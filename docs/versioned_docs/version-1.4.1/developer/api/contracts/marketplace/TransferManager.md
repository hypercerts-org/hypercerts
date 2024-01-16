# TransferManager

_LooksRare protocol team (👀,💎); bitbeckers_

> TransferManager

This contract provides the transfer functions for ERC721/ERC1155/Hypercert for contracts that require them. Collection type &quot;0&quot; refers to ERC721 transfer functions. Collection type &quot;1&quot; refers to ERC1155 transfer functions. Collection type &quot;2&quot; refers to Hypercert transfer functions.

_&quot;Safe&quot; transfer functions for ERC721 are not implemented since they come with added gas costs to verify if the recipient is a contract as it requires verifying the receiver interface is valid._

## Methods

### allowOperator

```solidity
function allowOperator(address operator) external nonpayable
```

This function allows an operator to be added for the shared transfer system. Once the operator is allowed, users can grant NFT approvals to this operator.

_Only callable by owner._

#### Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| operator | address | Operator address to allow |

### cancelOwnershipTransfer

```solidity
function cancelOwnershipTransfer() external nonpayable
```

This function is used to cancel the ownership transfer.

_This function can be used for both cancelling a transfer to a new owner and cancelling the renouncement of the ownership._

### confirmOwnershipRenouncement

```solidity
function confirmOwnershipRenouncement() external nonpayable
```

This function is used to confirm the ownership renouncement.

### confirmOwnershipTransfer

```solidity
function confirmOwnershipTransfer() external nonpayable
```

This function is used to confirm the ownership transfer.

_This function can only be called by the current potential owner._

### grantApprovals

```solidity
function grantApprovals(address[] operators) external nonpayable
```

This function allows a user to grant approvals for an array of operators. Users cannot grant approvals if the operator is not allowed by this contract&#39;s owner.

_Each operator address must be globally allowed to be approved._

#### Parameters

| Name      | Type      | Description                 |
| --------- | --------- | --------------------------- |
| operators | address[] | Array of operator addresses |

### hasUserApprovedOperator

```solidity
function hasUserApprovedOperator(address, address) external view returns (bool)
```

This returns whether the user has approved the operator address. The first address is the user and the second address is the operator (e.g. LooksRareProtocol).

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |
| \_1  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### initiateOwnershipRenouncement

```solidity
function initiateOwnershipRenouncement() external nonpayable
```

This function is used to initiate the ownership renouncement.

### initiateOwnershipTransfer

```solidity
function initiateOwnershipTransfer(address newPotentialOwner) external nonpayable
```

This function is used to initiate the transfer of ownership to a new owner.

#### Parameters

| Name              | Type    | Description                 |
| ----------------- | ------- | --------------------------- |
| newPotentialOwner | address | New potential owner address |

### isOperatorAllowed

```solidity
function isOperatorAllowed(address) external view returns (bool)
```

This returns whether the operator address is allowed by this contract&#39;s owner.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

Address of the current owner.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### ownershipStatus

```solidity
function ownershipStatus() external view returns (enum IOwnableTwoSteps.Status)
```

Ownership status.

#### Returns

| Name | Type                         | Description |
| ---- | ---------------------------- | ----------- |
| \_0  | enum IOwnableTwoSteps.Status | undefined   |

### potentialOwner

```solidity
function potentialOwner() external view returns (address)
```

Address of the potential owner.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### removeOperator

```solidity
function removeOperator(address operator) external nonpayable
```

This function allows the user to remove an operator for the shared transfer system.

_Only callable by owner._

#### Parameters

| Name     | Type    | Description                |
| -------- | ------- | -------------------------- |
| operator | address | Operator address to remove |

### revokeApprovals

```solidity
function revokeApprovals(address[] operators) external nonpayable
```

This function allows a user to revoke existing approvals for an array of operators.

_Each operator address must be approved at the user level to be revoked._

#### Parameters

| Name      | Type      | Description                 |
| --------- | --------- | --------------------------- |
| operators | address[] | Array of operator addresses |

### splitItemsHypercert

```solidity
function splitItemsHypercert(address collection, address from, address to, uint256[] itemIds, uint256[] amounts) external nonpayable
```

This function splits and transfers a fraction of a hypercert.

_It does not allow batch transferring._

#### Parameters

| Name       | Type      | Description        |
| ---------- | --------- | ------------------ |
| collection | address   | Collection address |
| from       | address   | Sender address     |
| to         | address   | Recipient address  |
| itemIds    | uint256[] | Array of itemIds   |
| amounts    | uint256[] | Array of amounts   |

### transferBatchItemsAcrossCollections

```solidity
function transferBatchItemsAcrossCollections(ITransferManager.BatchTransferItem[] items, address from, address to) external nonpayable
```

#### Parameters

| Name  | Type                                 | Description |
| ----- | ------------------------------------ | ----------- |
| items | ITransferManager.BatchTransferItem[] | undefined   |
| from  | address                              | undefined   |
| to    | address                              | undefined   |

### transferItemsERC1155

```solidity
function transferItemsERC1155(address collection, address from, address to, uint256[] itemIds, uint256[] amounts) external nonpayable
```

