# ITransferManager

_LooksRare protocol team (👀,💎)_

> ITransferManager

## Events

### ApprovalsGranted

```solidity
event ApprovalsGranted(address user, address[] operators)
```

It is emitted if operators&#39; approvals to transfer NFTs are granted by a user.

#### Parameters

| Name      | Type      | Description                 |
| --------- | --------- | --------------------------- |
| user      | address   | Address of the user         |
| operators | address[] | Array of operator addresses |

### ApprovalsRemoved

```solidity
event ApprovalsRemoved(address user, address[] operators)
```

It is emitted if operators&#39; approvals to transfer NFTs are revoked by a user.

#### Parameters

| Name      | Type      | Description                 |
| --------- | --------- | --------------------------- |
| user      | address   | Address of the user         |
| operators | address[] | Array of operator addresses |

### OperatorAllowed

```solidity
event OperatorAllowed(address operator)
```

It is emitted if a new operator is added to the global allowlist.

#### Parameters

| Name     | Type    | Description      |
| -------- | ------- | ---------------- |
| operator | address | Operator address |

### OperatorRemoved

```solidity
event OperatorRemoved(address operator)
```

It is emitted if an operator is removed from the global allowlist.

#### Parameters

| Name     | Type    | Description      |
| -------- | ------- | ---------------- |
| operator | address | Operator address |

## Errors

### OperatorAlreadyAllowed

```solidity
error OperatorAlreadyAllowed()
```

It is returned if the transfer caller is already allowed by the owner.

_This error can only be returned for owner operations._

### OperatorAlreadyApprovedByUser

```solidity
error OperatorAlreadyApprovedByUser()
```

It is returned if the operator to approve has already been approved by the user.

### OperatorNotAllowed

```solidity
error OperatorNotAllowed()
```

It is returned if the operator to approve is not in the global allowlist defined by the owner.

_This error can be returned if the user tries to grant approval to an operator address not in the allowlist or if the owner tries to remove the operator from the global allowlist._

### OperatorNotApprovedByUser

```solidity
error OperatorNotApprovedByUser()
```

It is returned if the operator to revoke has not been previously approved by the user.

### TransferCallerInvalid

```solidity
error TransferCallerInvalid()
```

It is returned if the transfer caller is invalid. For a transfer called to be valid, the operator must be in the global allowlist and approved by the &#39;from&#39; user.
