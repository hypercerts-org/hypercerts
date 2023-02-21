# hypercerts-protocol [![Foundry][foundry-badge]][foundry]

[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg

## Contracts

### IHypercertToken

This interface is the requirements set for hypercert-compliant tokens. This enables developer to use their own preferred
token implementation or standard.

### HypercertMinter

Example implementation for a hypercert token that is an `ERC1155 NFT` under the hood with an `Allowlist` extension.

#### Goerli

HypercertMinter (UUPS Proxy) is deployed to proxy address:
[0xf3528EED298e943652A41ed04bb9A48cA4969fE0](https://goerli.etherscan.io/address/0xf3528EED298e943652A41ed04bb9A48cA4969fE0#code)
and managed by
[0x8CD35a62fF56A91485eBF97491612F1552dbc1c9](https://goerli.etherscan.io/address/0x8CD35a62fF56A91485eBF97491612F1552dbc1c9)

## Usage

Here's a list of the most frequently needed commands.

### Build

Build the contracts:

```sh
forge build
```

### Clean

Delete the build artifacts and cache directories:

```sh
forge clean
```

### Compile

Compile the contracts:

```sh
forge build
```

### Validate

Validate contract upgradeability against deployment.

For example `goerli` deployment:

```sh
yarn hardhat validate-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS
```

### Deploy

Deployment of the contract to EVM compatible net is managed by
[OpenZeppelin](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades). Primarily because of proxy
management and safety checks.

```sh
yarn build:release
yarn hardhat deploy --network goerli
```

### Transfer ownership

To transfer ownership of the proxy contract for upgrades, run the following:

```sh
yarn hardhat transfer-owner --network goerli --proxy PROXY_CONTRACT_ADDRESS --owner NEW_OWNER_ADDRESS
```

This is typically done to transfer control to a multi-sig (i.e. Gnosis Safe).

### Propose Upgrade

Propose an upgrade via OpenZeppelin Defender. For more information, see this
[guide](https://docs.openzeppelin.com/defender/guide-upgrades)

```sh
yarn build:release
yarn hardhat propose-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS --multisig OWNER_MULTISIG_ADDRESS
```

### Format

Format the contracts with Prettier:

```sh
yarn prettier
```

### Gas Usage

Get a gas report:

```sh
forge test --gas-report
```

### Lint

Lint the contracts:

```sh
yarn lint
```

### Test

#### Foundry

Solidity tests are executed using Foundry Run the tests:

```sh
forge test
```

#### Analyze storage gaps

```sh
forge inspect HypercertMinter storageLayout --pretty
```
