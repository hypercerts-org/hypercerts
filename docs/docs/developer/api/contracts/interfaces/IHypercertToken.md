# IHypercertToken

_bitbeckers_

> Interface for hypercert token interactions

This interface declares the required functionality for a hypercert tokenThis interface does not specify the underlying token type (e.g. 721 or 1155)

## Methods

### burnFraction

```solidity
function burnFraction(address account, uint256 tokenID) external nonpayable
```

Operator must be allowed by `creator` and the token must represent the total amount of available units.

_Function to burn the token at `tokenID` for `account`_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |
| tokenID | uint256 | undefined   |

### mergeFractions

```solidity
function mergeFractions(address account, uint256[] tokenIDs) external nonpayable
```

Tokens that have been merged are burned.

_Function called to merge tokens within `tokenIDs`._

#### Parameters

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| account  | address   | undefined   |
| tokenIDs | uint256[] | undefined   |

### mintClaim

```solidity
function mintClaim(address account, uint256 units, string uri, enum IHypercertToken.TransferRestrictions restrictions) external nonpayable
```

_Function called to store a claim referenced via `uri` with a maximum number of fractions `units`._

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| account      | address                                   | undefined   |
| units        | uint256                                   | undefined   |
| uri          | string                                    | undefined   |
| restrictions | enum IHypercertToken.TransferRestrictions | undefined   |

### mintClaimWithFractions

```solidity
function mintClaimWithFractions(address account, uint256 units, uint256[] fractions, string uri, enum IHypercertToken.TransferRestrictions restrictions) external nonpayable
```

_Function called to store a claim referenced via `uri` with a set of `fractions`.Fractions are internally summed to total units._

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| account      | address                                   | undefined   |
| units        | uint256                                   | undefined   |
| fractions    | uint256[]                                 | undefined   |
| uri          | string                                    | undefined   |
| restrictions | enum IHypercertToken.TransferRestrictions | undefined   |

### splitFraction

```solidity
function splitFraction(address account, uint256 tokenID, uint256[] _values) external nonpayable
```

The sum of `values` must equal the current value of `_tokenID`.

_Function called to split `tokenID` owned by `account` into units declared in `values`._

#### Parameters

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| account  | address   | undefined   |
| tokenID  | uint256   | undefined   |
| \_values | uint256[] | undefined   |

### unitsOf

```solidity
function unitsOf(address account, uint256 tokenID) external view returns (uint256 units)
```

_Returns the `units` held by `account` of a (fractional) token at `claimID`If `tokenID` is a base type, the total amount of `units` held by `account` for the claim is returned.If `tokenID` is a fractional token, the `units` held by `account` the token is returned_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |
| tokenID | uint256 | undefined   |

#### Returns

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| units | uint256 | undefined   |

### unitsOf

```solidity
function unitsOf(uint256 tokenID) external view returns (uint256 units)
```

_Returns the `units` held by a (fractional) token at `claimID`If `tokenID` is a base type, the total amount of `units` for the claim is returned.If `tokenID` is a fractional token, the `units` held by the token is returned_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| units | uint256 | undefined   |

### uri

```solidity
function uri(uint256 tokenID) external view returns (string metadata)
```

_Returns the `uri` for metadata of the claim represented by `tokenID`Metadata must conform to { Hypercert Metadata } spec (based on ERC1155 Metadata)_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| metadata | string | undefined   |

## Events

### ClaimStored

```solidity
event ClaimStored(uint256 indexed claimID, string uri, uint256 totalUnits)
```

_Emitted when token with tokenID `claimID` is stored, with external data reference via `uri`._

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| claimID `indexed` | uint256 | undefined   |
| uri               | string  | undefined   |
| totalUnits        | uint256 | undefined   |
