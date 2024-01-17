# LooksRareProtocol

_LooksRare protocol team (👀,💎); bitbeckers_

> LooksRareProtocol

This contract is the core smart contract of the LooksRare protocol (&quot;v2&quot;). It is the main entry point for users to initiate transactions with taker orders and manage the cancellation of maker orders, which exist off-chain. ~~~~~~ ~~~~ ~~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~~~~~~~ ~~~ ~~~ ~~~~~~~~~ ~~~ ~~~~~~~~~ ~~~~ ~~~~ ~~~~~~~~~ ~~~ ~~~ ~~~~~~~ ~~~~~~~ ~~~ ~~~- ~~~~~~~~ ~~~~ ~~~ ~~~~ ~~~~ ~~~ ~~~ ~~~~~~~~~~~~ ~~~~~~~~~~~~ ~~~ ~~~ ~~~~~~~~~~~ ~~~~~~~~~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~~~~~~~~ ~~~ ~~~ ~~~~~ ~~~ ~~~~~~ ~~~~~~ ~~~ ~~~~~ ~~~~~~~ ~~~ ~~~ ~~~ ~~~ ~~~~~~~ ~~~~~~ ~~~~ ~~~ ~~~ ~~~~ ~~~~~~ ~~~~ ~~~ ~~~ ~~~ ~~~ ~~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~~ ~~~ ~~~ ~~~ ~~~ ~~~~ ~~~~~~ ~~~~ ~~~ ~~~ ~~~~~ ~~~~~~ ~~~~~~~ ~~~ ~~~ ~~~ ~~~ ~~~~~~~ ~~~~~ ~~~ ~~~~~~ ~~~~~~ ~~~ ~~~~~ ~~~ ~~~ ~~~~~~~~~~ ~~~ ~~~ ~~ ~~~ ~~~ ~~~ ~~~ ~~~~~~~~~~~ ~~~~~~~~~~~ ~~~ ~~~ ~~~~~~~~~~~~ ~~~~~~~~~~~~ ~~~ ~~~ ~~~~ ~~~~ ~~~ ~~~~ ~~~~~~~~ ~~~~ ~~~ ~~~~~~~ ~~~~~~~ ~~~ ~~~ ~~~~~~~~ ~~~~ ~~~~ ~~~~~~~~ ~~~ ~~~~~~~~~ ~~~ ~~~ ~~~~~~~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~~ ~~~~ ~~~~~~

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

### WETH

```solidity
function WETH() external view returns (address)
```

Wrapped ETH.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### \_getUnitsHeldByHypercertFractions

```solidity
function _getUnitsHeldByHypercertFractions(address collection, uint256[] itemIds) external view returns (uint256 unitsHeldByItems)
```

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| collection | address   | undefined   |
| itemIds    | uint256[] | undefined   |

#### Returns

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| unitsHeldByItems | uint256 | undefined   |

### addStrategy

```solidity
function addStrategy(uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation) external nonpayable
```

This function allows the owner to add a new execution strategy to the protocol.

_Strategies have an id that is incremental. Only callable by owner._

#### Parameters

| Name                  | Type    | Description                                    |
| --------------------- | ------- | ---------------------------------------------- |
| standardProtocolFeeBp | uint16  | Standard protocol fee (in basis point)         |
| minTotalFeeBp         | uint16  | Minimum total fee (in basis point)             |
| maxProtocolFeeBp      | uint16  | Maximum protocol fee (in basis point)          |
| selector              | bytes4  | Function selector for the strategy             |
| isMakerBid            | bool    | Whether the function selector is for maker bid |
| implementation        | address | Implementation address                         |

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

### cancelOwnershipTransfer

```solidity
function cancelOwnershipTransfer() external nonpayable
```

This function is used to cancel the ownership transfer.

_This function can be used for both cancelling a transfer to a new owner and cancelling the renouncement of the ownership._

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

### chainId

```solidity
function chainId() external view returns (uint256)
```

Current chainId.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

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

### creatorFeeManager

```solidity
function creatorFeeManager() external view returns (contract ICreatorFeeManager)
```

Creator fee manager.

#### Returns

| Name | Type                        | Description |
| ---- | --------------------------- | ----------- |
| \_0  | contract ICreatorFeeManager | undefined   |

### domainSeparator

```solidity
function domainSeparator() external view returns (bytes32)
```

Current domain separator.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### executeMultipleTakerBids

