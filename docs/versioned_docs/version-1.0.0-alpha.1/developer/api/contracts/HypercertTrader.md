# HypercertTrader

_bitbeckers_

> Contract for managing hypercert trades

Implementation of the HypercertTrader Interface

## Methods

### batchBuyUnits

```solidity
function batchBuyUnits(address recipient, uint256[] offerIDs, uint256[] unitAmounts, address[] buyTokens, uint256[] tokenAmountsPerUnit) external payable
```

This function allows a user to buy Hypercert tokens from multiple existing offers in a single transaction. The function takes in several arrays of parameters, including the IDs of the offers to buy from, the number of units to buy for each offer, the tokens used for payment for each offer, and the amounts of tokens to pay per unit for each offer. The function then executes the trades and transfers the Hypercert tokens to the specified recipient.

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

This function buys Hypercert tokens from an existing offer. The function verifies that the offer is valid and that the buyer has provided enough payment in the specified token. If the offer is for a fraction of a Hypercert token, the function splits the fraction and transfers the appropriate number of units to the buyer. If the offer is for a fixed number of units, the function transfers the units to the buyer. The function also transfers the payment to the offerer and emits a `Trade` event.

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

This function cancels an existing offer. The function verifies that the offer exists and that the caller is the offerer. The function sets the offer status to `Cancelled` and emits an `OfferCancelled` event.

_Cancels an existing offer._

#### Parameters

| Name    | Type    | Description                    |
| ------- | ------- | ------------------------------ |
| offerID | uint256 | The ID of the offer to cancel. |

### createOffer

```solidity
function createOffer(address hypercertContract, uint256 fractionID, uint256 unitsForSale, uint256 minUnitsPerTrade, uint256 maxUnitsPerTrade, IHypercertTrader.AcceptedToken[] acceptedTokens) external payable returns (uint256 offerID)
```

#### Parameters

| Name              | Type                             | Description |
| ----------------- | -------------------------------- | ----------- |
| hypercertContract | address                          | undefined   |
| fractionID        | uint256                          | undefined   |
| unitsForSale      | uint256                          | undefined   |
| minUnitsPerTrade  | uint256                          | undefined   |
| maxUnitsPerTrade  | uint256                          | undefined   |
| acceptedTokens    | IHypercertTrader.AcceptedToken[] | undefined   |

#### Returns

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| offerID | uint256 | undefined   |

### getOffer

```solidity
function getOffer(uint256 offerID) external view returns (struct IHypercertTrader.Offer)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| offerID | uint256 | undefined   |

#### Returns

| Name | Type                   | Description |
| ---- | ---------------------- | ----------- |
| \_0  | IHypercertTrader.Offer | undefined   |

### initialize

```solidity
function initialize() external nonpayable
```

_see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }_

### offers

```solidity
function offers(uint256) external view returns (address offerer, address hypercertContract, uint256 fractionID, uint256 unitsAvailable, uint256 minUnitsPerTrade, uint256 maxUnitsPerTrade, enum IHypercertTrader.OfferType offerType, enum IHypercertTrader.OfferStatus status)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name              | Type                              | Description |
| ----------------- | --------------------------------- | ----------- |
| offerer           | address                           | undefined   |
| hypercertContract | address                           | undefined   |
| fractionID        | uint256                           | undefined   |
| unitsAvailable    | uint256                           | undefined   |
| minUnitsPerTrade  | uint256                           | undefined   |
| maxUnitsPerTrade  | uint256                           | undefined   |
| offerType         | enum IHypercertTrader.OfferType   | undefined   |
| status            | enum IHypercertTrader.OfferStatus | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

_Returns the address of the current owner._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### pause

```solidity
function pause() external nonpayable
```

PAUSABLE

### paused

```solidity
function paused() external view returns (bool)
```

_Returns true if the contract is paused, and false otherwise._

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### proxiableUUID

```solidity
function proxiableUUID() external view returns (bytes32)
```

_Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the implementation. It is used to validate the implementation&#39;s compatibility when performing an upgrade. IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```

_Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner._

### totalUnitsForSale

```solidity
function totalUnitsForSale(address, uint256) external view returns (uint256)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

_Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### unpause

```solidity
function unpause() external nonpayable
```

### upgradeTo

```solidity
function upgradeTo(address newImplementation) external nonpayable
```

_Upgrade the implementation of the proxy to `newImplementation`. Calls {\_authorizeUpgrade}. Emits an {Upgraded} event._

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| newImplementation | address | undefined   |

### upgradeToAndCall

```solidity
function upgradeToAndCall(address newImplementation, bytes data) external payable
```

_Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. Calls {\_authorizeUpgrade}. Emits an {Upgraded} event._

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| newImplementation | address | undefined   |
| data              | bytes   | undefined   |

## Events

### AdminChanged

```solidity
event AdminChanged(address previousAdmin, address newAdmin)
```

#### Parameters

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| previousAdmin | address | undefined   |
| newAdmin      | address | undefined   |

### BeaconUpgraded

```solidity
event BeaconUpgraded(address indexed beacon)
```

#### Parameters

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| beacon `indexed` | address | undefined   |

### Initialized

```solidity
event Initialized(uint8 version)
```

#### Parameters

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| version | uint8 | undefined   |

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

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

### Paused

```solidity
event Paused(address account)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |

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

### Unpaused

```solidity
event Unpaused(address account)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

#### Parameters

| Name                     | Type    | Description |
| ------------------------ | ------- | ----------- |
| implementation `indexed` | address | undefined   |

## Errors

### InvalidBuy

```solidity
error InvalidBuy(string)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### InvalidOffer

```solidity
error InvalidOffer(string)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### NotAllowed

```solidity
error NotAllowed()
```
