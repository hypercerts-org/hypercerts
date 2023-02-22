# hypercerts-protocol [![Foundry][foundry-badge]][foundry]

[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg

## Setup

Create a copy of `.env.example` and rename the copy to `.env`. If your organization already has keys, ask your admin
where they are.

- `MNEMONIC`: the seed phrase used for deploying the contract and upgrades
  - Make sure there is sufficient balance in the account for these operations
  - If you need a new address, you can run `yarn hardhat generate-address`
- `INFURA_API_KEY`: [Infura](https://www.infura.io/) is used as the gateway.
- `OPENZEPPELIN_API_KEY` and `OPENZEPPELIN_SECRET_KEY`: [OpenZeppelin Defender](https://defender.openzeppelin.com/) is
  used for proposing upgrades to the multi-sig.
- `ETHERSCAN_API_KEY`: [Etherscan](https://etherscan.io/)

## Usage

Here's a list of the most frequently needed commands.

Note that the project is configured to use both Hardhat and Foundry. We typically use Foundry for fast compiles and
testing. We typically use Hardhat to compile for deployment and to run operational tasks.

### Foundry operations

#### Build

Build the contracts:

```sh
forge build
```

#### Tests

Solidity tests are executed using Foundry Run the tests:

```sh
forge test
```

#### Gas Usage

Get a gas report:

```sh
forge test --gas-report
```

#### Analyze storage gaps

```sh
forge inspect HypercertMinter storageLayout --pretty
```

#### Clean

Delete the build artifacts and cache directories:

```sh
forge clean
```

### Hardhat operations

#### Build

```sh
yarn build:hardhat
```

#### Deploy

Deployment of the contract to EVM compatible net is managed by
[OpenZeppelin](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades), primarily because of proxy
management and safety checks.

```sh
yarn build:hardhat
yarn hardhat deploy --network goerli
```

#### Transfer ownership

To transfer ownership of the proxy contract for upgrades, run the following:

```sh
yarn hardhat transfer-owner --network goerli --proxy PROXY_CONTRACT_ADDRESS --owner NEW_OWNER_ADDRESS
```

This is typically done to transfer control to a multi-sig (i.e. Gnosis Safe).

#### Validate upgrade

Validate contract upgradeability against deployment.

For example `goerli` deployment:

```sh
yarn hardhat validate-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS
```

#### Propose Upgrade

Propose an upgrade via OpenZeppelin Defender. For more information, see this
[guide](https://docs.openzeppelin.com/defender/guide-upgrades)

```sh
yarn build:hardhat
yarn hardhat propose-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS --multisig OWNER_MULTISIG_ADDRESS
```

This will output an OpenZeppelin URL that multi-sig members can use to approve/reject the upgrade.

### Other operations

#### Format

Format the contracts with Prettier:

```sh
yarn prettier
```

#### Lint

Lint the contracts:

```sh
yarn lint
```

## Contracts

### IHypercertToken

This interface is the requirements set for hypercert-compliant tokens. This enables developer to use their own preferred
token implementation or standard.

### HypercertMinter

Example implementation for a hypercert token that is an `ERC1155 NFT` under the hood with an `Allowlist` extension.
