// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "../../libraries/OrderStructs.sol";
import {CurrencyValidator} from "../../libraries/CurrencyValidator.sol";

// Interfaces
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Enums
import {QuoteType} from "../../enums/QuoteType.sol";

// Shared errors
import {
    BidTooLow,
    OrderInvalid,
    CurrencyInvalid,
    FunctionSelectorInvalid,
    QuoteTypeInvalid
} from "../../errors/SharedErrors.sol";
import {ChainlinkPriceInvalid, PriceFeedNotAvailable, PriceNotRecentEnough} from "../../errors/ChainlinkErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "../BaseStrategy.sol";
import {BaseStrategyChainlinkPriceLatency} from "./BaseStrategyChainlinkPriceLatency.sol";

/**
 * @title StrategyChainlinkUSDDynamicAsk
 * @notice This contract allows a seller to sell an NFT priced in USD and the receivable amount to be in ETH.
 * @author LooksRare protocol team (👀,💎)
 */
contract StrategyChainlinkUSDDynamicAsk is BaseStrategy, BaseStrategyChainlinkPriceLatency {
    /**
     * @dev It is possible to call priceFeed.decimals() to get the decimals,
     *      but to save gas, it is hard coded instead.
     */
    uint256 public constant ETH_USD_PRICE_FEED_DECIMALS = 1e8;

    /**
     * @notice Wrapped ether (WETH) address.
     */
    address public immutable WETH;

    /**
     * @notice ETH/USD Chainlink price feed
     */
    AggregatorV3Interface public immutable priceFeed;

    /**
     * @notice Constructor
     * @param _weth Wrapped ether address
     * @param _owner Owner address
     * @param _priceFeed Address of the ETH/USD price feed
     */
    constructor(address _owner, address _weth, address _priceFeed) BaseStrategyChainlinkPriceLatency(_owner, 3600) {
        WETH = _weth;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy looks at the seller's desired sale price in USD and minimum sale price in ETH,
     *         converts the USD value into ETH using Chainlink's price feed and chooses the higher price.
     * @param takerBid Taker bid struct (taker bid-specific parameters for the execution)
     * @param makerAsk Maker ask struct (maker ask-specific parameters for the execution)
     * @dev The client has to provide the seller's desired sale price in USD as the additionalParameters
     */
    function executeStrategyWithTakerBid(OrderStructs.Taker calldata takerBid, OrderStructs.Maker calldata makerAsk)
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        uint256 itemIdsLength = makerAsk.itemIds.length;

        if (itemIdsLength == 0 || itemIdsLength != makerAsk.amounts.length) {
            revert OrderInvalid();
        }

        CurrencyValidator.allowNativeOrAllowedCurrency(makerAsk.currency, WETH);

        (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();

        if (answer <= 0) {
            revert ChainlinkPriceInvalid();
        }

        if (block.timestamp - updatedAt > maxLatency) {
            revert PriceNotRecentEnough();
        }

        // The client has to provide a USD value that is augmented by 1e18.
        uint256 desiredSalePriceInUSD = abi.decode(makerAsk.additionalParameters, (uint256));

        uint256 ethPriceInUSD = uint256(answer);
        uint256 minPriceInETH = makerAsk.price;
        uint256 desiredSalePriceInETH = (desiredSalePriceInUSD * ETH_USD_PRICE_FEED_DECIMALS) / ethPriceInUSD;

        if (minPriceInETH >= desiredSalePriceInETH) {
            price = minPriceInETH;
        } else {
            price = desiredSalePriceInETH;
        }

        uint256 maxPrice = abi.decode(takerBid.additionalParameters, (uint256));
        if (maxPrice < price) {
            revert BidTooLow();
        }

        itemIds = makerAsk.itemIds;
        amounts = makerAsk.amounts;
        isNonceInvalidated = true;
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
        if (functionSelector != StrategyChainlinkUSDDynamicAsk.executeStrategyWithTakerBid.selector) {
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

        if (makerAsk.currency != address(0)) {
            if (makerAsk.currency != WETH) {
                return (isValid, CurrencyInvalid.selector);
            }
        }

        (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();

        if (answer <= 0) {
            return (isValid, ChainlinkPriceInvalid.selector);
        }

        if (block.timestamp - updatedAt > maxLatency) {
            return (isValid, PriceNotRecentEnough.selector);
        }

        isValid = true;
    }
}
