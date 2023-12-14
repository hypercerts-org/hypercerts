// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// Enums
import {CollectionType} from "../enums/CollectionType.sol";

/**
 * @title ITransferManager
 * @author LooksRare protocol team (👀,💎)
 */
interface ITransferManager {
    /**
     * @notice This struct is only used for transferBatchItemsAcrossCollections.
     * @param collection Collection address
     * @param collectionType 0 for ERC721, 1 for ERC1155, 2 for Hypercert
     * @param itemIds Array of item ids to transfer
     * @param amounts Array of amounts to transfer
     */
    struct BatchTransferItem {
        address collection;
        CollectionType collectionType;
        uint256[] itemIds;
        uint256[] amounts;
    }

    /**
     * @notice It is emitted if operators' approvals to transfer NFTs are granted by a user.
     * @param user Address of the user
     * @param operators Array of operator addresses
     */
    event ApprovalsGranted(address user, address[] operators);

    /**
     * @notice It is emitted if operators' approvals to transfer NFTs are revoked by a user.
     * @param user Address of the user
     * @param operators Array of operator addresses
     */
    event ApprovalsRemoved(address user, address[] operators);

    /**
     * @notice It is emitted if a new operator is added to the global allowlist.
     * @param operator Operator address
     */
    event OperatorAllowed(address operator);

    /**
     * @notice It is emitted if an operator is removed from the global allowlist.
     * @param operator Operator address
     */
    event OperatorRemoved(address operator);

    /**
     * @notice It is returned if the operator to approve has already been approved by the user.
     */
    error OperatorAlreadyApprovedByUser();

    /**
     * @notice It is returned if the operator to revoke has not been previously approved by the user.
     */
    error OperatorNotApprovedByUser();

    /**
     * @notice It is returned if the transfer caller is already allowed by the owner.
     * @dev This error can only be returned for owner operations.
     */
    error OperatorAlreadyAllowed();

    /**
     * @notice It is returned if the operator to approve is not in the global allowlist defined by the owner.
     * @dev This error can be returned if the user tries to grant approval to an operator address not in the
     *      allowlist or if the owner tries to remove the operator from the global allowlist.
     */
    error OperatorNotAllowed();

    /**
     * @notice It is returned if the transfer caller is invalid.
     *         For a transfer called to be valid, the operator must be in the global allowlist and
     *         approved by the 'from' user.
     */
    error TransferCallerInvalid();
}
