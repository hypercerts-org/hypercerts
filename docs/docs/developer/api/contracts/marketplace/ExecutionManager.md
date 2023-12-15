# ExecutionManager

_LooksRare protocol team (👀,💎); bitbeckers;_

> ExecutionManager

This contract handles the execution and resolution of transactions. A transaction is executed on-chain when an off-chain maker order is matched by on-chain taker order of a different kind. For instance, a taker ask is executed against a maker bid (or a taker bid against a maker ask).

## Methods

### MAGIC_VALUE_ORDER_NONCE_EXECUTED

```solidity
function MAGIC_VALUE_ORDER_NONCE_EXECUTED() external view returns (bytes32)
```

Magic value nonce returned if executed (or cancelled).

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

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

### cancelOrderNonces

```solidity
function cancelOrderNonces(uint256[] orderNonces) external nonpayable
```

This function allows a user to cancel an array of order nonces.

_It does not check the status of the nonces to save gas and to prevent revertion if one of the orders is filled in the same block._

#### Parameters

| Name        | Type      | Description           |
| ----------- | --------- | --------------------- |
| orderNonces | uint256[] | Array of order nonces |

### cancelOwnershipTransfer

```solidity
function cancelOwnershipTransfer() external nonpayable
```

This function is used to cancel the ownership transfer.

_This function can be used for both cancelling a transfer to a new owner and cancelling the renouncement of the ownership._

### cancelSubsetNonces

```solidity
function cancelSubsetNonces(uint256[] subsetNonces) external nonpayable
```

This function allows a user to cancel an array of subset nonces.

_It does not check the status of the nonces to save gas._

#### Parameters

| Name         | Type      | Description            |
| ------------ | --------- | ---------------------- |
| subsetNonces | uint256[] | Array of subset nonces |

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

### creatorFeeManager

```solidity
function creatorFeeManager() external view returns (contract ICreatorFeeManager)
```

Creator fee manager.

#### Returns

| Name | Type                        | Description |
| ---- | --------------------------- | ----------- |
| \_0  | contract ICreatorFeeManager | undefined   |

### incrementBidAskNonces

```solidity
function incrementBidAskNonces(bool bid, bool ask) external nonpayable
```

This function increments a user&#39;s bid/ask nonces.

_The logic for computing the quasi-random number is inspired by Seaport v1.2. The pseudo-randomness allows non-deterministic computation of the next ask/bid nonce. A deterministic increment would make the cancel-all process non-effective in certain cases (orders signed with a greater ask/bid nonce). The same quasi-random number is used for incrementing both the bid and ask nonces if both values are incremented in the same transaction. If this function is used twice in the same block, it will return the same quasiRandomNumber but this will not impact the overall business logic._

#### Parameters

| Name | Type | Description                             |
| ---- | ---- | --------------------------------------- |
| bid  | bool | Whether to increment the user bid nonce |
| ask  | bool | Whether to increment the user ask nonce |

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

### maxCreatorFeeBp

```solidity
function maxCreatorFeeBp() external view returns (uint16)
```

Maximum creator fee (in basis point).

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | uint16 | undefined   |

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

### protocolFeeRecipient

```solidity
function protocolFeeRecipient() external view returns (address)
```

Protocol fee recipient.

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

### updateCreatorFeeManager

```solidity
function updateCreatorFeeManager(address newCreatorFeeManager) external nonpayable
```

This function allows the owner to update the creator fee manager address.

_Only callable by owner._

#### Parameters

| Name                 | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| newCreatorFeeManager | address | Address of the creator fee manager |

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

### updateMaxCreatorFeeBp

```solidity
function updateMaxCreatorFeeBp(uint16 newMaxCreatorFeeBp) external nonpayable
```

This function allows the owner to update the maximum creator fee (in basis point).

_The maximum value that can be set is 25%. Only callable by owner._

#### Parameters

| Name               | Type   | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| newMaxCreatorFeeBp | uint16 | New maximum creator fee (in basis point) |

