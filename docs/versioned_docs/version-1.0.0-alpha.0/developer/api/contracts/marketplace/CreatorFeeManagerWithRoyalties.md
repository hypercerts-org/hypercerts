# CreatorFeeManagerWithRoyalties

_LooksRare protocol team (👀,💎)_

> CreatorFeeManagerWithRoyalties

This contract returns the creator fee address and the creator fee amount.

## Methods

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

_There are two on-chain sources for the royalty fee to distribute. 1. RoyaltyFeeRegistry: It is an on-chain registry where creator fee is defined for all items of a collection. 2. ERC2981: The NFT Royalty Standard where royalty fee is defined at a itemId level in a collection. The on-chain logic looks up the registry first. If it does not find anything, it checks if a collection is ERC2981. If so, it fetches the proper royalty information for the itemId. For a bundle that contains multiple itemIds (for a collection using ERC2981), if the royalty fee/recipient differ among the itemIds part of the bundle, the trade reverts. This contract DOES NOT enforce any restriction for extremely high creator fee, nor verifies the creator fee fetched is inferior to the total price. If any contract relies on it to build an on-chain royalty logic, it should implement protection against: (1) high royalties (2) potential unexpected royalty changes that can occur after the creation of the order._

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
