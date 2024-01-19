# Minting

## Token design

Hypercerts are semi-fungible tokens.
Thus, each hypercert is represented on-chain by a group of fraction tokens,
each representing a fraction of ownership over the hypercert.
If you want to split your fraction token, or merge multiple tokens into one,
check out the section on [splitting and merging](./split-merge.md).

## Minting your first hypercert

To mint a hypercert you need to provide the `metadata`, total amount of `units` and the preferred `TransferRestrictions`.
The resulting hypercert will be wholly owned by the creator.

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const { metadata } = formatHypercertData(...);
const totalUnits = 10000n;

const txHash = await hypercerts.mintClaim({
  metadata,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

> **Note** If you did not initialize your HypercertsClient with an `walletClient`, the client will run in [read-only mode](#read-only-mode) and this will fail.

Let's see what happens under the hood:

First, `mintClaim` checks that the client is not `read only` and that the operator is a `Signer`. If not, it throws an `InvalidOrMissingError`.

Next, the function validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`. The function then stores the metadata on `IPFS` using the `storeMetadata` method and returns the `CID` for the metadata.

Finally, we call the mintClaim function on the contract with the signer `address`, total `units`, `CID`, and `transfer restriction` as parameters. If `overrides` are provided, the function uses them to send the transaction. Otherwise, it sends the transaction without overrides.

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
