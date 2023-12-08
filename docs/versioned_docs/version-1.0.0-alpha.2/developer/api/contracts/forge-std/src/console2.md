# console2

_The original console.sol uses `int` and `uint` for computing function selectors, but it should use `int256` and `uint256`. This modified version fixes that. This version is recommended over `console.sol` if you don&#39;t need compatibility with Hardhat as the logs will show up in forge stack traces. If you do need compatibility with Hardhat, you must use `console.sol`. Reference: https://github.com/NomicFoundation/hardhat/issues/2178_
