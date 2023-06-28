# hypercerts [![License: Apache 2.0][license-badge]][license] [![Github Actions][gha-badge]][gha]

[license]: https://opensource.org/license/apache-2-0/
[license-badge]: https://img.shields.io/badge/License-Apache2.0-blue.svg
[gha]: https://github.com/hypercerts-org/hypercerts/actions/workflows/ci-default.yml
[gha-badge]: https://github.com/hypercerts-org/hypercerts/actions/workflows/ci-default.yml/badge.svg

Hypercerts are a tool to build scalable retrospective reward systems for impact.
For more details, check out our [website](https://hypercerts.org/).

## Organization

- `/contracts`: Smart contracts (Foundry+Hardhat)
  - Manually deployed via hardhat tasks
  - Note: This is not currently on CI/CD
  - On Goerli:
    - HypercertMinter (UUPS Proxy): [0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07](https://goerli.etherscan.io/address/0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07)
    - Safe multi-sig: [0x8CD35a62fF56A91485eBF97491612F1552dbc1c9](https://goerli.etherscan.io/address/0x8CD35a62fF56A91485eBF97491612F1552dbc1c9)
  - On Optimism:
    - HypercertMinter (UUPS Proxy): [0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07](https://optimistic.etherscan.io/address/0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07)
    - Safe multi-sig: [0x560adA72a80b4707e493cA8c3B7B7528930E7Be5](https://optimistic.etherscan.io/address/0x560adA72a80b4707e493cA8c3B7B7528930E7Be5)
- `/cors-proxy`: CORS proxy for Cloudflare Workers
  - [via GitHub actions](https://github.com/hypercerts-org/hypercerts/actions/workflows/deploy-cors-proxy.yml)
- `/defender`: OpenZeppelin Defender integration
  - [via GitHub actions](https://github.com/hypercerts-org/hypercerts/actions/workflows/deploy-defender.yml)
- `/docs`: documentation (Docusaurus)
  - [on Fleek](https://hypercerts.on.fleek.co/docs/) - Production build on mainnet
  - [on Cloudflare](https://testnet.hypercerts.org/docs) - Staging build on Goerli
- `/frontend`: frontend application (Next.js)
  - [on Fleek](https://hypercerts.on.fleek.co/) - Production build on mainnet
  - [on Cloudflare](https://testnet.hypercerts.org) - Staging build on Goerli
- `/graph`: The Graph integration
  - [via GitHub actions](https://github.com/hypercerts-org/hypercerts/actions/workflows/deploy-graph.yml)
  - [Goerli Subgraph](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet)
  - [Optimism Subgraph](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-optimism-mainnet)
- `/sdk`: Hypercerts SDK
  - Manually published to npm
- `/utils`: various scripts for operations
  - Manually run

## Quickstart with Dapp development

### Setup and build the frontend

First, make sure the environment variables are set for `./frontend`.
Take a look at `./frontend/.env.local.example` for the complete list.

- You can either set these yourself (e.g. in CI/CD)
- or copy the file to `.env.local` and populate it.

Then the do a turbo build of all apps, run the following:

```bash
yarn install
yarn build
```

The resulting static site can be found in `./build/`.

### Running the prod server

If you've already run the build, you can use `yarn serve:build` to serve the built files

### Running the frontend dev server

To run a dev server that watches for changes across code and Plasmic, run:

```bash
yarn dev:frontend
```

## E2E Local Development

We now have a mostly localized development infrastructure that can be used when
developing the Dapp. The localized development infrastructure will spin up a
localchain, graph, and postgres. Your local machine must
have docker and docker compose installed.

### Setup environment variables

You will then need to create a `.env.local` file in the root of the repository with at the following environment variables:

```
# Required
PLASMIC_PROJECT_ID=
PLASMIC_PROJECT_API_TOKEN=
NEXT_PUBLIC_NFT_STORAGE_TOKEN=
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=
NEXT_PUBLIC_WALLETCONNECT_ID=

# Optional (used to fund an address on the localchain)
LOCAL_TESTING_ADDRESS=
```

### Starting the local development infrastructure

Once you have your environment configured you can run the infrastructure like so:

```
yarn dev:serve-e2e
```

Once everything is the dapp will be served from http://127.0.0.1:3000. You will
need to point your metamask to the localchain at 127.0.0.1:8545 with ChainID 31337.

## Playbooks

For setup and common operations for each subproject, navigate into the respective directory and check out the `README.md`.

We also maintain a [playbook](https://hypercerts.org/docs/devops) for larger operations.
