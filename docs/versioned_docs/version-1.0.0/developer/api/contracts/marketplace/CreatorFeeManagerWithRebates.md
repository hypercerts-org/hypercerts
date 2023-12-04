# CreatorFeeManagerWithRebates

_LooksRare protocol team (👀,💎)_

> CreatorFeeManagerWithRebates

This contract returns the creator fee address and the creator rebate amount.

## Methods

### STANDARD_ROYALTY_FEE_BP

```solidity
function STANDARD_ROYALTY_FEE_BP() external view returns (uint256)
```

Standard royalty fee (in basis point).

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### royaltyFeeRegistry

```solidity
function royaltyFeeRegistry() external view returns (contract IRoyaltyFeeRegistry)
```

Royalty fee registry interface.

#### Returns

| Name | Type                         | Description |
| ---- | ---------------------------- | ----------- |
| \_0  | contract IRoyaltyFeeRegistry | undefined   |

### viewCreatorFeeInfo

```solidity
function viewCreatorFeeInfo(address collection, uint256 price, uint256[] itemIds) external view returns (address creator, uint256 creatorFeeAmount)
```

This function returns the creator address and calculates the creator fee amount.

#### Parameters

| Name       | Type      | Description        |
| ---------- | --------- | ------------------ |
| collection | address   | Collection address |
| price      | uint256   | Transaction price  |
| itemIds    | uint256[] | Array of item ids  |

#### Returns

| Name             | Type    | Description        |
| ---------------- | ------- | ------------------ |
| creator          | address | Creator address    |
| creatorFeeAmount | uint256 | Creator fee amount |

## Errors

### BundleEIP2981NotAllowed

```solidity
error BundleEIP2981NotAllowed(address collection)
```

It is returned if the bundle contains multiple itemIds with different creator fee structure.

#### Parameters

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| collection | address | undefined   |
