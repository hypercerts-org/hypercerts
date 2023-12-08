# IRoyaltyFeeRegistry

_LooksRare protocol team (👀,💎)_

> IRoyaltyFeeRegistry

## Methods

### royaltyInfo

```solidity
function royaltyInfo(address collection, uint256 price) external view returns (address receiver, uint256 royaltyFee)
```

This function returns the royalty information for a collection at a given transaction price.

#### Parameters

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| collection | address | Collection address |
| price      | uint256 | Transaction price  |

#### Returns

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| receiver   | address | Receiver address   |
| royaltyFee | uint256 | Royalty fee amount |
