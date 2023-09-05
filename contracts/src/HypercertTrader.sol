// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { IHypercertTrader } from "./interfaces/IHypercertTrader.sol";
import { IHypercertToken } from "./interfaces/IHypercertToken.sol";
import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";
import { IERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import { Errors } from "./libs/Errors.sol";

error NotAllowed();
error InvalidOffer(string);
error InvalidBuy(string);

interface IHypercertMinter {
    function ownerOf(uint256 id) external view returns (address);

    function unitsOf(uint256 id) external view returns (uint256);
}

/**
 * @title Contract for managing hypercert trades
 * @notice Implementation of the HypercertTrader Interface
 * @author bitbeckers
 */
contract HypercertTrader is IHypercertTrader, Initializable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    mapping(address => mapping(uint256 => uint256)) public totalUnitsForSale;
    mapping(uint256 => Offer) public offers;
    uint256 internal _offerCounter;

    /// INIT

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    function initialize() public virtual initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Creates a new offer to sell Hypercert tokens.
     * @param hypercertContract The address of the Hypercert token contract.
     * @param fractionID The ID of the fraction to sell.
     * @param unitsForSale The number of units available for sale.
     * @param minUnitsPerTrade The minimum number of units that can be bought in a single trade.
     * @param maxUnitsPerTrade The maximum number of units that can be bought in a single trade.
     * @param acceptedTokens The list of tokens that are accepted for payment.
     * @notice This function creates a new offer to sell Hypercert tokens. The offer specifies the Hypercert token contract,
     * the fraction to sell, the number of units available for sale, the minimum and maximum number of units that can be bought
     * in a single trade, and the list of tokens that are accepted for payment. The offer is added to the list of existing offers
     * and can be bought by other users using the `buyUnits` function.
     */
    function createOffer(
        address hypercertContract,
        uint256 fractionID,
        uint256 unitsForSale,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) external payable whenNotPaused returns (uint256 offerID) {
        // This checks is the contract is approved to trade on behalf of the owner at the time of offering.
        // However, the owner can revoke this approval at any time.
        if (!IERC1155Upgradeable(hypercertContract).isApprovedForAll(msg.sender, address(this))) revert NotAllowed();

        _validateOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            unitsForSale,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        offerID = _offerCounter;
        offers[offerID] = _createOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            unitsForSale,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        _offerCounter += 1;
        totalUnitsForSale[hypercertContract][fractionID] += unitsForSale;

        emit OfferCreated(msg.sender, hypercertContract, fractionID, offerID);
    }

    /**
     * @dev Buys Hypercert tokens from an existing offer.
     * @param recipient The address that will receive the Hypercert tokens.
     * @param offerID The ID of the offer to buy from.
     * @param unitAmount The number of units to buy.
     * @param buyToken The address of the token used for payment.
     * @param tokenAmountPerUnit The amount of tokens to pay per unit.
     * @notice This function buys Hypercert tokens from an existing offer. The function verifies that the offer is valid and that
     * the buyer has provided enough payment in the specified token. If the offer is for a fraction of a Hypercert token, the function
     * splits the fraction and transfers the appropriate number of units to the buyer. If the offer is for a fixed number of units,
     * the function transfers the units to the buyer. The function also transfers the payment to the offerer and emits a `Trade` event.
     */
    function buyUnits(
        address recipient,
        uint256 offerID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable whenNotPaused {
        // Get the offer and validate that it is open and has enough units available
        Offer storage offer = offers[offerID];
        _validateBuyOffer(offer, unitAmount, buyToken, tokenAmountPerUnit);

        offer.unitsAvailable -= unitAmount;
        totalUnitsForSale[offer.hypercertContract][offer.fractionID] -= unitAmount;

        if (offer.unitsAvailable == 0) {
            offer.status = OfferStatus.Fulfilled;
        }

        uint256 unitsInFraction = IHypercertMinter(offer.hypercertContract).unitsOf(offer.fractionID);

        // Check if full fraction is being bought
        if (unitsInFraction == unitAmount) {
            IERC1155Upgradeable(offer.hypercertContract).safeTransferFrom(
                offer.offerer,
                recipient,
                offer.fractionID,
                1,
                ""
            );
        } else {
            // Create uint256[] for the split with the remaining units and units to transfer
            uint256[] memory units = new uint256[](2);
            units[0] = unitsInFraction - unitAmount;
            units[1] = unitAmount;

            IHypercertToken(offer.hypercertContract).splitFraction(recipient, offer.fractionID, units);
        }
        (bool success, ) = payable(offer.offerer).call{ value: msg.value }("");
        if (!success) revert InvalidBuy("Payment failed");

        emit Trade(
            offer.offerer,
            recipient,
            offer.hypercertContract,
            offer.fractionID,
            unitAmount,
            buyToken,
            tokenAmountPerUnit,
            offerID
        );
    }

    /**
     * @dev Cancels an existing offer.
     * @param offerID The ID of the offer to cancel.
     * @notice This function cancels an existing offer. The function verifies that the offer exists and that the caller is the offerer.
     * The function sets the offer status to `Cancelled` and emits an `OfferCancelled` event.
     */
    function cancelOffer(uint256 offerID) external whenNotPaused {
        // Get the offer and validate that the caller is the offerer
        Offer storage offer = offers[offerID];
        if (offer.offerer != msg.sender) revert NotAllowed();
        if (offer.status != OfferStatus.Open) revert InvalidOffer("status");

        // Update the offer and emit an OfferCancelled event
        offer.status = OfferStatus.Cancelled;
        totalUnitsForSale[offer.hypercertContract][offer.fractionID] -= offer.unitsAvailable;
        emit OfferCancelled(msg.sender, offer.hypercertContract, offer.fractionID, offerID);
    }

    /// PAUSABLE

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// INTERNAL

    /**
     * @dev Internal function to create a new offer to sell Hypercert tokens.
     * @param offerer The address of the offerer.
     * @param hypercertContract The address of the Hypercert token contract.
     * @param fractionID The ID of the fraction to sell.
     * @param unitsAvailable The number of units available for sale.
     * @param minUnitsPerTrade The minimum number of units that can be bought in a single trade.
     * @param maxUnitsPerTrade The maximum number of units that can be bought in a single trade.
     * @param acceptedTokens The list of tokens that are accepted for payment.
     * @return The storage reference to the newly created offer.
     */
    function _createOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 unitsAvailable,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) internal returns (Offer storage) {
        // TODO optimise init and adding accepted tokens
        Offer storage offer = offers[_offerCounter];
        offer.offerer = offerer;
        offer.hypercertContract = hypercertContract;
        offer.fractionID = fractionID;
        offer.unitsAvailable = unitsAvailable;
        offer.minUnitsPerTrade = minUnitsPerTrade;
        offer.maxUnitsPerTrade = maxUnitsPerTrade;
        offer.status = OfferStatus.Open;

        if (minUnitsPerTrade == maxUnitsPerTrade) {
            offer.offerType = OfferType.Fraction;
        } else {
            offer.offerType = OfferType.Units;
        }

        uint256 len = acceptedTokens.length;
        for (uint256 i; i < len; ) {
            offer.acceptedTokens.push(AcceptedToken(acceptedTokens[i].token, acceptedTokens[i].minimumAmountPerUnit));

            unchecked {
                ++i;
            }
        }

        return offer;
    }

    /**
     * @dev Validates the parameters for a new offer.
     * @param hypercertContract The address of the Hypercert token contract.
     * @param fractionID The ID of the fraction to sell.
     * @param unitsForSale The number of units available for sale.
     * @param minUnitsPerTrade The minimum number of units that can be bought in a single trade.
     * @param maxUnitsPerTrade The maximum number of units that can be bought in a single trade.
     * @param acceptedTokens The list of tokens that are accepted for payment.
     * @notice This internal function validates the parameters for a new offer. The function verifies that the Hypercert token contract
     * exists and that the fraction ID is valid. The function also verifies that the units available, minimum units per trade, and maximum
     * units per trade are valid and that the accepted tokens list is not empty.
     */
    function _validateOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 unitsForSale,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) internal view returns (bool) {
        if (IHypercertMinter(hypercertContract).ownerOf(fractionID) != offerer) revert InvalidOffer("Not owner");

        // Validate units exist and are available
        uint256 totalUnits = IHypercertMinter(hypercertContract).unitsOf(fractionID);
        if (
            unitsForSale == 0 ||
            totalUnits < unitsForSale ||
            totalUnits < totalUnitsForSale[hypercertContract][fractionID] + unitsForSale
        ) {
            revert InvalidOffer("Insufficient units");
        }

        // Validate min/max units per trade
        if (maxUnitsPerTrade > unitsForSale || minUnitsPerTrade > maxUnitsPerTrade) {
            revert InvalidOffer("Min/Max units");
        }

        // If sale is for a fraction, the units must be a multiple of the minimum units per trade
        if (minUnitsPerTrade == maxUnitsPerTrade && unitsForSale % minUnitsPerTrade != 0) {
            revert InvalidOffer("Units indivisible by fractions");
        }

        // Minimum amount per unit must be greater than 0
        if (acceptedTokens.length == 0 || acceptedTokens[0].minimumAmountPerUnit == 0) {
            revert InvalidOffer("No accepted tokens");
        }

        // for now only accept the native token, ZERO_ADDRESS
        if (acceptedTokens.length != 1 || acceptedTokens[0].token != address(0)) {
            revert InvalidOffer("Only zero token");
        }
    }

    /**
     * @dev Validates an existing offer for a buy operation.
     * @param offer The offer to validate.
     * @param unitAmountsToBuy The number of units to buy.
     * @param buyToken The address of the token used for payment.
     * @param tokenAmountPerUnit The amount of tokens to pay per unit.
     * @notice This internal function validates an existing offer for a buy operation. The function verifies that the offer exists,
     * is open, and has enough units available for sale. The function also verifies that the specified token is accepted for payment
     * and that the buyer has provided enough payment in the specified token.
     */
    function _validateBuyOffer(
        Offer memory offer,
        uint256 unitAmountsToBuy,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) internal {
        if (offer.status != OfferStatus.Open || offer.offerType != OfferType.Units) {
            revert InvalidOffer("Wrong status");
        }

        if (
            offer.unitsAvailable < unitAmountsToBuy ||
            offer.minUnitsPerTrade > unitAmountsToBuy ||
            offer.maxUnitsPerTrade < unitAmountsToBuy
        ) revert InvalidOffer("Min/Max units");

        // Check for sufficient funds; currently only native token
        if (buyToken != address(0) || (unitAmountsToBuy * tokenAmountPerUnit) > msg.value) {
            revert InvalidOffer("Wrong token/value");
        }

        // TODO check on overpayment???

        //TODO optimize array search or use mapping
        // Check for accepted tokens
        uint256 len = offer.acceptedTokens.length;
        bool tokenAccepted = false;
        for (uint256 i; i < len; ) {
            if (!tokenAccepted) {
                tokenAccepted = offer.acceptedTokens[i].token == buyToken;
            }

            if (
                offer.acceptedTokens[i].token == buyToken &&
                offer.acceptedTokens[i].minimumAmountPerUnit > tokenAmountPerUnit
            ) {
                revert InvalidOffer("Wrong token/value");
            }

            unchecked {
                ++i;
            }
        }
        if (!tokenAccepted) revert InvalidOffer("Wrong token/value");
    }

    /// INTERNAL

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol }
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     * Assuming 30 available slots (slots cost space, cost gas)
     * 1. totalUnitsForSale
     * 2. offers
     * 3. _offerCounter
     */
    uint256[27] private __gap;
}
