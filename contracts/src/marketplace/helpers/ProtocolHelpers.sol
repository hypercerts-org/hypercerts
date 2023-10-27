// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {SignatureCheckerCalldata} from "@looksrare/contracts-libs/contracts/SignatureCheckerCalldata.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// Other dependencies
import {LooksRareProtocol} from "../LooksRareProtocol.sol";

/**
 * @title ProtocolHelpers
 * @notice This contract contains helper view functions for order creation.
 * @author LooksRare protocol team (👀,💎)
 */
contract ProtocolHelpers {
    using OrderStructs for OrderStructs.Maker;

    // Encoding prefix for EIP-712 signatures
    string internal constant _ENCODING_PREFIX = "\x19\x01";

    // LooksRareProtocol
    LooksRareProtocol public looksRareProtocol;

    /**
     * @notice Constructor
     * @param _looksRareProtocol LooksRare protocol address
     */
    constructor(address _looksRareProtocol) {
        looksRareProtocol = LooksRareProtocol(_looksRareProtocol);
    }

    /**
     * @notice Compute digest for maker bid struct
     * @param maker Maker struct
     * @return digest Digest
     */
    function computeMakerDigest(OrderStructs.Maker memory maker) public view returns (bytes32 digest) {
        bytes32 domainSeparator = looksRareProtocol.domainSeparator();
        return keccak256(abi.encodePacked(_ENCODING_PREFIX, domainSeparator, maker.hash()));
    }

    /**
     * @notice Compute digest for merkle tree struct
     * @param merkleTree Merkle tree struct
     * @return digest Digest
     */
    function computeDigestMerkleTree(OrderStructs.MerkleTree memory merkleTree) public view returns (bytes32 digest) {
        bytes32 domainSeparator = looksRareProtocol.domainSeparator();
        bytes32 batchOrderHash = looksRareProtocol.hashBatchOrder(merkleTree.root, merkleTree.proof.length);
        return keccak256(abi.encodePacked(_ENCODING_PREFIX, domainSeparator, batchOrderHash));
    }

    /**
     * @notice Verify maker order signature
     * @param maker Maker struct
     * @param makerSignature Maker signature
     * @param signer Signer address
     * @dev It returns true only if the SignatureCheckerCalldata does not revert before.
     */
    function verifyMakerSignature(OrderStructs.Maker memory maker, bytes calldata makerSignature, address signer)
        public
        view
        returns (bool)
    {
        bytes32 digest = computeMakerDigest(maker);
        SignatureCheckerCalldata.verify(digest, signer, makerSignature);
        return true;
    }

    /**
     * @notice Verify merkle tree signature
     * @param merkleTree Merkle tree struct
     * @param makerSignature Maker signature
     * @param signer Signer address
     * @dev It returns true only if the SignatureCheckerCalldata does not revert before.
     */
    function verifyMerkleTree(OrderStructs.MerkleTree memory merkleTree, bytes calldata makerSignature, address signer)
        public
        view
        returns (bool)
    {
        bytes32 digest = computeDigestMerkleTree(merkleTree);
        SignatureCheckerCalldata.verify(digest, signer, makerSignature);
        return true;
    }
}
