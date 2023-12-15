# BaseStrategyChainlinkPriceLatency

_LooksRare protocol team (👀,💎)_

> BaseStrategyChainlinkPriceLatency

This contract allows the owner to define the maximum acceptable Chainlink price latency.

## Methods

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

### maxLatency

```solidity
function maxLatency() external view returns (uint256)
```

Maximum latency accepted after which the execution strategy rejects the retrieved price. For ETH, it cannot be higher than 3,600 as Chainlink will at least update the price every 3,600 seconds, provided ETH&#39;s price does not deviate more than 0.5%. For NFTs, it cannot be higher than 86,400 as Chainlink will at least update the price every 86,400 seconds, provided ETH&#39;s price does not deviate more than 2%.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

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

## Events

### CancelOwnershipTransfer

```solidity
event CancelOwnershipTransfer()
```

This is emitted if the ownership transfer is cancelled.

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

### RenouncementNotInProgress

```solidity
error RenouncementNotInProgress()
```

This is returned when there is no renouncement in progress but the owner tries to validate the ownership renouncement.

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
