// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Test} from "forge-std/Test.sol";
import {BytesLib} from "./BytesLib.sol";

abstract contract TestHelpers is Test {
    using BytesLib for bytes;

    modifier asPrankedUser(address user) {
        vm.startPrank(user);
        _;
        vm.stopPrank();
    }

    /**
     * @dev Transforms a standard signature into an EIP2098 compliant signature
     * @param signature The secp256k1 65-bytes signature
     * @return eip2098Signature The 64-bytes EIP2098 compliant signature
     */
    function _eip2098Signature(bytes memory signature) internal pure returns (bytes memory eip2098Signature) {
        eip2098Signature = signature.slice(0, 64);
        uint8 parityBit = uint8(eip2098Signature[32]) | ((uint8(signature[64]) % 27) << 7);
        eip2098Signature[32] = bytes1(parityBit);
    }
}
