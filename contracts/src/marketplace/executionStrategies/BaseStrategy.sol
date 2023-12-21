// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interfaces
import {IStrategy} from "../interfaces/IStrategy.sol";

// Assembly constants
import {OrderInvalid_error_selector} from "../constants/AssemblyConstants.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// Enums
import {CollectionType} from "../enums/CollectionType.sol";

/**
 * @title BaseStrategy
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
abstract contract BaseStrategy is IStrategy {
    /**
     * @inheritdoc IStrategy
     */
    function isLooksRareV2Strategy() external pure override returns (bool) {
        return true;
    }

    /**
     * @dev This is equivalent to
     *      if (amount == 0 || (amount != 1 && collectionType == 0)) {
     *          return (0, OrderInvalid.selector);
     *      }
     * @dev OrderInvalid_error_selector is a left-padded 4 bytes. If the error selector is returned
     *      instead of reverting, the error selector needs to be right-padded by
     *      28 bytes. Therefore it needs to be left shifted by 28 x 8 = 224 bits.
     */
    function _validateAmountNoRevert(uint256 amount, CollectionType collectionType) internal pure {
        assembly {
            if or(
                iszero(amount),
                or(and(xor(amount, 1), iszero(collectionType)), and(xor(amount, 1), eq(collectionType, 2)))
            ) {
                mstore(0x00, 0x00)
                mstore(0x20, shl(224, OrderInvalid_error_selector))
                return(0, 0x40)
            }
        }
    }
}
