// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @notice It is returned if the available amount of fraction units is not available
 *         for the selected type of transaction.
 *         For instance, a split transaction cannot be executed if the amount of fraction units
 *         is not higher than the amount of fraction units available.
 */
error UnitAmountInvalid();
