# hypercerts [![License: Apache 2.0][license-badge]][license] [![Github Actions][gha-badge]][gha]

[license]: https://opensource.org/license/apache-2-0/
[license-badge]: https://img.shields.io/badge/License-Apache2.0-blue.svg
[gha]: https://github.com/Network-Goods/hypercerts/actions/workflows/ci-default.yml
[gha-badge]: https://github.com/Network-Goods/hypercerts/actions/workflows/ci-default.yml/badge.svg

Hypercerts are a tool to build scalable retrospective reward systems for impact.
For more details, check out our [website](https://hypercerts.org/).

## Organization

- `/contracts`: Smart contracts (Foundry+Hardhat)
  - Manually deployed via hardhat tasks
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
- `/sdk`: Hypercerts SDK
  - Manually published to npm
- `/utils`: various scripts for operations
  - Manually run 

## Setup and build

First, make sure the environment variables are set for `./frontend`.
Take a look at `./frontend/.env.local.example` for the complete list.
You can either set these yourself (e.g. in CI/CD) or copy the file to `.env.local` and populate it.

Then the do a turbo build of all apps, run the following:

```bash
yarn install
yarn build
```

The resulting static site can be found in `./build/`.

## Run

### Running the frontend dev server

```bash
yarn dev:frontend
```

### Running the prod server

If you've already run the build, you can use `yarn serve:build` to serve those files
