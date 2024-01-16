# Pause / Unpause

## Pause

### Contract owned by an address

Make sure you have set up your wallets and config from the [setup guide](./setup.md).

To pause the contract, run the following, where `CONTRACT_ADDRESS` is the proxy address of the HypercertMinter, and `NETWORK` is one of the networks from `hardhat.config.ts`:

```sh
yarn hardhat pause --network NETWORK --address CONTRACT_ADDRESS
```

### Contract owned by a multi-sig

If we transferred ownership to a multisig, we can use
[OpenZeppelin Defender Admin](https://defender.openzeppelin.com/#/admin)
to propose a pause to be approved by the multisig.

## Unpause

Make sure you have set up your wallets and config from the [setup guide](./setup.md).

To pause the contract, run the following, where `CONTRACT_ADDRESS` is the proxy address of the HypercertMinter, and `NETWORK` is one of the networks from `hardhat.config.ts`:

```sh
yarn hardhat unpause --network NETWORK --address CONTRACT_ADDRESS
```
