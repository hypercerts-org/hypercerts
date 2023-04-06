# Getting started with JavaScript

or TypeScript

## Installing the Hypercerts SDK

```bash
npm install @hypercerts-org/sdk
# or yarn add @hypercerts-org/sdk
```

## Initialize the client

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

### Handling Errors

```js
TODO;
```

We want to expose lots of good typed errors for all the things that can go wrong.

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
