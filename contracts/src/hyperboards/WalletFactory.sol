// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import { Create2 } from "oz-contracts/contracts/utils/Create2.sol";
import { ERC1967Proxy } from "oz-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import { Hyperboard } from "./HyperboardNFT.sol";

/**
 * A sample factory contract for SimpleAccount
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract Wallet {
    event DeployedWallet(uint256 boardID, address walletAddress, address owner);

    /**
     * create an account, and return its address.
     * returns the address even if the account is already deployed.
     * Note that during UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation
     */
    // function createAccount(
    //     uint256 boardId,
    //     uint256 salt,
    //     address walletImpl,
    //     address owner
    // ) public returns (address ret) {
    //     address addr = getAddress(owner, salt);
    //     uint codeSize = addr.code.length;
    //     if (codeSize > 0) {
    //         return payable(addr);
    //     }
    //     ret = address(
    //         new ERC1967Proxy{ salt: bytes32(salt) }(
    //             address(walletImpl),
    //             abi.encodeCall(SimpleAccount.initialize, (owner))
    //         )
    //     );
    //     emit DeployedWallet(boardId, ret, msg.sender);
    // }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(address walletImpl, uint256 salt, bytes memory owner) public view returns (address) {
        return
            Create2.computeAddress(
                bytes32(salt),
                keccak256(abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(address(walletImpl), (owner))))
            );
    }
}
