// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title IExecutionManager
 * @author LooksRare protocol team (👀,💎)
 */
interface IExecutionManager {
    /**
     * @notice It is issued when there is a new creator fee manager.
     * @param creatorFeeManager Address of the new creator fee manager
     */
    event NewCreatorFeeManager(address creatorFeeManager);

    /**
     * @notice It is issued when there is a new maximum creator fee (in basis point).
     * @param maxCreatorFeeBp New maximum creator fee (in basis point)
     */
    event NewMaxCreatorFeeBp(uint256 maxCreatorFeeBp);

    /**
     * @notice It is issued when there is a new protocol fee recipient address.
     * @param protocolFeeRecipient Address of the new protocol fee recipient
     */
    event NewProtocolFeeRecipient(address protocolFeeRecipient);

    /**
     * @notice It is returned if the creator fee (in basis point) is too high.
     */
    error CreatorFeeBpTooHigh();

    /**
     * @notice It is returned if the new protocol fee recipient is set to address(0).
     */
    error NewProtocolFeeRecipientCannotBeNullAddress();

    /**
     * @notice It is returned if there is no selector for maker ask/bid for a given strategyId,
     *         depending on the quote type.
     */
    error NoSelectorForStrategy();

    /**
     * @notice It is returned if the current block timestamp is not between start and end times in the maker order.
     */
    error OutsideOfTimeRange();

    /**
     * @notice It is returned if the strategy id has no implementation.
     * @dev It is returned if there is no implementation address and the strategyId is strictly greater than 0.
     */
    error StrategyNotAvailable(uint256 strategyId);
}
