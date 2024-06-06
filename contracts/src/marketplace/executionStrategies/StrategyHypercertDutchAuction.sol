// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interface
import {IHypercert1155Token} from "../interfaces/IHypercert1155Token.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// Enums
import {QuoteType} from "../enums/QuoteType.sol";
import {CollectionType} from "../enums/CollectionType.sol";

// Shared errors
import {
    AmountInvalid,
    BidTooLow,
    OrderInvalid,
    FunctionSelectorInvalid,
    QuoteTypeInvalid,
    CollectionTypeInvalid
} from "../errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "./BaseStrategy.sol";

/**
 * @title StrategyHypercertDutchAuction
 * @notice This contract offers a single execution strategy for users to create Dutch auctions for hypercerts.
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract StrategyHypercertDutchAuction is BaseStrategy {
    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         The execution price set by the seller decreases linearly within the defined period.
     * @dev Taker bid additionalParameters uint256 startPrice, uint256[] memory unitsPerItem
     * @dev Maker ask additionalParameters uint256 maxPrice
     * @param takerBid Taker bid struct (taker ask-specific parameters for the execution)
     * @param makerAsk Maker ask struct (maker bid-specific parameters for the execution)
     * @dev The client has to provide the seller's desired initial start price as the additionalParameters.
     */
    function executeStrategyWithTakerBid(OrderStructs.Taker calldata takerBid, OrderStructs.Maker calldata makerAsk)
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        if (makerAsk.collectionType != CollectionType.Hypercert) {
            revert CollectionTypeInvalid();
        }

        uint256 itemIdsLength = makerAsk.itemIds.length;

        if (itemIdsLength == 0 || itemIdsLength != makerAsk.amounts.length) {
            revert OrderInvalid();
        }

        (uint256 startPrice, uint256[] memory unitsPerItem) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256[]));

        if (startPrice < makerAsk.price || unitsPerItem.length == 0 || unitsPerItem.length != itemIdsLength) {
            revert OrderInvalid();
        }

        uint256 unitsPerItemLength = unitsPerItem.length;
        for (uint256 i; i < unitsPerItemLength;) {
            if (IHypercert1155Token(makerAsk.collection).unitsOf(makerAsk.itemIds[i]) != unitsPerItem[i]) {
                revert OrderInvalid();
            }
            unchecked {
                ++i;
            }
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
        view
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        if (makerAsk.collectionType != CollectionType.Hypercert) {
            return (isValid, CollectionTypeInvalid.selector);
        }

        if (functionSelector != StrategyHypercertDutchAuction.executeStrategyWithTakerBid.selector) {
            return (isValid, FunctionSelectorInvalid.selector);
        }

        if (makerAsk.quoteType != QuoteType.Ask) {
            return (isValid, QuoteTypeInvalid.selector);
        }

        uint256 itemIdsLength = makerAsk.itemIds.length;

        (uint256 startPrice, uint256[] memory unitsPerItem) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256[]));

        if (
            itemIdsLength == 0 || unitsPerItem.length == 0 || unitsPerItem.length != itemIdsLength
                || itemIdsLength != makerAsk.amounts.length
        ) {
            return (isValid, OrderInvalid.selector);
        }

        for (uint256 i; i < itemIdsLength;) {
            _validateAmountNoRevert(makerAsk.amounts[i], makerAsk.collectionType);
            if ((IHypercert1155Token(makerAsk.collection).unitsOf(makerAsk.itemIds[i]) != unitsPerItem[i])) {
                return (isValid, OrderInvalid.selector);
            }
            unchecked {
                ++i;
            }
        }

        if (startPrice < makerAsk.price) {
            return (isValid, OrderInvalid.selector);
        }

        // If no root is provided or invalid length, it should be invalid.
        // @dev 32 is the length of the bytes32 array when the startprice is provided together with an array of
        // unitsPerItem.
        // params declared in the additionalParameters (uint256 startPrice, uint256[] memory unitsPerItem).
        if (makerAsk.additionalParameters.length <= 64) {
            return (isValid, OrderInvalid.selector);
        }
        isValid = true;
    }
}
