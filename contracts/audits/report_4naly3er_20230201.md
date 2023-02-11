# Report

## Gas Optimizations

|                 | Issue                                                                              | Instances |
| --------------- | :--------------------------------------------------------------------------------- | :-------: |
| [GAS-1](#GAS-1) | Use assembly to check for `address(0)`                                             |     1     |
| [GAS-2](#GAS-2) | Using bools for storage incurs overhead                                            |     1     |
| [GAS-3](#GAS-3) | Use calldata instead of memory for function arguments that do not get mutated      |     8     |
| [GAS-4](#GAS-4) | For Operations that will not overflow, you could use unchecked                     |    102    |
| [GAS-5](#GAS-5) | Functions guaranteed to revert when called by normal users can be marked `payable` |     7     |
| [GAS-6](#GAS-6) | Using `private` rather than `public` for constants, saves gas                      |     1     |
| [GAS-7](#GAS-7) | Use != 0 instead of > 0 for unsigned integer comparison                            |     1     |
| [GAS-8](#GAS-8) | `internal` functions not called by the contract should be removed                  |     2     |

### <a name="GAS-1"></a>[GAS-1] Use assembly to check for `address(0)`

_Saves 6 gas per instance_

_Instances (1)_:

```solidity
File: SemiFungible1155.sol

319:             if (isBaseType(ids[i]) && from != address(0)) revert Errors.NotAllowed();

```

### <a name="GAS-2"></a>[GAS-2] Using bools for storage incurs overhead

Use uint256(1) and uint256(2) for true/false to avoid a Gwarmaccess (100 gas), and to avoid Gsset (20000 gas) when
changing from ‘false’ to ‘true’, after having been ‘true’ in the past. See
[source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27).

_Instances (1)_:

```solidity
File: AllowlistMinter.sol

18:     mapping(uint256 => mapping(bytes32 => bool)) public hasBeenClaimed;

```

### <a name="GAS-3"></a>[GAS-3] Use calldata instead of memory for function arguments that do not get mutated

Mark data types as `calldata` instead of `memory` where possible. This makes it so that the data is not automatically
loaded into memory. If the data passed into the function does not need to be changed (like updating values in an array),
it can be passed in as `calldata`. The one exception to this is if the argument must later be passed into another
function that takes an argument that specifies `memory` storage.

_Instances (8)_:

```solidity
File: HypercertMinter.sol

43:         string memory _uri,

57:         string memory _uri,

104:         string memory _uri,

```

```solidity
File: interfaces/IHypercertToken.sol

25:     function mintClaim(address account, uint256 units, string memory uri, TransferRestrictions restrictions) external;

32:         uint256[] memory fractions,

33:         string memory uri,

39:     function splitValue(address account, uint256 tokenID, uint256[] memory _values) external;

43:     function mergeValue(address account, uint256[] memory tokenIDs) external;

```

### <a name="GAS-4"></a>[GAS-4] For Operations that will not overflow, you could use unchecked

_Instances (102)_:

```solidity
File: AllowlistMinter.sol

4: import { MerkleProofUpgradeable } from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

4: import { MerkleProofUpgradeable } from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

4: import { MerkleProofUpgradeable } from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

4: import { MerkleProofUpgradeable } from "oz-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

5: import { IAllowlist } from "./interfaces/IAllowlist.sol";

5: import { IAllowlist } from "./interfaces/IAllowlist.sol";

7: import { Errors } from "./libs/Errors.sol";

7: import { Errors } from "./libs/Errors.sol";

```

```solidity
File: HypercertMinter.sol

4: import { IHypercertToken } from "./interfaces/IHypercertToken.sol";

4: import { IHypercertToken } from "./interfaces/IHypercertToken.sol";

5: import { SemiFungible1155 } from "./SemiFungible1155.sol";

6: import { AllowlistMinter } from "./AllowlistMinter.sol";

7: import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";

7: import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";

7: import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";

9: import { Errors } from "./libs/Errors.sol";

9: import { Errors } from "./libs/Errors.sol";

91:                 ++i;

91:                 ++i;

194:                 ++i;

194:                 ++i;

```

```solidity
File: SemiFungible1155.sol

6: import { Upgradeable1155 } from "./Upgradeable1155.sol";

7: import { IERC1155ReceiverUpgradeable } from "oz-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

7: import { IERC1155ReceiverUpgradeable } from "oz-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

7: import { IERC1155ReceiverUpgradeable } from "oz-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

7: import { IERC1155ReceiverUpgradeable } from "oz-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

9: import { Errors } from "./libs/Errors.sol";

9: import { Errors } from "./libs/Errors.sol";

96:         typeID = ++typeCounter << 128;

96:         typeID = ++typeCounter << 128;

112:         uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

112:         uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

112:         uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

112:         uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

112:         uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

127:         _splitValue(_account, typeID + maxIndex[typeID], _values);

136:             tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

136:             tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

136:             tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

136:             tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

136:             tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

164:                 uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

164:                 uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

164:                 uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

164:                 uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

164:                 uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data

168:                 ++i;

168:                 ++i;

188:         uint256 len = _values.length - 1;

190:         maxIndex[_typeID] += len;

209:                 toIDs[i] = ++currentID;

209:                 toIDs[i] = ++currentID;

214:                     ++i;

214:                     ++i;

222:             valueLeft -= values[i];

227:                 ++i;

227:                 ++i;

244:         uint256 len = _fractionIDs.length - 1;

264:                     ++i;

264:                     ++i;

272:             _totalValue += values[i];

276:                 ++i;

276:                 ++i;

280:         tokenValues[target] += _totalValue;

321:                 ++i;

321:                 ++i;

343:                 ++i;

343:                 ++i;

366:                 ++i;

366:                 ++i;

390:         ++_count;

390:         ++_count;

398:         ++_count;

398:         ++_count;

408:             sum += array[i];

410:                 ++i;

410:                 ++i;

```

```solidity
File: Upgradeable1155.sol

4: import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

4: import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

4: import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

4: import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

5: import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

5: import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

5: import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

5: import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

5: import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

6: import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";

6: import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";

6: import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";

6: import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";

6: import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";

7: import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";

7: import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";

7: import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";

8: import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";

8: import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";

8: import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";

8: import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";

9: import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

9: import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

9: import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

9: import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

```

### <a name="GAS-5"></a>[GAS-5] Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function.
Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include
checks for whether a payment was provided.

_Instances (7)_:

```solidity
File: HypercertMinter.sol

143:     function pause() external onlyOwner {

147:     function unpause() external onlyOwner {

171:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```

```solidity
File: SemiFungible1155.sol

45:     function __SemiFungible1155_init() public virtual onlyInitializing {

371:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```

```solidity
File: Upgradeable1155.sol

21:     function __Upgradeable1155_init() public virtual onlyInitializing {

30:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```

### <a name="GAS-6"></a>[GAS-6] Using `private` rather than `public` for constants, saves gas

If needed, the values can be read from the verified contract source code, or if there are multiple values there can be a
single getter function that
[returns a tuple](https://github.com/code-423n4/2022-08-frax/blob/90f55a9ce4e25bceed3a74290b854341d8de6afa/src/contracts/FraxlendPair.sol#L156-L178)
of the values of all currently-public constants. Saves **3406-3606 gas** in deployment gas due to the compiler not
having to create non-payable getter functions for deployment calldata, not having to store the bytes of the value
outside of where it's used, and not adding another entry to the method ID table

_Instances (1)_:

```solidity
File: HypercertMinter.sol

18:     string public constant name = "HypercertMinter";

```

### <a name="GAS-7"></a>[GAS-7] Use != 0 instead of > 0 for unsigned integer comparison

_Instances (1)_:

```solidity
File: SemiFungible1155.sol

363:             if (getBaseType(_to) > 0 && getBaseType(_from) != getBaseType(_to)) revert Errors.TypeMismatch();

```

### <a name="GAS-8"></a>[GAS-8] `internal` functions not called by the contract should be removed

If the functions are required by an interface, the contract should inherit from that interface and use the `override`
keyword

_Instances (2)_:

```solidity
File: SemiFungible1155.sol

51:     function getItemIndex(uint256 tokenID) internal pure returns (uint256) {

68:     function isTypedItem(uint256 tokenID) internal pure returns (bool) {

```

## Non Critical Issues

|               | Issue                                                                      | Instances |
| ------------- | :------------------------------------------------------------------------- | :-------: |
| [NC-1](#NC-1) | `require()` / `revert()` statements should have descriptive reason strings |    18     |
| [NC-2](#NC-2) | Event is missing `indexed` fields                                          |     5     |
| [NC-3](#NC-3) | Functions not used internally could be marked external                     |     1     |

### <a name="NC-1"></a>[NC-1] `require()` / `revert()` statements should have descriptive reason strings

_Instances (18)_:

```solidity
File: AllowlistMinter.sol

25:         if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();

30:         if (merkleRoots[claimID] != "") revert Errors.DuplicateEntry();

37:         if (merkleRoots[claimID].length == 0) revert Errors.DoesNotExist();

41:         if (hasBeenClaimed[claimID][node]) revert Errors.DuplicateEntry();

43:         if (!MerkleProofUpgradeable.verifyCalldata(proof, merkleRoots[claimID], node)) revert Errors.Invalid();

```

```solidity
File: HypercertMinter.sol

189:                 revert Errors.TransfersNotAllowed();

191:                 revert Errors.TransfersNotAllowed();

```

```solidity
File: SemiFungible1155.sol

108:             revert Errors.NotAllowed();

132:         if (!isBaseType(_typeID)) revert Errors.NotAllowed();

160:             if (!isBaseType(_typeID)) revert Errors.NotAllowed();

179:         if (_values.length > 253 || _values.length < 2) revert Errors.ArraySize();

180:         if (tokenValues[_tokenID] != _getSum(_values)) revert Errors.NotAllowed();

242:             revert Errors.ArraySize();

319:             if (isBaseType(ids[i]) && from != address(0)) revert Errors.NotAllowed();

362:             if (isBaseType(_from)) revert Errors.NotAllowed();

363:             if (getBaseType(_to) > 0 && getBaseType(_from) != getBaseType(_to)) revert Errors.TypeMismatch();

364:             if (from != _msgSender() && !isApprovedForAll(from, _msgSender())) revert Errors.NotApprovedOrOwner();

407:             if (array[i] == 0) revert Errors.NotAllowed();

```

### <a name="NC-2"></a>[NC-2] Event is missing `indexed` fields

Index event fields make the field more quickly accessible to off-chain tools that parse events. However, note that each
index field costs extra gas during emission, so it's not necessarily best to index the maximum allowed per event (three
fields). Each event should use three indexed fields if there are three or more fields, and gas usage is not particularly
of concern for the events in question. If there are fewer than three fields, all of the fields should be indexed.

_Instances (5)_:

```solidity
File: AllowlistMinter.sol

14:     event AllowlistCreated(uint256 tokenID, bytes32 root);

15:     event LeafClaimed(uint256 tokenID, bytes32 leaf);

```

```solidity
File: SemiFungible1155.sol

38:     event ValueTransfer(uint256 claimID, uint256 fromTokenID, uint256 toTokenID, uint256 value);

41:     event BatchValueTransfer(uint256[] claimIDs, uint256[] fromTokenIDs, uint256[] toTokenIDs, uint256[] values);

```

```solidity
File: interfaces/IHypercertToken.sol

22:     event ClaimStored(uint256 indexed claimID, string uri, uint256 totalUnits);

```

### <a name="NC-3"></a>[NC-3] Functions not used internally could be marked external

_Instances (1)_:

```solidity
File: HypercertMinter.sol

154:     function uri(uint256 tokenID) public view override(IHypercertToken, SemiFungible1155) returns (string memory _uri) {

```

## Low Issues

|             | Issue                           | Instances |
| ----------- | :------------------------------ | :-------: |
| [L-1](#L-1) | Initializers could be front-run |    12     |

### <a name="L-1"></a>[L-1] Initializers could be front-run

Initializers could be front-run, allowing an attacker to either set their own values, take ownership of the contract,
and in the best case forcing a re-deployment

_Instances (12)_:

```solidity
File: HypercertMinter.sol

31:     function initialize() public virtual initializer {

31:     function initialize() public virtual initializer {

32:         __SemiFungible1155_init();

33:         __Pausable_init();

```

```solidity
File: SemiFungible1155.sol

45:     function __SemiFungible1155_init() public virtual onlyInitializing {

46:         __Upgradeable1155_init();

```

```solidity
File: Upgradeable1155.sol

21:     function __Upgradeable1155_init() public virtual onlyInitializing {

22:         __ERC1155_init("");

23:         __ERC1155Burnable_init();

24:         __ERC1155URIStorage_init();

25:         __Ownable_init();

26:         __UUPSUpgradeable_init();

```

## Medium Issues

|             | Issue                                  | Instances |
| ----------- | :------------------------------------- | :-------: |
| [M-1](#M-1) | Centralization Risk for trusted owners |     5     |

### <a name="M-1"></a>[M-1] Centralization Risk for trusted owners

#### Impact:

Contracts have owners with privileged rights to perform admin tasks and need to be trusted to not perform malicious
updates or drain funds.

_Instances (5)_:

```solidity
File: HypercertMinter.sol

143:     function pause() external onlyOwner {

147:     function unpause() external onlyOwner {

171:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```

```solidity
File: SemiFungible1155.sol

371:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```

```solidity
File: Upgradeable1155.sol

30:     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {

```