This function transfers items for a single ERC1155 collection.

_It does not allow batch transferring if from = msg.sender since native function should be used._

#### Parameters

| Name       | Type      | Description        |
| ---------- | --------- | ------------------ |
| collection | address   | Collection address |
| from       | address   | Sender address     |
| to         | address   | Recipient address  |
| itemIds    | uint256[] | Array of itemIds   |
| amounts    | uint256[] | Array of amounts   |

### transferItemsERC721

```solidity
function transferItemsERC721(address collection, address from, address to, uint256[] itemIds, uint256[] amounts) external nonpayable
```

This function transfers items for a single ERC721 collection.

#### Parameters

| Name       | Type      | Description        |
| ---------- | --------- | ------------------ |
| collection | address   | Collection address |
| from       | address   | Sender address     |
| to         | address   | Recipient address  |
| itemIds    | uint256[] | Array of itemIds   |
| amounts    | uint256[] | Array of amounts   |

### transferItemsHypercert

```solidity
function transferItemsHypercert(address collection, address from, address to, uint256[] itemIds, uint256[] amounts) external nonpayable
```

This function transfers items for a single Hypercert.

_It does not allow batch transferring if from = msg.sender since native function should be used._

#### Parameters

| Name       | Type      | Description        |
| ---------- | --------- | ------------------ |
| collection | address   | Collection address |
| from       | address   | Sender address     |
| to         | address   | Recipient address  |
| itemIds    | uint256[] | Array of itemIds   |
| amounts    | uint256[] | Array of amounts   |

## Events

### ApprovalsGranted

```solidity
event ApprovalsGranted(address user, address[] operators)
```

It is emitted if operators&#39; approvals to transfer NFTs are granted by a user.

#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| user      | address   | undefined   |
| operators | address[] | undefined   |

### ApprovalsRemoved

```solidity
event ApprovalsRemoved(address user, address[] operators)
```

It is emitted if operators&#39; approvals to transfer NFTs are revoked by a user.

#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| user      | address   | undefined   |
| operators | address[] | undefined   |

### CancelOwnershipTransfer

```solidity
event CancelOwnershipTransfer()
```

This is emitted if the ownership transfer is cancelled.

### InitiateOwnershipRenouncement

```solidity
event InitiateOwnershipRenouncement()
```

This is emitted if the ownership renouncement is initiated.

### InitiateOwnershipTransfer

```solidity
event InitiateOwnershipTransfer(address previousOwner, address potentialOwner)
```

This is emitted if the ownership transfer is initiated.

#### Parameters

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| previousOwner  | address | undefined   |
| potentialOwner | address | undefined   |

### NewOwner

```solidity
event NewOwner(address newOwner)
```

This is emitted when there is a new owner.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### OperatorAllowed

```solidity
event OperatorAllowed(address operator)
```

It is emitted if a new operator is added to the global allowlist.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| operator | address | undefined   |

### OperatorRemoved

```solidity
event OperatorRemoved(address operator)
```

It is emitted if an operator is removed from the global allowlist.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| operator | address | undefined   |

## Errors

### AmountInvalid

```solidity
error AmountInvalid()
```

It is returned if the amount is invalid. For ERC721 and Hypercert, any number that is not 1. For ERC1155, if amount is 0.

### ERC1155SafeBatchTransferFromFail

```solidity
error ERC1155SafeBatchTransferFromFail()
```

It is emitted if the ERC1155 safeBatchTransferFrom fails.

### ERC1155SafeTransferFromFail

```solidity
error ERC1155SafeTransferFromFail()
```

It is emitted if the ERC1155 safeTransferFrom fails.

### ERC721TransferFromFail

```solidity
error ERC721TransferFromFail()
```

It is emitted if the ERC721 transferFrom fails.

### HypercertSplitFractionError

```solidity
error HypercertSplitFractionError()
```

### LengthsInvalid

```solidity
error LengthsInvalid()
```

It is returned if there is either a mismatch or an error in the length of the array(s).

### NoOngoingTransferInProgress

```solidity
error NoOngoingTransferInProgress()
```

This is returned when there is no transfer of ownership in progress.

### NotAContract

```solidity
error NotAContract()
```

It is emitted if the call recipient is not a contract.

### NotOwner

```solidity
error NotOwner()
```

This is returned when the caller is not the owner.

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

### RenouncementNotInProgress

```solidity
error RenouncementNotInProgress()
```

This is returned when there is no renouncement in progress but the owner tries to validate the ownership renouncement.

### TransferAlreadyInProgress

```solidity
error TransferAlreadyInProgress()
```

This is returned when the transfer is already in progress but the owner tries initiate a new ownership transfer.

### TransferCallerInvalid

```solidity
error TransferCallerInvalid()
```

It is returned if the transfer caller is invalid. For a transfer called to be valid, the operator must be in the global allowlist and approved by the &#39;from&#39; user.

### TransferNotInProgress

```solidity
error TransferNotInProgress()
```

This is returned when there is no ownership transfer in progress but the ownership change tries to be approved.

### WrongPotentialOwner

```solidity
error WrongPotentialOwner()
```

This is returned when the ownership transfer is attempted to be validated by the a caller that is not the potential owner.
