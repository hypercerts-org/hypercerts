# ProtocolHelpers

_LooksRare protocol team (👀,💎)_

> ProtocolHelpers

This contract contains helper view functions for order creation.

## Methods

### computeDigestMerkleTree

```solidity
function computeDigestMerkleTree(OrderStructs.MerkleTree merkleTree) external view returns (bytes32 digest)
```

#### Parameters

| Name       | Type                    | Description |
| ---------- | ----------------------- | ----------- |
| merkleTree | OrderStructs.MerkleTree | undefined   |

#### Returns

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| digest | bytes32 | undefined   |

### computeMakerDigest

```solidity
function computeMakerDigest(OrderStructs.Maker maker) external view returns (bytes32 digest)
```

#### Parameters

| Name  | Type               | Description |
| ----- | ------------------ | ----------- |
| maker | OrderStructs.Maker | undefined   |

#### Returns

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| digest | bytes32 | undefined   |

### looksRareProtocol

```solidity
function looksRareProtocol() external view returns (contract LooksRareProtocol)
```

#### Returns

| Name | Type                       | Description |
| ---- | -------------------------- | ----------- |
| \_0  | contract LooksRareProtocol | undefined   |

### verifyMakerSignature

```solidity
function verifyMakerSignature(OrderStructs.Maker maker, bytes makerSignature, address signer) external view returns (bool)
```

#### Parameters

| Name           | Type               | Description |
| -------------- | ------------------ | ----------- |
| maker          | OrderStructs.Maker | undefined   |
| makerSignature | bytes              | undefined   |
| signer         | address            | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### verifyMerkleTree

```solidity
function verifyMerkleTree(OrderStructs.MerkleTree merkleTree, bytes makerSignature, address signer) external view returns (bool)
```

#### Parameters

| Name           | Type                    | Description |
| -------------- | ----------------------- | ----------- |
| merkleTree     | OrderStructs.MerkleTree | undefined   |
| makerSignature | bytes                   | undefined   |
| signer         | address                 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

## Errors

### NullSignerAddress

```solidity
error NullSignerAddress()
```

It is emitted if the signer is null.

### SignatureEOAInvalid

```solidity
error SignatureEOAInvalid()
```

It is emitted if the signature is invalid for an EOA (the address recovered is not the expected one).

### SignatureERC1271Invalid

```solidity
error SignatureERC1271Invalid()
```

It is emitted if the signature is invalid for a ERC1271 contract signer.

### SignatureLengthInvalid

```solidity
error SignatureLengthInvalid(uint256 length)
```

It is emitted if the signature&#39;s length is neither 64 nor 65 bytes.

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| length | uint256 | undefined   |

### SignatureParameterSInvalid

```solidity
error SignatureParameterSInvalid()
```

It is emitted if the signature is invalid due to S parameter.

### SignatureParameterVInvalid

```solidity
error SignatureParameterVInvalid(uint8 v)
```

It is emitted if the signature is invalid due to V parameter.

#### Parameters

| Name | Type  | Description |
| ---- | ----- | ----------- |
| v    | uint8 | undefined   |
