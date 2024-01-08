# StrategyHypercertFractionOffer

_LooksRare protocol team (👀,💎); bitbeckers;_

> StrategyHypercertFractionOffer

This contract offers a single execution strategy for users to bid on a specific amount of units in an hypercerts that&#39;s for sale. Example: Alice has 100 units of a hypercert (id: 42) for sale at a minimum price of 0.001 ETH/unit. Bob wants to buy 10 units. Bob can create a taker bid order with the following parameters: - unitAmount: 10000 // in `additionalParameters` - pricePerUnit: 10 // amount of accepted token paid; in `additionalParameters` - proof: [0xsdadfa....s9fds,0xdasdas...asff8e] // proof to the root defined in the maker ask; in `additionalParameters` This strategy will validate the available units and the price.This contract offers execution strategies for users to create maker bid offers for items in a collection. There are three available functions: 1. executeHypercertFractionStrategyWithTakerBid --&gt; it applies to all itemIds in a collection 2. executeHypercertFractionStrategyWithTakerBidWithAllowlist --&gt; it allows adding merkle proof criteria for accounts.The bidder can only bid on 1 item id at a time. 1. If Hypercert, the amount must be 1 because the fractions are NFTs.

_Use cases can include tiered pricing; think early bird tickets._

## Methods

### executeHypercertFractionStrategyWithTakerBid

```solidity
function executeHypercertFractionStrategyWithTakerBid(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

### executeHypercertFractionStrategyWithTakerBidWithAllowlist

```solidity
function executeHypercertFractionStrategyWithTakerBidWithAllowlist(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk) external view returns (uint256 price, uint256[] itemIds, uint256[] amounts, bool isNonceInvalidated)
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

## Errors

### AmountInvalid

```solidity
error AmountInvalid()
```

It is returned if the amount is invalid. For ERC721 and Hypercert, any number that is not 1. For ERC1155, if amount is 0.

### LengthsInvalid

```solidity
error LengthsInvalid()
```

It is returned if there is either a mismatch or an error in the length of the array(s).

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
