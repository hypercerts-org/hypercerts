// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Shared errors
import {MerkleProofTooLarge} from "./errors/SharedErrors.sol";

/**
 * @title BatchOrderTypehashRegistry
 * @notice The contract generates the batch order hash that is used to compute the digest for signature verification.
 * @author LooksRare protocol team (👀,💎)
 */
contract BatchOrderTypehashRegistry {
    /**
     * @notice This function returns the hash of the concatenation of batch order type hash and merkle root.
     * @param root Merkle root
     * @param proofLength Merkle proof length
     * @return batchOrderHash The batch order hash
     */
    function hashBatchOrder(bytes32 root, uint256 proofLength) public pure returns (bytes32 batchOrderHash) {
        batchOrderHash = keccak256(abi.encode(_getBatchOrderTypehash(proofLength), root));
    }

    /**
     * @dev It looks like this for each height
     *      height == 1: BatchOrder(Maker[2] tree)Maker(uint8 quoteType,uint256 globalNonce,uint256 subsetNonce,uint256
     * orderNonce,uint256 strategyId,uint8 collectionType,address collection,address currency,address signer,uint256
     * startTime,uint256 endTime,uint256 price,uint256[] itemIds,uint256[] amounts,bytes additionalParameters)
     *      height == 2: BatchOrder(Maker[2][2] tree)Maker(uint8 quoteType,uint256 globalNonce,uint256
     * subsetNonce,uint256 orderNonce,uint256 strategyId,uint8 collectionType,address collection,address
     * currency,address signer,uint256 startTime,uint256 endTime,uint256 price,uint256[] itemIds,uint256[] amounts,bytes
     * additionalParameters)
     *      height == n: BatchOrder(Maker[2]...[2] tree)Maker(uint8 quoteType,uint256 globalNonce,uint256
     * subsetNonce,uint256 orderNonce,uint256 strategyId,uint8 collectionType,address collection,address
     * currency,address signer,uint256 startTime,uint256 endTime,uint256 price,uint256[] itemIds,uint256[] amounts,bytes
     * additionalParameters)
     */
    function _getBatchOrderTypehash(uint256 height) internal pure returns (bytes32 typehash) {
        if (height == 1) {
            typehash = hex"9661287f7a4aa4867db46a2453ee15bebac4e8fc25667a58718da658f15de643";
        } else if (height == 2) {
            typehash = hex"a54ab330ea9e1dfccee2b86f3666989e7fbd479704416c757c8de8e820142a08";
        } else if (height == 3) {
            typehash = hex"93390f5d45ede9dea305f16aec86b2472af4f823851637f1b7019ad0775cea49";
        } else if (height == 4) {
            typehash = hex"9dda2c8358da895e43d574bb15954ce5727b22e923a2d8f28261f297bce42f0b";
        } else if (height == 5) {
            typehash = hex"92dc717124e161262f9d10c7079e7d54dc51271893fba54aa4a0f270fecdcc98";
        } else if (height == 6) {
            typehash = hex"ce02aee5a7a35d40d974463c4c6e5534954fb07a7e7bc966fee268a15337bfd8";
        } else if (height == 7) {
            typehash = hex"f7a65efd167a18f7091b2bb929d687dd94503cf0a43620487055ed7d6b727559";
        } else if (height == 8) {
            typehash = hex"def24acacad1318b664520f7c10e8bc6d1e7f6f6f7c8b031e70624ceb42266a6";
        } else if (height == 9) {
            typehash = hex"4cb4080dc4e7bae88b4dc4307ad5117fa4f26195998a1b5f40368809d7f4c7f2";
        } else if (height == 10) {
            typehash = hex"f8b1f864164d8d6e0b45f1399bd711223117a4ab0b057a9c2d7779e86a7c88db";
        } else {
            revert MerkleProofTooLarge(height);
        }
    }
}
