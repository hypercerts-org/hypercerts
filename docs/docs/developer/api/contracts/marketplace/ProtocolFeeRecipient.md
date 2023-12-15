# ProtocolFeeRecipient

_LooksRare protocol team (👀,💎)_

> ProtocolFeeRecipient

This contract is used to receive protocol fees and transfer them to the fee sharing setter. Fee sharing setter cannot receive ETH directly, so we need to use this contract as a middleman to convert ETH into WETH before sending it.

## Methods

### FEE_SHARING_SETTER

```solidity
function FEE_SHARING_SETTER() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### WETH

```solidity
function WETH() external view returns (contract IWETH)
```

#### Returns

| Name | Type           | Description |
| ---- | -------------- | ----------- |
| \_0  | contract IWETH | undefined   |

### transferERC20

```solidity
function transferERC20(address currency) external nonpayable
```

#### Parameters

| Name     | Type    | Description            |
| -------- | ------- | ---------------------- |
| currency | address | ERC20 currency address |

### transferETH

```solidity
function transferETH() external nonpayable
```

## Errors

### ERC20TransferFail

```solidity
error ERC20TransferFail()
```

It is emitted if the ERC20 transfer fails.

### NotAContract

```solidity
error NotAContract()
```

It is emitted if the call recipient is not a contract.

### NothingToTransfer

```solidity
error NothingToTransfer()
```
