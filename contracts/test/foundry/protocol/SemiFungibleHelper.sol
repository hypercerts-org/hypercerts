// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {SemiFungible1155} from "@hypercerts/protocol/SemiFungible1155.sol";
import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";

contract SemiFungible1155Helper is SemiFungible1155, PRBTest, StdCheats, StdUtils {
    error FractionalBurn();
    error NotAllowed();
    error NotApprovedOrOwner();
    error ArraySize();

    function setMaxIndex(uint256 typeID, uint256 index) public {
        maxIndex[typeID] = index;
    }

    function setMaxType() public {
        typeCounter = type(uint256).max;
    }

    function creator(uint256 tokenID) public view returns (address _creator) {
        _creator = creators[tokenID];
    }

    function tokenValue(uint256 tokenID) public view returns (uint256 value) {
        value = tokenValues[tokenID];
    }

    function mintValue(address user, uint256 value, string memory uri) public returns (uint256 tokenID) {
        return _mintNewTypeWithToken(user, value, uri);
    }

    function mintValue(address user, uint256[] calldata values, string memory uri) public returns (uint256 tokenID) {
        return _mintNewTypeWithTokens(user, values, uri);
    }

    function mintClaim(address account, uint256 typeID, uint256 units) public returns (uint256 tokenID) {
        return _mintToken(account, typeID, units);
    }

    function splitValue(address user, uint256 tokenID, uint256[] calldata values) public {
        _splitTokenUnits(user, tokenID, values);
    }

    function mergeValue(address account, uint256[] memory tokenIDs) public {
        _mergeTokensUnits(account, tokenIDs);
    }

    function burnValue(address account, uint256 tokenID) public {
        _burnToken(account, tokenID);
    }

    function batchBurnValues(address account, uint256[] memory tokenIDs) public {
        _batchBurnToken(account, tokenIDs);
    }

    function unitsOf(uint256 tokenID) public view returns (uint256) {
        return _unitsOf(tokenID);
    }

    function unitsOf(address owner, uint256 tokenID) public view returns (uint256) {
        return _unitsOf(owner, tokenID);
    }

    function noOverflow(uint256[] memory values) public pure returns (bool) {
        uint256 total;
        for (uint256 i = 0; i < values.length; i++) {
            uint256 newTotal;
            unchecked {
                newTotal = total + values[i];
                if (newTotal < total) {
                    return false;
                }
                total = newTotal;
            }
        }
        return true;
    }

    function noZeroes(uint256[] memory values) public pure returns (bool) {
        for (uint256 i = 0; i < values.length; i++) {
            if (values[i] == 0) return false;
        }
        return true;
    }

    function getSum(uint256[] memory array) public pure returns (uint256 sum) {
        if (array.length == 0) {
            return 0;
        }
        sum = 0;
        for (uint256 i = 0; i < array.length; i++) {
            sum += array[i];
        }
    }

    function buildValues(uint256 size, uint256 base) public pure returns (uint256[] memory) {
        uint256[] memory _values = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            _values[i] = base;
        }
        return _values;
    }

    function buildIDs(uint256 baseID, uint256 size) public pure returns (uint256[] memory) {
        uint256[] memory _values = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            _values[i] = baseID + i + 1;
        }
        return _values;
    }

    function getCount() public view returns (uint256) {
        return typeCounter;
    }

    function isContract(address account) public view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    function swapFirstLast(uint256[] memory values) public pure returns (uint256[] memory swappedValues) {
        swappedValues = values;
        uint256 len = values.length - 1;

        uint256 swapValue = values[len];
        values[len] = values[0];
        swappedValues[0] = swapValue;
    }

    function validateOwnerBalanceUnits(uint256 tokenID, address owner, uint256 balance, uint256 units) public {
        uint256 _expectedUnits = 0;
        if (ownerOf(tokenID) == owner) {
            _expectedUnits = units;
        }
        assertEq(ownerOf(tokenID), owner);
        assertEq(balanceOf(owner, tokenID), balance);
        assertEq(unitsOf(owner, tokenID), _expectedUnits);
    }

    function validateNotOwnerNoBalanceNoUnits(uint256 tokenID, address owner) public {
        assertNotEq(ownerOf(tokenID), owner);
        assertEq(balanceOf(owner, tokenID), 0);
        assertEq(unitsOf(owner, tokenID), 0);
    }
}
