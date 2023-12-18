// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IImmutableCreate2Factory {
    function safeCreate2(bytes32 salt, bytes calldata initializationCode)
        external
        payable
        returns (address deploymentAddress);

    function findCreate2Address(bytes32 salt, bytes calldata initializationCode)
        external
        view
        returns (address deploymentAddress);
}
