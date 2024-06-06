// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IHypercert1155Token {
    function splitFraction(address to, uint256 tokenID, uint256[] memory _values) external;

    function unitsOf(uint256 tokenId) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);

    function isApprovedForAll(address account, address operator) external view returns (bool);
}
