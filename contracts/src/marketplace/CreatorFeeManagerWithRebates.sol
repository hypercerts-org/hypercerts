// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IERC2981} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC2981.sol";

// Interfaces
import {ICreatorFeeManager} from "./interfaces/ICreatorFeeManager.sol";
import {IRoyaltyFeeRegistry} from "./interfaces/IRoyaltyFeeRegistry.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "./constants/NumericConstants.sol";

/**
 * @title CreatorFeeManagerWithRebates
 * @notice This contract returns the creator fee address and the creator rebate amount.
 * @author LooksRare protocol team (👀,💎)
 */
contract CreatorFeeManagerWithRebates is ICreatorFeeManager {
    /**
     * @notice Standard royalty fee (in basis point).
     */
    uint256 public constant STANDARD_ROYALTY_FEE_BP = 50;

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
     */
    function viewCreatorFeeInfo(address collection, uint256 price, uint256[] memory itemIds)
        external
        view
        returns (address creator, uint256 creatorFeeAmount)
    {
        // Check if there is a royalty info in the system
        (creator,) = royaltyFeeRegistry.royaltyInfo(collection, price);

        if (creator == address(0)) {
            if (IERC2981(collection).supportsInterface(IERC2981.royaltyInfo.selector)) {
                uint256 length = itemIds.length;

                for (uint256 i; i < length;) {
                    try IERC2981(collection).royaltyInfo(itemIds[i], price) returns (
                        address newCreator, uint256 /* newCreatorFeeAmount */
                    ) {
                        if (i == 0) {
                            creator = newCreator;

                            unchecked {
                                ++i;
                            }
                            continue;
                        }

                        if (newCreator != creator) {
                            revert BundleEIP2981NotAllowed(collection);
                        }
                    } catch {
                        // If creator address is not 0, that means there was at least 1
                        // successful call. If all royaltyInfo calls fail, it should assume
                        // 0 royalty.
                        // If the first call reverts, even if creator is address(0), subsequent
                        // successful calls will still revert above with BundleEIP2981NotAllowed
                        // because newCreator will be different from creator.
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

        // A fixed royalty fee is applied
        if (creator != address(0)) {
            creatorFeeAmount = (STANDARD_ROYALTY_FEE_BP * price) / ONE_HUNDRED_PERCENT_IN_BP;
        }
    }
}
