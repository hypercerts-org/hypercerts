// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

contract MockHypercertMinter is IHypercertToken {
    constructor() IHypercertToken() {}

    /// @dev Function called to store a claim referenced via `uri` with a maximum number of fractions `units`.
    function mintClaim(address account, uint256 units, string memory _uri, TransferRestrictions restrictions)
        external
    {
        return;
    }

    /// @dev Function called to store a claim referenced via `uri` with a set of `fractions`.
    /// @dev Fractions are internally summed to total units.
    function mintClaimWithFractions(
        address account,
        uint256 units,
        uint256[] memory fractions,
        string memory _uri,
        TransferRestrictions restrictions
    ) external {
        return;
    }

    /// @dev Function called to split `tokenID` owned by `account` into units declared in `values`.
    /// @notice The sum of `values` must equal the current value of `_tokenID`.
    function splitFraction(address account, uint256 tokenID, uint256[] memory _values) external {
        return;
    }

    /// @dev Function called to merge tokens within `tokenIDs`.
    /// @notice Tokens that have been merged are burned.
    function mergeFractions(address account, uint256[] memory tokenIDs) external {
        return;
    }

    /// @dev Function to burn the token at `tokenID` for `account`
    /// @notice Operator must be allowed by `creator` and the token must represent the total amount of available units.
    function burnFraction(address account, uint256 tokenID) external {
        return;
    }

    /// @dev Function to burn the tokens at `tokenIDs` for `account`
    /// @notice Operator must be allowed by `creator` and the tokens must represent the total amount of available units.
    function batchBurnFraction(address account, uint256[] memory tokenIDs) external {
        return;
    }

    /// @dev Returns the `units` held by a (fractional) token at `claimID`
    /// @dev If `tokenID` is a base type, the total amount of `units` for the claim is returned.
    /// @dev If `tokenID` is a fractional token, the `units` held by the token is returned
    function unitsOf(uint256 tokenID) external view virtual returns (uint256 units) {
        return 0;
    }

    /// @dev Returns the `units` held by `account` of a (fractional) token at `claimID`
    /// @dev If `tokenID` is a base type, the total amount of `units` held by `account` for the claim is returned.
    /// @dev If `tokenID` is a fractional token, the `units` held by `account` the token is returned
    function unitsOf(address account, uint256 tokenID) external view virtual returns (uint256 units) {
        return 0;
    }

    /// @dev Returns the `uri` for metadata of the claim represented by `tokenID`
    /// @dev Metadata must conform to { Hypercert Metadata } spec (based on ERC1155 Metadata)
    function uri(uint256 tokenID) external view returns (string memory metadata) {
        return "metadata";
    }

    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IHypercertToken).interfaceId;
    }
}
