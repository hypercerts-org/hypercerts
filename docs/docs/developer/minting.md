# Minting

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
