## Unpause

Make sure you have set up your wallets and config from the [setup guide](./setup.md).

To pause the contract, run the following, where `CONTRACT_ADDRESS` is the proxy address of the HypercertMinter, and `NETWORK` is one of the networks from `hardhat.config.ts`:

```sh
yarn hardhat unpause --network NETWORK --address CONTRACT_ADDRESS
```
