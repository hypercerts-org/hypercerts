# Allowlists

Allowlists are an efficient way to enable distribution of hypercert fractions amongst a group.
First, the creator will create the hypercert with the metadata and an immutable allowlist.
Armed with the claimId, every account specified in the allowlist can later mint their fraction token from that allowlist.

## Create an allowlist

First specify an allowlist, mapping addresses to the number of units they should receive.

```js
import {
  TransferRestrictions,
  formatHypercertData,
  Allowlist,
} from "@hypercerts-org/sdk";

const allowlist: Allowlist = [
  { address: "0x123", units: 100 },
  { address: "0xabc", units: 100 },
];
```

Then, call `createAllowlist` with the metadata and allowlist.

```js
const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const { claimId } = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

## Claiming a fraction token

Users can claim their fraction tokens for many hypercerts at once using `mintFromAllowlist`.

```js
const { tokenId } = await hypercerts.mintFromAllowlist({
  claimIds: [claimId1, claimId2],
});
```
