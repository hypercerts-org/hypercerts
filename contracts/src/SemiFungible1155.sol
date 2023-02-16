// SPDX-License-Identifier: MIT
// Used components of Enjin example implementation for mixed fungibility
// https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155MixedFungibleMintable.sol
pragma solidity 0.8.16;

import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { Errors } from "./libs/Errors.sol";

/// @title Contract for minting semi-fungible EIP1155 tokens
/// @author bitbeckers
/// @notice Extends { Upgradeable1155 } token with semi-fungible properties and the concept of `units`
/// @dev Adds split bit strategy as described in [EIP-1155](https://eips.ethereum.org/EIPS/eip-1155#non-fungible-tokens)
contract SemiFungible1155 is
    Initializable,
    ERC1155Upgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @dev Counter used to generate next typeID.
    uint256 internal typeCounter;

    /// @dev Bitmask used to expose only upper 128 bits of uint256
    uint256 internal constant TYPE_MASK = type(uint256).max << 128;

    /// @dev Bitmask used to expose only lower 128 bits of uint256
    uint256 internal constant NF_INDEX_MASK = type(uint256).max >> 128;

    uint256 internal constant FRACTION_LIMIT = 253;

    /// @dev Mapping of `tokenID` to address of `owner`
    mapping(uint256 => address) internal owners;

    /// @dev Mapping of `tokenID` to address of `creator`
    mapping(uint256 => address) internal creators;

    /// @dev Used to determine amount of `units` stored in token at `tokenID`
    mapping(uint256 => uint256) internal tokenValues;

    /// @dev Used to find highest index of token belonging to token at `typeID`
    mapping(uint256 => uint256) internal maxIndex;

    /// @dev Emitted on transfer of `value` between `fromTokenID` to `toTokenID` of the same `claimID`
    event ValueTransfer(uint256 claimID, uint256 fromTokenID, uint256 toTokenID, uint256 value);

    /// @dev Emitted on transfer of `values` between `fromTokenIDs` to `toTokenIDs` of `claimIDs`
    event BatchValueTransfer(uint256[] claimIDs, uint256[] fromTokenIDs, uint256[] toTokenIDs, uint256[] values);

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    // solhint-disable-next-line func-name-mixedcase
    function __SemiFungible1155_init() public virtual onlyInitializing {
        __ERC1155_init("");
        __ERC1155Burnable_init();
        __ERC1155URIStorage_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @dev Get index of fractional token at `_id` by returning lower 128 bit values
    /// @dev Returns 0 if `_id` is a baseType
    function getItemIndex(uint256 tokenID) internal pure returns (uint256) {
        return tokenID & NF_INDEX_MASK;
    }

    /// @dev Get base type ID for token at `_id` by returning upper 128 bit values
    function getBaseType(uint256 tokenID) internal pure returns (uint256) {
        return tokenID & TYPE_MASK;
    }

    /// @dev Identify that token at `_id` is base type.
    /// @dev Upper 128 bits identify base type ID, lower bits should be 0
    function isBaseType(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK == tokenID) && (tokenID & NF_INDEX_MASK == 0);
    }

    /// @dev Identify that token at `_id` is fraction of a claim.
    /// @dev Upper 128 bits identify base type ID, lower bits should be > 0
    function isTypedItem(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK != 0) && (tokenID & NF_INDEX_MASK != 0);
    }

    /// READ
    function ownerOf(uint256 tokenID) public view returns (address _owner) {
        _owner = owners[tokenID];
    }

    /// @dev see {IHypercertToken}
    function _unitsOf(uint256 tokenID) internal view returns (uint256 units) {
        units = tokenValues[tokenID];
    }

    /// @dev see {IHypercertToken}
    function _unitsOf(address account, uint256 tokenID) internal view returns (uint256 units) {
        // Check if fraction token and accounts owns it
        if (ownerOf(tokenID) == account) {
            units = tokenValues[tokenID];
        }
    }

    /// MUTATE

    /// @dev create token type ID based of token counter

    function _createTokenType(address _account, uint256 units, string memory _uri) internal returns (uint256 typeID) {
        _notMaxType(typeCounter);
        typeID = ++typeCounter << 128;

        creators[typeID] = _account;
        tokenValues[typeID] = units;

        _setURI(typeID, _uri);

        //Event emitted for indexing purposes
        emit TransferSingle(_account, address(0), address(0), typeID, 0);
    }

    /// @dev Mint a new token type and the initial value
    function _mintValue(address _account, uint256 _value, string memory _uri) internal returns (uint256 typeID) {
        if (_value == 0) {
            revert Errors.NotAllowed();
        }
        typeID = _createTokenType(_account, _value, _uri);

        uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

        tokenValues[tokenID] = _value;

        _mint(_account, tokenID, 1, "");
        emit ValueTransfer(typeID, 0, tokenID, _value);
    }

    /// @dev Mint a new token type and the initial fractions
    function _mintValue(
        address _account,
        uint256[] calldata _values,
        string memory _uri
    ) internal returns (uint256 typeID) {
        typeID = _mintValue(_account, _getSum(_values), _uri);
        _splitValue(_account, typeID + maxIndex[typeID], _values);
    }

    /// @dev Mint a new token for an existing type
    function _mintClaim(address _account, uint256 _typeID, uint256 _units) internal returns (uint256 tokenID) {
        if (!isBaseType(_typeID)) revert Errors.NotAllowed();

        _notMaxItem(maxIndex[_typeID]);

        unchecked {
            tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data
        }

        tokenValues[tokenID] = _units;

        _mint(_account, tokenID, 1, "");
        emit ValueTransfer(_typeID, 0, tokenID, _units);
    }

    /// @dev Mint new tokens for existing types
    /// @notice Enables batch claiming from multiple allowlists
    function _batchMintClaims(
        address _account,
        uint256[] calldata _typeIDs,
        uint256[] calldata _units
    ) internal returns (uint256[] memory tokenIDs) {
        uint256 len = _typeIDs.length;

        tokenIDs = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);
        uint256[] memory zeroes = new uint256[](len);

        for (uint256 i; i < len; ) {
            uint256 _typeID = _typeIDs[i];
            if (!isBaseType(_typeID)) revert Errors.NotAllowed();
            _notMaxItem(maxIndex[_typeID]);

            unchecked {
                uint256 tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data
                tokenValues[tokenID] = _units[i];
                tokenIDs[i] = tokenID;
                amounts[i] = 1;
                ++i;
            }
        }

        _mintBatch(_account, tokenIDs, amounts, "");
        emit BatchValueTransfer(_typeIDs, zeroes, tokenIDs, _units);
    }

    /// @dev Split the units of `_tokenID` owned by `account` across `_values`
    /// @dev `_values` must sum to total `units` held at `_tokenID`
    function _splitValue(address _account, uint256 _tokenID, uint256[] calldata _values) internal {
        if (_values.length > FRACTION_LIMIT || _values.length < 2) revert Errors.ArraySize();
        if (tokenValues[_tokenID] != _getSum(_values)) revert Errors.NotAllowed();

        // Current token
        uint256 _typeID = getBaseType(_tokenID);
        uint256 currentID = _tokenID;
        uint256 valueLeft = tokenValues[_tokenID];

        // Prepare batch processing, we want to skip the first entry
        uint256 len = _values.length - 1;

        uint256[] memory typeIDs = new uint256[](len);
        uint256[] memory fromIDs = new uint256[](len);
        uint256[] memory toIDs = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);
        uint256[] memory values = new uint256[](len);

        {
            uint256[] memory _valuesCache = _values;
            uint256 swapValue = _valuesCache[len];
            _valuesCache[len] = _valuesCache[0];
            _valuesCache[0] = swapValue;

            for (uint256 i; i < len; ) {
                _notMaxItem(maxIndex[_typeID]);

                typeIDs[i] = _typeID;
                fromIDs[i] = _tokenID;
                toIDs[i] = _typeID + ++maxIndex[_typeID];
                amounts[i] = 1;
                values[i] = _valuesCache[i];

                unchecked {
                    ++i;
                }
            }
        }

        _beforeValueTransfer(_msgSender(), _account, fromIDs, toIDs, values, "");

        for (uint256 i; i < len; ) {
            valueLeft -= values[i];

            tokenValues[toIDs[i]] = values[i];

            unchecked {
                ++i;
            }
        }

        tokenValues[_tokenID] = valueLeft;

        _mintBatch(_account, toIDs, amounts, "");

        emit BatchValueTransfer(typeIDs, fromIDs, toIDs, values);
    }

    /// @dev Merge the units of `_fractionIDs`.
    /// @dev Base type of `_fractionIDs` must be identical for all tokens.
    function _mergeValue(address _account, uint256[] memory _fractionIDs) internal {
        if (_fractionIDs.length > FRACTION_LIMIT || _fractionIDs.length < 2) {
            revert Errors.ArraySize();
        }
        uint256 len = _fractionIDs.length - 1;

        uint256 target = _fractionIDs[len];

        uint256 _totalValue;
        uint256[] memory fromIDs = new uint256[](len);
        uint256[] memory toIDs = new uint256[](len);
        uint256[] memory values = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);

        {
            for (uint256 i; i < len; ) {
                uint256 _fractionID = _fractionIDs[i];
                fromIDs[i] = _fractionID;
                toIDs[i] = target;
                amounts[i] = 1;
                values[i] = tokenValues[_fractionID];

                unchecked {
                    ++i;
                }
            }
        }

        _beforeValueTransfer(_msgSender(), _account, fromIDs, toIDs, values, "");

        for (uint256 i; i < len; ) {
            _totalValue += values[i];

            delete tokenValues[fromIDs[i]];
            unchecked {
                ++i;
            }
        }

        tokenValues[target] += _totalValue;

        _burnBatch(_account, fromIDs, amounts);
    }

    /// @dev Burn the token at `_tokenID` owned by `_account`
    /// @dev Not allowed to burn base type.
    /// @dev `_tokenID` must hold all value declared at base type
    function _burnValue(address _account, uint256 _tokenID) internal {
        if (_account != _msgSender() && !isApprovedForAll(_account, _msgSender())) revert Errors.NotApprovedOrOwner();

        uint256 value = tokenValues[_tokenID];

        delete tokenValues[_tokenID];

        _burn(_account, _tokenID, 1);
        emit ValueTransfer(getBaseType(_tokenID), _tokenID, 0, value);
    }

    /// TRANSFERS

    // The following functions are overrides required by Solidity.
    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);

        uint256 len = ids.length;

        for (uint256 i; i < len; ) {
            owners[ids[i]] = to;
            unchecked {
                ++i;
            }
        }
    }

    function _beforeValueTransfer(
        address operator,
        address from,
        uint256[] memory fromIDs,
        uint256[] memory toIDs,
        uint256[] memory values,
        bytes memory data
    ) internal virtual {
        uint256 len = fromIDs.length;

        for (uint256 i; i < len; ) {
            uint256 _from = fromIDs[i];
            uint256 _to = toIDs[i];

            if (isBaseType(_from)) revert Errors.NotAllowed();
            if (getBaseType(_from) != getBaseType(_to)) revert Errors.TypeMismatch();
            if (from != _msgSender() && !isApprovedForAll(from, _msgSender())) revert Errors.NotApprovedOrOwner();
            unchecked {
                ++i;
            }
        }
    }

    /// METADATA

    /// @dev see { openzeppelin-contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol }
    /// @dev Always returns the URI for the basetype so that it's managed in one place.
    function uri(
        uint256 tokenID
    ) public view virtual override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable) returns (string memory _uri) {
        _uri = ERC1155URIStorageUpgradeable.uri(tokenID);
    }

    /// UTILS

    /**
     * @dev Check if value is below max item index
     */
    function _notMaxItem(uint256 tokenID) private pure {
        uint128 _count = uint128(tokenID);
        ++_count;
    }

    /**
     * @dev Check if value is below max type index
     */
    function _notMaxType(uint256 tokenID) private pure {
        uint128 _count = uint128(tokenID >> 128);
        ++_count;
    }

    /**
     * @dev calculate the sum of the elements of an array
     */
    function _getSum(uint256[] memory array) internal pure returns (uint256 sum) {
        uint256 len = array.length;
        for (uint256 i; i < len; ) {
            if (array[i] == 0) revert Errors.NotAllowed();
            sum += array[i];
            unchecked {
                ++i;
            }
        }
    }

    function _getSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }

    // UUPS PROXY

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol }
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     * Assuming 30 available slots (slots cost space, cost gas)
     * 1. typeCounter
     * 2. owners
     * 3. creators
     * 4. tokenValues
     * 5. maxIndex
     */
    uint256[25] private __gap;
}
