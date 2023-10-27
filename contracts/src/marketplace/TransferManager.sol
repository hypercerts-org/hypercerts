// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {OwnableTwoSteps} from "@looksrare/contracts-libs/contracts/OwnableTwoSteps.sol";
import {LowLevelERC721Transfer} from "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelERC721Transfer.sol";
import {LowLevelERC1155Transfer} from "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelERC1155Transfer.sol";

// Interfaces and errors
import {ITransferManager} from "./interfaces/ITransferManager.sol";
import {AmountInvalid, LengthsInvalid} from "./errors/SharedErrors.sol";

// Libraries
import {OrderStructs} from "./libraries/OrderStructs.sol";

// Enums
import {CollectionType} from "./enums/CollectionType.sol";

/**
 * @title TransferManager
 * @notice This contract provides the transfer functions for ERC721/ERC1155/Hypercert/Hyperboard for contracts that
 * require them.
 *         Collection type "0" refers to ERC721 transfer functions.
 *         Collection type "1" refers to ERC1155 transfer functions.
 *         Collection type "2" refers to Hypercert transfer functions.
 *         Collection type "3" refers to Hyperboard transfer functions.
 * @dev "Safe" transfer functions for ERC721 are not implemented since they come with added gas costs
 *       to verify if the recipient is a contract as it requires verifying the receiver interface is valid.
 * @author LooksRare protocol team (👀,💎)
 */
