// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {OwnableTwoSteps} from "@looksrare/contracts-libs/contracts/OwnableTwoSteps.sol";

// Royalty Fee Registry interface
import {IRoyaltyFeeRegistry} from "@hypercerts/marketplace/interfaces/IRoyaltyFeeRegistry.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

/**
 * @title MockRoyaltyFeeRegistry
 * @notice It is a royalty fee registry for the LooksRare exchange.
 * @dev The original one used the standard Ownable library from OpenZeppelin.
 */
contract MockRoyaltyFeeRegistry is IRoyaltyFeeRegistry, OwnableTwoSteps {
    struct FeeInfo {
        address setter;
        address receiver;
        uint256 fee;
    }

    // Limit (if enforced for fee royalty in basis point (10,000 = 100%)
    uint256 public royaltyFeeLimit;

    mapping(address => FeeInfo) private _royaltyFeeInfoCollection;

    event NewRoyaltyFeeLimit(uint256 royaltyFeeLimit);
    event RoyaltyFeeUpdate(address indexed collection, address indexed setter, address indexed receiver, uint256 fee);

    /**
     * @notice Constructor
     * @param _owner Owner address
     * @param _royaltyFeeLimit new royalty fee limit (500 = 5%, 1,000 = 10%)
     */
    constructor(address _owner, uint256 _royaltyFeeLimit) OwnableTwoSteps(_owner) {
        require(_royaltyFeeLimit <= 9500, "Owner: Royalty fee limit too high");
        royaltyFeeLimit = _royaltyFeeLimit;
    }

    /**
     * @notice Update royalty info for collection
     * @param _royaltyFeeLimit new royalty fee limit (500 = 5%, 1,000 = 10%)
     */
    function updateRoyaltyFeeLimit(uint256 _royaltyFeeLimit) external onlyOwner {
        require(_royaltyFeeLimit <= 9500, "Owner: Royalty fee limit too high");
        royaltyFeeLimit = _royaltyFeeLimit;

        emit NewRoyaltyFeeLimit(_royaltyFeeLimit);
    }

    /**
     * @notice Update royalty info for collection
     * @param collection address of the NFT contract
     * @param setter address that sets the receiver
     * @param receiver receiver for the royalty fee
     * @param fee fee (500 = 5%, 1,000 = 10%)
     */
    function updateRoyaltyInfoForCollection(address collection, address setter, address receiver, uint256 fee)
        external
        onlyOwner
    {
        require(fee <= royaltyFeeLimit, "Registry: Royalty fee too high");
        _royaltyFeeInfoCollection[collection] = FeeInfo({setter: setter, receiver: receiver, fee: fee});

        emit RoyaltyFeeUpdate(collection, setter, receiver, fee);
    }

    /**
     * @notice Calculate royalty info for a collection address and a sale gross amount
     * @param collection collection address
     * @param amount amount
     * @return receiver address and amount received by royalty recipient
     */
    function royaltyInfo(address collection, uint256 amount) external view returns (address, uint256) {
        return (
            _royaltyFeeInfoCollection[collection].receiver,
            (amount * _royaltyFeeInfoCollection[collection].fee) / ONE_HUNDRED_PERCENT_IN_BP
        );
    }

    /**
     * @notice View royalty info for a collection address
     * @param collection collection address
     */
    function royaltyFeeInfoCollection(address collection) external view returns (address, address, uint256) {
        return (
            _royaltyFeeInfoCollection[collection].setter,
            _royaltyFeeInfoCollection[collection].receiver,
            _royaltyFeeInfoCollection[collection].fee
        );
    }
}
