# Setup

## Pre-requisites

1. Install [NodeJS](https://nodejs.org/en/) and [git](https://git-scm.com/)
2. Install [yarn](https://classic.yarnpkg.com/)

```sh
npm install --global yarn
```

3. Clone the repository:

```
git clone git@github.com:hypercerts-org/hypercerts.git
cd hypercerts
```

4. Install dependancies:

To install dependencies across all projects in the monorepo workspace:

```sh
yarn install
```

## Setup your wallets

We need 2 wallets: a multi-sig for administering the contracts, and a hot wallet for setting everything up.

1. We use a [Gnosis Safe](https://app.safe.global/) multisig for managing and administering the contracts. Set one up with your desired confirmation threshold (e.g. 2 of 3). This wallet will not require any balance.
2. Separately, set up a wallet that we'll use in our developer scripts.

- If you don't have one, you can goto `contracts/` and run `yarn hardhat generate-address`.
- Make sure there is enough balance in this account to deploy the contract and transfer ownership to the multisig
  - [Goerli Faucet](https://goerlifaucet.com/)
  - [Optimism Bridge](https://app.optimism.io/bridge/deposit)

## Next Steps

Depending on what you want to do (e.g. in `./sdk/` or `./frontend/`), there will be further setup instructions in the respective `README.md` file.
