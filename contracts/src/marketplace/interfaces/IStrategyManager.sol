// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title IStrategyManager
 * @author LooksRare protocol team (👀,💎)
 */
interface IStrategyManager {
    /**
     * @notice This struct contains the parameter of an execution strategy.
     * @param strategyId Id of the new strategy
     * @param standardProtocolFeeBp Standard protocol fee (in basis point)
     * @param minTotalFeeBp Minimum total fee (in basis point)
     * @param maxProtocolFeeBp Maximum protocol fee (in basis point)
     * @param selector Function selector for the transaction to be executed
     * @param isMakerBid Whether the strategyId is for maker bid
     * @param implementation Address of the implementation of the strategy
     */
    struct Strategy {
        bool isActive;
        uint16 standardProtocolFeeBp;
        uint16 minTotalFeeBp;
        uint16 maxProtocolFeeBp;
        bytes4 selector;
        bool isMakerBid;
        address implementation;
    }

    /**
     * @notice It is emitted when a new strategy is added.
     * @param strategyId Id of the new strategy
     * @param standardProtocolFeeBp Standard protocol fee (in basis point)
     * @param minTotalFeeBp Minimum total fee (in basis point)
     * @param maxProtocolFeeBp Maximum protocol fee (in basis point)
     * @param selector Function selector for the transaction to be executed
     * @param isMakerBid Whether the strategyId is for maker bid
     * @param implementation Address of the implementation of the strategy
     */
    event NewStrategy(
        uint256 strategyId,
        uint16 standardProtocolFeeBp,
        uint16 minTotalFeeBp,
        uint16 maxProtocolFeeBp,
        bytes4 selector,
        bool isMakerBid,
        address implementation
    );

    /**
     * @notice It is emitted when an existing strategy is updated.
     * @param strategyId Id of the strategy
     * @param isActive Whether the strategy is active (or not) after the update
     * @param standardProtocolFeeBp Standard protocol fee (in basis point)
     * @param minTotalFeeBp Minimum total fee (in basis point)
     */
    event StrategyUpdated(uint256 strategyId, bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp);

    /**
     * @notice If the strategy has not set properly its implementation contract.
     * @dev It can only be returned for owner operations.
     */
    error NotV2Strategy();

    /**
     * @notice It is returned if the strategy has no selector.
     * @dev It can only be returned for owner operations.
     */
    error StrategyHasNoSelector();

    /**
     * @notice It is returned if the strategyId is invalid.
     */
    error StrategyNotUsed();

    /**
     * @notice It is returned if the strategy's protocol fee is too high.
     * @dev It can only be returned for owner operations.
     */
    error StrategyProtocolFeeTooHigh();
}
