// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interfaces
import {IRoyaltyFeeRegistry} from "./IRoyaltyFeeRegistry.sol";

/**
 * @title ICreatorFeeManager
 * @author LooksRare protocol team (👀,💎)
 */
interface ICreatorFeeManager {
    /**
     * @notice It is returned if the bundle contains multiple itemIds with different creator fee structure.
     */
    error BundleEIP2981NotAllowed(address collection);

    /**
     * @notice It returns the royalty fee registry address/interface.
     * @return royaltyFeeRegistry Interface of the royalty fee registry
     */
    function royaltyFeeRegistry() external view returns (IRoyaltyFeeRegistry royaltyFeeRegistry);

    /**
     * @notice This function returns the creator address and calculates the creator fee amount.
     * @param collection Collection address
     * @param price Transaction price
     * @param itemIds Array of item ids
     * @return creator Creator address
     * @return creatorFeeAmount Creator fee amount
     */
    function viewCreatorFeeInfo(address collection, uint256 price, uint256[] memory itemIds)
        external
        view
        returns (address creator, uint256 creatorFeeAmount);
}