// TODO Needs to be updated to split a fraction and transfer the new fraction to the bidder
contract TransferManager is ITransferManager, LowLevelERC721Transfer, LowLevelERC1155Transfer, OwnableTwoSteps {
    /**
     * @notice This returns whether the user has approved the operator address.
     * The first address is the user and the second address is the operator (e.g. LooksRareProtocol).
     */
    mapping(address => mapping(address => bool)) public hasUserApprovedOperator;

    /**
     * @notice This returns whether the operator address is allowed by this contract's owner.
     */
    mapping(address => bool) public isOperatorAllowed;

    /**
     * @notice Constructor
     * @param _owner Owner address
     */
    constructor(address _owner) OwnableTwoSteps(_owner) {}

    /**
     * @notice This function transfers items for a single ERC721 collection.
     * @param collection Collection address
     * @param from Sender address
     * @param to Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     */
    function transferItemsERC721(
        address collection,
        address from,
        address to,
        uint256[] calldata itemIds,
        uint256[] calldata amounts
    ) external {
        uint256 length = itemIds.length;
        if (length == 0) {
            revert LengthsInvalid();
        }

        _isOperatorValidForTransfer(from, msg.sender);

        for (uint256 i; i < length;) {
            if (amounts[i] != 1) {
                revert AmountInvalid();
            }
            _executeERC721TransferFrom(collection, from, to, itemIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice This function transfers items for a single ERC1155 collection.
     * @param collection Collection address
     * @param from Sender address
     * @param to Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     * @dev It does not allow batch transferring if from = msg.sender since native function should be used.
     */
    function transferItemsERC1155(
        address collection,
        address from,
        address to,
        uint256[] calldata itemIds,
        uint256[] calldata amounts
    ) external {
        uint256 length = itemIds.length;

        if (length == 0 || amounts.length != length) {
            revert LengthsInvalid();
        }

        _isOperatorValidForTransfer(from, msg.sender);

        if (length == 1) {
            if (amounts[0] == 0) {
                revert AmountInvalid();
            }
            _executeERC1155SafeTransferFrom(collection, from, to, itemIds[0], amounts[0]);
        } else {
            for (uint256 i; i < length;) {
                if (amounts[i] == 0) {
                    revert AmountInvalid();
                }

                unchecked {
                    ++i;
                }
            }
            _executeERC1155SafeBatchTransferFrom(collection, from, to, itemIds, amounts);
        }
    }

    /**
     * @notice This function transfers items for a single Hypercert.
     * @param collection Collection address
     * @param from Sender address
     * @param to Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     * @dev It does not allow batch transferring if from = msg.sender since native function should be used.
     */
    function transferItemsHypercert(
        address collection,
        address from,
        address to,
        uint256[] calldata itemIds,
        uint256[] calldata amounts
    ) external {
        uint256 length = itemIds.length;

        if (length == 0 || amounts.length != length) {
            revert LengthsInvalid();
        }

        _isOperatorValidForTransfer(from, msg.sender);

        if (length == 1) {
            if (amounts[0] == 0) {
                revert AmountInvalid();
            }
            _executeERC1155SafeTransferFrom(collection, from, to, itemIds[0], amounts[0]);
        } else {
            for (uint256 i; i < length;) {
                if (amounts[i] == 0) {
                    revert AmountInvalid();
                }

                unchecked {
                    ++i;
                }
            }
            _executeERC1155SafeBatchTransferFrom(collection, from, to, itemIds, amounts);
        }
    }

    /**
     * @notice This function transfers items for a single Hyperboard.
     * @param collection Collection address
     * @param from Sender address
     * @param to Recipient address
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     * @dev It does not allow batch transferring if from = msg.sender since native function should be used.
     */
    function transferItemsHyperboard(
        address collection,
        address from,
        address to,
        uint256[] calldata itemIds,
        uint256[] calldata amounts
    ) external {
        uint256 length = itemIds.length;

        if (length == 0 || amounts.length != length) {
            revert LengthsInvalid();
        }

        _isOperatorValidForTransfer(from, msg.sender);

        if (length == 1) {
            if (amounts[0] == 0) {
                revert AmountInvalid();
            }
            _executeERC1155SafeTransferFrom(collection, from, to, itemIds[0], amounts[0]);
        } else {
            for (uint256 i; i < length;) {
                if (amounts[i] == 0) {
                    revert AmountInvalid();
                }

                unchecked {
                    ++i;
                }
            }
            _executeERC1155SafeBatchTransferFrom(collection, from, to, itemIds, amounts);
        }
    }

    /**
     * @notice This function transfers items across an array of collections that can be both ERC721 and ERC1155.
     * @param items Array of BatchTransferItem
     * @param from Sender address
     * @param to Recipient address
     */
    function transferBatchItemsAcrossCollections(BatchTransferItem[] calldata items, address from, address to)
        external
    {
        uint256 itemsLength = items.length;

        if (itemsLength == 0) {
            revert LengthsInvalid();
        }

        if (from != msg.sender) {
            _isOperatorValidForTransfer(from, msg.sender);
        }

        for (uint256 i; i < itemsLength;) {
            uint256[] calldata itemIds = items[i].itemIds;
            uint256 itemIdsLengthForSingleCollection = itemIds.length;
            uint256[] calldata amounts = items[i].amounts;

            if (itemIdsLengthForSingleCollection == 0 || amounts.length != itemIdsLengthForSingleCollection) {
                revert LengthsInvalid();
            }

            CollectionType collectionType = items[i].collectionType;
            if (collectionType == CollectionType.ERC721) {
                for (uint256 j; j < itemIdsLengthForSingleCollection;) {
                    if (amounts[j] != 1) {
                        revert AmountInvalid();
                    }
                    _executeERC721TransferFrom(items[i].collection, from, to, itemIds[j]);
                    unchecked {
                        ++j;
                    }
                }
            } else if (collectionType == CollectionType.ERC1155) {
                for (uint256 j; j < itemIdsLengthForSingleCollection;) {
                    if (amounts[j] == 0) {
                        revert AmountInvalid();
                    }

                    unchecked {
                        ++j;
                    }
                }
                _executeERC1155SafeBatchTransferFrom(items[i].collection, from, to, itemIds, amounts);
            }

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice This function allows a user to grant approvals for an array of operators.
     *         Users cannot grant approvals if the operator is not allowed by this contract's owner.
     * @param operators Array of operator addresses
     * @dev Each operator address must be globally allowed to be approved.
     */
    function grantApprovals(address[] calldata operators) external {
        uint256 length = operators.length;

        if (length == 0) {
            revert LengthsInvalid();
        }

        for (uint256 i; i < length;) {
            address operator = operators[i];

            if (!isOperatorAllowed[operator]) {
                revert OperatorNotAllowed();
            }

            if (hasUserApprovedOperator[msg.sender][operator]) {
                revert OperatorAlreadyApprovedByUser();
            }

            hasUserApprovedOperator[msg.sender][operator] = true;

            unchecked {
                ++i;
            }
        }

        emit ApprovalsGranted(msg.sender, operators);
    }

    /**
     * @notice This function allows a user to revoke existing approvals for an array of operators.
     * @param operators Array of operator addresses
     * @dev Each operator address must be approved at the user level to be revoked.
     */
    function revokeApprovals(address[] calldata operators) external {
        uint256 length = operators.length;
        if (length == 0) {
            revert LengthsInvalid();
        }

        for (uint256 i; i < length;) {
            address operator = operators[i];

            if (!hasUserApprovedOperator[msg.sender][operator]) {
                revert OperatorNotApprovedByUser();
            }

            delete hasUserApprovedOperator[msg.sender][operator];
            unchecked {
                ++i;
            }
        }

        emit ApprovalsRemoved(msg.sender, operators);
    }

    /**
     * @notice This function allows an operator to be added for the shared transfer system.
     *         Once the operator is allowed, users can grant NFT approvals to this operator.
     * @param operator Operator address to allow
     * @dev Only callable by owner.
     */
    function allowOperator(address operator) external onlyOwner {
        if (isOperatorAllowed[operator]) {
            revert OperatorAlreadyAllowed();
        }

        isOperatorAllowed[operator] = true;

        emit OperatorAllowed(operator);
    }

    /**
     * @notice This function allows the user to remove an operator for the shared transfer system.
     * @param operator Operator address to remove
     * @dev Only callable by owner.
     */
    function removeOperator(address operator) external onlyOwner {
        if (!isOperatorAllowed[operator]) {
            revert OperatorNotAllowed();
        }

        delete isOperatorAllowed[operator];

        emit OperatorRemoved(operator);
    }

    /**
     * @notice This function is internal and verifies whether the transfer
     *         (by an operator on behalf of a user) is valid. If not, it reverts.
     * @param user User address
     * @param operator Operator address
     */
    function _isOperatorValidForTransfer(address user, address operator) private view {
        if (isOperatorAllowed[operator] && hasUserApprovedOperator[user][operator]) {
            return;
        }

        revert TransferCallerInvalid();
    }
}