```solidity
function executeMultipleTakerBids(OrderStructs.Taker[] takerBids, OrderStructs.Maker[] makerAsks, bytes[] makerSignatures, OrderStructs.MerkleTree[] merkleTrees, bool isAtomic) external payable
```

#### Parameters

| Name            | Type                      | Description |
| --------------- | ------------------------- | ----------- |
| takerBids       | OrderStructs.Taker[]      | undefined   |
| makerAsks       | OrderStructs.Maker[]      | undefined   |
| makerSignatures | bytes[]                   | undefined   |
| merkleTrees     | OrderStructs.MerkleTree[] | undefined   |
| isAtomic        | bool                      | undefined   |

### executeTakerAsk

```solidity
function executeTakerAsk(OrderStructs.Taker takerAsk, OrderStructs.Maker makerBid, bytes makerSignature, OrderStructs.MerkleTree merkleTree) external nonpayable
```

#### Parameters

| Name           | Type                    | Description |
| -------------- | ----------------------- | ----------- |
| takerAsk       | OrderStructs.Taker      | undefined   |
| makerBid       | OrderStructs.Maker      | undefined   |
| makerSignature | bytes                   | undefined   |
| merkleTree     | OrderStructs.MerkleTree | undefined   |

### executeTakerBid

```solidity
function executeTakerBid(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk, bytes makerSignature, OrderStructs.MerkleTree merkleTree) external payable
```

#### Parameters

| Name           | Type                    | Description |
| -------------- | ----------------------- | ----------- |
| takerBid       | OrderStructs.Taker      | undefined   |
| makerAsk       | OrderStructs.Maker      | undefined   |
| makerSignature | bytes                   | undefined   |
| merkleTree     | OrderStructs.MerkleTree | undefined   |

### hashBatchOrder

```solidity
function hashBatchOrder(bytes32 root, uint256 proofLength) external pure returns (bytes32 batchOrderHash)
```

This function returns the hash of the concatenation of batch order type hash and merkle root.

#### Parameters

| Name        | Type    | Description         |
| ----------- | ------- | ------------------- |
| root        | bytes32 | Merkle root         |
| proofLength | uint256 | Merkle proof length |

#### Returns

| Name           | Type    | Description          |
| -------------- | ------- | -------------------- |
| batchOrderHash | bytes32 | The batch order hash |

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

### isCurrencyAllowed

```solidity
function isCurrencyAllowed(address) external view returns (bool)
```

It checks whether the currency is allowed for transacting.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### maxCreatorFeeBp

```solidity
function maxCreatorFeeBp() external view returns (uint16)
```

Maximum creator fee (in basis point).

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | uint16 | undefined   |

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

### protocolFeeRecipient

```solidity
function protocolFeeRecipient() external view returns (address)
```

Protocol fee recipient.

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### restrictedExecuteTakerBid

```solidity
function restrictedExecuteTakerBid(OrderStructs.Taker takerBid, OrderStructs.Maker makerAsk, address sender, bytes32 orderHash) external nonpayable returns (uint256 protocolFeeAmount)
```

#### Parameters

| Name      | Type               | Description |
| --------- | ------------------ | ----------- |
| takerBid  | OrderStructs.Taker | undefined   |
| makerAsk  | OrderStructs.Maker | undefined   |
| sender    | address            | undefined   |
| orderHash | bytes32            | undefined   |

#### Returns

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| protocolFeeAmount | uint256 | undefined   |

### strategyInfo

```solidity
function strategyInfo(uint256) external view returns (bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation)
```

This returns the strategy information for a strategy id.

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| isActive              | bool    | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |
| maxProtocolFeeBp      | uint16  | undefined   |
| selector              | bytes4  | undefined   |
| isMakerBid            | bool    | undefined   |
| implementation        | address | undefined   |

### transferManager

```solidity
function transferManager() external view returns (contract TransferManager)
```

Transfer manager for ERC721, ERC1155 and Hypercerts.

#### Returns

| Name | Type                     | Description |
| ---- | ------------------------ | ----------- |
| \_0  | contract TransferManager | undefined   |

### updateCreatorFeeManager

```solidity
function updateCreatorFeeManager(address newCreatorFeeManager) external nonpayable
```

This function allows the owner to update the creator fee manager address.

_Only callable by owner._

#### Parameters

| Name                 | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| newCreatorFeeManager | address | Address of the creator fee manager |

