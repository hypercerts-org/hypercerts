// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {MockERC1155} from "./MockERC1155.sol";

contract MockERC1155WithoutBalanceOfBatch is MockERC1155 {
    function balanceOfBatch(address[] calldata, uint256[] calldata) public pure override returns (uint256[] memory) {
        revert("Not implemented");
    }
}
