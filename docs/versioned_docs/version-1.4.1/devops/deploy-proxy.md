# Deploy a new proxy contract

This should be done only on rare occasions. For example, when:

- We want to deploy to a new network
- We have updated the contract in a way that is _NOT_ backwards-compatible.
  - For most upgrades, please use UUPS [upgrades](./upgrade.md).

## Smart Contracts

### Setup the `contracts/` environment

Navigate to `contracts/`. Configure your `.env` file by following the instructions in the
[README](https://github.com/hypercerts-org/hypercerts/tree/main/contracts#setup).

### Build and deploy the smart contracts

---

**NOTE**

While we use foundry for developement and testing, we use hardhat for deployment. This is because hardhat is more flexible and allows us to easily integrate with OpenZeppelin tools for upgradeable contracts.

---

If you are deploying on a new network, configure `contracts/hardhat.config.ts` to support the new network under the `networks` key.

```javascript
    "sepolia": getChainConfig("sepolia"),
```

Build the contracts and deploy. Specify the network to match the key used in `hardhat.config.ts`.

```sh
# Run in contracts/
yarn build:hardhat
yarn hardhat deploy --network NETWORK
```

This will output the new proxy address. Update the root `README.md` with this new address.

Now transfer ownership over the proxy contract to the multisig:

```sh
yarn hardhat transfer-owner --network NETWORK --proxy PROXY_CONTRACT_ADDRESS --owner MULTISIG_ADDRESS
```

## Subgraph

### Setup the `graph/` environment

Navigate to `graph/`. Follow the instructions in the
[README](https://github.com/hypercerts-org/hypercerts/tree/main/graph#setup)
to get set up.

### Deploy the subgraph

Update `graph/networks.json` with the new proxy address. To speed up indexing, you set the `startBlock` to the block containing the contract creation. We can add multiple networks that are monitored by the same subgraph. For more details, see the [Graph documentation](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/#deploying-the-subgraph-to-multiple-ethereum-networks).

To separate test from production, we use a different subgraph for each network. This means that we need to deploy a new subgraph for each network; but we group the deployments in the scripts.

- Create a new deploy script for the network in the `package.json` of the `graph/` directory. For example, if you are deploying to the `sepolia` network, you would add the following script:

````json
      "deploy:sepolia": "graph deploy --node https://api.thegraph.com/deploy/ --network sepolia hypercerts-admin/hypercerts-sepolia"
      ```

* Add the deploy script to `deploy:test` or `deploy:prod` depending on whether you are deploying to a test or production network.

* Now deploy the subgraph

```sh
# Run in graph/
yarn build
yarn deploy:test
````

## OpenZeppelin Defender

### Create a new Supabase table

Log into the [Supabase dashboard](https://app.supabase.com/).
We store all data in a single project, but use different tables for each network.
The table name should be suffixed by the network (e.g. `allowlistCache-goerli`).
If you are deploying to a new network, create a new table. You can copy the table schema and RLS policy from another pre-existing table.

If you are deploying a new proxy contract to a network for which you already have another deployment, you'll have to make a judgement call as to whether you can reuse the existing table, whether you need to clear the existing table, or create another table.

Note: We want to merge all the tables in this [issue](https://github.com/hypercerts-org/hypercerts/issues/477).

### Update the OpenZeppelin Defender scripts

Modify the Defender scripts to support the new network in `defender/src/networks.ts`.

If the ABI of the contract has changed, make sure you also update `defender/src/HypercertMinterABI.ts`.

Note: The entry point for deployment is in `defender/src/setup.ts`.

### Setup the `defender/` environment

Navigate to `defender/`. Follow the instructions in the
[README](https://github.com/hypercerts-org/hypercerts/tree/main/defender#setup)
to get set up.

### Deploy defender scripts

Deploy to OpenZeppelin Defender via

```sh
# Run in defender/
yarn deploy
```

## Hypercerts SDK

TODO: Flesh this out

Run the build in `contracts/`.

(Soon to be deprecated) Publish `contracts/` to npm

Configure the SDK to support the new network via the graphclient.

Publish SDK to npm

## Deploy the Dapp frontend

Each frontend build is configured to run on a different network (e.g. `https://testnet.hypercerts.org`). You can use any CDN to serve the site (e.g. Netlify, Vercel, GitHub Pages, Cloudflare Pages, Fleek, Firebase Hosting).

1. Configure your build environment with the environment variables specified in `frontend/.env.local.example`.

2. Configure your builds to the following settings:

- Build command: `yarn build:site`
- Build output directory: `/build`
- Root directory: `/`

3. Configure the domain that you want for your build.
