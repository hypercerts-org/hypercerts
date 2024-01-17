// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {MerkleProofUpgradeable} from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import {IAllowlist} from "./interfaces/IAllowlist.sol";

import {Errors} from "./libs/Errors.sol";

/// @title Interface for hypercert token interactions
/// @author bitbeckers
/// @notice This interface declares the required functionality for a hypercert token
/// @notice This interface does not specify the underlying token type (e.g. 721 or 1155)
contract AllowlistMinter is IAllowlist {
    event AllowlistCreated(uint256 tokenID, bytes32 root);
    event LeafClaimed(uint256 tokenID, bytes32 leaf);

    mapping(uint256 => bytes32) internal merkleRoots;
    mapping(uint256 => mapping(bytes32 => bool)) public hasBeenClaimed;
    mapping(uint256 => uint256) internal maxUnits;
    mapping(uint256 => uint256) internal minted;

    function getMinted(uint256 claimID) external view returns (uint256 mintedUnits) {
        mintedUnits = minted[claimID];
    }

    function isAllowedToClaim(bytes32[] calldata proof, uint256 claimID, bytes32 leaf)
        external
        view
        returns (bool isAllowed)
    {
        if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();
        isAllowed = MerkleProofUpgradeable.verifyCalldata(proof, merkleRoots[claimID], leaf);
    }

    function _createAllowlist(uint256 claimID, bytes32 merkleRoot, uint256 units) internal {
        if (merkleRoot == "" || units == 0) revert Errors.Invalid();
        if (merkleRoots[claimID] != "") revert Errors.DuplicateEntry();

        merkleRoots[claimID] = merkleRoot;
        maxUnits[claimID] = units;
        emit AllowlistCreated(claimID, merkleRoot);
    }

    function _processClaim(bytes32[] calldata proof, uint256 claimID, uint256 amount) internal {
        if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();

        bytes32 leaf = _calculateLeaf(msg.sender, amount);

        if (hasBeenClaimed[claimID][leaf]) revert Errors.AlreadyClaimed();
        if (
            !MerkleProofUpgradeable.verifyCalldata(proof, merkleRoots[claimID], leaf)
                || (minted[claimID] + amount) > maxUnits[claimID]
        ) revert Errors.Invalid();
        hasBeenClaimed[claimID][leaf] = true;

        minted[claimID] += amount;

        emit LeafClaimed(claimID, leaf);
    }

    function _calculateLeaf(address account, uint256 amount) internal pure returns (bytes32 leaf) {
        leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     * Assuming 30 available slots (slots cost space, cost gas)
     * 1. merkleRoots
     * 2. hasBeenClaimed
     * 3. maxUnits
     * 4. minted
     */
    uint256[26] private __gap;
}
