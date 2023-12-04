# Getting started with Solidity

> :construction: **NOTE**: This is a work-in-progress and may not be fully functioning yet.

If you need the Solidity contracts or interfaces exported from the SDK,
please reach out by [filing an issue](https://github.com/hypercerts-org/hypercerts/issues).

## Hypercerts deployments

Hypercerts is a multi-chain protocol and we want to support any network that wants to make positive impact.
We plan to support at most 1 canonical contract deployment per network.
For a complete list of deployments and their contract addresses, see [Supported Networks](./supported-networks.md).

## Installing the Hypercert contracts

```bash
npm install @hypercerts-org/contracts
# or yarn add @hypercerts-org/contracts
```

## Using the Solidity interface

If you want to call the Hypercerts contract on your network directly from Solidity,
we export the interface/ABI for you to use from your contract.

```js
import { IHypercertToken } from "@hypercerts-org/contracts/IHypercertMinter.sol";

contract MyContract {
  IHypercertToken hypercerts;

  function initialize(address _addr) public virtual initializer {
    hypercerts = IHypercertToken(_addr);
  }

  function uri(uint256 tokenID) public view returns (string memory _uri) {
    _uri = hypercerts.uri(tokenID);
  }
}

```