### updateProtocolFeeRecipient

```solidity
function updateProtocolFeeRecipient(address newProtocolFeeRecipient) external nonpayable
```

This function allows the owner to update the protocol fee recipient.

_Only callable by owner._

#### Parameters

| Name                    | Type    | Description                        |
| ----------------------- | ------- | ---------------------------------- |
| newProtocolFeeRecipient | address | New protocol fee recipient address |

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

### userBidAskNonces

```solidity
function userBidAskNonces(address) external view returns (uint256 bidNonce, uint256 askNonce)
```

This tracks the bid and ask nonces for a user address.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| bidNonce | uint256 | undefined   |
| askNonce | uint256 | undefined   |

### userOrderNonce

```solidity
function userOrderNonce(address, uint256) external view returns (bytes32)
```

This checks whether the order nonce for a user was executed or cancelled.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### userSubsetNonce

```solidity
function userSubsetNonce(address, uint256) external view returns (bool)
```

This checks whether the subset nonce for a user was cancelled.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

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

### NewBidAskNonces

```solidity
event NewBidAskNonces(address user, uint256 bidNonce, uint256 askNonce)
```

It is emitted when there is an update of the global bid/ask nonces for a user.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| user     | address | undefined   |
| bidNonce | uint256 | undefined   |
| askNonce | uint256 | undefined   |

### NewCreatorFeeManager

```solidity
event NewCreatorFeeManager(address creatorFeeManager)
```

It is issued when there is a new creator fee manager.

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| creatorFeeManager | address | undefined   |

### NewMaxCreatorFeeBp

```solidity
event NewMaxCreatorFeeBp(uint256 maxCreatorFeeBp)
```

It is issued when there is a new maximum creator fee (in basis point).

#### Parameters

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| maxCreatorFeeBp | uint256 | undefined   |

### NewOwner

```solidity
event NewOwner(address newOwner)
```

This is emitted when there is a new owner.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### NewProtocolFeeRecipient

```solidity
event NewProtocolFeeRecipient(address protocolFeeRecipient)
```

It is issued when there is a new protocol fee recipient address.

#### Parameters

| Name                 | Type    | Description |
| -------------------- | ------- | ----------- |
| protocolFeeRecipient | address | undefined   |

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

### OrderNoncesCancelled

```solidity
event OrderNoncesCancelled(address user, uint256[] orderNonces)
```

It is emitted when order nonces are cancelled for a user.

#### Parameters

| Name        | Type      | Description |
| ----------- | --------- | ----------- |
| user        | address   | undefined   |
| orderNonces | uint256[] | undefined   |

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

### SubsetNoncesCancelled

```solidity
event SubsetNoncesCancelled(address user, uint256[] subsetNonces)
```

It is emitted when subset nonces are cancelled for a user.

#### Parameters

| Name         | Type      | Description |
| ------------ | --------- | ----------- |
| user         | address   | undefined   |
| subsetNonces | uint256[] | undefined   |

## Errors

### CreatorFeeBpTooHigh

```solidity
error CreatorFeeBpTooHigh()
```

It is returned if the creator fee (in basis point) is too high.

### LengthsInvalid

```solidity
error LengthsInvalid()
```

It is returned if there is either a mismatch or an error in the length of the array(s).

### NewProtocolFeeRecipientCannotBeNullAddress

```solidity
error NewProtocolFeeRecipientCannotBeNullAddress()
```

It is returned if the new protocol fee recipient is set to address(0).

### NoOngoingTransferInProgress

```solidity
error NoOngoingTransferInProgress()
```

This is returned when there is no transfer of ownership in progress.

### NoSelectorForStrategy

```solidity
error NoSelectorForStrategy()
```

It is returned if there is no selector for maker ask/bid for a given strategyId, depending on the quote type.

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

### OutsideOfTimeRange

```solidity
error OutsideOfTimeRange()
```

It is returned if the current block timestamp is not between start and end times in the maker order.

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
