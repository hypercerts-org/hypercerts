// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {CurrencyManager} from "./CurrencyManager.sol";

// Interfaces
import {IStrategy} from "./interfaces/IStrategy.sol";
import {IStrategyManager} from "./interfaces/IStrategyManager.sol";

/**
 * @title StrategyManager
 * @notice This contract handles the addition and the update of execution strategies.
 * @author LooksRare protocol team (👀,💎)
 */
contract StrategyManager is IStrategyManager, CurrencyManager {
    /**
     * @notice This variable keeps the count of how many strategies exist.
     *         It includes strategies that have been removed.
     */
    uint256 private _countStrategies = 1;

    /**
     * @notice This returns the strategy information for a strategy id.
     */
    mapping(uint256 => Strategy) public strategyInfo;

    /**
     * @notice Constructor
     * @param _owner Owner address
     */
    constructor(address _owner) CurrencyManager(_owner) {
        strategyInfo[0] = Strategy({
            isActive: true,
            standardProtocolFeeBp: 50,
            minTotalFeeBp: 50,
            maxProtocolFeeBp: 200,
            selector: bytes4(0),
            isMakerBid: false,
            implementation: address(0)
        });

        emit NewStrategy(0, 50, 50, 200, bytes4(0), false, address(0));
    }

    /**
     * @notice This function allows the owner to add a new execution strategy to the protocol.
     * @param standardProtocolFeeBp Standard protocol fee (in basis point)
     * @param minTotalFeeBp Minimum total fee (in basis point)
     * @param maxProtocolFeeBp Maximum protocol fee (in basis point)
     * @param selector Function selector for the strategy
     * @param isMakerBid Whether the function selector is for maker bid
     * @param implementation Implementation address
     * @dev Strategies have an id that is incremental.
     *      Only callable by owner.
     */
    function addStrategy(
        uint16 standardProtocolFeeBp,
        uint16 minTotalFeeBp,
        uint16 maxProtocolFeeBp,
        bytes4 selector,
        bool isMakerBid,
        address implementation
    ) external onlyOwner {
        if (minTotalFeeBp > maxProtocolFeeBp || standardProtocolFeeBp > minTotalFeeBp || maxProtocolFeeBp > 500) {
            revert StrategyProtocolFeeTooHigh();
        }

        if (selector == bytes4(0)) {
            revert StrategyHasNoSelector();
        }

        if (!IStrategy(implementation).isLooksRareV2Strategy()) {
            revert NotV2Strategy();
        }

        strategyInfo[_countStrategies] = Strategy({
            isActive: true,
            standardProtocolFeeBp: standardProtocolFeeBp,
            minTotalFeeBp: minTotalFeeBp,
            maxProtocolFeeBp: maxProtocolFeeBp,
            selector: selector,
            isMakerBid: isMakerBid,
            implementation: implementation
        });

        emit NewStrategy(
            _countStrategies++,
            standardProtocolFeeBp,
            minTotalFeeBp,
            maxProtocolFeeBp,
            selector,
            isMakerBid,
            implementation
        );
    }

    /**
     * @notice This function allows the owner to update parameters for an existing execution strategy.
     * @param strategyId Strategy id
     * @param isActive Whether the strategy must be active
     * @param newStandardProtocolFee New standard protocol fee (in basis point)
     * @param newMinTotalFee New minimum total fee (in basis point)
     * @dev Only callable by owner.
     */
    function updateStrategy(uint256 strategyId, bool isActive, uint16 newStandardProtocolFee, uint16 newMinTotalFee)
        external
        onlyOwner
    {
        if (strategyId >= _countStrategies) {
            revert StrategyNotUsed();
        }

        if (newMinTotalFee > strategyInfo[strategyId].maxProtocolFeeBp || newStandardProtocolFee > newMinTotalFee) {
            revert StrategyProtocolFeeTooHigh();
        }

        strategyInfo[strategyId].isActive = isActive;
        strategyInfo[strategyId].standardProtocolFeeBp = newStandardProtocolFee;
        strategyInfo[strategyId].minTotalFeeBp = newMinTotalFee;

        emit StrategyUpdated(strategyId, isActive, newStandardProtocolFee, newMinTotalFee);
    }
}
