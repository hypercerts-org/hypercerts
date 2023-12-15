# StrategyItemIdsRange

_LooksRare protocol team (👀,💎)_

> StrategyItemIdsRange

This contract offers a single execution strategy for users to bid on a specific amount of items in a range bounded by 2 item ids.

## Methods

### executeStrategyWithTakerAsk

```solidity
function executeStrategyWithTakerAsk(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external pure returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
```

#### Parameters

| Name     | Type               | Description |
| -------- | ------------------ | ----------- |
| takerAsk | OrderStructs.Taker | undefined   |
| makerBid | OrderStructs.Maker | undefined   |

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
function isMakerOrderValid(OrderStructs.Maker makerBid, bytes4 functionSelector) external pure returns (bool isValid, bytes4 errorSelector)
```

#### Parameters

| Name             | Type               | Description |
| ---------------- | ------------------ | ----------- |
| makerBid         | OrderStructs.Maker | undefined   |
| functionSelector | bytes4             | undefined   |

#### Returns

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| isValid       | bool   | undefined   |
| errorSelector | bytes4 | undefined   |

## Errors

### OrderInvalid

```solidity
error OrderInvalid()
```

It is returned if the order is permanently invalid. There may be an issue with the order formatting.
