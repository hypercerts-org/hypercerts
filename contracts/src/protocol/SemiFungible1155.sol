// SPDX-License-Identifier: MIT
// Used components of Enjin example implementation for mixed fungibility
// https://github.com/enjin/erc-1155/blob/master/contracts/ERC1155MixedFungibleMintable.sol
pragma solidity 0.8.17;

import {ERC1155Upgradeable} from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ERC1155BurnableUpgradeable} from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import {ERC1155URIStorageUpgradeable} from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import {OwnableUpgradeable} from "oz-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "oz-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Errors} from "./libs/Errors.sol";

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

    /**
     * @dev Returns the index of the fractional token at `_id` by returning lower 128 bit values.
     * @param tokenID The ID of the token to query.
     * @return The index of the fractional token.
     * @dev This function returns 0 if `_id` is a baseType.
     */
    function getItemIndex(uint256 tokenID) internal pure returns (uint256) {
        return tokenID & NF_INDEX_MASK;
    }

    /**
     * @dev Get base type ID for token at `_id` by returning upper 128 bit values.
     * @param tokenID The ID of the token to query.
     * @return The base type ID of the token.
     */
    function getBaseType(uint256 tokenID) internal pure returns (uint256) {
        return tokenID & TYPE_MASK;
    }

    /**
     * @dev Identify that token at `_id` is base type.
     * @param tokenID The ID of the token to query.
     * @return A boolean indicating whether the token is a base type.
     * @dev Upper 128 bits identify base type ID, lower bits should be 0.
     */
    function isBaseType(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK == tokenID) && (tokenID & NF_INDEX_MASK == 0);
    }

    /**
     * @dev Returns a boolean indicating whether the token at `_id` belongs to a base type.
     * @param tokenID The ID of the token to query.
     * @return A boolean indicating whether the token is a typed item.
     * @dev Upper 128 bits identify the type ID, lower bits identify the index of the typed item.
     */
    function isTypedItem(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK != 0) && (tokenID & NF_INDEX_MASK != 0);
    }

    /// READ
    /**
     * @dev Returns the owner of a given token ID.
     * @param tokenID The ID of the token to query.
     * @return _owner The address of the owner of the token.
     */
    function ownerOf(uint256 tokenID) public view returns (address _owner) {
        _owner = owners[tokenID];
    }

    /**
     * @dev Returns the number of units of a given token ID.
     * @param tokenID The ID of the token to query.
     * @return units The number of units of the token.
     * @dev This function is used internally to get the number of units of a token.
     */
    function _unitsOf(uint256 tokenID) internal view returns (uint256 units) {
        units = tokenValues[tokenID];
    }

    /**
     * @dev Returns the number of units of a given token ID owned by a given account.
     * @param account The address of the account to query.
     * @param tokenID The ID of the token to query.
     * @return units The number of units of the token owned by the account.
     * @dev This function is used internally to get the number of units of a token owned by an account.
     */
    function _unitsOf(address account, uint256 tokenID) internal view returns (uint256 units) {
        // Check if fraction token and accounts owns it
        if (ownerOf(tokenID) == account) {
            units = tokenValues[tokenID];
        }
    }

    /// MUTATE

    /**
     * @dev Creates a new token type ID based on the token counter.
     * @param _account The address of the account that will own the new token type.
     * @param units The number of units associated with the new token type.
     * @param _uri The URI for the metadata associated with the new token type.
     * @return typeID The new token type ID.
     */
    function _createTokenType(address _account, uint256 units, string memory _uri) internal returns (uint256 typeID) {
        _notMaxType(typeCounter);
        typeID = ++typeCounter << 128;

        creators[typeID] = _account;
        tokenValues[typeID] = units;

        _setURI(typeID, _uri);

        //Event emitted for indexing purposes
        emit TransferSingle(_account, address(0), address(0), typeID, 0);
    }

    /**
     * @dev Mints a new token with a new token type ID and assigns it to the specified account.
     * @param _account The address of the account that will receive the new token.
     * @param _units The number of units associated with the new token.
     * @param _uri The URI for the metadata associated with the new token.
     * @return typeID The new token type ID.
     * @dev This function creates a new token type ID by calling the `_createTokenType` function and then mints a new
     * token with the new type ID.
     * @dev The `tokenID` is calculated by adding the `typeID` to the current maximum index for the `typeID`.
     * @dev The `tokenValues` mapping is updated with the number of units associated with the new token.
     * @dev A `ValueTransfer` event is emitted to indicate that a new token has been minted and assigned to the
     * specified account.
     * @dev If `_units` is zero, the function will revert with an error.
     */
    function _mintNewTypeWithToken(address _account, uint256 _units, string memory _uri)
        internal
        returns (uint256 typeID)
    {
        if (_units == 0) {
            revert Errors.NotAllowed();
        }
        typeID = _createTokenType(_account, _units, _uri);

        uint256 tokenID = typeID + ++maxIndex[typeID]; //1 based indexing, 0 holds type data

        tokenValues[tokenID] = _units;

        _mint(_account, tokenID, 1, "");
        emit ValueTransfer(typeID, 0, tokenID, _units);
    }

    /**
     * @dev Mints a new token with a new token type ID and assigns it to the specified account.
     * @param _account The address of the account that will receive the new token.
     * @param _fractions An array of values associated with the new token.
     * @param _uri The URI for the metadata associated with the new token.
     * @return typeID The new token type ID.
     * @dev This function creates a new token type ID by calling the `_createTokenType` function and then mints a new
     * token with the new type ID.
     * @dev The `tokenID` is calculated by adding the `typeID` to the current maximum index for the `typeID`.
     * @dev The `tokenValues` mapping is updated with the number of units associated with the new token.
     * @dev A `ValueTransfer` event is emitted to indicate that a new token has been minted and assigned to the
     * specified account.
     * @dev If any of the fractional values in `_fractions` are zero, the function will revert with an error.
     * @dev This function also calls the `_splitTokenUnits` function to split the new token into multiple sub-tokens
     * with the specified fractional values.
     */
    function _mintNewTypeWithTokens(address _account, uint256[] calldata _fractions, string memory _uri)
        internal
        returns (uint256 typeID)
    {
        typeID = _mintNewTypeWithToken(_account, _getSum(_fractions), _uri);
        _splitTokenUnits(_account, typeID + maxIndex[typeID], _fractions);
    }

    /**
     * @dev Mints a new token with the specified token type ID and assigns it to the specified account.
     * @param _account The address of the account that will receive the new token.
     * @param _typeID The ID of the token type to mint.
     * @param _units The number of units associated with the new token.
     * @return tokenID The ID of the newly minted token.
     * @dev This function checks that the specified token type ID is a base type and that the maximum number of tokens
     * for the token type has not been reached.
     * @dev The function then calculates the new token ID by adding the specified token type ID to the current maximum
     * index for the token type.
     * @dev The `tokenValues` mapping is updated with the number of units associated with the new token.
     * @dev A `ValueTransfer` event is emitted to indicate that a new token has been minted and assigned to the
     * specified account.
     */
    function _mintToken(address _account, uint256 _typeID, uint256 _units) internal returns (uint256 tokenID) {
        if (!isBaseType(_typeID)) revert Errors.NotAllowed();

        _notMaxItem(maxIndex[_typeID]);

        unchecked {
            tokenID = _typeID + ++maxIndex[_typeID]; //1 based indexing, 0 holds type data
        }

        tokenValues[tokenID] = _units;

        _mint(_account, tokenID, 1, "");
        emit ValueTransfer(_typeID, 0, tokenID, _units);
    }

    /**
     * @dev Mints multiple tokens with the specified token type IDs and assigns them to the specified account.
     * @param _account The address of the account that will receive the new tokens.
     * @param _typeIDs An array of token type IDs to mint.
     * @param _units An array of numbers of units associated with the new tokens.
     * @return tokenIDs An array of the IDs of the newly minted tokens.
     * @dev This function checks that each specified token type ID is a base type and that the maximum number of tokens
     * for each token type has not been reached.
     * @dev The function then calculates the new token IDs by adding the specified token type IDs to the current maximum
     * index for each token type.
     * @dev The `tokenValues` mapping is updated with the number of units associated with each new token.
     * @dev A `BatchValueTransfer` event is emitted to indicate that new tokens have been minted and assigned to the
     * specified account.
     */
    function _batchMintTokens(address _account, uint256[] calldata _typeIDs, uint256[] calldata _units)
        internal
        returns (uint256[] memory tokenIDs)
    {
        uint256 len = _typeIDs.length;

        tokenIDs = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);
        uint256[] memory zeroes = new uint256[](len);

        for (uint256 i; i < len;) {
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

    /**
     * @dev Splits a token into multiple tokens with different unit values.
     * @param _account The address of the account that will receive the new tokens.
     * @param _tokenID The ID of the token to split.
     * @param _values An array of numbers of units associated with the new tokens.
     * @dev This function splits a token into multiple tokens with different unit values.
     * @dev The `_values` array specifies the number of units associated with each new token.
     * @dev The function checks that the length of the `_values` array is between 2 and `FRACTION_LIMIT`, and that the
     * sum of the values in the `_values` array is equal to the number of units associated with the original token.
     * @dev The function then creates new tokens with the specified unit values and assigns them to the specified
     * account.
     * @dev A `BatchValueTransfer` event is emitted to indicate that the original token has been split into multiple
     * tokens.
     */
    function _splitTokenUnits(address _account, uint256 _tokenID, uint256[] calldata _values) internal {
        if (_values.length > FRACTION_LIMIT || _values.length < 2) revert Errors.ArraySize();
        if (tokenValues[_tokenID] != _getSum(_values)) revert Errors.NotAllowed();

        // Current token
        uint256 _typeID = getBaseType(_tokenID);
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

            for (uint256 i; i < len;) {
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

        _beforeUnitTransfer(_msgSender(), owners[_tokenID], fromIDs, toIDs, values, "");

        for (uint256 i; i < len;) {
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

    /**
     * @dev Merges the units of multiple tokens into a single token.
     * @param _account The address of the account that will receive the merged token.
     * @param _fractionIDs An array of token IDs to merge.
     * @dev This function merges the units of multiple tokens into a single token.
     * @dev The `_fractionIDs` array specifies the IDs of the tokens to merge.
     * @dev The function checks that the length of the `_fractionIDs` array is between 2 and `FRACTION_LIMIT`.
     * @dev The function then calculates the total value of the merged token by summing the values of the tokens to be
     * merged.
     * @dev The `tokenValues` mapping is updated with the total value of the merged token.
     * @dev The tokens to be merged are burned except the last one that receives all the units.
     * @dev A `BatchValueTransfer` event is emitted to indicate that the tokens have been merged into a single token.
     */
    function _mergeTokensUnits(address _account, uint256[] memory _fractionIDs) internal {
        if (_fractionIDs.length > FRACTION_LIMIT || _fractionIDs.length < 2) {
            revert Errors.ArraySize();
        }
        uint256 len = _fractionIDs.length - 1;

        uint256 _typeID = getBaseType(_fractionIDs[0]);
        uint256 target = _fractionIDs[len];

        uint256 _totalValue;
        uint256[] memory typeIDs = new uint256[](len);
        uint256[] memory fromIDs = new uint256[](len);
        uint256[] memory toIDs = new uint256[](len);
        uint256[] memory values = new uint256[](len);
        uint256[] memory amounts = new uint256[](len);

        {
            for (uint256 i; i < len;) {
                uint256 _fractionID = _fractionIDs[i];
                typeIDs[i] = _typeID;
                fromIDs[i] = _fractionID;
                toIDs[i] = target;
                amounts[i] = 1;
                values[i] = tokenValues[_fractionID];

                if (_account == address(0) || owners[_fractionID] != _account || owners[target] != _account) {
                    revert Errors.NotAllowed();
                }

                unchecked {
                    ++i;
                }
            }
        }

        _beforeUnitTransfer(_msgSender(), _account, fromIDs, toIDs, values, "");

        for (uint256 i; i < len;) {
            _totalValue += values[i];

            delete tokenValues[fromIDs[i]];
            unchecked {
                ++i;
            }
        }

        tokenValues[target] += _totalValue;

        _burnBatch(_account, fromIDs, amounts);
        emit BatchValueTransfer(typeIDs, fromIDs, toIDs, values);
    }

    /**
     * @dev Burns a single token and emits a `ValueTransfer` event with a value of 0.
     * @param _account The address of the account that owns the token to burn.
     * @param _tokenID The ID of the token to burn.
     * @dev This function burns a single token with the specified ID and emits a `ValueTransfer` event `toTokenID` 0.
     * @dev The function checks that the caller is the owner of the token or is approved to burn the token on behalf of
     * the owner.
     * @dev The function then deletes the token from the `tokenValues` mapping and calls the `_burn` function to burn
     * the token.
     */
    function _burnToken(address _account, uint256 _tokenID) internal {
        if (_account != _msgSender() && !isApprovedForAll(_account, _msgSender())) revert Errors.NotApprovedOrOwner();

        uint256 value = tokenValues[_tokenID];

        delete tokenValues[_tokenID];

        _burn(_account, _tokenID, 1);
        emit ValueTransfer(getBaseType(_tokenID), _tokenID, 0, value);
    }

    /**
     * @dev Burns multiple tokens and emits a `BatchValueTransfer` event with a value of 0 for each token burned.
     * @param _account The address of the account that owns the tokens to burn.
     * @param _tokenIDs An array of token IDs to burn.
     * @dev This function burns multiple tokens with the specified IDs and emits a `BatchValueTransfer` event.
     * @dev The function checks that the caller is the owner of the tokens or is approved to burn the tokens on behalf
     * of the owner.
     * @dev The function then deletes the tokens from the `tokenValues` mapping and calls the `_burnBatch` function to
     * burn the tokens.
     * @dev Finally, the function emits a `BatchValueTransfer` event with a value of 1 and `toTokenIDs` as 0 for each
     * token burned to indicate that the tokens have been burned.
     */
    function _batchBurnToken(address _account, uint256[] memory _tokenIDs) internal {
        if (_account != _msgSender() && !isApprovedForAll(_account, _msgSender())) revert Errors.NotApprovedOrOwner();

        uint256 len = _tokenIDs.length;

        // ERC115 requires values
        uint256[] memory claimIDs = new uint256[](len);
        uint256[] memory toTokens = new uint256[](len);
        uint256[] memory claimUnits = new uint256[](len);
        uint256[] memory values = new uint256[](len);

        for (uint256 i; i < len; i++) {
            uint256 _tokenId = _tokenIDs[i];
            uint256 value = tokenValues[_tokenId];

            delete tokenValues[_tokenId];

            claimIDs[i] = getBaseType(_tokenId);
            claimUnits[i] = value;
            values[i] = 1;
        }

        _burnBatch(_account, _tokenIDs, values);
        emit BatchValueTransfer(claimIDs, _tokenIDs, toTokens, claimUnits);
    }

    /// TRANSFERS

    // The following functions are overrides required by Solidity.
    /**
     * @dev Called after a token transfer has been completed.
     * @param operator The address of the operator performing the transfer.
     * @param from The address of the sender of the tokens.
     * @param to The address of the recipient of the tokens.
     * @param ids An array of token IDs that were transferred.
     * @param amounts An array of token amounts that were transferred.
     * @param data Additional data that was passed along with the transfer.
     * @dev This function updates the `owners` mapping to reflect the new owner of each token that was transferred.
     */
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

        for (uint256 i; i < len;) {
            owners[ids[i]] = to;
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Called before a batch of tokens is transferred.
     * @param {operator} The address of the operator performing the transfer.
     * @param from The address of the sender of the tokens.
     * @param fromIDs An array of token IDs that are being transferred.
     * @param toIDs An array of token IDs that the tokens are being transferred to.
     * @param {values} An array of token amounts that are being transferred.
     * @param {data} Additional data that was passed along with the transfer.
     * @dev This function checks that the transfer is allowed by verifying that the sender is approved to transfer the
     * tokens and that the tokens being transferred are of the same base type.
     */
    function _beforeUnitTransfer(
        address, /*operator*/
        address from,
        uint256[] memory fromIDs,
        uint256[] memory toIDs,
        uint256[] memory, /*values*/
        bytes memory /*data*/
    ) internal virtual {
        uint256 len = fromIDs.length;
        if (from != _msgSender() && !isApprovedForAll(from, _msgSender())) revert Errors.NotApprovedOrOwner();

        for (uint256 i; i < len;) {
            uint256 _from = fromIDs[i];
            uint256 _to = toIDs[i];

            if (isBaseType(_from)) revert Errors.NotAllowed();
            if (getBaseType(_from) != getBaseType(_to)) revert Errors.TypeMismatch();
            unchecked {
                ++i;
            }
        }
    }

    /// METADATA

    /**
     * @dev Returns the metadata URI for a given token ID.
     * @param tokenID The ID of the token to retrieve the metadata URI for.
     * @return _uri The metadata URI for the specified token ID.
     * @dev This function retrieves the metadata URI for the specified token ID by calling the `uri` function of the
     * `ERC1155URIStorageUpgradeable` contract.
     * @dev The metadata URI is a string that points to a JSON file containing information about the token, such as its
     * name, symbol, and image.
     * @dev This function always returns the URI for the basetype so that it's managed in one place.
     */
    function uri(uint256 tokenID)
        public
        view
        virtual
        override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable)
        returns (string memory _uri)
    {
        // All tokens share the same metadata at the moment
        _uri = ERC1155URIStorageUpgradeable.uri(getBaseType(tokenID));
    }

    /// UTILS

    /**
     * @dev Checks if the specified token ID is below the maximum item index.
     * @param tokenID The ID of the token to check.
     * @dev This function checks if the specified token ID is below the maximum item index by converting the token ID to
     * a `uint128` value and incrementing it.
     * @dev If the token ID is greater than or equal to the maximum item index, the function will revert with an error.
     */
    function _notMaxItem(uint256 tokenID) private pure {
        uint128 _count = uint128(tokenID);
        ++_count;
    }

    /**
     * @dev Checks if the specified token ID is below the maximum type index.
     * @param tokenID The ID of the token to check.
     * @dev This function checks if the specified token ID is below the maximum type index by shifting the token ID
     * right by 128 bits to get the type ID and converting it to a `uint128` value.
     * @dev If the type ID is greater than or equal to the maximum type index, the function will revert with an error.
     */
    function _notMaxType(uint256 tokenID) private pure {
        uint128 _count = uint128(tokenID >> 128);
        ++_count;
    }

    /**
     * @dev Calculates the sum of the elements of an array.
     * @param array The array of uint256 values to sum.
     * @return sum The sum of the elements of the array.
     * @dev This function calculates the sum of the elements of the specified array by iterating over the array and
     * adding each element to a running total.
     * @dev If an element in the array is 0, the function will revert with an error.
     */
    function _getSum(uint256[] memory array) internal pure returns (uint256 sum) {
        uint256 len = array.length;
        for (uint256 i; i < len;) {
            if (array[i] == 0) revert Errors.NotAllowed();
            sum += array[i];
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Returns an array containing a single element.
     * @param element The element to include in the array.
     * @return An array containing a single element.
     * @dev This function returns an array containing a single element by creating a new array with a length of 1 and
     * setting the first element to the specified value.
     */
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
