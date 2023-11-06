# StrategyCollectionOffer

_LooksRare protocol team (👀,💎)_

> StrategyCollectionOffer

This contract offers execution strategies for users to create maker bid offers for items in a collection. There are two available functions: 1. executeCollectionStrategyWithTakerAsk --&gt; it applies to all itemIds in a collection 2. executeCollectionStrategyWithTakerAskWithProof --&gt; it allows adding merkle proof criteria.The bidder can only bid on 1 item id at a time. 1. If ERC721, the amount must be 1. 2. If ERC1155, the amount can be greater than 1.

_Use cases can include trait-based offers or rarity score offers._

## Methods

### executeCollectionStrategyWithTakerAsk

```solidity
function executeCollectionStrategyWithTakerAsk(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external pure returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

### executeCollectionStrategyWithTakerAskWithProof

```solidity
function executeCollectionStrategyWithTakerAskWithProof(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid) external pure returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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
