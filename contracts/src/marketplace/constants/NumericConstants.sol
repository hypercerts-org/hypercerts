// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @dev 100% represented in basis point is 10_000.
 */
uint256 constant ONE_HUNDRED_PERCENT_IN_BP = 10_000;

/**
 * @dev The maximum length of a proof for a batch order is 10.
 *      The maximum merkle tree that can used for signing has a height of
 *      2**10 = 1_024.
 */
uint256 constant MAX_CALLDATA_PROOF_LENGTH = 10;
