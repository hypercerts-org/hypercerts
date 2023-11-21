// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Scripting tool
import {Script} from "forge-std/Script.sol";

// Core contracts
import {ProtocolFeeRecipient} from "@hypercerts/marketplace/ProtocolFeeRecipient.sol";

contract ProtocolFeeRecipientDeployment is Script {
    error ChainIdInvalid(uint256 chainId);

    // WETH
    address public weth;
    address private feeSharingSetter;

    function run() external {
        uint256 chainId = block.chainid;
        uint256 deployerPrivateKey;

        if (chainId == 1) {
            weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
            feeSharingSetter = 0x5924A28caAF1cc016617874a2f0C3710d881f3c1;
            deployerPrivateKey = vm.envUint("MAINNET_KEY");
        } else if (chainId == 5) {
            weth = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
            feeSharingSetter = 0x3d1E1521b659b0C942836DeF24dd254aBdEb873b;
            deployerPrivateKey = vm.envUint("TESTNET_KEY");
        } else if (chainId == 11_155_111) {
            weth = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
            feeSharingSetter = 0x8a7c709648160a5A1191D07dfAB316224E4C6b07;
            deployerPrivateKey = vm.envUint("TESTNET_KEY");
        } else {
            revert ChainIdInvalid(chainId);
        }

        vm.startBroadcast(deployerPrivateKey);

        new ProtocolFeeRecipient(feeSharingSetter, weth);

        vm.stopBroadcast();
    }
}
