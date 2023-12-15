# IAllowlist

_bitbeckers_

> Interface for allowlist

This interface declares the required functionality for a hypercert tokenThis interface does not specify the underlying token type (e.g. 721 or 1155)

## Methods

### isAllowedToClaim

```solidity
function isAllowedToClaim(bytes32[] proof, uint256 tokenID, bytes32 leaf) external view returns (bool isAllowed)
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| proof   | bytes32[] | undefined   |
| tokenID | uint256   | undefined   |
| leaf    | bytes32   | undefined   |

#### Returns

| Name      | Type | Description |
| --------- | ---- | ----------- |
| isAllowed | bool | undefined   |
