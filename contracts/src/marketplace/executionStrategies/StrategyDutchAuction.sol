// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// Enums
import {QuoteType} from "../enums/QuoteType.sol";
import {CollectionType} from "../enums/CollectionType.sol";

// Shared errors
import {
    BidTooLow,
    OrderInvalid,
    FunctionSelectorInvalid,
    QuoteTypeInvalid,
    CollectionTypeInvalid
} from "../errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "./BaseStrategy.sol";

/**
 * @title StrategyDutchAuction
 * @notice This contract offers a single execution strategy for users to create Dutch auctions.
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract StrategyDutchAuction is BaseStrategy {
    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         The execution price set by the seller decreases linearly within the defined period.
     * @param takerBid Taker bid struct (taker ask-specific parameters for the execution)
     * @param makerAsk Maker ask struct (maker bid-specific parameters for the execution)
     * @dev The client has to provide the seller's desired initial start price as the additionalParameters.
     */
    function executeStrategyWithTakerBid(OrderStructs.Taker calldata takerBid, OrderStructs.Maker calldata makerAsk)
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        if (makerAsk.collectionType != CollectionType.ERC721 && makerAsk.collectionType != CollectionType.ERC1155) {
            revert CollectionTypeInvalid();
        }

        uint256 itemIdsLength = makerAsk.itemIds.length;

        if (itemIdsLength == 0 || itemIdsLength != makerAsk.amounts.length) {
            revert OrderInvalid();
        }

        uint256 startPrice = abi.decode(makerAsk.additionalParameters, (uint256));

        if (startPrice < makerAsk.price) {
            revert OrderInvalid();
        }

        uint256 startTime = makerAsk.startTime;
        uint256 endTime = makerAsk.endTime;

        price = ((endTime - block.timestamp) * startPrice + (block.timestamp - startTime) * makerAsk.price)
            / (endTime - startTime);

        uint256 maxPrice = abi.decode(takerBid.additionalParameters, (uint256));
        if (maxPrice < price) {
            revert BidTooLow();
        }

        isNonceInvalidated = true;

        itemIds = makerAsk.itemIds;
        amounts = makerAsk.amounts;
    }

    /**
     * @inheritdoc IStrategy
     */
    function isMakerOrderValid(OrderStructs.Maker calldata makerAsk, bytes4 functionSelector)
        external
        pure
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        if (makerAsk.collectionType != CollectionType.ERC721 && makerAsk.collectionType != CollectionType.ERC1155) {
            return (isValid, CollectionTypeInvalid.selector);
        }

        if (functionSelector != StrategyDutchAuction.executeStrategyWithTakerBid.selector) {
            return (isValid, FunctionSelectorInvalid.selector);
        }

        if (makerAsk.quoteType != QuoteType.Ask) {
            return (isValid, QuoteTypeInvalid.selector);
        }

        uint256 itemIdsLength = makerAsk.itemIds.length;

        if (itemIdsLength == 0 || itemIdsLength != makerAsk.amounts.length) {
            return (isValid, OrderInvalid.selector);
        }

        for (uint256 i; i < itemIdsLength;) {
            _validateAmountNoRevert(makerAsk.amounts[i], makerAsk.collectionType);
            unchecked {
                ++i;
            }
        }

        uint256 startPrice = abi.decode(makerAsk.additionalParameters, (uint256));

        if (startPrice < makerAsk.price) {
            return (isValid, OrderInvalid.selector);
        }

        isValid = true;
    }
}
