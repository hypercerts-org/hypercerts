// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {MockERC721} from "./MockERC721.sol";

contract MockERC721SupportsNoInterface is MockERC721 {
    function supportsInterface(bytes4) public view virtual override returns (bool) {
        return false;
    }
}
