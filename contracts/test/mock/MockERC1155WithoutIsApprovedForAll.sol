// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @dev This contract has to inherit from OZ instead of Solmate because
 *      Solmate's implementation defines isApprovedForAll as a public mapping
 *      and it cannot be overridden.
 */
contract MockERC1155WithoutIsApprovedForAll is ERC1155 {
    constructor() ERC1155("https://example.com") {}

    function mint(address to, uint256 tokenId, uint256 amount) public {
        _mint(to, tokenId, amount, "");
    }

    function isApprovedForAll(address, address) public view virtual override returns (bool) {
        revert("Not implemented");
    }
}
