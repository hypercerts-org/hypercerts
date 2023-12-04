// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Direct dependencies
import {PackableReentrancyGuard} from "@looksrare/contracts-libs/contracts/PackableReentrancyGuard.sol";
import {ExecutionManager} from "./ExecutionManager.sol";
import {TransferManager} from "./TransferManager.sol";
import {StrategyHypercertFractionOffer} from "./executionStrategies/StrategyHypercertFractionOffer.sol";

// Libraries
import {OrderStructs} from "./libraries/OrderStructs.sol";

// Enums
import {CollectionType} from "./enums/CollectionType.sol";

// Interfaces
import {IHypercertToken} from "../protocol/interfaces/IHypercertToken.sol";

/**
 * @title TransferSelectorNFT
 * @notice This contract handles the logic for transferring non-fungible items.
 * @author LooksRare protocol team (👀,💎); bitbeckers;
 */
contract TransferSelectorNFT is ExecutionManager, PackableReentrancyGuard {
    error UnsupportedCollectionType();
    /**
     * @notice Transfer manager for ERC721, ERC1155 and Hypercerts.
     */

    TransferManager public immutable transferManager;

    /**
     * @notice Constructor
     * @param _owner Owner address
     * @param _protocolFeeRecipient Protocol fee recipient address
     * @param _transferManager Address of the transfer manager for ERC721/ERC1155
     */
    constructor(address _owner, address _protocolFeeRecipient, address _transferManager)
        ExecutionManager(_owner, _protocolFeeRecipient)
    {
        transferManager = TransferManager(_transferManager);
    }

    /**
     * @notice This function is internal and used to transfer non-fungible tokens.
     * @param collection Collection address
     * @param collectionType Collection type (e.g. 0 = ERC721, 1 = ERC1155)
     * @param sender Sender address
     * @param recipient Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     */
    function _transferNFT(
        address collection,
        CollectionType collectionType,
        address sender,
        address recipient,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) internal {
        if (collectionType == CollectionType.ERC721) {
            transferManager.transferItemsERC721(collection, sender, recipient, itemIds, amounts);
        } else if (collectionType == CollectionType.ERC1155) {
            transferManager.transferItemsERC1155(collection, sender, recipient, itemIds, amounts);
        } else {
            revert UnsupportedCollectionType();
        }
    }

    /**
     * @notice This function is internal and used to split a hypercert fraction or execute a transfer of the fraction.
     * @param collection Collection address
     * @param collectionType Collection type (e.g. 0 = ERC721, 1 = ERC1155, 2 = Hypercert)
     * @param sender Sender address
     * @param recipient Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     */
    function _transferHypercertFraction(
        address collection,
        CollectionType collectionType,
        uint256 strategyId,
        address sender,
        address recipient,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) internal {
        if (collectionType != CollectionType.Hypercert) {
            revert UnsupportedCollectionType();
        }

        if (
            strategyInfo[strategyId].selector
                == StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                || strategyInfo[strategyId].selector
                    == StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
        ) {
            transferManager.splitItemsHypercert(collection, sender, recipient, itemIds, amounts);
        } else {
            transferManager.transferItemsHypercert(collection, sender, recipient, itemIds, amounts);
        }
    }
}
