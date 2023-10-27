// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title IRoyaltyFeeRegistry
 * @author LooksRare protocol team (👀,💎)
 */
interface IRoyaltyFeeRegistry {
    /**
     * @notice This function returns the royalty information for a collection at a given transaction price.
     * @param collection Collection address
     * @param price Transaction price
     * @return receiver Receiver address
     * @return royaltyFee Royalty fee amount
     */
    function royaltyInfo(
        address collection,
        uint256 price
    ) external view returns (address receiver, uint256 royaltyFee);
}
