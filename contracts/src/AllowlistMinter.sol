// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { MerkleProofUpgradeable } from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import { IAllowlist } from "./interfaces/IAllowlist.sol";

import { Errors } from "./libs/Errors.sol";

/// @title Interface for hypercert token interactions
/// @author bitbeckers
/// @notice This interface declares the required functionality for a hypercert token
/// @notice This interface does not specify the underlying token type (e.g. 721 or 1155)
contract AllowlistMinter is IAllowlist {
    event AllowlistCreated(uint256 tokenID, bytes32 root);
    event LeafClaimed(uint256 tokenID, bytes32 leaf);

    mapping(uint256 => bytes32) internal merkleRoots;
    mapping(uint256 => mapping(bytes32 => bool)) public hasBeenClaimed;

    function isAllowedToClaim(
        bytes32[] calldata proof,
        uint256 claimID,
        bytes32 leaf
    ) external view returns (bool isAllowed) {
        if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();
        isAllowed = MerkleProofUpgradeable.verifyCalldata(proof, merkleRoots[claimID], leaf);
    }

    function _createAllowlist(uint256 claimID, bytes32 merkleRoot) internal {
        if (merkleRoots[claimID] != "") revert Errors.DuplicateEntry();

        merkleRoots[claimID] = merkleRoot;
        emit AllowlistCreated(claimID, merkleRoot);
    }

    function _processClaim(bytes32[] calldata proof, uint256 claimID, uint256 amount) internal {
        if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();

        bytes32 node = _calculateLeaf(msg.sender, amount);

        if (hasBeenClaimed[claimID][node]) revert Errors.DuplicateEntry();

        if (!MerkleProofUpgradeable.verifyCalldata(proof, merkleRoots[claimID], node)) revert Errors.Invalid();
        hasBeenClaimed[claimID][node] = true;

        emit LeafClaimed(claimID, node);
    }

    function _calculateLeaf(address account, uint256 amount) internal pure returns (bytes32 leaf) {
        leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
    }
}
