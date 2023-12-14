# StrategyChainlinkUSDDynamicAsk

_LooksRare protocol team (👀,💎)_

> StrategyChainlinkUSDDynamicAsk

This contract allows a seller to sell an NFT priced in USD and the receivable amount to be in ETH.

## Methods

### ETH_USD_PRICE_FEED_DECIMALS

```solidity
function ETH_USD_PRICE_FEED_DECIMALS() external view returns (uint256)
```

_It is possible to call priceFeed.decimals() to get the decimals, but to save gas, it is hard coded instead._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### WETH

```solidity
function WETH() external view returns (address)
```

Wrapped ether (WETH) address.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

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
function isMakerOrderValid(OrderStructs.Maker makerAsk, bytes4 functionSelector) external view returns (bool isValid, bytes4 errorSelector)
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

### priceFeed

```solidity
function priceFeed() external view returns (contract AggregatorV3Interface)
```

ETH/USD Chainlink price feed

#### Returns

| Name | Type                           | Description |
| ---- | ------------------------------ | ----------- |
| \_0  | contract AggregatorV3Interface | undefined   |

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

### BidTooLow

```solidity
error BidTooLow()
```

It is returned if the bid price is too low for the ask user.

### ChainlinkPriceInvalid

```solidity
error ChainlinkPriceInvalid()
```

It is returned if the Chainlink price is invalid (e.g. negative).

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

### OrderInvalid

```solidity
error OrderInvalid()
```

It is returned if the order is permanently invalid. There may be an issue with the order formatting.

### PriceNotRecentEnough

```solidity
error PriceNotRecentEnough()
```

It is returned if the current block time relative to the latest price&#39;s update time is greater than the latency tolerance.

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
