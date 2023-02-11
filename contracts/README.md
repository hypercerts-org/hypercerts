# hypercerts-protocol [![Github Actions][gha-badge]][gha] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gha]: https://github.com/bitbeckers/foundry-infinitoken-poc/actions
[gha-badge]: https://github.com/bitbeckers/foundry-infinitoken-poc/actions/workflows/ci.yml/badge.svg
[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

## Contracts

### IHypercertToken

This interface is the requirements set for hypercert compliant tokens. This enables developer to use their own prefered
token implementation or standard.

### HypercertMinter

Example implementation for a hypercert token that is an `ERC1155 NFT` under the hood with an `Allowlist` extension.

#### Goerli

HypercertMinter (UUPS Proxy) is deployed to proxy address:
[0x94a04Ce2e537eaf2Bdabd629dE503797e7021E87](https://goerli.etherscan.io/address/0x94a04Ce2e537eaf2Bdabd629dE503797e7021E87#code)

## Usage

Here's a list of the most frequently needed commands.

### Build

Build the contracts:

```sh
$ forge build
```

### Clean

Delete the build artifacts and cache directories:

```sh
$ forge clean
```

### Compile

Compile the contracts:

```sh
$ forge build
```

### Validate

Validate contract upgradeability agains deployment.

For example `goerli` deployment:

`yarn validate:upgrade --network goerli --proxy 0xcC08266250930E98256182734913Bf1B36102072`

### Deploy

Deployment of the contract to EVM compatible net is managed by
[OpenZeppelin](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades). Primarily because of proxy
management and safety checks.

Run: `yarn hardhat deploy --network goerli`

### Format

Format the contracts with Prettier:

```sh
$ yarn prettier
```

### Gas Usage

Get a gas report:

```sh
$ forge test --gas-report
```

### Lint

Lint the contracts:

```sh
$ yarn lint
```

### Test

#### Foundry

Solidity tests are executed using Foundry Run the tests:

```sh
$ forge test

```

## License

[MIT](./LICENSE.md) © Paul Razvan Berg
