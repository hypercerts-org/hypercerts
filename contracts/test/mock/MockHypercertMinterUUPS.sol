// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract UUPSProxy is ERC1967Proxy {
    constructor(address implementation, bytes memory data) ERC1967Proxy(implementation, data) {}
}

contract MockHypercertMinterUUPS {
    HypercertMinter public instance;
    UUPSProxy public proxy;
    HypercertMinter public minter;

    function setUp() public {
        instance = new HypercertMinter();
        proxy = new UUPSProxy(address(instance), "");
        minter = HypercertMinter(address(proxy));
    }
}
