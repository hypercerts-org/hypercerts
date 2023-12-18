# Upgrading the contract

## Validate upgrade

Validate contract upgradeability against deployment.

For example, for the `goerli` deployment:

```sh
yarn hardhat validate-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS
```

## Propose Upgrade

Propose an upgrade via OpenZeppelin Defender. For more information, see this
[guide](https://docs.openzeppelin.com/defender/guide-upgrades)

For example, for the `goerli` deployment:

```sh
yarn build:hardhat
yarn hardhat propose-upgrade --network goerli --proxy PROXY_CONTRACT_ADDRESS --multisig OWNER_MULTISIG_ADDRESS
```

This will output an OpenZeppelin URL that multi-sig members can use to approve/reject the upgrade.

## Publish to npm

After you update the contracts, deploy the `contracts/` package to npm.

TODO

Update the dependencies in `frontend/package.json` and `sdk/package.json`.

If the ABI of the contract has changed, make sure you also update `defender/src/HypercertMinterABI.ts`.
