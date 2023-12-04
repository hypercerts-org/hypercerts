# IExecutionManager

_LooksRare protocol team (👀,💎)_

> IExecutionManager

## Events

### NewCreatorFeeManager

```solidity
event NewCreatorFeeManager(address creatorFeeManager)
```

It is issued when there is a new creator fee manager.

#### Parameters

| Name              | Type    | Description                            |
| ----------------- | ------- | -------------------------------------- |
| creatorFeeManager | address | Address of the new creator fee manager |

### NewMaxCreatorFeeBp

```solidity
event NewMaxCreatorFeeBp(uint256 maxCreatorFeeBp)
```

It is issued when there is a new maximum creator fee (in basis point).

#### Parameters

| Name            | Type    | Description                              |
| --------------- | ------- | ---------------------------------------- |
| maxCreatorFeeBp | uint256 | New maximum creator fee (in basis point) |

### NewProtocolFeeRecipient

```solidity
event NewProtocolFeeRecipient(address protocolFeeRecipient)
```

It is issued when there is a new protocol fee recipient address.

#### Parameters

| Name                 | Type    | Description                               |
| -------------------- | ------- | ----------------------------------------- |
| protocolFeeRecipient | address | Address of the new protocol fee recipient |

## Errors

### CreatorFeeBpTooHigh

```solidity
error CreatorFeeBpTooHigh()
```

It is returned if the creator fee (in basis point) is too high.

### NewProtocolFeeRecipientCannotBeNullAddress

```solidity
error NewProtocolFeeRecipientCannotBeNullAddress()
```

It is returned if the new protocol fee recipient is set to address(0).

### NoSelectorForStrategy

```solidity
error NoSelectorForStrategy()
```

It is returned if there is no selector for maker ask/bid for a given strategyId, depending on the quote type.

### OutsideOfTimeRange

```solidity
error OutsideOfTimeRange()
```

It is returned if the current block timestamp is not between start and end times in the maker order.

### StrategyNotAvailable

```solidity
error StrategyNotAvailable(uint256 strategyId)
```

It is returned if the strategy id has no implementation.

_It is returned if there is no implementation address and the strategyId is strictly greater than 0._

#### Parameters

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| strategyId | uint256 | undefined   |
