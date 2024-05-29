// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "./libraries/OrderStructs.sol";

// Interfaces
import {IExecutionManager} from "./interfaces/IExecutionManager.sol";
import {ICreatorFeeManager} from "./interfaces/ICreatorFeeManager.sol";

// Direct dependencies
import {InheritedStrategy} from "./InheritedStrategy.sol";
import {NonceManager} from "./NonceManager.sol";
import {StrategyManager} from "./StrategyManager.sol";

// Assembly
import {
    NoSelectorForStrategy_error_selector,
    NoSelectorForStrategy_error_length,
    OutsideOfTimeRange_error_selector,
    OutsideOfTimeRange_error_length,
    Error_selector_offset
} from "./constants/AssemblyConstants.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "./constants/NumericConstants.sol";

// Enums
import {QuoteType} from "./enums/QuoteType.sol";
import {CollectionType} from "./enums/CollectionType.sol";

/**
 * @title ExecutionManager
 * @notice This contract handles the execution and resolution of transactions. A transaction is executed on-chain
 *         when an off-chain maker order is matched by on-chain taker order of a different kind.
 *         For instance, a taker ask is executed against a maker bid (or a taker bid against a maker ask).
 * @author LooksRare protocol team (👀,💎); bitbeckers;
 */
contract ExecutionManager is InheritedStrategy, NonceManager, StrategyManager, IExecutionManager {
    /**
     * @notice Protocol fee recipient.
     */
    address public protocolFeeRecipient;

    /**
     * @notice Maximum creator fee (in basis point).
     */
    uint16 public maxCreatorFeeBp = 1000;

    /**
     * @notice Creator fee manager.
     */
    ICreatorFeeManager public creatorFeeManager;

    /**
     * @notice Constructor
     * @param _owner Owner address
     * @param _protocolFeeRecipient Protocol fee recipient address
     */
    constructor(address _owner, address _protocolFeeRecipient) StrategyManager(_owner) {
        _updateProtocolFeeRecipient(_protocolFeeRecipient);
    }

    /**
     * @notice This function allows the owner to update the creator fee manager address.
     * @param newCreatorFeeManager Address of the creator fee manager
     * @dev Only callable by owner.
     */
    function updateCreatorFeeManager(address newCreatorFeeManager) external onlyOwner {
        creatorFeeManager = ICreatorFeeManager(newCreatorFeeManager);
        emit NewCreatorFeeManager(newCreatorFeeManager);
    }

    /**
     * @notice This function allows the owner to update the maximum creator fee (in basis point).
     * @param newMaxCreatorFeeBp New maximum creator fee (in basis point)
     * @dev The maximum value that can be set is 25%.
     *      Only callable by owner.
     */
    function updateMaxCreatorFeeBp(uint16 newMaxCreatorFeeBp) external onlyOwner {
        if (newMaxCreatorFeeBp > 2500) {
            revert CreatorFeeBpTooHigh();
        }

        maxCreatorFeeBp = newMaxCreatorFeeBp;

        emit NewMaxCreatorFeeBp(newMaxCreatorFeeBp);
    }

    /**
     * @notice This function allows the owner to update the protocol fee recipient.
     * @param newProtocolFeeRecipient New protocol fee recipient address
     * @dev Only callable by owner.
     */
    function updateProtocolFeeRecipient(address newProtocolFeeRecipient) external onlyOwner {
        _updateProtocolFeeRecipient(newProtocolFeeRecipient);
    }

    /**
     * @notice This function is internal and is used to execute a transaction initiated by a taker order.
     * @param takerOrder Taker order struct (taker specific parameters for the execution)
     * @param makerOrder Maker order struct (maker specific parameter for the execution)
     * @param sender The address that sent the transaction
     * @return itemIds Array of item ids to be traded
     * @return amounts Array of amounts for each item id
     * @return recipients Array of recipient addresses
     * @return feeAmounts Array of fee amounts
     * @return isNonceInvalidated Whether the order's nonce will be invalidated after executing the order
     */
    function _executeStrategyForTakerOrder(
        OrderStructs.Taker calldata takerOrder,
        OrderStructs.Maker calldata makerOrder,
        address sender
    )
        internal
        returns (
            uint256[] memory itemIds,
            uint256[] memory amounts,
            address[2] memory recipients,
            uint256[3] memory feeAmounts,
            bool isNonceInvalidated
        )
    {
        uint256 price;

        // Verify the order validity for timestamps
        _verifyOrderTimestampValidity(makerOrder.startTime, makerOrder.endTime);

        if (makerOrder.strategyId == 0) {
            _verifyItemIdsAndAmountsEqualLengthsAndValidAmounts(makerOrder.amounts, makerOrder.itemIds);
            (price, itemIds, amounts) = (makerOrder.price, makerOrder.itemIds, makerOrder.amounts);
            isNonceInvalidated = true;
        } else {
            if (strategyInfo[makerOrder.strategyId].isActive) {
                /**
                 * @dev This is equivalent to
                 *
                 * if (makerOrder.quoteType == QuoteType.Bid) {
                 *     if (!strategyInfo[makerOrder.strategyId].isMakerBid) {
                 *         revert NoSelectorForStrategy();
                 *     }
                 * } else {
                 *     if (strategyInfo[makerOrder.strategyId].isMakerBid) {
                 *         revert NoSelectorForStrategy();
                 *     }
                 * }
                 *
                 * because one must be 0 and another must be 1 for the function
                 * to not revert.
                 *
                 * Both quoteType (an enum with 2 values) and isMakerBid (a bool)
                 * can only be 0 or 1.
                 */
                QuoteType quoteType = makerOrder.quoteType;
                bool isMakerBid = strategyInfo[makerOrder.strategyId].isMakerBid;
                assembly {
                    if eq(quoteType, isMakerBid) {
                        mstore(0x00, NoSelectorForStrategy_error_selector)
                        revert(Error_selector_offset, NoSelectorForStrategy_error_length)
                    }
                }

                (bool status, bytes memory data) = strategyInfo[makerOrder.strategyId].implementation.call(
                    abi.encodeWithSelector(strategyInfo[makerOrder.strategyId].selector, takerOrder, makerOrder)
                );

                if (!status) {
                    // @dev It forwards the revertion message from the low-level call
                    assembly {
                        revert(add(data, 32), mload(data))
                    }
                }

                (price, itemIds, amounts, isNonceInvalidated) = abi.decode(data, (uint256, uint256[], uint256[], bool));
            } else {
                revert StrategyNotAvailable(makerOrder.strategyId);
            }
        }

        // Creator fee and adjustment of protocol fee
        (recipients[1], feeAmounts[1]) =
            _getCreatorRecipientAndCalculateFeeAmount(makerOrder.collection, price, itemIds);
        if (makerOrder.quoteType == QuoteType.Bid) {
            _setTheRestOfFeeAmountsAndRecipients(
                makerOrder.strategyId,
                price,
                takerOrder.recipient == address(0) ? sender : takerOrder.recipient,
                feeAmounts,
                recipients
            );
        } else {
            _setTheRestOfFeeAmountsAndRecipients(
                makerOrder.strategyId, price, makerOrder.signer, feeAmounts, recipients
            );
        }
    }

    /**
     * @notice This private function updates the protocol fee recipient.
     * @param newProtocolFeeRecipient New protocol fee recipient address
     */
    function _updateProtocolFeeRecipient(address newProtocolFeeRecipient) private {
        if (newProtocolFeeRecipient == address(0)) {
            revert NewProtocolFeeRecipientCannotBeNullAddress();
        }

        protocolFeeRecipient = newProtocolFeeRecipient;
        emit NewProtocolFeeRecipient(newProtocolFeeRecipient);
    }

    /**
     * @notice This function is internal and is used to calculate
     *         the protocol fee amount for a set of fee amounts.
     * @param price Transaction price
     * @param strategyId Strategy id
     * @param creatorFeeAmount Creator fee amount
     * @param minTotalFeeAmount Min total fee amount
     * @return protocolFeeAmount Protocol fee amount
     */
    function _calculateProtocolFeeAmount(
        uint256 price,
        uint256 strategyId,
        uint256 creatorFeeAmount,
        uint256 minTotalFeeAmount
    ) private view returns (uint256 protocolFeeAmount) {
        protocolFeeAmount = (price * strategyInfo[strategyId].standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;

        if (protocolFeeAmount + creatorFeeAmount < minTotalFeeAmount) {
            protocolFeeAmount = minTotalFeeAmount - creatorFeeAmount;
        }
    }

    /**
     * @notice This function is internal and is used to get the creator fee address
     *         and calculate the creator fee amount.
     * @param collection Collection address
     * @param price Transaction price
     * @param itemIds Array of item ids
     * @return creator Creator recipient
     * @return creatorFeeAmount Creator fee amount
     */
    function _getCreatorRecipientAndCalculateFeeAmount(address collection, uint256 price, uint256[] memory itemIds)
        private
        view
        returns (address creator, uint256 creatorFeeAmount)
    {
        if (address(creatorFeeManager) != address(0)) {
            (creator, creatorFeeAmount) = creatorFeeManager.viewCreatorFeeInfo(collection, price, itemIds);

            if (creator == address(0)) {
                // If recipient is null address, creator fee is set to 0
                creatorFeeAmount = 0;
            } else if (creatorFeeAmount * ONE_HUNDRED_PERCENT_IN_BP > (price * uint256(maxCreatorFeeBp))) {
                // If creator fee is higher than tolerated, it reverts
                revert CreatorFeeBpTooHigh();
            }
        }
    }

    /**
     * @dev This function does not need to return feeAmounts and recipients as they are modified
     *      in memory.
     */
    function _setTheRestOfFeeAmountsAndRecipients(
        uint256 strategyId,
        uint256 price,
        address askRecipient,
        uint256[3] memory feeAmounts,
        address[2] memory recipients
    ) private view {
        // Compute minimum total fee amount
        uint256 minTotalFeeAmount = (price * strategyInfo[strategyId].minTotalFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;

        if (feeAmounts[1] == 0) {
            // If creator fee is null, protocol fee is set as the minimum total fee amount
            feeAmounts[2] = minTotalFeeAmount;
            // Net fee amount for seller
            feeAmounts[0] = price - feeAmounts[2];
        } else {
            // If there is a creator fee information, the protocol fee amount can be calculated
            feeAmounts[2] = _calculateProtocolFeeAmount(price, strategyId, feeAmounts[1], minTotalFeeAmount);
            // Net fee amount for seller
            feeAmounts[0] = price - feeAmounts[1] - feeAmounts[2];
        }

        recipients[0] = askRecipient;
    }

    /**
     * @notice This function is internal and is used to verify the validity of an order
     *         in the context of the current block timestamps.
     * @param startTime Start timestamp
     * @param endTime End timestamp
     */
    function _verifyOrderTimestampValidity(uint256 startTime, uint256 endTime) private view {
        // if (startTime > block.timestamp || endTime < block.timestamp) revert OutsideOfTimeRange();
        assembly {
            if or(gt(startTime, timestamp()), lt(endTime, timestamp())) {
                mstore(0x00, OutsideOfTimeRange_error_selector)
                revert(Error_selector_offset, OutsideOfTimeRange_error_length)
            }
        }
    }
}
