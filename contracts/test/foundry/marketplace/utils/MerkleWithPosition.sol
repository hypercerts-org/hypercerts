// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

/**
 * @dev Modified from MurkyBase to add each node's position after hashing.
 *      hashLeafPair does not sort the nodes to match EIP-712.
 */
contract MerkleWithPosition {
    /**
     *
     * PROOF GENERATION *
     *
     */
    function getRoot(OrderStructs.MerkleTreeNode[] memory data) public pure returns (bytes32) {
        require(data.length > 1, "won't generate root for single leaf");
        while (data.length > 1) {
            data = hashLevel(data);
        }
        return data[0].value;
    }

    function getProof(OrderStructs.MerkleTreeNode[] memory data, uint256 node)
        public
        pure
        returns (OrderStructs.MerkleTreeNode[] memory result)
    {
        require(data.length > 1, "won't generate proof for single leaf");
        // The size of the proof is equal to the ceiling of log2(numLeaves)
        result = new OrderStructs.MerkleTreeNode[](log2ceilBitMagic(data.length));
        uint256 pos = 0;

        // Two overflow risks: node, pos
        // node: max array size is 2**256-1. Largest index in the array will be 1 less than that. Also,
        // for dynamic arrays, size is limited to 2**64-1
        // pos: pos is bounded by log2(data.length), which should be less than type(uint256).max
        while (data.length > 1) {
            unchecked {
                if (node & 0x1 == 1) {
                    result[pos] = data[node - 1];
                } else if (node + 1 == data.length) {
                    result[pos] = OrderStructs.MerkleTreeNode({
                        value: bytes32(0),
                        position: OrderStructs.MerkleTreeNodePosition.Left
                    });
                } else {
                    result[pos] = data[node + 1];
                }
                ++pos;
                node /= 2;
            }
            data = hashLevel(data);
        }
        return result;
    }

    ///@dev function is private to prevent unsafe data from being passed
    function hashLevel(OrderStructs.MerkleTreeNode[] memory data)
        private
        pure
        returns (OrderStructs.MerkleTreeNode[] memory result)
    {
        // Function is private, and all internal callers check that data.length >=2.
        // Underflow is not possible as lowest possible value for data/result index is 1
        // overflow should be safe as length is / 2 always.
        unchecked {
            uint256 length = data.length;
            if (length & 0x1 == 1) {
                result = new OrderStructs.MerkleTreeNode[](length / 2 + 1);
                bytes32 hashed = hashLeafPairs(data[length - 1].value, bytes32(0));
                result[result.length - 1] =
                    OrderStructs.MerkleTreeNode({value: hashed, position: OrderStructs.MerkleTreeNodePosition.Left});
            } else {
                result = new OrderStructs.MerkleTreeNode[](length / 2);
            }
            // pos is upper bounded by data.length / 2, so safe even if array is at max size
            uint256 pos = 0;
            bool nextIsLeft = true;
            for (uint256 i = 0; i < length - 1; i += 2) {
                bytes32 hashed = hashLeafPairs(data[i].value, data[i + 1].value);
                result[pos] = OrderStructs.MerkleTreeNode({
                    value: hashed,
                    position: nextIsLeft
                        ? OrderStructs.MerkleTreeNodePosition.Left
                        : OrderStructs.MerkleTreeNodePosition.Right
                });
                nextIsLeft = !nextIsLeft;
                ++pos;
            }
        }
        return result;
    }

    /**
     *
     * MATH "LIBRARY" *
     *
     */

    /// Original bitmagic adapted from https://github.com/paulrberg/prb-math/blob/main/contracts/PRBMath.sol
    /// @dev Note that x assumed > 1
    function log2ceilBitMagic(uint256 x) public pure returns (uint256) {
        if (x <= 1) {
            return 0;
        }
        uint256 msb = 0;
        uint256 _x = x;
        if (x >= 2 ** 128) {
            x >>= 128;
            msb += 128;
        }
        if (x >= 2 ** 64) {
            x >>= 64;
            msb += 64;
        }
        if (x >= 2 ** 32) {
            x >>= 32;
            msb += 32;
        }
        if (x >= 2 ** 16) {
            x >>= 16;
            msb += 16;
        }
        if (x >= 2 ** 8) {
            x >>= 8;
            msb += 8;
        }
        if (x >= 2 ** 4) {
            x >>= 4;
            msb += 4;
        }
        if (x >= 2 ** 2) {
            x >>= 2;
            msb += 2;
        }
        if (x >= 2 ** 1) {
            msb += 1;
        }

        uint256 lsb = (~_x + 1) & _x;
        if ((lsb == _x) && (msb > 0)) {
            return msb;
        } else {
            return msb + 1;
        }
    }

    function hashLeafPairs(bytes32 left, bytes32 right) public pure returns (bytes32 _hash) {
        assembly {
            mstore(0x0, left)
            mstore(0x20, right)
            _hash := keccak256(0x0, 0x40)
        }
    }
}
