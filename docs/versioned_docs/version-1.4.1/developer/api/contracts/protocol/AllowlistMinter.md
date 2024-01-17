# AllowlistMinter

_bitbeckers_

> Interface for hypercert token interactions

This interface declares the required functionality for a hypercert tokenThis interface does not specify the underlying token type (e.g. 721 or 1155)

## Methods

### getMinted

```solidity
function getMinted(uint256 claimID) external view returns (uint256 mintedUnits)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| claimID | uint256 | undefined   |

#### Returns

| Name        | Type    | Description |
| ----------- | ------- | ----------- |
| mintedUnits | uint256 | undefined   |

### hasBeenClaimed

```solidity
function hasBeenClaimed(uint256, bytes32) external view returns (bool)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |
| \_1  | bytes32 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### isAllowedToClaim

```solidity
function isAllowedToClaim(bytes32[] proof, uint256 claimID, bytes32 leaf) external view returns (bool isAllowed)
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| proof   | bytes32[] | undefined   |
| claimID | uint256   | undefined   |
| leaf    | bytes32   | undefined   |

#### Returns

| Name      | Type | Description |
| --------- | ---- | ----------- |
| isAllowed | bool | undefined   |

## Events

### AllowlistCreated

```solidity
event AllowlistCreated(uint256 tokenID, bytes32 root)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |
| root    | bytes32 | undefined   |

### LeafClaimed

```solidity
event LeafClaimed(uint256 tokenID, bytes32 leaf)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |
| leaf    | bytes32 | undefined   |

## Errors

### DoesNotExist

```solidity
error DoesNotExist()
```
