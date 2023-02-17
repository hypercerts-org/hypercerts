# hypercerts [![License: Apache 2.0][license-badge]][license] [![Github Actions][gha-badge]][gha]

[license]: https://opensource.org/license/apache-2-0/
[license-badge]: https://img.shields.io/badge/License-Apache2.0-blue.svg
[gha]: https://github.com/Network-Goods/hypercerts/actions/workflows/ci-default.yml
[gha-badge]: https://github.com/Network-Goods/hypercerts/actions/workflows/ci-default.yml/badge.svg

Hypercerts are a tool to build scalable retrospective reward systems for impact.
For more details, check out our [website](https://hypercerts.org/).

## Organization

- `/contracts`: Smart contracts (Foundry+Hardhat)
- `/cors-proxy`: CORS proxy for Cloudflare Workers
- `/defender`: OpenZeppelin Defender integration
- `/docs`: documentation (Docusaurus)
- `/frontend`: frontend application (Next.js)
- `/graph`: The Graph integration
- `/sdk`: Hypercerts SDK
- `/utils`: various scripts for operations

## Links

- Hypercerts Dapp
  - [on Fleek](https://hypercerts.on.fleek.co/) - Production build on mainnet
  - [on Vercel](https://hypercerts.vercel.app) - Staging build on Goerli

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
