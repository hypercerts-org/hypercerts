/// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Custom errors
import {OrderInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "@hypercerts/marketplace/executionStrategies/BaseStrategy.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";

contract StrategyTestMultiFillCollectionOrder is BaseStrategy {
    using OrderStructs for OrderStructs.Maker;

    // Address of the protocol
    address public immutable LOOKSRARE_PROTOCOL;

    // Tracks historical fills
    mapping(bytes32 => uint256) internal countItemsFilledForOrderHash;

    /**
     * @notice Constructor
     * @param _looksRareProtocol Address of the LooksRare protocol
     */
    constructor(address _looksRareProtocol) {
        LOOKSRARE_PROTOCOL = _looksRareProtocol;
    }

    /**
     * @notice Execute collection strategy with taker ask order
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     */
    function executeStrategyWithTakerAsk(OrderStructs.Taker calldata takerAsk, OrderStructs.Maker calldata makerBid)
        external
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        if (msg.sender != LOOKSRARE_PROTOCOL) revert OrderInvalid();
        // Only available for ERC721
        if (makerBid.collectionType != CollectionType.ERC721) revert OrderInvalid();

        bytes32 orderHash = makerBid.hash();
        uint256 countItemsFilled = countItemsFilledForOrderHash[orderHash];
        uint256 countItemsFillable = makerBid.amounts[0];

        price = makerBid.price;
        (itemIds, amounts) = abi.decode(takerAsk.additionalParameters, (uint256[], uint256[]));
        uint256 countItemsToFill = amounts.length;

        if (
            countItemsToFill == 0 || makerBid.amounts.length != 1 || itemIds.length != countItemsToFill
                || countItemsFillable < countItemsToFill + countItemsFilled
        ) revert OrderInvalid();

        price *= countItemsToFill;

        if (countItemsToFill + countItemsFilled == countItemsFillable) {
            delete countItemsFilledForOrderHash[orderHash];
            isNonceInvalidated = true;
        } else {
            countItemsFilledForOrderHash[orderHash] += countItemsToFill;
        }
    }

    function isMakerOrderValid(OrderStructs.Maker calldata, bytes4)
        external
        view
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        //
    }
}
