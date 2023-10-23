// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/// @title Interface for allowlist
/// @author bitbeckers
/// @notice This interface declares the required functionality for a hypercert token
/// @notice This interface does not specify the underlying token type (e.g. 721 or 1155)
interface IAllowlist {
    function isAllowedToClaim(
        bytes32[] calldata proof,
        uint256 tokenID,
        bytes32 leaf
    ) external view returns (bool isAllowed);
}
