// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {MockERC1155} from "./MockERC1155.sol";

contract MockERC1155SupportsNoInterface is MockERC1155 {
    function supportsInterface(bytes4) public view virtual override returns (bool) {
        return false;
    }
}
