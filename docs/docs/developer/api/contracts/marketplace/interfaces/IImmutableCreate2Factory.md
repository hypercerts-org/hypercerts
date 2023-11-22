# IImmutableCreate2Factory

## Methods

### findCreate2Address

```solidity
function findCreate2Address(bytes32 salt, bytes initializationCode) external view returns (address deploymentAddress)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| salt               | bytes32 | undefined   |
| initializationCode | bytes   | undefined   |

#### Returns

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| deploymentAddress | address | undefined   |

### safeCreate2

```solidity
function safeCreate2(bytes32 salt, bytes initializationCode) external payable returns (address deploymentAddress)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| salt               | bytes32 | undefined   |
| initializationCode | bytes   | undefined   |

#### Returns

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| deploymentAddress | address | undefined   |
