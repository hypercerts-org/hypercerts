// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { IHypercertTrader } from "./interfaces/IHypercertTrader.sol";
import { IHypercertToken } from "./interfaces/IHypercertToken.sol";
import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";
import { IERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

import { Errors } from "./libs/Errors.sol";

error NotAllowed();
error InvalidOffer();

interface IHypercertMinter {
    function ownerOf(uint256 id) external view returns (address);
}

/// @title Contract for managing hypercert trades
/// @author bitbeckers
/// @notice Implementation of the HypercertTrader Interface
contract HypercertTrader is IHypercertTrader, PausableUpgradeable {
    mapping(uint256 => Offer) public offers;
    uint256 internal _offerCounter;

    /// @notice Create a new offer for a fraction of a hypercert
    /// @dev see {IHypercertTrader}
    function createOffer(
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) external payable returns (uint256 offerID) {
        // This checks is the contract is approved to trade on behalf of the owner at the time of offering.
        // However, the owner can revoke this approval at any time.
        if (!IERC1155Upgradeable(hypercertContract).isApprovedForAll(msg.sender, address(this))) revert NotAllowed();

        _validateOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            units,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        offerID = _offerCounter;
        offers[offerID] = _createOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            units,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        _offerCounter += 1;

        emit OfferCreated(msg.sender, hypercertContract, fractionID, offerID);
    }

    /// @notice Submit a trade for a fraction of a hypercert
    /// @dev see {IHypercertTrader}
    function buyUnits(
        address recipient,
        uint256 offerID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable {
        Offer storage offer = offers[offerID];
        if (offer.status != OfferStatus.Open || offer.offerType != OfferType.Units) {
            revert InvalidOffer();
        }

        if (
            offer.unitsAvailable < unitAmount ||
            offer.minUnitsPerTrade > unitAmount ||
            offer.maxUnitsPerTrade < unitAmount
        ) revert InvalidOffer();

        offer.unitsAvailable -= unitAmount;

        if (offer.unitsAvailable == 0) {
            offer.status = OfferStatus.Fulfilled;
        }

        // Create uint256[] for the split with the remaining units and units to transfer
        uint256[] memory units = new uint256[](2);
        units[0] = offer.unitsAvailable;
        units[1] = unitAmount;

        // TODO split and transfer or full transfer
        IHypercertToken(offer.hypercertContract).splitFraction(recipient, offer.fractionID, units);

        emit Trade(
            offer.offerer,
            recipient,
            offer.hypercertContract,
            offer.fractionID,
            buyToken,
            tokenAmountPerUnit,
            offerID
        );
    }

    /// @notice Cancel an offer for a fraction of a hypercert
    /// @dev see {IHypercertTrader}
    function cancelOffer(uint256 offerID) external {
        Offer storage offer = offers[offerID];
        if (offer.offerer != msg.sender) revert NotAllowed();
        if (offer.status != OfferStatus.Open) revert InvalidOffer();

        offer.status = OfferStatus.Cancelled;
        emit OfferCancelled(msg.sender, offer.hypercertContract, offer.fractionID, offerID);
    }

    /// INTERNAL

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

    function _validateOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) internal view returns (bool) {
        if (IHypercertMinter(hypercertContract).ownerOf(fractionID) != offerer) revert InvalidOffer();

        // Validate units exist and are available
        if (units == 0 || IHypercertToken(hypercertContract).unitsOf(fractionID) <= units) revert InvalidOffer();

        // Validate min/max units per trade
        if (maxUnitsPerTrade > units || minUnitsPerTrade > maxUnitsPerTrade) {
            revert InvalidOffer();
        }

        // If sale is for a fraction, the units must be a multiple of the minimum units per trade
        if (minUnitsPerTrade == maxUnitsPerTrade && units % minUnitsPerTrade != 0) revert InvalidOffer();

        // for now only accept the native token, ZERO_ADDRESS
        if (
            acceptedTokens.length != 1 ||
            acceptedTokens[0].token != address(0) ||
            acceptedTokens[0].minimumAmountPerUnit == 0
        ) {
            revert InvalidOffer();
        }
    }
}
