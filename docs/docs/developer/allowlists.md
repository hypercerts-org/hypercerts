# Allowlists

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
