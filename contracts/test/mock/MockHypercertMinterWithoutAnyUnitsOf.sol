// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {MockHypercertMinter} from "./MockHypercertMinter.sol";

contract MockHypercertMinterWithoutAnyUnitsOf is MockHypercertMinter {
    function unitsOf(address, uint256) public view virtual override returns (uint256) {
        revert("Not implemented");
    }
}
