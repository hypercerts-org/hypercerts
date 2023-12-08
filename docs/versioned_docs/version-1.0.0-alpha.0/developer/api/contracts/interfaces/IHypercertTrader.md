# IHypercertTrader

_bitbeckers_

> Interface for hypercert token trading

This interface declares the required functionality to interact with the hypercert marketplace

## Methods

### batchBuyUnits

```solidity
function batchBuyUnits(address recipient, uint256[] offerIDs, uint256[] unitAmounts, address[] buyTokens, uint256[] tokenAmountsPerUnit) external payable
```

_Buys Hypercert tokens from multiple existing offers in a single transaction._

#### Parameters

| Name                | Type      | Description                                                          |
| ------------------- | --------- | -------------------------------------------------------------------- |
| recipient           | address   | The address that will receive the Hypercert tokens.                  |
| offerIDs            | uint256[] | The list of IDs of the offers to buy from.                           |
| unitAmounts         | uint256[] | The list of numbers of units to buy for each offer.                  |
| buyTokens           | address[] | The list of addresses of the tokens used for payment for each offer. |
| tokenAmountsPerUnit | uint256[] | The list of amounts of tokens to pay per unit for each offer.        |

### buyUnits

```solidity
function buyUnits(address recipient, uint256 offerID, uint256 unitAmount, address buyToken, uint256 tokenAmountPerUnit) external payable
```

_Buys Hypercert tokens from an existing offer._

#### Parameters

| Name               | Type    | Description                                         |
| ------------------ | ------- | --------------------------------------------------- |
| recipient          | address | The address that will receive the Hypercert tokens. |
| offerID            | uint256 | The ID of the offer to buy from.                    |
| unitAmount         | uint256 | The number of units to buy.                         |
| buyToken           | address | The address of the token used for payment.          |
| tokenAmountPerUnit | uint256 | The amount of tokens to pay per unit.               |

### cancelOffer

```solidity
function cancelOffer(uint256 offerID) external nonpayable
```

_Cancels an existing offer._

#### Parameters

| Name    | Type    | Description                    |
| ------- | ------- | ------------------------------ |
| offerID | uint256 | The ID of the offer to cancel. |

### createOffer

```solidity
function createOffer(address hypercertContract, uint256 fractionID, uint256 units, uint256 minUnitsPerTrade, uint256 maxUnitsPerTrade, IHypercertTrader.AcceptedToken[] acceptedTokens) external payable returns (uint256 offerID)
```

#### Parameters

| Name              | Type                             | Description |
| ----------------- | -------------------------------- | ----------- |
| hypercertContract | address                          | undefined   |
| fractionID        | uint256                          | undefined   |
| units             | uint256                          | undefined   |
| minUnitsPerTrade  | uint256                          | undefined   |
| maxUnitsPerTrade  | uint256                          | undefined   |
| acceptedTokens    | IHypercertTrader.AcceptedToken[] | undefined   |

#### Returns

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| offerID | uint256 | undefined   |

## Events

### OfferCancelled

```solidity
event OfferCancelled(address indexed creator, address indexed hypercertContract, uint256 indexed fractionID, uint256 offerID)
```

#### Parameters

| Name                        | Type    | Description |
| --------------------------- | ------- | ----------- |
| creator `indexed`           | address | undefined   |
| hypercertContract `indexed` | address | undefined   |
| fractionID `indexed`        | uint256 | undefined   |
| offerID                     | uint256 | undefined   |

### OfferCreated

```solidity
event OfferCreated(address indexed offerer, address indexed hypercertContract, uint256 indexed fractionID, uint256 offerID)
```

#### Parameters

| Name                        | Type    | Description |
| --------------------------- | ------- | ----------- |
| offerer `indexed`           | address | undefined   |
| hypercertContract `indexed` | address | undefined   |
| fractionID `indexed`        | uint256 | undefined   |
| offerID                     | uint256 | undefined   |

### Trade

```solidity
event Trade(address indexed seller, address indexed buyer, address indexed hypercertContract, uint256 fractionID, uint256 unitsBought, address buyToken, uint256 tokenAmountPerUnit, uint256 offerID)
```

#### Parameters

| Name                        | Type    | Description |
| --------------------------- | ------- | ----------- |
| seller `indexed`            | address | undefined   |
| buyer `indexed`             | address | undefined   |
| hypercertContract `indexed` | address | undefined   |
| fractionID                  | uint256 | undefined   |
| unitsBought                 | uint256 | undefined   |
| buyToken                    | address | undefined   |
| tokenAmountPerUnit          | uint256 | undefined   |
| offerID                     | uint256 | undefined   |
