# Release notes

## 1.4.3

- Add Base and Base Sepolia to supported chains in config

## 1.4.2

- Improve ESM support by exporting `index.mjs` instead of `index.js`. @baumstern
- Added dweb IPFS gateway links and use `Promise.any` call to try and fetch data from multiple gateways.
- Expose timeout on HTTP requests from storage layer up to client wrapper methods as optional config.
- Default timeout on calls of 0 ms (no timeout) to avoid issues with large files or multiple IPFS calls.
- Updated contracts package to support Base and Base Sepolia

## New contributors

Welcoming @baumstern as a new contributor to the hypercerts codebase!

## 1.4.0

- Added all deployments from `@hypercerts-org/contracts` to the SDK under deploments.
- Deprecated `getContract` because we no longer have one contract address per network.
- Added `getDeployments` to retrieve all deployments for a network.

## 1.3.0

- Added `txParser` util to parse transaction hashes and return the required data
- Added `getClaimStoredDataFromTxHash` to retrieve the claim data from a transaction hash

## 1.1.1

- Deprecate goerli chain

## 1.1.0

- Refactored `HypercertStorage` to use hypercert APIs instead if web3.storage and nft.storage for uploading metadata and
  allowlist data
- Added `uploadMetaData` and `uploadAllowList` methods to `HypercertStorage` and as exports from the SDK.
- Removed `storeData` methods from `HypercertStorage` and as exports from the SDK.
- Added `apis` as export from the SDK.

....

## 0.3.1 Update dependencies

- Updated graph package dependencies
- Updated nft.storage and web3.storage dependencies

## 0.3.0 Simplify config

- Simplify config: merge the Signer and Provider into the operator. The SDK will determine which is available (provided
  via overrides, env vars or defaults) and infer whether transactions can be broadcasted
- Add test suite for config loading

## 0.2.0 Errors

- Updates Error types and error payload field.
- Added test suite for error types
- Expands SDK config with unsafe overrideable config
- Tweaks SDK config for graph

## 0.1.0 Client SDK

- Provides HypercertClient via SDK that exposes wrapper function and key components to the hypercerts protocol

## 0.0.33

- Adding custom error types to SDK
- Adding Winston for logging

## 0.0.32

- Handle empty fields in formatter to fix issue where OpenSea wouldn't index a token
- Remove arbitrary limit value in fractions query

## 0.0.31

- Hack around getData handler
- Update app with updated function calls

## 0.0.30

- Expose Query types via SDK

## 0.0.29

- Added TypeDoc and Markdown plugin
- Implementing Rollup as the build tool
- Add Optimism network, but still hardcoding to Goerli
- Multi-chain support in Graph client
- SDK parameterisation
- Error handling in chain config/setup

## 0.0.28

- Fix wrong TransferRestrictions
- Fix formatting dates of 0 => "indefinite"

## 0.0.27

- Do not use this version. Accidentally published broken changes

## 0.0.26

- Fix `getData` to not wrapDirectory

## 0.0.25

- Remove meta-minting function temporarily

## 0.0.24

- Fix re-export from `@hypercerts-org/hypercerts-protocol`
- Export `TransferRestrictions`

## 0.0.23

- Moved to `@hypercerts-org/hypercerts-protocol` v0.0.10

## 0.0.22

- Add HypercertsStorage class for explicit configurations (i.e. keys)
- Move storeData and getData to use web3.storage

## 0.0.21

- Change interface for `formatHypercertData()` to allow arbitrary strings for contributors

## 0.0.20

- Use numbers and not date for `formatHypercertData()` timeframes

## 0.0.19

- Update to the most recent JSON format
- Add `formatHypercertData()` function, which formats to the specified JSON format and validates input in the process

## 0.0.18

- Remove ipfs:// prefix when generating gateway uri and a URI is passed, instead of a cid

## 0.0.17

- Update contracts
- Cleaned up package.json

## 0.0.16

- Return errors with property keys

## 0.0.15

- Include error messages in returned value from schema validation

## 0.0.14

- Update to hypercerts-sdk 0.0.8

## 0.0.13

- Add claimtoken queries
- Sort queries claim by creation timestamp instead of id

## 0.0.12

- JSON assertion

## 0.0.11

- Refactored to use ESM ("type": "module")
- Refactered Mocha to Jest
- Added basic assertions for the exported interface functions
- Updated build scripts for stabler releasing
- Enforce graphclient dependencies

... [Numbers got lost in testing releasing]

## 0.0.6

- Added graphql deps to solve publishing blocker

## 0.0.5

- Added `storeData` to upload Blobs to IPFS for non-metadata data upload
- Added `getData` to retrieve those blobs
- Refactored GraphQL queries to use graphclient generated SDK for better typings
- Updated Graph client and types
- Export ESM module only
- Add allowList property to `HypercertMetaData`

## 0.0.4

- Added `ClaimById` query
- Added `ClaimTokensByClaim` query
- Ensure `getMetaData()` always returns a value

## 0.0.3

- Updated `@bitbeckers/hypercerts-protocol:0.0.5` to `@network-goods/hypercerts-protocol:0.0.6` including imports
- Added `RELEASE.md` to `docs`
- Replaced `fetch` with `axios` for testing
- Updated default IPFS gateway address and CID URL inference
