// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IERC2981} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC2981.sol";

// Interfaces
import {ICreatorFeeManager} from "./interfaces/ICreatorFeeManager.sol";
import {IRoyaltyFeeRegistry} from "./interfaces/IRoyaltyFeeRegistry.sol";

/**
 * @title CreatorFeeManagerWithRoyalties
 * @notice This contract returns the creator fee address and the creator fee amount.
 * @author LooksRare protocol team (👀,💎)
 */
contract CreatorFeeManagerWithRoyalties is ICreatorFeeManager {
    /**
     * @notice Royalty fee registry interface.
     */
    IRoyaltyFeeRegistry public immutable royaltyFeeRegistry;

    /**
     * @notice Constructor
     * @param _royaltyFeeRegistry Royalty fee registry address.
     */
    constructor(address _royaltyFeeRegistry) {
        royaltyFeeRegistry = IRoyaltyFeeRegistry(_royaltyFeeRegistry);
    }

    /**
     * @inheritdoc ICreatorFeeManager
     * @dev There are two on-chain sources for the royalty fee to distribute.
     *      1. RoyaltyFeeRegistry: It is an on-chain registry where creator fee is defined
     *         for all items of a collection.
     *      2. ERC2981: The NFT Royalty Standard where royalty fee is defined at a itemId level in a collection.
     *      The on-chain logic looks up the registry first. If it does not find anything,
     *      it checks if a collection is ERC2981. If so, it fetches the proper royalty information for the itemId.
     *      For a bundle that contains multiple itemIds (for a collection using ERC2981), if the royalty fee/recipient
     *      differ among the itemIds part of the bundle, the trade reverts.
     *      This contract DOES NOT enforce any restriction for extremely high creator fee,
     *      nor verifies the creator fee fetched is inferior to the total price.
     *      If any contract relies on it to build an on-chain royalty logic,
     *      it should implement protection against:
     *      (1) high royalties
     *      (2) potential unexpected royalty changes that can occur after the creation of the order.
     */
    function viewCreatorFeeInfo(address collection, uint256 price, uint256[] memory itemIds)
        external
        view
        returns (address creator, uint256 creatorFeeAmount)
    {
        // Check if there is a royalty info in the system
        (creator, creatorFeeAmount) = royaltyFeeRegistry.royaltyInfo(collection, price);

        if (creator == address(0)) {
            if (IERC2981(collection).supportsInterface(IERC2981.royaltyInfo.selector)) {
                uint256 length = itemIds.length;

                for (uint256 i; i < length;) {
                    try IERC2981(collection).royaltyInfo(itemIds[i], price) returns (
                        address newCreator, uint256 newCreatorFeeAmount
                    ) {
                        if (i == 0) {
                            creator = newCreator;
                            creatorFeeAmount = newCreatorFeeAmount;

                            unchecked {
                                ++i;
                            }
                            continue;
                        }

                        if (newCreator != creator || newCreatorFeeAmount != creatorFeeAmount) {
                            revert BundleEIP2981NotAllowed(collection);
                        }
                    } catch {
                        // If creator address is not 0, that means there was at least 1
                        // successful call. If all royaltyInfo calls fail, it should assume
                        // 0 royalty.
                        // If the first call reverts, even if creator is address(0), subsequent
                        // successful calls will still revert above with BundleEIP2981NotAllowed
                        // because newCreator/newCreatorFeeAmount will be different from creator/creatorFeeAmount.
                        if (creator != address(0)) {
                            revert BundleEIP2981NotAllowed(collection);
                        }
                    }

                    unchecked {
                        ++i;
                    }
                }
            }
        }
    }
}
