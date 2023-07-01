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
const transferRestrictions = TransferRestrictions.FromCreatorOnly

const { claimId } = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

> **note** We store the allowlist and the Merkle tree in the metadata of the Hypercert. To understand the Merkle tree generation and object we refer you to [OpenZeppeling Merkle Tree library](https://github.com/OpenZeppelin/merkle-tree)

It first checks if the client is writable and if the operator is a signer. If the operator is not a signer, it throws an `InvalidOrMissingError`.

Next, it validates the allowlist and metadata by calling the `validateAllowlist` and `validateMetaData` functions respectively. If either the allowlist or metadata is invalid, it throws a `MalformedDataError`.

Once the allowlist and metadata are validated, the method creates a Merkle tree from the allowlist and stores it on `IPFS`. It then stores the metadata on IPFS as well.

Finally, the method invokes the `createAllowlist` function on the contract with the signer's `address`, the total number of `units`, the Merkle tree `root`, the metadata `CID`, and the `transfer restrictions`. If the method is called with `overrides`, it passes them to the createAllowlist function.

## Claiming a fraction token

Users can claim their fraction tokens for many hypercerts at once using `mintClaimFractionFromAllowlist`. To determine the input the following information is required:

| Variable | Type         | Source       |
| -------- | ------------ | ------------ |
| claimId  | BigNumberish | Hypercert ID |
| units    | BigNumberish | Allowlist    |
| proof    | BytesLike[]  | Merkle tree  |

> **note** We store the allowlist and the Merkle tree in the metadata of the Hypercert. To understand the Merkle tree generation and object, we refer you to [OpenZeppeling Merkle Tree library](https://github.com/OpenZeppelin/merkle-tree)

Then, call `mintClaimFractionFromAllowlist` with the required data. The contracts will also verify the proofs. However, when providing the `root` in the function input, the proofs will be verified before a transaction is submitted.

```js
const { indexer, storage } = client;
const claimById = await indexer.claimById(claimId);
const { uri, tokenID: _id } = claimByIdRes.claim;
const metadata = await storage.getMetadata(uri || "");
const treeResponse = await storage.getData(metadata.allowList);

let result;

if (typeof value === "string") {
  // Load the tree
  const tree = StandardMerkleTree.load(JSON.parse(value));

  // Find the proof
  for (const [leaf, value] of tree.entries()) {
    if (value[0] === address) {
      result = {
        proofs: tree.getProof(leaf),
        units: Number(value[1]),
        claimId: _id,
      };
    }
  }

  return result;
}

const tx = await hypercerts.mintClaimFractionFromAllowlist({
  ...result,
});
```
