# ICreatorFeeManager

_LooksRare protocol team (👀,💎)_

> ICreatorFeeManager

## Methods

### royaltyFeeRegistry

```solidity
function royaltyFeeRegistry() external view returns (contract IRoyaltyFeeRegistry royaltyFeeRegistry)
```

It returns the royalty fee registry address/interface.

#### Returns

| Name               | Type                         | Description                           |
| ------------------ | ---------------------------- | ------------------------------------- |
| royaltyFeeRegistry | contract IRoyaltyFeeRegistry | Interface of the royalty fee registry |

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
