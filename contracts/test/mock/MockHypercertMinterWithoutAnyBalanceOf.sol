// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";

contract MockHypercertMinterWithoutAnyBalanceOf is HypercertMinter {
    constructor() HypercertMinter() {}

    function balanceOf(address, uint256) public view virtual override returns (uint256) {
        revert("Not implemented");
    }
}
