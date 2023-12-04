# OrderValidatorV2A

_LooksRare protocol team (👀,💎); bitbeckers_

> OrderValidatorV2A

This contract is used to check the validity of maker ask/bid orders in the LooksRareProtocol (v2). It performs checks for: 1. Protocol allowlist issues (i.e. currency or strategy not allowed) 2. Maker order-specific issues (e.g., order invalid due to format or other-strategy specific issues) 3. Nonce related issues (e.g., nonce executed or cancelled) 4. Signature related issues and merkle tree parameters 5. Timestamp related issues (e.g., order expired) 6. Asset-related issues for ERC20/ERC721/ERC1155/Hypercerts (approvals and balances) 7. Collection-type suggestions 8. Transfer manager related issues 9. Creator fee related issues (e.g., creator fee too high, ERC2981 bundles)

_This version does not handle strategies with partial fills._

## Methods

### CRITERIA_GROUPS

```solidity
function CRITERIA_GROUPS() external view returns (uint256)
```

Number of distinct criteria groups checked to evaluate the validity of an order.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### ERC1155_INTERFACE_ID

```solidity
function ERC1155_INTERFACE_ID() external view returns (bytes4)
```

ERC1155 interfaceId.

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### ERC721_INTERFACE_ID_1

```solidity
function ERC721_INTERFACE_ID_1() external view returns (bytes4)
```

ERC721 potential interfaceId.

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### ERC721_INTERFACE_ID_2

```solidity
function ERC721_INTERFACE_ID_2() external view returns (bytes4)
```

ERC721 potential interfaceId.

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### HYPERCERT_INTERFACE_ID

```solidity
function HYPERCERT_INTERFACE_ID() external view returns (bytes4)
```

Hypercert interfaceId

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | bytes4 | undefined   |

### MAGIC_VALUE_ORDER_NONCE_EXECUTED

```solidity
function MAGIC_VALUE_ORDER_NONCE_EXECUTED() external view returns (bytes32)
```

Magic value nonce returned if executed (or cancelled).

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### checkMakerOrderValidity

```solidity
function checkMakerOrderValidity(OrderStructs.Maker makerOrder, bytes signature, OrderStructs.MerkleTree merkleTree) external view returns (uint256[9] validationCodes)
```

#### Parameters

| Name       | Type                    | Description |
| ---------- | ----------------------- | ----------- |
| makerOrder | OrderStructs.Maker      | undefined   |
| signature  | bytes                   | undefined   |
| merkleTree | OrderStructs.MerkleTree | undefined   |

#### Returns

| Name            | Type       | Description |
| --------------- | ---------- | ----------- |
| validationCodes | uint256[9] | undefined   |

### checkMultipleMakerOrderValidities

```solidity
function checkMultipleMakerOrderValidities(OrderStructs.Maker[] makerOrders, bytes[] signatures, OrderStructs.MerkleTree[] merkleTrees) external view returns (uint256[9][] validationCodes)
```

#### Parameters

| Name        | Type                      | Description |
| ----------- | ------------------------- | ----------- |
| makerOrders | OrderStructs.Maker[]      | undefined   |
| signatures  | bytes[]                   | undefined   |
| merkleTrees | OrderStructs.MerkleTree[] | undefined   |

#### Returns

| Name            | Type         | Description |
| --------------- | ------------ | ----------- |
| validationCodes | uint256[9][] | undefined   |

### creatorFeeManager

```solidity
function creatorFeeManager() external view returns (contract ICreatorFeeManager)
```

CreatorFeeManager.

#### Returns

| Name | Type                        | Description |
| ---- | --------------------------- | ----------- |
| \_0  | contract ICreatorFeeManager | undefined   |

### deriveProtocolParameters

```solidity
function deriveProtocolParameters() external nonpayable
```

Derive protocol parameters. Anyone can call this function.

_It allows adjusting if the domain separator or creator fee manager address were to change._

### domainSeparator

```solidity
function domainSeparator() external view returns (bytes32)
```

LooksRareProtocol domain separator.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### looksRareProtocol

```solidity
function looksRareProtocol() external view returns (contract LooksRareProtocol)
```

LooksRareProtocol.

#### Returns

| Name | Type                       | Description |
| ---- | -------------------------- | ----------- |
| \_0  | contract LooksRareProtocol | undefined   |

### maxCreatorFeeBp

```solidity
function maxCreatorFeeBp() external view returns (uint256)
```

Maximum creator fee (in basis point).

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### transferManager

```solidity
function transferManager() external view returns (contract TransferManager)
```

TransferManager

#### Returns

| Name | Type                     | Description |
| ---- | ------------------------ | ----------- |
| \_0  | contract TransferManager | undefined   |
