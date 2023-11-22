// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @dev This contract has to inherit from OZ instead of Solmate because
 *      Solmate's implementation defines balanceOf as a public mapping
 *      and it cannot be overridden.
 */
contract MockERC1155WithoutAnyBalanceOf is ERC1155 {
    constructor() ERC1155("https://example.com") {}

    function balanceOf(address, uint256) public view virtual override returns (uint256) {
        revert("Not implemented");
    }

    function balanceOfBatch(address[] memory, uint256[] memory) public pure override returns (uint256[] memory) {
        revert("Not implemented");
    }
}
