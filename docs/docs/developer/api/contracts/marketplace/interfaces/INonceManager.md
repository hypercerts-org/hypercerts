# INonceManager

_LooksRare protocol team (👀,💎)_

> INonceManager

## Events

### NewBidAskNonces

```solidity
event NewBidAskNonces(address user, uint256 bidNonce, uint256 askNonce)
```

It is emitted when there is an update of the global bid/ask nonces for a user.

#### Parameters

| Name     | Type    | Description         |
| -------- | ------- | ------------------- |
| user     | address | Address of the user |
| bidNonce | uint256 | New bid nonce       |
| askNonce | uint256 | New ask nonce       |

### OrderNoncesCancelled

```solidity
event OrderNoncesCancelled(address user, uint256[] orderNonces)
```

It is emitted when order nonces are cancelled for a user.

#### Parameters

| Name        | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| user        | address   | Address of the user             |
| orderNonces | uint256[] | Array of order nonces cancelled |

### SubsetNoncesCancelled

```solidity
event SubsetNoncesCancelled(address user, uint256[] subsetNonces)
```

It is emitted when subset nonces are cancelled for a user.

#### Parameters

| Name         | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| user         | address   | Address of the user              |
| subsetNonces | uint256[] | Array of subset nonces cancelled |
