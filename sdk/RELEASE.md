# Release notes

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
