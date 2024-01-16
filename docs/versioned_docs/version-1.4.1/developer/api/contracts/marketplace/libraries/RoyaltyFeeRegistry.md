# RoyaltyFeeRegistry

> RoyaltyFeeRegistry

It is a royalty fee registry for the LooksRare exchange.

## Methods

### owner

```solidity
function owner() external view returns (address)
```

_Returns the address of the current owner._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```

_Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner._

### royaltyFeeInfoCollection

```solidity
function royaltyFeeInfoCollection(address collection) external view returns (address, address, uint256)
```

View royalty info for a collection address

#### Parameters

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| collection | address | collection address |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | address | undefined   |
| \_2  | uint256 | undefined   |

### royaltyFeeLimit

```solidity
function royaltyFeeLimit() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### royaltyInfo

```solidity
function royaltyInfo(address collection, uint256 amount) external view returns (address, uint256)
```

Calculate royalty info for a collection address and a sale gross amount

#### Parameters

| Name       | Type    | Description        |
| ---------- | ------- | ------------------ |
| collection | address | collection address |
| amount     | uint256 | amount             |

#### Returns

| Name | Type    | Description                                               |
| ---- | ------- | --------------------------------------------------------- |
| \_0  | address | receiver address and amount received by royalty recipient |
| \_1  | uint256 | undefined                                                 |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

_Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### updateRoyaltyFeeLimit

```solidity
function updateRoyaltyFeeLimit(uint256 _royaltyFeeLimit) external nonpayable
```

Update royalty info for collection

#### Parameters

| Name              | Type    | Description                                   |
| ----------------- | ------- | --------------------------------------------- |
| \_royaltyFeeLimit | uint256 | new royalty fee limit (500 = 5%, 1,000 = 10%) |

### updateRoyaltyInfoForCollection

```solidity
function updateRoyaltyInfoForCollection(address collection, address setter, address receiver, uint256 fee) external nonpayable
```

Update royalty info for collection

#### Parameters

| Name       | Type    | Description                    |
| ---------- | ------- | ------------------------------ |
| collection | address | address of the NFT contract    |
| setter     | address | address that sets the receiver |
| receiver   | address | receiver for the royalty fee   |
| fee        | uint256 | fee (500 = 5%, 1,000 = 10%)    |

## Events

### NewRoyaltyFeeLimit

```solidity
event NewRoyaltyFeeLimit(uint256 royaltyFeeLimit)
```

#### Parameters

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| royaltyFeeLimit | uint256 | undefined   |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

### RoyaltyFeeUpdate

```solidity
event RoyaltyFeeUpdate(address indexed collection, address indexed setter, address indexed receiver, uint256 fee)
```

#### Parameters

| Name                 | Type    | Description |
| -------------------- | ------- | ----------- |
| collection `indexed` | address | undefined   |
| setter `indexed`     | address | undefined   |
| receiver `indexed`   | address | undefined   |
| fee                  | uint256 | undefined   |