### updateCurrencyStatus

```solidity
function updateCurrencyStatus(address currency, bool isAllowed) external nonpayable
```

This function allows the owner to update the status of a currency.

_Only callable by owner._

#### Parameters

| Name      | Type    | Description                                        |
| --------- | ------- | -------------------------------------------------- |
| currency  | address | Currency address (address(0) for ETH)              |
| isAllowed | bool    | Whether the currency should be allowed for trading |

### updateDomainSeparator

```solidity
function updateDomainSeparator() external nonpayable
```

This function allows the owner to update the domain separator (if possible).

_Only callable by owner. If there is a fork of the network with a new chainId, it allows the owner to reset the domain separator for the new chain id._

### updateETHGasLimitForTransfer

```solidity
function updateETHGasLimitForTransfer(uint256 newGasLimitETHTransfer) external nonpayable
```

This function allows the owner to update the maximum ETH gas limit for a standard transfer.

_Only callable by owner._

#### Parameters

| Name                   | Type    | Description                    |
| ---------------------- | ------- | ------------------------------ |
| newGasLimitETHTransfer | uint256 | New gas limit for ETH transfer |

### updateMaxCreatorFeeBp

```solidity
function updateMaxCreatorFeeBp(uint16 newMaxCreatorFeeBp) external nonpayable
```

This function allows the owner to update the maximum creator fee (in basis point).

_The maximum value that can be set is 25%. Only callable by owner._

#### Parameters

| Name               | Type   | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| newMaxCreatorFeeBp | uint16 | New maximum creator fee (in basis point) |

### updateProtocolFeeRecipient

```solidity
function updateProtocolFeeRecipient(address newProtocolFeeRecipient) external nonpayable
```

This function allows the owner to update the protocol fee recipient.

_Only callable by owner._

#### Parameters

| Name                    | Type    | Description                        |
| ----------------------- | ------- | ---------------------------------- |
| newProtocolFeeRecipient | address | New protocol fee recipient address |

### updateStrategy

```solidity
function updateStrategy(uint256 strategyId, bool isActive, uint16 newStandardProtocolFee, uint16 newMinTotalFee) external nonpayable
```

This function allows the owner to update parameters for an existing execution strategy.

_Only callable by owner._

#### Parameters

| Name                   | Type    | Description                                |
| ---------------------- | ------- | ------------------------------------------ |
| strategyId             | uint256 | Strategy id                                |
| isActive               | bool    | Whether the strategy must be active        |
| newStandardProtocolFee | uint16  | New standard protocol fee (in basis point) |
| newMinTotalFee         | uint16  | New minimum total fee (in basis point)     |

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

### CancelOwnershipTransfer

```solidity
event CancelOwnershipTransfer()
```

This is emitted if the ownership transfer is cancelled.

### CurrencyStatusUpdated

```solidity
event CurrencyStatusUpdated(address currency, bool isAllowed)
```

It is emitted if the currency status in the allowlist is updated.

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| currency  | address | undefined   |
| isAllowed | bool    | undefined   |

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

### NewCreatorFeeManager

```solidity
event NewCreatorFeeManager(address creatorFeeManager)
```

It is issued when there is a new creator fee manager.

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| creatorFeeManager | address | undefined   |

### NewDomainSeparator

```solidity
event NewDomainSeparator()
```

It is emitted if there is a change in the domain separator.

### NewGasLimitETHTransfer

```solidity
event NewGasLimitETHTransfer(uint256 gasLimitETHTransfer)
```

It is emitted when there is a new gas limit for a ETH transfer (before it is wrapped to WETH).

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| gasLimitETHTransfer | uint256 | undefined   |

### NewMaxCreatorFeeBp

```solidity
event NewMaxCreatorFeeBp(uint256 maxCreatorFeeBp)
```

It is issued when there is a new maximum creator fee (in basis point).

#### Parameters

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| maxCreatorFeeBp | uint256 | undefined   |

### NewOwner

```solidity
event NewOwner(address newOwner)
```

This is emitted when there is a new owner.

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### NewProtocolFeeRecipient

```solidity
event NewProtocolFeeRecipient(address protocolFeeRecipient)
```

It is issued when there is a new protocol fee recipient address.

#### Parameters

| Name                 | Type    | Description |
| -------------------- | ------- | ----------- |
| protocolFeeRecipient | address | undefined   |

