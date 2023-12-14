// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {MockHypercertMinter} from "./MockHypercertMinter.sol";

contract MockHypercertMinterSupportsNoInterface is MockHypercertMinter {
    function supportsInterface(bytes4) public view virtual override returns (bool) {
        return false;
    }
}
