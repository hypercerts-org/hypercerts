# Minting

## Minting your first hypercert

To mint a hypercert you need to provide the `metadata`, total amount of `units` and the preferred `TransferRestrictions`.
The resulting hypercert will be wholly owned by the creator.

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const tx: Promise<ContractTransaction> = await hypercerts.mintClaim({
  metadata,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

> **Note** If you did not initialize your HypercertsClient with an `operator`, `nftStorageToken` and `web3StorageToken`, the client will run in [read-only mode](#read-only-mode) and this will fail.

## Transfer restrictions

When minting a Hypercert, you must pass in a `TransferRestriction` policy. For now there are only 3 implemented policies:

```js
enum TransferRestrictions {
  // Unrestricted
  AllowAll,
  // All transfers disabled after minting
  DisallowAll,
  // Only the original creator can transfer
  FromCreatorOnly
}
```

## Reference

See the [code](https://github.com/hypercerts-org/hypercerts/tree/main/sdk/src/client.ts)
for more details on how we implement minting.
