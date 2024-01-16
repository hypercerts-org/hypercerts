# Allowlists

Allowlists are an efficient way to enable distribution of hypercert fractions amongst a group.
First, the creator will create the hypercert with the metadata and an immutable allowlist.
With the `claimId`, every account specified in the allowlist can later mint their fraction token from that allowlist.

## Create an allowlist

First specify an allowlist, mapping addresses to the number of units they should receive.

```js
import {
  TransferRestrictions,
  formatHypercertData,
  Allowlist,
} from "@hypercerts-org/sdk";

const allowlist: Allowlist = [
  { address: "0x123....asfcnaes", units: 100n },
  { address: "0xabc....w2dwqwef", units: 100n },
];
```

Then, call `createAllowlist` with the metadata and allowlist.

```js
const { metadata } = formatHypercertData(...);
const totalUnits = 10000n;
const transferRestrictions = TransferRestrictions.FromCreatorOnly

const txHash = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

> **note** We store the allowlist and the Merkle tree in the metadata of the Hypercert. To understand the Merkle tree generation and data structures, check out the [OpenZeppelin merkle tree library](https://github.com/OpenZeppelin/merkle-tree)

It first checks if the client is writable and if the operator is a signer. If the operator is not a signer, it throws an `InvalidOrMissingError`.

Next, it validates the allowlist and metadata by calling the `validateAllowlist` and `validateMetaData` functions respectively. If either the allowlist or metadata is invalid, it throws a `MalformedDataError`.

Once the allowlist and metadata are validated, the method creates a Merkle tree from the allowlist and stores it on IPFS. It then stores the metadata on IPFS as well.

Finally, the method invokes the `createAllowlist` function on the contract with the signer's `address`, the total number of `units`, the Merkle tree `root`, the metadata `CID`, and the `transfer restrictions`. If the method is called with `overrides`, it passes them to the createAllowlist function.

## Claiming a fraction token

Users can claim their fraction tokens for many hypercerts at once using `mintClaimFractionFromAllowlist`. To determine the input the following information is required:

| Variable | Type   | Source        |
| -------- | ------ | ------------- | ----------- |
| claimId  | bigint | Hypercert ID  |
| units    | bigint | Allowlist     |
| proof    | `(Hex  | ByteArray)[]` | Merkle tree |

We store the allowlist and the Merkle tree in the metadata of the Hypercert. To understand the Merkle tree data structures, check out the [OpenZeppelin merkle tree library](https://github.com/OpenZeppelin/merkle-tree). You can get the `proof` and `units` by traversing the merkle tree.

Then, call `mintClaimFractionFromAllowlist` with the required data. The contracts will also verify the proofs. However, when providing the `root` in the function input, the proofs will be verified before a transaction is submitted.

```js
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const claimId = "0x822f17a9a5eecfd...85254363386255337";
const address = "0xc0ffee254729296a45a3885639AC7E10F9d54979";

const { indexer, storage } = hypercertsClient;
const claimById = await indexer.claimById(claimId);
const { uri, tokenID: _id } = claimById.claim;
const metadata = await storage.getMetadata(uri || "");
const treeResponse = await storage.getData(metadata.allowList);
const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

let args;
// Find the proof in the allowlist
for (const [leaf, value] of tree.entries()) {
  if (value[0] === address) {
    args = {
      proofs: tree.getProof(leaf),
      units: Number(value[1]),
      claimId: _id,
    };
    break;
  }
}

// Mint fraction token
const tx = await hypercerts.mintClaimFractionFromAllowlist({
  ...args,
});
```

Let's see what happens under the hood:

First, the method checks that the client is not `read only` and that the operator is a signer. If not, it throws an `InvalidOrMissingError`.

Next, the method verifies the Merkle `proof` using the OpenZeppelin Merkle tree library. If a `root` is provided, the method uses it to verify the proof. If the proof is invalid, it throws an error.

Finally, the method calls the `mintClaimFromAllowlist` function on the contract with the signer `address`, Merkle `proof`, `claim ID`, and number of `units` as parameters. If overrides are provided, the method uses them to send the transaction. Otherwise, it sends the transaction without overrides.
