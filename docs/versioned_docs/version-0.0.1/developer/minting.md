# Minting and allowlisting

### Minting you first hypercert

[code](https://github.com/hypercerts-org/hypercerts/tree/main/sdk/src/client.ts)

To mint a hypercert you need to provide the `metadata`, total amount of `units` and the prefered `TransferRestrictions`.

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const tx: Promise<ContractTransaction> = await hypercerts.mintClaim({
  metadata,
  totalUnits
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});

```

### Create an allowlist

Allowlists are an efficient way to enable distribution of hypercert fractions amongst a group of funders/contributors.

```js
import { TransferRestrictions, formatHypercertData, Allowlist } from "@hypercerts-org/sdk"

const allowlist: Allowlist = [
  { address: "0x123", units: 100},
  { address: "0xabc", units: 100}
];
const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const { claimId } = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

#### Claiming a fraction token

```js
const { tokenId } = await hypercerts.mintFromAllowlist({
  claimIds: [claimId1, claimId2],
});
```
