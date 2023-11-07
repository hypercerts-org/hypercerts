// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @notice It is returned if the Chainlink price is invalid (e.g. negative).
 */
error ChainlinkPriceInvalid();

/**
 * @notice It is returned if the decimals from the NFT floor price feed is invalid.
 *         Chainlink price feeds are expected to have 18 decimals.
 * @dev It can only be returned for owner operations.
 */
error DecimalsInvalid();

/**
 * @notice It is returned if the fixed discount for a maker bid is greater than floor price.
 */
error DiscountGreaterThanFloorPrice();

/**
 * @notice It is returned if the latency tolerance is set too high (i.e. greater than 3,600 sec).
 */
error LatencyToleranceTooHigh();

/**
 * @notice It is returned if the price feed for a collection is already set.
 * @dev It can only be returned for owner operations.
 */
error PriceFeedAlreadySet();

/**
 * @notice It is returned when the price feed is not available.
 */
error PriceFeedNotAvailable();

/**
 * @notice It is returned if the current block time relative to the latest price's update time
 *         is greater than the latency tolerance.
 */
error PriceNotRecentEnough();
