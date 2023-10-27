// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {OwnableTwoSteps} from "@looksrare/contracts-libs/contracts/OwnableTwoSteps.sol";

// Interfaces
import {ICurrencyManager} from "./interfaces/ICurrencyManager.sol";

/**
 * @title CurrencyManager
 * @notice This contract manages the list of valid fungible currencies.
 * @author LooksRare protocol team (👀,💎)
 */
contract CurrencyManager is ICurrencyManager, OwnableTwoSteps {
    /**
     * @notice It checks whether the currency is allowed for transacting.
     */
    mapping(address => bool) public isCurrencyAllowed;

    /**
     * @notice Constructor
     * @param _owner Owner address
     */
    constructor(address _owner) OwnableTwoSteps(_owner) {}

    /**
     * @notice This function allows the owner to update the status of a currency.
     * @param currency Currency address (address(0) for ETH)
     * @param isAllowed Whether the currency should be allowed for trading
     * @dev Only callable by owner.
     */
    function updateCurrencyStatus(address currency, bool isAllowed) external onlyOwner {
        isCurrencyAllowed[currency] = isAllowed;
        emit CurrencyStatusUpdated(currency, isAllowed);
    }
}
