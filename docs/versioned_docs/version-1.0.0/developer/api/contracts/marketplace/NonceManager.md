# NonceManager

_LooksRare protocol team (👀,💎)_

> NonceManager

This contract handles the nonce logic that is used for invalidating maker orders that exist off-chain. The nonce logic revolves around three parts at the user level: - order nonce (orders sharing an order nonce are conditional, OCO-like) - subset (orders can be grouped under a same subset) - bid/ask (all orders can be executed only if the bid/ask nonce matches the user&#39;s one on-chain) Only the order nonce is invalidated at the time of the execution of a maker order that contains it.

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

### LengthsInvalid

```solidity
error LengthsInvalid()
```

It is returned if there is either a mismatch or an error in the length of the array(s).
