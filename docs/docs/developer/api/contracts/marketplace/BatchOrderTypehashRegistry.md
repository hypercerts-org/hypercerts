# BatchOrderTypehashRegistry

_LooksRare protocol team (👀,💎)_

> BatchOrderTypehashRegistry

The contract generates the batch order hash that is used to compute the digest for signature verification.

## Methods

### hashBatchOrder

```solidity
function hashBatchOrder(bytes32 root, uint256 proofLength) external pure returns (bytes32 batchOrderHash)
```

This function returns the hash of the concatenation of batch order type hash and merkle root.

#### Parameters

| Name        | Type    | Description         |
| ----------- | ------- | ------------------- |
| root        | bytes32 | Merkle root         |
| proofLength | uint256 | Merkle proof length |

#### Returns

| Name           | Type    | Description          |
| -------------- | ------- | -------------------- |
| batchOrderHash | bytes32 | The batch order hash |

## Errors

### MerkleProofTooLarge

```solidity
error MerkleProofTooLarge(uint256 length)
```

It is returned if the length of the merkle proof provided is greater than tolerated.

#### Parameters

| Name   | Type    | Description  |
| ------ | ------- | ------------ |
| length | uint256 | Proof length |
