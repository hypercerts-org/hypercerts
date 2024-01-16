# StrategyHypercertCollectionOffer

_LooksRare protocol team (👀,💎); bitbeckers_

> StrategyHypercertCollectionOffer

This contract offers execution strategies for users to create maker bid offers for items in a collection. There are two available functions: 1. executeCollectionStrategyWithTakerAsk --&gt; it applies to all itemIds in a collection 2. executeCollectionStrategyWithTakerAskWithProof --&gt; it allows adding merkle proof criteria for tokenIds. 2. executeCollectionStrategyWithTakerAskWithAllowlist --&gt; it allows adding merkle proof criteria for accounts.The bidder can only bid on 1 item id at a time. 1. The amount must be 1. 2. The units held at bid creation and ask execution time must be the same. 3. The units held by the item sold must be the same as the units held by the item bid.

## Methods

### executeHypercertCollectionStrategyWithTakerAsk

```solidity
function executeHypercertCollectionStrategyWithTakerAsk(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

### executeHypercertCollectionStrategyWithTakerAskWithAllowlist

```solidity
function executeHypercertCollectionStrategyWithTakerAskWithAllowlist(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

### executeHypercertCollectionStrategyWithTakerAskWithProof

```solidity
function executeHypercertCollectionStrategyWithTakerAskWithProof(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

### CollectionTypeInvalid

```solidity
error CollectionTypeInvalid()
```

It is returned is the collection type is not supported. For instance if the strategy is specific to hypercerts.

### MerkleProofInvalid

```solidity
error MerkleProofInvalid()
```

It is returned if the merkle proof provided is invalid.

### OrderInvalid

```solidity
error OrderInvalid()
```

It is returned if the order is permanently invalid. There may be an issue with the order formatting.
