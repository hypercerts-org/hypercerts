# ILooksRareProtocol

_LooksRare protocol team (👀,💎)_

> ILooksRareProtocol

## Methods

### executeMultipleTakerBids

```solidity
function executeMultipleTakerBids(OrderStructs.Taker[] takerBids, OrderStructs.Maker[] makerAsks, bytes[] makerSignatures, OrderStructs.MerkleTree[] merkleTrees, bool isAtomic) external payable
```

#### Parameters

| Name            | Type                      | Description |
| --------------- | ------------------------- | ----------- |
| takerBids       | OrderStructs.Taker[]      | undefined   |
| makerAsks       | OrderStructs.Maker[]      | undefined   |
| makerSignatures | bytes[]                   | undefined   |
| merkleTrees     | OrderStructs.MerkleTree[] | undefined   |
| isAtomic        | bool                      | undefined   |

### executeTakerAsk

```solidity
function executeTakerAsk(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid, bytes makerSignature, OrderStructs.MerkleTree merkleTree) external nonpayable
```

#### Parameters

| Name           | Type                    | Description |
| -------------- | ----------------------- | ----------- |
| takerAsk       | OrderStructs.Taker      | undefined   |
| makerBid       | OrderStructs.Maker      | undefined   |
| makerSignature | bytes                   | undefined   |
| merkleTree     | OrderStructs.MerkleTree | undefined   |

### executeTakerBid

```solidity
function executeTakerBid(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk, bytes makerSignature, OrderStructs.MerkleTree merkleTree) external payable
```

#### Parameters

| Name           | Type                    | Description |
| -------------- | ----------------------- | ----------- |
| takerBid       | OrderStructs.Taker      | undefined   |
| makerAsk       | OrderStructs.Maker      | undefined   |
| makerSignature | bytes                   | undefined   |
| merkleTree     | OrderStructs.MerkleTree | undefined   |

## Events

### NewDomainSeparator

```solidity
event NewDomainSeparator()
```

It is emitted if there is a change in the domain separator.

### NewGasLimitETHTransfer

```solidity
event NewGasLimitETHTransfer(uint256 gasLimitETHTransfer)
```

It is emitted when there is a new gas limit for a ETH transfer (before it is wrapped to WETH).

#### Parameters

| Name                | Type    | Description                   |
| ------------------- | ------- | ----------------------------- |
| gasLimitETHTransfer | uint256 | Gas limit for an ETH transfer |

### TakerAsk

```solidity
event TakerAsk(ILooksRareProtocol.NonceInvalidationParameters nonceInvalidationParameters, address askUser, address bidUser, uint256 strategyId, address currency, address collection, uint256[] itemIds, uint256[] amounts, address[2] feeRecipients, uint256[3] feeAmounts)
```

It is emitted when a taker ask transaction is completed.

#### Parameters

| Name                        | Type                                           | Description                                                                                                                                                                                                 |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nonceInvalidationParameters | ILooksRareProtocol.NonceInvalidationParameters | Struct about nonce invalidation parameters                                                                                                                                                                  |
| askUser                     | address                                        | Address of the ask user                                                                                                                                                                                     |
| bidUser                     | address                                        | Address of the bid user                                                                                                                                                                                     |
| strategyId                  | uint256                                        | Id of the strategy                                                                                                                                                                                          |
| currency                    | address                                        | Address of the currency                                                                                                                                                                                     |
| collection                  | address                                        | Address of the collection                                                                                                                                                                                   |
| itemIds                     | uint256[]                                      | Array of item ids                                                                                                                                                                                           |
| amounts                     | uint256[]                                      | Array of amounts (for item ids)                                                                                                                                                                             |
| feeRecipients               | address[2]                                     | Array of fee recipients feeRecipients[0] User who receives the proceeds of the sale (it can be the taker ask user or different) feeRecipients[1] Creator fee recipient (if none, address(0))                |
| feeAmounts                  | uint256[3]                                     | Array of fee amounts feeAmounts[0] Fee amount for the user receiving sale proceeds feeAmounts[1] Creator fee amount feeAmounts[2] Protocol fee amount prior to adjustment for a potential affiliate payment |

### TakerBid

```solidity
event TakerBid(ILooksRareProtocol.NonceInvalidationParameters nonceInvalidationParameters, address bidUser, address bidRecipient, uint256 strategyId, address currency, address collection, uint256[] itemIds, uint256[] amounts, address[2] feeRecipients, uint256[3] feeAmounts)
```

It is emitted when a taker bid transaction is completed.

#### Parameters

| Name                        | Type                                           | Description                                                                                                                                                                                                 |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nonceInvalidationParameters | ILooksRareProtocol.NonceInvalidationParameters | Struct about nonce invalidation parameters                                                                                                                                                                  |
| bidUser                     | address                                        | Address of the bid user                                                                                                                                                                                     |
| bidRecipient                | address                                        | Address of the recipient of the bid                                                                                                                                                                         |
| strategyId                  | uint256                                        | Id of the strategy                                                                                                                                                                                          |
| currency                    | address                                        | Address of the currency                                                                                                                                                                                     |
| collection                  | address                                        | Address of the collection                                                                                                                                                                                   |
| itemIds                     | uint256[]                                      | Array of item ids                                                                                                                                                                                           |
| amounts                     | uint256[]                                      | Array of amounts (for item ids)                                                                                                                                                                             |
| feeRecipients               | address[2]                                     | Array of fee recipients feeRecipients[0] User who receives the proceeds of the sale (it is the maker ask user) feeRecipients[1] Creator fee recipient (if none, address(0))                                 |
| feeAmounts                  | uint256[3]                                     | Array of fee amounts feeAmounts[0] Fee amount for the user receiving sale proceeds feeAmounts[1] Creator fee amount feeAmounts[2] Protocol fee amount prior to adjustment for a potential affiliate payment |

## Errors

### ChainIdInvalid

```solidity
error ChainIdInvalid()
```

It is returned if the domain separator should change.

### NewGasLimitETHTransferTooLow

```solidity
error NewGasLimitETHTransferTooLow()
```

It is returned if the gas limit for a standard ETH transfer is too low.

### NoncesInvalid

```solidity
error NoncesInvalid()
```

It is returned if the nonces are invalid.

### SameDomainSeparator

```solidity
error SameDomainSeparator()
```

It is returned if the domain separator cannot be updated (i.e. the chainId is the same).
