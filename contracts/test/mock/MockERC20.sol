// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {ERC20} from "solmate/src/tokens/ERC20.sol";

contract MockERC20 is ERC20("MockERC20", "MockERC20", 18) {
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
