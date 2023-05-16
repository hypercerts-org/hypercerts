# HypercertMinter

_bitbeckers_

> Contract for managing hypercert claims and whitelists

Implementation of the HypercertTokenInterface using { SemiFungible1155 } as underlying token.This contract supports whitelisted minting via { AllowlistMinter }.

_Wrapper contract to expose and chain functions._

## Methods

### \_\_SemiFungible1155_init

```solidity
function __SemiFungible1155_init() external nonpayable
```

_see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }_

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

_See {IERC1155-balanceOf}. Requirements: - `account` cannot be the zero address._

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |
| id      | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```

_See {IERC1155-balanceOfBatch}. Requirements: - `accounts` and `ids` must have the same length._

#### Parameters

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| accounts | address[] | undefined   |
| ids      | uint256[] | undefined   |

#### Returns

| Name | Type      | Description |
| ---- | --------- | ----------- |
| \_0  | uint256[] | undefined   |

### batchMintClaimsFromAllowlists

```solidity
function batchMintClaimsFromAllowlists(address account, bytes32[][] proofs, uint256[] claimIDs, uint256[] units) external nonpayable
```

Mint semi-fungible tokens representing a fraction of the claims in `claimIDs`

_Calls AllowlistMinter to verify `proofs`.Mints the `amount` of units for the hypercert stored under `claimIDs`_

#### Parameters

| Name     | Type        | Description |
| -------- | ----------- | ----------- |
| account  | address     | undefined   |
| proofs   | bytes32[][] | undefined   |
| claimIDs | uint256[]   | undefined   |
| units    | uint256[]   | undefined   |

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external nonpayable
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |
| id      | uint256 | undefined   |
| value   | uint256 | undefined   |

### burnBatch

```solidity
function burnBatch(address account, uint256[] ids, uint256[] values) external nonpayable
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| account | address   | undefined   |
| ids     | uint256[] | undefined   |
| values  | uint256[] | undefined   |

### burnFraction

```solidity
function burnFraction(address _account, uint256 _tokenID) external nonpayable
```

Burn a claimtoken

_see {IHypercertToken}_

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| \_account | address | undefined   |
| \_tokenID | uint256 | undefined   |

### createAllowlist

```solidity
function createAllowlist(address account, uint256 units, bytes32 merkleRoot, string _uri, enum IHypercertToken.TransferRestrictions restrictions) external nonpayable
```

Register a claim and the whitelist for minting token(s) belonging to that claim

_Calls SemiFungible1155 to store the claim referenced in `uri` with amount of `units`Calls AllowlistMinter to store the `merkleRoot` as proof to authorize claims_

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| account      | address                                   | undefined   |
| units        | uint256                                   | undefined   |
| merkleRoot   | bytes32                                   | undefined   |
| \_uri        | string                                    | undefined   |
| restrictions | enum IHypercertToken.TransferRestrictions | undefined   |

### hasBeenClaimed

```solidity
function hasBeenClaimed(uint256, bytes32) external view returns (bool)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |
| \_1  | bytes32 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### initialize

```solidity
function initialize() external nonpayable
```

_see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }_

### isAllowedToClaim

```solidity
function isAllowedToClaim(bytes32[] proof, uint256 claimID, bytes32 leaf) external view returns (bool isAllowed)
```

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| proof   | bytes32[] | undefined   |
| claimID | uint256   | undefined   |
| leaf    | bytes32   | undefined   |

#### Returns

| Name      | Type | Description |
| --------- | ---- | ----------- |
| isAllowed | bool | undefined   |

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

_See {IERC1155-isApprovedForAll}._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| account  | address | undefined   |
| operator | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### mergeFractions

```solidity
function mergeFractions(address _account, uint256[] _fractionIDs) external nonpayable
```

Merge the value of tokens belonging to the same claim

_see {IHypercertToken}_

#### Parameters

| Name          | Type      | Description |
| ------------- | --------- | ----------- |
| \_account     | address   | undefined   |
| \_fractionIDs | uint256[] | undefined   |

### mintClaim

```solidity
function mintClaim(address account, uint256 units, string _uri, enum IHypercertToken.TransferRestrictions restrictions) external nonpayable
```

Mint a semi-fungible token for the impact claim referenced via `uri`

_see {IHypercertToken}_

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| account      | address                                   | undefined   |
| units        | uint256                                   | undefined   |
| \_uri        | string                                    | undefined   |
| restrictions | enum IHypercertToken.TransferRestrictions | undefined   |

### mintClaimFromAllowlist

```solidity
function mintClaimFromAllowlist(address account, bytes32[] proof, uint256 claimID, uint256 units) external nonpayable
```

Mint a semi-fungible token representing a fraction of the claim

_Calls AllowlistMinter to verify `proof`.Mints the `amount` of units for the hypercert stored under `claimID`_

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| account | address   | undefined   |
| proof   | bytes32[] | undefined   |
| claimID | uint256   | undefined   |
| units   | uint256   | undefined   |

### mintClaimWithFractions

```solidity
function mintClaimWithFractions(address account, uint256 units, uint256[] fractions, string _uri, enum IHypercertToken.TransferRestrictions restrictions) external nonpayable
```

Mint semi-fungible tokens for the impact claim referenced via `uri`

_see {IHypercertToken}_

#### Parameters

| Name         | Type                                      | Description |
| ------------ | ----------------------------------------- | ----------- |
| account      | address                                   | undefined   |
| units        | uint256                                   | undefined   |
| fractions    | uint256[]                                 | undefined   |
| \_uri        | string                                    | undefined   |
| restrictions | enum IHypercertToken.TransferRestrictions | undefined   |

### name

```solidity
function name() external view returns (string)
```

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

_Returns the address of the current owner._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### ownerOf

```solidity
function ownerOf(uint256 tokenID) external view returns (address _owner)
```

READ

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| \_owner | address | undefined   |

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

### readTransferRestriction

```solidity
function readTransferRestriction(uint256 tokenID) external view returns (string)
```

TRANSFER RESTRICTIONS

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```

_Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external nonpayable
```

_See {IERC1155-safeBatchTransferFrom}._

#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| from    | address   | undefined   |
| to      | address   | undefined   |
| ids     | uint256[] | undefined   |
| amounts | uint256[] | undefined   |
| data    | bytes     | undefined   |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external nonpayable
```

_See {IERC1155-safeTransferFrom}._

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| from   | address | undefined   |
| to     | address | undefined   |
| id     | uint256 | undefined   |
| amount | uint256 | undefined   |
| data   | bytes   | undefined   |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```

_See {IERC1155-setApprovalForAll}._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| operator | address | undefined   |
| approved | bool    | undefined   |

### splitFraction

```solidity
function splitFraction(address _account, uint256 _tokenID, uint256[] _newFractions) external nonpayable
```

Split a claimtokens value into parts with summed value equal to the original

_see {IHypercertToken}_

#### Parameters

| Name           | Type      | Description |
| -------------- | --------- | ----------- |
| \_account      | address   | undefined   |
| \_tokenID      | uint256   | undefined   |
| \_newFractions | uint256[] | undefined   |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_See {IERC165-supportsInterface}._

#### Parameters

| Name        | Type   | Description |
| ----------- | ------ | ----------- |
| interfaceId | bytes4 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

_Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner._

#### Parameters

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| newOwner | address | undefined   |

### unitsOf

```solidity
function unitsOf(address account, uint256 tokenID) external view returns (uint256 units)
```

_see {IHypercertToken}_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |
| tokenID | uint256 | undefined   |

#### Returns

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| units | uint256 | undefined   |

### unitsOf

```solidity
function unitsOf(uint256 tokenID) external view returns (uint256 units)
```

_see {IHypercertToken}_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| units | uint256 | undefined   |

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

### uri

```solidity
function uri(uint256 tokenID) external view returns (string _uri)
```

_see { IHypercertMetadata}_

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |

#### Returns

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| \_uri | string | undefined   |

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

### AllowlistCreated

```solidity
event AllowlistCreated(uint256 tokenID, bytes32 root)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |
| root    | bytes32 | undefined   |

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed account, address indexed operator, bool approved)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| account `indexed`  | address | undefined   |
| operator `indexed` | address | undefined   |
| approved           | bool    | undefined   |

### BatchValueTransfer

```solidity
event BatchValueTransfer(uint256[] claimIDs, uint256[] fromTokenIDs, uint256[] toTokenIDs, uint256[] values)
```

#### Parameters

| Name         | Type      | Description |
| ------------ | --------- | ----------- |
| claimIDs     | uint256[] | undefined   |
| fromTokenIDs | uint256[] | undefined   |
| toTokenIDs   | uint256[] | undefined   |
| values       | uint256[] | undefined   |

### BeaconUpgraded

```solidity
event BeaconUpgraded(address indexed beacon)
```

#### Parameters

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| beacon `indexed` | address | undefined   |

### ClaimStored

```solidity
event ClaimStored(uint256 indexed claimID, string uri, uint256 totalUnits)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| claimID `indexed` | uint256 | undefined   |
| uri               | string  | undefined   |
| totalUnits        | uint256 | undefined   |

### Initialized

```solidity
event Initialized(uint8 version)
```

#### Parameters

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| version | uint8 | undefined   |

### LeafClaimed

```solidity
event LeafClaimed(uint256 tokenID, bytes32 leaf)
```

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| tokenID | uint256 | undefined   |
| leaf    | bytes32 | undefined   |

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

### TransferBatch

```solidity
event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)
```

#### Parameters

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| operator `indexed` | address   | undefined   |
| from `indexed`     | address   | undefined   |
| to `indexed`       | address   | undefined   |
| ids                | uint256[] | undefined   |
| values             | uint256[] | undefined   |

### TransferSingle

```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)
```

#### Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| operator `indexed` | address | undefined   |
| from `indexed`     | address | undefined   |
| to `indexed`       | address | undefined   |
| id                 | uint256 | undefined   |
| value              | uint256 | undefined   |

### URI

```solidity
event URI(string value, uint256 indexed id)
```

#### Parameters

| Name         | Type    | Description |
| ------------ | ------- | ----------- |
| value        | string  | undefined   |
| id `indexed` | uint256 | undefined   |

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

### ValueTransfer

```solidity
event ValueTransfer(uint256 claimID, uint256 fromTokenID, uint256 toTokenID, uint256 value)
```

#### Parameters

| Name        | Type    | Description |
| ----------- | ------- | ----------- |
| claimID     | uint256 | undefined   |
| fromTokenID | uint256 | undefined   |
| toTokenID   | uint256 | undefined   |
| value       | uint256 | undefined   |

## Errors

### AlreadyClaimed

```solidity
error AlreadyClaimed()
```

### ArraySize

```solidity
error ArraySize()
```

### DoesNotExist

```solidity
error DoesNotExist()
```

### DuplicateEntry

```solidity
error DuplicateEntry()
```

### Invalid

```solidity
error Invalid()
```

### NotAllowed

```solidity
error NotAllowed()
```

### NotApprovedOrOwner

```solidity
error NotApprovedOrOwner()
```

### TransfersNotAllowed

```solidity
error TransfersNotAllowed()
```

### TypeMismatch

```solidity
error TypeMismatch()
```
