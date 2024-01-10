# StrategyDutchAuction

_LooksRare protocol team (👀,💎); bitbeckers_

> StrategyDutchAuction

This contract offers a single execution strategy for users to create Dutch auctions.

## Methods

### executeStrategyWithTakerBid

```solidity
function executeStrategyWithTakerBid(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
```

#### Parameters

| Name     | Type               | Description |
| -------- | ------------------ | ----------- |
| takerBid | OrderStructs.Taker | undefined   |
| makerAsk | OrderStructs.Maker | undefined   |

#### Returns

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| price              | uint256   | undefined   |
| itemIds            | uint256[] | undefined   |
| amounts            | uint256[] | undefined   |
| isNonceInvalidated | bool      | undefined   |

### isLooksRareV2Strategy

```solidity
function isLooksRareV2Strategy() external pure returns (bool)
```

This function acts as a safety check for the protocol&#39;s owner when adding new execution strategies.

#### Returns

| Name | Type | Description                                    |
| ---- | ---- | ---------------------------------------------- |
| \_0  | bool | Whether it is a LooksRare V2 protocol strategy |

### isMakerOrderValid

```solidity
function isMakerOrderValid(OrderStructs.Maker makerAsk, bytes4 functionSelector) external pure returns (bool isValid, bytes4 errorSelector)
```

#### Parameters

| Name             | Type               | Description |
| ---------------- | ------------------ | ----------- |
| makerAsk         | OrderStructs.Maker | undefined   |
| functionSelector | bytes4             | undefined   |

#### Returns

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| isValid       | bool   | undefined   |
| errorSelector | bytes4 | undefined   |

## Errors

### BidTooLow

```solidity
error BidTooLow()
```

It is returned if the bid price is too low for the ask user.

### CollectionTypeInvalid

```solidity
error CollectionTypeInvalid()
```

It is returned is the collection type is not supported. For instance if the strategy is specific to hypercerts.

### OrderInvalid

```solidity
error OrderInvalid()
```

It is returned if the order is permanently invalid. There may be an issue with the order formatting.
