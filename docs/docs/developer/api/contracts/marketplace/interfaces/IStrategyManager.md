# IStrategyManager

*LooksRare protocol team (👀,💎)*

> IStrategyManager






## Events

### NewStrategy

```solidity
event NewStrategy(uint256 strategyId, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation)
```

It is emitted when a new strategy is added.



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId  | uint256 | Id of the new strategy |
| standardProtocolFeeBp  | uint16 | Standard protocol fee (in basis point) |
| minTotalFeeBp  | uint16 | Minimum total fee (in basis point) |
| maxProtocolFeeBp  | uint16 | Maximum protocol fee (in basis point) |
| selector  | bytes4 | Function selector for the transaction to be executed |
| isMakerBid  | bool | Whether the strategyId is for maker bid |
| implementation  | address | Address of the implementation of the strategy |

### StrategyUpdated

```solidity
event StrategyUpdated(uint256 strategyId, bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp)
```

It is emitted when an existing strategy is updated.



#### Parameters

| Name | Type | Description |
|---|---|---|
| strategyId  | uint256 | Id of the strategy |
| isActive  | bool | Whether the strategy is active (or not) after the update |
| standardProtocolFeeBp  | uint16 | Standard protocol fee (in basis point) |
| minTotalFeeBp  | uint16 | Minimum total fee (in basis point) |



## Errors

### NotV2Strategy

```solidity
error NotV2Strategy()
```

If the strategy has not set properly its implementation contract.

*It can only be returned for owner operations.*


### StrategyHasNoSelector

```solidity
error StrategyHasNoSelector()
```

It is returned if the strategy has no selector.

*It can only be returned for owner operations.*


### StrategyNotUsed

```solidity
error StrategyNotUsed()
```

It is returned if the strategyId is invalid.




### StrategyProtocolFeeTooHigh

```solidity
error StrategyProtocolFeeTooHigh()
```

It is returned if the strategy&#39;s protocol fee is too high.

*It can only be returned for owner operations.*



