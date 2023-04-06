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
