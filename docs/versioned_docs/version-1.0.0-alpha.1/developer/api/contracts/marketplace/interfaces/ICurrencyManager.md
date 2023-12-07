# ICurrencyManager

_LooksRare protocol team (👀,💎)_

> ICurrencyManager

## Events

### CurrencyStatusUpdated

```solidity
event CurrencyStatusUpdated(address currency, bool isAllowed)
```

It is emitted if the currency status in the allowlist is updated.

#### Parameters

| Name      | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| currency  | address | Currency address (address(0) = ETH) |
| isAllowed | bool    | Whether the currency is allowed     |
