// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Test} from "forge-std/Test.sol";

import {BatchOrderTypehashRegistry} from "@hypercerts/marketplace/BatchOrderTypehashRegistry.sol";

// Shared errors
import {MerkleProofTooLarge} from "@hypercerts/marketplace/errors/SharedErrors.sol";

contract BatchOrderTypehashRegistryInheriter is BatchOrderTypehashRegistry {
    function getBatchOrderTypehash(uint256 height) external pure returns (bytes32 typehash) {
        return _getBatchOrderTypehash(height);
    }
}

contract BatchOrderTypehashRegistryTest is Test {
    function testHash() public {
        BatchOrderTypehashRegistryInheriter registry = new BatchOrderTypehashRegistryInheriter();
        bytes32 root = hex"6942000000000000000000000000000000000000000000000000000000000000";
        assertEq(
            registry.hashBatchOrder(root, 1), hex"8f0c85a215cff55fe39cf62ee7a1e0b5205a8ade02ff12ffee9ece02d626ffc3"
        );
        assertEq(
            registry.hashBatchOrder(root, 2), hex"f04a7d8a4688cf084b00b51ed583de7e5a19e59b073635e00a45a474899e89ec"
        );
        assertEq(
            registry.hashBatchOrder(root, 3), hex"56ef3bb8c564d19cfe494776934aa5e7ed84c41ae609d5f10e726f76281dd30b"
        );
        assertEq(
            registry.hashBatchOrder(root, 4), hex"2b0cb021eacab73e36d9ac9a04c1cf58589ff5bb4dc0d9b88ec29f67358ca812"
        );
        assertEq(
            registry.hashBatchOrder(root, 5), hex"253b3cc8d591a8b01fc8967cefe3ac3d0e078b884d96aa589f1ffd4536921bbb"
        );
        assertEq(
            registry.hashBatchOrder(root, 6), hex"7e4c4a2c5806fc4765bca325e8b78ccf9633bd1c7643144a56210293daefcbca"
        );
        assertEq(
            registry.hashBatchOrder(root, 7), hex"e8e39cebe7137f0fadf6b88ba611044ac79c0168444eab66ca53bddd0c5fb717"
        );
        assertEq(
            registry.hashBatchOrder(root, 8), hex"6e02f123509255ed381c7552de5e2ac1c1ea401a23e026e2452f01b70564affb"
        );
        assertEq(
            registry.hashBatchOrder(root, 9), hex"7eeb4a7fe4655841fdd66f8ecfcf6cd261d50eafabbaebb10f63f5fe84ddddc9"
        );
        assertEq(
            registry.hashBatchOrder(root, 10), hex"a96dee8b7b88deda5d50b55f641ca08c1ee00825eeb1db7a324f392fa0b8bb83"
        );
    }

    function testGetTypehash() public {
        BatchOrderTypehashRegistryInheriter registry = new BatchOrderTypehashRegistryInheriter();
        bytes memory makerOrderString = bytes(
            "Maker(" "uint8 quoteType," "uint256 globalNonce," "uint256 subsetNonce," "uint256 orderNonce,"
            "uint256 strategyId," "uint8 collectionType," "address collection," "address currency," "address signer,"
            "uint256 startTime," "uint256 endTime," "uint256 price," "uint256[] itemIds," "uint256[] amounts,"
            "bytes additionalParameters" ")"
        );

        assertEq(
            registry.getBatchOrderTypehash(1),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(2),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(3),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(4),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(5),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(6),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(7),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(8),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(9),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2][2][2][2][2] tree)"), makerOrderString))
        );

        assertEq(
            registry.getBatchOrderTypehash(10),
            keccak256(bytes.concat(bytes("BatchOrder(Maker[2][2][2][2][2][2][2][2][2][2] tree)"), makerOrderString))
        );
    }

    function testGetTypehashMerkleProofTooLarge(uint256 height) public {
        vm.assume(height > 10);

        BatchOrderTypehashRegistryInheriter registry = new BatchOrderTypehashRegistryInheriter();
        vm.expectRevert(abi.encodeWithSelector(MerkleProofTooLarge.selector, height));
        registry.getBatchOrderTypehash(height);
    }
}
