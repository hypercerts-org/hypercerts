// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title ICurrencyManager
 * @author LooksRare protocol team (👀,💎)
 */
interface ICurrencyManager {
    /**
     * @notice It is emitted if the currency status in the allowlist is updated.
     * @param currency Currency address (address(0) = ETH)
     * @param isAllowed Whether the currency is allowed
     */
    event CurrencyStatusUpdated(address currency, bool isAllowed);
}
