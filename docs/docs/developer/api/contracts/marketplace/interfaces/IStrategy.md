# IStrategy

_LooksRare protocol team (👀,💎)_

> IStrategy

## Methods

### isLooksRareV2Strategy

```solidity
function isLooksRareV2Strategy() external pure returns (bool isStrategy)
```

This function acts as a safety check for the protocol&#39;s owner when adding new execution strategies.

#### Returns

| Name       | Type | Description                                    |
| ---------- | ---- | ---------------------------------------------- |
| isStrategy | bool | Whether it is a LooksRare V2 protocol strategy |

### isMakerOrderValid

```solidity
function isMakerOrderValid(OrderStructs.Maker makerOrder, bytes4 functionSelector) external view returns (bool isValid, bytes4 errorSelector)
```

#### Parameters

| Name             | Type               | Description |
| ---------------- | ------------------ | ----------- |
| makerOrder       | OrderStructs.Maker | undefined   |
| functionSelector | bytes4             | undefined   |

#### Returns

| Name          | Type   | Description |
| ------------- | ------ | ----------- |
| isValid       | bool   | undefined   |
| errorSelector | bytes4 | undefined   |
