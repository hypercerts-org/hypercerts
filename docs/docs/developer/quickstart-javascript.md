# Getting started with JavaScript

or TypeScript

## Installing the Hypercerts SDK

```bash
npm install @hypercerts-org/sdk
```

Or

```bash
yarn add @hypercerts-org/sdk
```

## Initialize the client

[code](https://github.com/hypercerts-org/hypercerts/tree/main/sdk/src/client.ts)

```js
import { HypercertsClient, HypercertsStorage } from "@hypercerts-org/sdk";
import { ethers } from "ethers";

const hypercerts = new HypercertsClient({
  chainId: 5,
  provider: ethers.getDefaultProvider("goerli"),
  storage: new HypercertsStorage({ web3storage: "", nftstorage: "" }),
});
```

You can override options, see [API reference](./api-reference.md)

## Contract Operations

Pattern:
Contract interactions wait for settlement to get back some return value.
The user does not need to `await` the promise, they can choose to fire and forget

### Minting

[code](https://github.com/hypercerts-org/hypercerts/tree/main/sdk/src/operator/hypercert-minting.ts)

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const { metadata } = formatHypercertData(...);
const { claimId } = await hypercerts.mintClaim({
  totalSupply: 10000, // total supply
  metadata,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});

```

### Create an allowlist

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const allowlist = [
  { address: "0x123", units: 100},
  { address: "0xabc", units: 100}
];
const { metadata } = formatHypercertData(...);
const { claimId } = await hypercerts.createAllowlist({
  allowlist,
  metadata,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

#### Claiming a fraction token

```js
const { tokenId } = await hypercerts.mintFromAllowlist({
  claimIds: [claimId1, claimId2],
});
```

### Split / merge token values

```js
const { tokenIds } = await hypercerts.splitFraction({
  tokenId,
  units: [10, 12, 15],
});
const { tokenId } = await hypercerts.mergeFractions({ tokenIds });
```

### Split / merge claim data

```js
const { claimIds } = await hypercerts.splitClaim({
  claimId,
  TODO: somehow specify hypercert subregions
});
const { claimId} = await hypercerts.mergeClaims({
  claimIds,
});
```

### Burning fraction tokens

```js
const { TODO } = await hypercerts.burnFraction({ tokenId });
```

### Create an evaluation

Perhaps leverage EAS schema registry to generate different types of evaluation schemas
(e.g. different type of eval for OSS vs SP Audits vs Climate)

```js
const { TODO } = await hypercerts.createEvaluation({
  ref: HypercertClaim || HypercertRegion || Evaluation
  evaluationSchema: "SCHEMA_IDENTIFIER"
  data: TODO
});
```

### Respond / or contest an evaluation

Just create an evaluation referencing an evaluation

```js

```

### Handling Errors

To support debugging we've implemented some custom errors.

```js
export interface TypedError extends Error {
  __type: ErrorType;
  payload?: { [key: string]: unknown };
}
```

| Error                 | Reason                             | Payload                                         |
| --------------------- | ---------------------------------- | ----------------------------------------------- |
| FetchError            | Async call to API failed           | `{ [key: string]: unknown }`                    |
| InvalidOrMissingError | Env var missing                    | `{ keyName: string }`                           |
| MalformedDataError    | Validation or formatting failed    | `{ [key: string]: unknown }`                    |
| MintingError          | EVM call to mint failed            | `{ [key: string]: unknown }`                    |
| StorageError          | NFT-/Web3 Storage error            | `{ [key: string]: unknown }`                    |
| UnsupportedChainError | Provided EVM chainID not supported | <code>{ chainID: string &#124; number };</code> |
| UnknownSchemaError    | Validation schema not found        | `{ schemaName: string }`                        |

### Progress reporting

```js
const promise = hypercerts.mintClaim(...);
// TODO see contract-interaction-dialog-context.tsx
const steps = promise.getSteps();
/**
 * [
 *  { key: "step1", description: "" }
 *  { key: "step2", description: "" }
 * ]
 **/
promise.onStep(stepKey => {...});
promise.onProgress(percent => {...});
const { claimId } = await promise;
```

## Query operations

### Claims

```js
const { TODO } = await hypercerts.claimsByOwner({ owner });
```

### Fraction tokens

```js
const { TODO } = await hypercerts.fractionsByOwner({ owner });
```
