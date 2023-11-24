// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Forge test
import {Test} from "forge-std/Test.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Core contracts
import {LooksRareProtocol} from "@hypercerts/marketplace/LooksRareProtocol.sol";

// Utils
import {MerkleWithPosition} from "./MerkleWithPosition.sol";
import {MathLib} from "./MathLib.sol";

// Constants
import {MAX_CALLDATA_PROOF_LENGTH} from "@hypercerts/marketplace/constants/NumericConstants.sol";

contract EIP712MerkleTree is Test {
    using OrderStructs for OrderStructs.Maker;

    LooksRareProtocol private looksRareProtocol;

    constructor(LooksRareProtocol _looksRareProtocol) {
        looksRareProtocol = _looksRareProtocol;
    }

    function sign(uint256 privateKey, OrderStructs.Maker[] memory makerOrders, uint256 makerOrderIndex)
        external
        returns (bytes memory signature, OrderStructs.MerkleTree memory merkleTree)
    {
        uint256 bidCount = makerOrders.length;
        uint256 treeHeight = MathLib.log2(bidCount);
        if (2 ** treeHeight != bidCount || treeHeight == 0) {
            treeHeight += 1;
        }
        bytes32 batchOrderTypehash = _getBatchOrderTypehash(treeHeight);
        uint256 leafCount = 2 ** treeHeight;
        OrderStructs.MerkleTreeNode[] memory leaves = new OrderStructs.MerkleTreeNode[](leafCount);

        for (uint256 i; i < bidCount; i++) {
            leaves[i] = OrderStructs.MerkleTreeNode({
                value: makerOrders[i].hash(),
                position: i % 2 == 0 ? OrderStructs.MerkleTreeNodePosition.Left : OrderStructs.MerkleTreeNodePosition.Right
            });
        }

        bytes32 emptyMakerOrderHash = _emptyMakerOrderHash();
        for (uint256 i = bidCount; i < leafCount; i++) {
            leaves[i] = OrderStructs.MerkleTreeNode({
                value: emptyMakerOrderHash,
                position: i % 2 == 0 ? OrderStructs.MerkleTreeNodePosition.Left : OrderStructs.MerkleTreeNodePosition.Right
            });
        }

        MerkleWithPosition merkle = new MerkleWithPosition();
        OrderStructs.MerkleTreeNode[] memory proof = merkle.getProof(leaves, makerOrderIndex);
        bytes32 root = merkle.getRoot(leaves);

        signature = _sign(privateKey, batchOrderTypehash, root);
        merkleTree = OrderStructs.MerkleTree({root: root, proof: proof});
    }

    function _emptyMakerOrderHash() private pure returns (bytes32 makerOrderHash) {
        OrderStructs.Maker memory makerOrder;
        makerOrderHash = makerOrder.hash();
    }

    function _sign(uint256 privateKey, bytes32 batchOrderTypehash, bytes32 root)
        private
        view
        returns (bytes memory signature)
    {
        bytes32 digest = keccak256(abi.encode(batchOrderTypehash, root));

        bytes32 domainSeparator = looksRareProtocol.domainSeparator();

        (uint8 v, bytes32 r, bytes32 s) =
            vm.sign(privateKey, keccak256(abi.encodePacked("\x19\x01", domainSeparator, digest)));

        signature = abi.encodePacked(r, s, v);
    }

    function _getBatchOrderTypehash(uint256 treeHeight) private pure returns (bytes32 batchOrderTypehash) {
        bytes32[] memory batchOrderTypehashes = new bytes32[](14);
        batchOrderTypehashes[1] = hex"9661287f7a4aa4867db46a2453ee15bebac4e8fc25667a58718da658f15de643";
        batchOrderTypehashes[2] = hex"a54ab330ea9e1dfccee2b86f3666989e7fbd479704416c757c8de8e820142a08";
        batchOrderTypehashes[3] = hex"93390f5d45ede9dea305f16aec86b2472af4f823851637f1b7019ad0775cea49";
        batchOrderTypehashes[4] = hex"9dda2c8358da895e43d574bb15954ce5727b22e923a2d8f28261f297bce42f0b";
        batchOrderTypehashes[5] = hex"92dc717124e161262f9d10c7079e7d54dc51271893fba54aa4a0f270fecdcc98";
        batchOrderTypehashes[6] = hex"ce02aee5a7a35d40d974463c4c6e5534954fb07a7e7bc966fee268a15337bfd8";
        batchOrderTypehashes[7] = hex"f7a65efd167a18f7091b2bb929d687dd94503cf0a43620487055ed7d6b727559";
        batchOrderTypehashes[8] = hex"def24acacad1318b664520f7c10e8bc6d1e7f6f6f7c8b031e70624ceb42266a6";
        batchOrderTypehashes[9] = hex"4cb4080dc4e7bae88b4dc4307ad5117fa4f26195998a1b5f40368809d7f4c7f2";
        batchOrderTypehashes[10] = hex"f8b1f864164d8d6e0b45f1399bd711223117a4ab0b057a9c2d7779e86a7c88db";
        batchOrderTypehashes[11] = hex"4787f505db237e03a7193c312d5159add8a5705278e1c7dcf92ab87126cbe490";
        batchOrderTypehashes[12] = hex"7a6517e5a16c56b29947b57b748aa91736987376e1a366d948e7a802a9df3431";
        batchOrderTypehashes[13] = hex"35806d347e9929042ce209d143da48f100f0ff0cbdb1fde68cf13af8059d79df";

        batchOrderTypehash = batchOrderTypehashes[treeHeight];
    }
}
