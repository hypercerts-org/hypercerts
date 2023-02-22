## Deploy a new proxy contract

This should be done only on rare occasions. For example, when:
- We want to deploy to a new network
- We have updated the contract in a way that is *NOT* backwards-compatible.
  - For most upgrades, please use UUPS [upgrades](./upgrade.md).

### Build and deploy

If you are deploying on a new network, configure `hardhat.config.ts` to support the new network under the `networks` key.
```javascript
    "optimism-goeri": getChainConfig("optimism-goerli"),
```

Build the contracts and deploy. Specify the network to match the key used in `hardhat.config.ts`.

```sh
yarn build:hardhat
yarn hardhat deploy --network NETWORK
```

This will output the new proxy address. Update the root `README.md` with this new address.

Now transfer ownership over the proxy contract to the multisig:

```sh
yarn hardhat transfer-owner --network NETWORK --proxy PROXY_CONTRACT_ADDRESS --owner MULTISIG_ADDRESS
```

### Deploy the subgraph

### Deploy the OpenZeppelin Defender scripts

### Deploy the Dapp frontend