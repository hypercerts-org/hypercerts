# StrategyManager

_LooksRare protocol team (👀,💎)_

> StrategyManager

This contract handles the addition and the update of execution strategies.

## Methods

### addStrategy

```solidity
function addStrategy(uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation) external nonpayable
```

This function allows the owner to add a new execution strategy to the protocol.

_Strategies have an id that is incremental. Only callable by owner._

#### Parameters

| Name                  | Type    | Description                                    |
| --------------------- | ------- | ---------------------------------------------- |
| standardProtocolFeeBp | uint16  | Standard protocol fee (in basis point)         |
| minTotalFeeBp         | uint16  | Minimum total fee (in basis point)             |
| maxProtocolFeeBp      | uint16  | Maximum protocol fee (in basis point)          |
| selector              | bytes4  | Function selector for the strategy             |
| isMakerBid            | bool    | Whether the function selector is for maker bid |
| implementation        | address | Implementation address                         |

### cancelOwnershipTransfer

```solidity
function cancelOwnershipTransfer() external nonpayable
```

This function is used to cancel the ownership transfer.

_This function can be used for both cancelling a transfer to a new owner and cancelling the renouncement of the ownership._

### confirmOwnershipRenouncement

```solidity
function confirmOwnershipRenouncement() external nonpayable
```

This function is used to confirm the ownership renouncement.

### confirmOwnershipTransfer

```solidity
function confirmOwnershipTransfer() external nonpayable
```

This function is used to confirm the ownership transfer.

_This function can only be called by the current potential owner._

### initiateOwnershipRenouncement

```solidity
function initiateOwnershipRenouncement() external nonpayable
```

This function is used to initiate the ownership renouncement.

### initiateOwnershipTransfer

```solidity
function initiateOwnershipTransfer(address newPotentialOwner) external nonpayable
```

This function is used to initiate the transfer of ownership to a new owner.

#### Parameters

| Name              | Type    | Description                 |
| ----------------- | ------- | --------------------------- |
| newPotentialOwner | address | New potential owner address |

### isCurrencyAllowed

```solidity
function isCurrencyAllowed(address) external view returns (bool)
```

It checks whether the currency is allowed for transacting.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

Address of the current owner.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### ownershipStatus

```solidity
function ownershipStatus() external view returns (enum IOwnableTwoSteps.Status)
```

Ownership status.

#### Returns

| Name | Type                         | Description |
| ---- | ---------------------------- | ----------- |
| \_0  | enum IOwnableTwoSteps.Status | undefined   |

### potentialOwner

```solidity
function potentialOwner() external view returns (address)
```

Address of the potential owner.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### strategyInfo

```solidity
function strategyInfo(uint256) external view returns (bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation)
```

This returns the strategy information for a strategy id.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| isActive              | bool    | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |
| maxProtocolFeeBp      | uint16  | undefined   |
| selector              | bytes4  | undefined   |
| isMakerBid            | bool    | undefined   |
| implementation        | address | undefined   |

### updateCurrencyStatus

```solidity
function updateCurrencyStatus(address currency, bool isAllowed) external nonpayable
```

This function allows the owner to update the status of a currency.

_Only callable by owner._

#### Parameters

| Name      | Type    | Description                                        |
| --------- | ------- | -------------------------------------------------- |
| currency  | address | Currency address (address(0) for ETH)              |
| isAllowed | bool    | Whether the currency should be allowed for trading |

### updateStrategy

```solidity
function updateStrategy(uint256 strategyId, bool isActive, uint16 newStandardProtocolFee, uint16 newMinTotalFee) external nonpayable
```

This function allows the owner to update parameters for an existing execution strategy.

_Only callable by owner._

#### Parameters

| Name                   | Type    | Description                                |
| ---------------------- | ------- | ------------------------------------------ |
| strategyId             | uint256 | Strategy id                                |
| isActive               | bool    | Whether the strategy must be active        |
| newStandardProtocolFee | uint16  | New standard protocol fee (in basis point) |
| newMinTotalFee         | uint16  | New minimum total fee (in basis point)     |

## Events

### CancelOwnershipTransfer

```solidity
event CancelOwnershipTransfer()
```

This is emitted if the ownership transfer is cancelled.

### CurrencyStatusUpdated

```solidity
event CurrencyStatusUpdated(address currency, bool isAllowed)
```

It is emitted if the currency status in the allowlist is updated.

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| currency  | address | undefined   |
| isAllowed | bool    | undefined   |

### InitiateOwnershipRenouncement

```solidity
event InitiateOwnershipRenouncement()
```

This is emitted if the ownership renouncement is initiated.

### InitiateOwnershipTransfer

```solidity
event InitiateOwnershipTransfer(address previousOwner, address potentialOwner)
```

This is emitted if the ownership transfer is initiated.

#### Parameters

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| previousOwner  | address | undefined   |
| potentialOwner | address | undefined   |

### NewOwner

```solidity
event NewOwner(address newOwner)
```

This is emitted when there is a new owner.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### NewStrategy

```solidity
event NewStrategy(uint256 strategyId, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation)
```

It is emitted when a new strategy is added.

#### Parameters

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| strategyId            | uint256 | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |
| maxProtocolFeeBp      | uint16  | undefined   |
| selector              | bytes4  | undefined   |
| isMakerBid            | bool    | undefined   |
| implementation        | address | undefined   |

### StrategyUpdated

```solidity
event StrategyUpdated(uint256 strategyId, bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp)
```

It is emitted when an existing strategy is updated.

#### Parameters

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| strategyId            | uint256 | undefined   |
| isActive              | bool    | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |

## Errors

### NoOngoingTransferInProgress

```solidity
error NoOngoingTransferInProgress()
```

This is returned when there is no transfer of ownership in progress.

### NotOwner

```solidity
error NotOwner()
```

This is returned when the caller is not the owner.

### NotV2Strategy

```solidity
error NotV2Strategy()
```

If the strategy has not set properly its implementation contract.

_It can only be returned for owner operations._

### RenouncementNotInProgress

```solidity
error RenouncementNotInProgress()
```

This is returned when there is no renouncement in progress but the owner tries to validate the ownership renouncement.

### StrategyHasNoSelector

```solidity
error StrategyHasNoSelector()
```

It is returned if the strategy has no selector.

_It can only be returned for owner operations._

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

_It can only be returned for owner operations._

### TransferAlreadyInProgress

```solidity
error TransferAlreadyInProgress()
```

This is returned when the transfer is already in progress but the owner tries initiate a new ownership transfer.

### TransferNotInProgress

```solidity
error TransferNotInProgress()
```

This is returned when there is no ownership transfer in progress but the ownership change tries to be approved.

### WrongPotentialOwner

```solidity
error WrongPotentialOwner()
```

This is returned when the ownership transfer is attempted to be validated by the a caller that is not the potential owner.
