// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @notice CollectionType is used in OrderStructs.Maker's collectionType to determine the collection type being traded.
 */
enum CollectionType {
    ERC721,
    ERC1155,
    Hypercert
}