### NewStrategy

```solidity
event NewStrategy(uint256 strategyId, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp, uint16 maxProtocolFeeBp, bytes4 selector, bool isMakerBid, address implementation)
```

It is emitted when a new strategy is added.

#### Parameters

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| strategyId            | uint256 | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |
| maxProtocolFeeBp      | uint16  | undefined   |
| selector              | bytes4  | undefined   |
| isMakerBid            | bool    | undefined   |
| implementation        | address | undefined   |

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

### StrategyUpdated

```solidity
event StrategyUpdated(uint256 strategyId, bool isActive, uint16 standardProtocolFeeBp, uint16 minTotalFeeBp)
```

It is emitted when an existing strategy is updated.

#### Parameters

| Name                  | Type    | Description |
| --------------------- | ------- | ----------- |
| strategyId            | uint256 | undefined   |
| isActive              | bool    | undefined   |
| standardProtocolFeeBp | uint16  | undefined   |
| minTotalFeeBp         | uint16  | undefined   |

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

### TakerAsk

```solidity
event TakerAsk(ILooksRareProtocol.NonceInvalidationParameters nonceInvalidationParameters, address askUser, address bidUser, uint256 strategyId, address currency, address collection, uint256[] itemIds, uint256[] amounts, address[2] feeRecipients, uint256[3] feeAmounts)
```

It is emitted when a taker ask transaction is completed.

#### Parameters

| Name                        | Type                                           | Description |
| --------------------------- | ---------------------------------------------- | ----------- |
| nonceInvalidationParameters | ILooksRareProtocol.NonceInvalidationParameters | undefined   |
| askUser                     | address                                        | undefined   |
| bidUser                     | address                                        | undefined   |
| strategyId                  | uint256                                        | undefined   |
| currency                    | address                                        | undefined   |
| collection                  | address                                        | undefined   |
| itemIds                     | uint256[]                                      | undefined   |
| amounts                     | uint256[]                                      | undefined   |
| feeRecipients               | address[2]                                     | undefined   |
| feeAmounts                  | uint256[3]                                     | undefined   |

### TakerBid

```solidity
event TakerBid(ILooksRareProtocol.NonceInvalidationParameters nonceInvalidationParameters, address bidUser, address bidRecipient, uint256 strategyId, address currency, address collection, uint256[] itemIds, uint256[] amounts, address[2] feeRecipients, uint256[3] feeAmounts)
```

It is emitted when a taker bid transaction is completed.

#### Parameters

| Name                        | Type                                           | Description |
| --------------------------- | ---------------------------------------------- | ----------- |
| nonceInvalidationParameters | ILooksRareProtocol.NonceInvalidationParameters | undefined   |
| bidUser                     | address                                        | undefined   |
| bidRecipient                | address                                        | undefined   |
| strategyId                  | uint256                                        | undefined   |
| currency                    | address                                        | undefined   |
| collection                  | address                                        | undefined   |
| itemIds                     | uint256[]                                      | undefined   |
| amounts                     | uint256[]                                      | undefined   |
| feeRecipients               | address[2]                                     | undefined   |
| feeAmounts                  | uint256[3]                                     | undefined   |

## Errors

### CallerInvalid

```solidity
error CallerInvalid()
```

It is returned if the function cannot be called by the sender.

### ChainIdInvalid

```solidity
error ChainIdInvalid()
```

It is returned if the domain separator should change.

### CollectionTypeInvalid

```solidity
error CollectionTypeInvalid()
```

It is returned is the collection type is not supported. For instance if the strategy is specific to hypercerts.

### CreatorFeeBpTooHigh

```solidity
error CreatorFeeBpTooHigh()
```

It is returned if the creator fee (in basis point) is too high.

### CurrencyInvalid

```solidity
error CurrencyInvalid()
```

It is returned if the currency is invalid.

### ERC20TransferFromFail

```solidity
error ERC20TransferFromFail()
```

It is emitted if the ERC20 transferFrom fails.

### LengthsInvalid

```solidity
error LengthsInvalid()
```

It is returned if there is either a mismatch or an error in the length of the array(s).

### MerkleProofInvalid

```solidity
error MerkleProofInvalid()
```

It is returned if the merkle proof provided is invalid.

### MerkleProofTooLarge

```solidity
error MerkleProofTooLarge(uint256 length)
```

It is returned if the length of the merkle proof provided is greater than tolerated.

