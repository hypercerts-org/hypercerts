// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Enums
import {CollectionType} from "../enums/CollectionType.sol";
import {QuoteType} from "../enums/QuoteType.sol";

/**
 * @title OrderStructs
 * @notice This library contains all order struct types for the LooksRare protocol (v2).
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
library OrderStructs {
    /**
     * 1. Maker struct
     */

    /**
     * @notice Maker is the struct for a maker order.
     * @param quoteType Quote type (i.e. 0 = BID, 1 = ASK)
     * @param globalNonce Global user order nonce for maker orders
     * @param subsetNonce Subset nonce (shared across bid/ask maker orders)
     * @param orderNonce Order nonce (it can be shared across bid/ask maker orders)
     * @param strategyId Strategy id
     * @param collectionType Collection type (i.e. 0 = ERC721, 1 = ERC1155, 2 = Hypercert)
     * @param collection Collection address
     * @param currency Currency address (@dev address(0) = ETH)
     * @param signer Signer address
     * @param startTime Start timestamp
     * @param endTime End timestamp
     * @param price Minimum price for maker ask, maximum price for maker bid
     * @param itemIds Array of itemIds
     * @param amounts Array of amounts
     * @param additionalParameters Extra data specific for the order
     */
    struct Maker {
        QuoteType quoteType;
        uint256 globalNonce;
        uint256 subsetNonce;
        uint256 orderNonce;
        uint256 strategyId;
        CollectionType collectionType;
        address collection;
        address currency;
        address signer;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        uint256[] itemIds;
        uint256[] amounts;
        bytes additionalParameters;
    }

    /**
     * 2. Taker struct
     */

    /**
     * @notice Taker is the struct for a taker ask/bid order. It contains the parameters required for a direct purchase.
     * @dev Taker struct is matched against MakerAsk/MakerBid structs at the protocol level.
     * @param recipient Recipient address (to receive NFTs or non-fungible tokens)
     * @param additionalParameters Extra data specific for the order
     */
    struct Taker {
        address recipient;
        bytes additionalParameters;
    }

    /**
     * 3. Merkle tree struct
     */
    enum MerkleTreeNodePosition {
        Left,
        Right
    }

    /**
     * @notice MerkleTreeNode is a MerkleTree's node.
     * @param value It can be an order hash or a proof
     * @param position The node's position in its branch.
     *                 It can be left or right or none
     *                 (before the tree is sorted).
     */
    struct MerkleTreeNode {
        bytes32 value;
        MerkleTreeNodePosition position;
    }

    /**
     * @notice MerkleTree is the struct for a merkle tree of order hashes.
     * @dev A Merkle tree can be computed with order hashes.
     *      It can contain order hashes from both maker bid and maker ask structs.
     * @param root Merkle root
     * @param proof Array containing the merkle proof
     */
    struct MerkleTree {
        bytes32 root;
        MerkleTreeNode[] proof;
    }

    /**
     * 4. Constants
     */

    /**
     * @notice This is the type hash constant used to compute the maker order hash.
     */
    bytes32 internal constant _MAKER_TYPEHASH = keccak256(
        "Maker(" "uint8 quoteType," "uint256 globalNonce," "uint256 subsetNonce," "uint256 orderNonce,"
        "uint256 strategyId," "uint8 collectionType," "address collection," "address currency," "address signer,"
        "uint256 startTime," "uint256 endTime," "uint256 price," "uint256[] itemIds," "uint256[] amounts,"
        "bytes additionalParameters" ")"
    );

    /**
     * 5. Hash functions
     */

    /**
     * @notice This function is used to compute the order hash for a maker struct.
     * @param maker Maker order struct
     * @return makerHash Hash of the maker struct
     */
    function hash(Maker memory maker) internal pure returns (bytes32) {
        // Encoding is done into two parts to avoid stack too deep issues
        return keccak256(
            bytes.concat(
                abi.encode(
                    _MAKER_TYPEHASH,
                    maker.quoteType,
                    maker.globalNonce,
                    maker.subsetNonce,
                    maker.orderNonce,
                    maker.strategyId,
                    maker.collectionType,
                    maker.collection,
                    maker.currency
                ),
                abi.encode(
                    maker.signer,
                    maker.startTime,
                    maker.endTime,
                    maker.price,
                    keccak256(abi.encodePacked(maker.itemIds)),
                    keccak256(abi.encodePacked(maker.amounts)),
                    keccak256(maker.additionalParameters)
                )
            )
        );
    }
}