#### Parameters

| Name   | Type    | Description  |
| ------ | ------- | ------------ |
| length | uint256 | Proof length |

### NewGasLimitETHTransferTooLow

```solidity
error NewGasLimitETHTransferTooLow()
```

It is returned if the gas limit for a standard ETH transfer is too low.

### NewProtocolFeeRecipientCannotBeNullAddress

```solidity
error NewProtocolFeeRecipientCannotBeNullAddress()
```

It is returned if the new protocol fee recipient is set to address(0).

### NoOngoingTransferInProgress

```solidity
error NoOngoingTransferInProgress()
```

This is returned when there is no transfer of ownership in progress.

### NoSelectorForStrategy

```solidity
error NoSelectorForStrategy()
```

It is returned if there is no selector for maker ask/bid for a given strategyId, depending on the quote type.

### NoncesInvalid

```solidity
error NoncesInvalid()
```

It is returned if the nonces are invalid.

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

### NotV2Strategy

```solidity
error NotV2Strategy()
```

If the strategy has not set properly its implementation contract.

_It can only be returned for owner operations._

### NullSignerAddress

```solidity
error NullSignerAddress()
```

It is emitted if the signer is null.

### OutsideOfTimeRange

```solidity
error OutsideOfTimeRange()
```

It is returned if the current block timestamp is not between start and end times in the maker order.

### QuoteTypeInvalid

```solidity
error QuoteTypeInvalid()
```

It is returned if the maker quote type is invalid.

### ReentrancyFail

```solidity
error ReentrancyFail()
```

This is returned when there is a reentrant call.

### RenouncementNotInProgress

```solidity
error RenouncementNotInProgress()
```

This is returned when there is no renouncement in progress but the owner tries to validate the ownership renouncement.

### SameDomainSeparator

```solidity
error SameDomainSeparator()
```

It is returned if the domain separator cannot be updated (i.e. the chainId is the same).

### SignatureEOAInvalid

```solidity
error SignatureEOAInvalid()
```

It is emitted if the signature is invalid for an EOA (the address recovered is not the expected one).

### SignatureERC1271Invalid

```solidity
error SignatureERC1271Invalid()
```

It is emitted if the signature is invalid for a ERC1271 contract signer.

### SignatureLengthInvalid

```solidity
error SignatureLengthInvalid(uint256 length)
```

It is emitted if the signature&#39;s length is neither 64 nor 65 bytes.

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| length | uint256 | undefined   |

### SignatureParameterSInvalid

```solidity
error SignatureParameterSInvalid()
```

It is emitted if the signature is invalid due to S parameter.

### SignatureParameterVInvalid

```solidity
error SignatureParameterVInvalid(uint8 v)
```

It is emitted if the signature is invalid due to V parameter.

#### Parameters

| Name | Type  | Description |
| ---- | ----- | ----------- |
| v    | uint8 | undefined   |

### StrategyHasNoSelector

```solidity
error StrategyHasNoSelector()
```

It is returned if the strategy has no selector.

_It can only be returned for owner operations._

### StrategyNotAvailable

```solidity
error StrategyNotAvailable(uint256 strategyId)
```

It is returned if the strategy id has no implementation.

_It is returned if there is no implementation address and the strategyId is strictly greater than 0._

#### Parameters

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| strategyId | uint256 | undefined   |

### StrategyNotUsed

```solidity
error StrategyNotUsed()
```

It is returned if the strategyId is invalid.

### StrategyProtocolFeeTooHigh

```solidity
error StrategyProtocolFeeTooHigh()
```

It is returned if the strategy&#39;s protocol fee is too high.

_It can only be returned for owner operations._

### TransferAlreadyInProgress

```solidity
error TransferAlreadyInProgress()
```

This is returned when the transfer is already in progress but the owner tries initiate a new ownership transfer.

### TransferNotInProgress

```solidity
error TransferNotInProgress()
```

This is returned when there is no ownership transfer in progress but the ownership change tries to be approved.

### UnitAmountInvalid

```solidity
error UnitAmountInvalid()
```

It is returned if the available amount of fraction units is not available for the selected type of transaction. For instance, a split transaction cannot be executed if the amount of fraction units is not higher than the amount of fraction units available.

### WrongPotentialOwner

```solidity
error WrongPotentialOwner()
```

This is returned when the ownership transfer is attempted to be validated by the a caller that is not the potential owner.
