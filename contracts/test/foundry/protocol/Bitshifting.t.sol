// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";

contract Bitshifter {
    /// @dev Bitmask used to expose only upper 128 bits of uint256
    uint256 public constant TYPE_MASK = type(uint256).max << 128;

    /// @dev Bitmask used to expose only lower 128 bits of uint256
    uint256 public constant NF_INDEX_MASK = type(uint256).max >> 128;

    /// @dev Get index of fractional token at `_id` by returning lower 128 bit values
    /// @dev Returns 0 if `_id` is a baseType
    function getItemIndex(uint256 _id) internal pure returns (uint256) {
        return _id & NF_INDEX_MASK;
    }

    /// @dev Get base type ID for token at `_id` by returning upper 128 bit values
    function getBaseType(uint256 _id) internal pure returns (uint256) {
        return _id & TYPE_MASK;
    }

    /// @dev Identify that token at `_id` is base type.
    /// @dev Upper 128 bits identify base type ID, lower bits should be 0
    function isBaseType(uint256 _id) internal pure returns (bool) {
        return (_id & TYPE_MASK == _id) && (_id & NF_INDEX_MASK == 0);
    }

    /// @dev Identify that token at `_id` is fraction of a claim.
    /// @dev Upper 128 bits identify base type ID, lower bits should be > 0
    function isTypedItem(uint256 _id) internal pure returns (bool) {
        return (_id & TYPE_MASK > 0) && (_id & NF_INDEX_MASK > 0);
    }
}

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract BitshiftingTest is PRBTest, StdCheats, StdUtils, Bitshifter {
    function setUp() public {
        // solhint-disable-previous-line no-empty-blocks
    }

    // HAPPY MINTING

    function testTypeMask() public {
        // 128 1s, 128 0s
        assertEq(
            TYPE_MASK,
            115_792_089_237_316_195_423_570_985_008_687_907_852_929_702_298_719_625_575_994_209_400_481_361_428_480
        );

        // 128 0s, 128 1s
        assertEq(NF_INDEX_MASK, 340_282_366_920_938_463_463_374_607_431_768_211_455);
    }

    function testBaseType() public {
        uint256 baseID = 1 << 128;
        uint256 baseType = getBaseType(baseID);
        assertEq(baseID, baseType);
        assertEq(baseID, 340_282_366_920_938_463_463_374_607_431_768_211_456);

        assertTrue(isBaseType(baseID));
        assertEq(getItemIndex(baseID), 0);
        assertEq(getBaseType(baseID), 340_282_366_920_938_463_463_374_607_431_768_211_456);
        assertFalse(isTypedItem(baseID));
    }

    function testBaseTypeFuzz(uint256 index) public {
        vm.assume(index > 0);
        uint256 baseType = index << 128;

        vm.assume(baseType > 0);

        assertTrue(isBaseType(baseType));
        assertEq(getItemIndex(baseType), 0);
        assertFalse(isTypedItem(baseType));
    }

    function testFractionalToken() public {
        uint256 baseID = 1;
        uint256 baseType = getItemIndex(baseID);
        assertEq(baseID, baseType);
        assertEq(baseID, 1);

        assertFalse(isBaseType(baseID));
        assertEq(getItemIndex(baseID), 1);
        assertEq(getBaseType(baseID), 0);
        assertFalse(isTypedItem(baseID)); // baseType 0
    }

    // UNHAPPY
    function testSimpleOverflow() public {
        // Test with max value of lower 128 bits
        uint256 itemID = type(uint128).max;

        assertFalse(isBaseType(itemID));
        assertEq(getItemIndex(itemID), itemID);
        assertEq(getBaseType(itemID), 0);
        assertFalse(isTypedItem(itemID));

        // Merge with baseID to get max index value of baseType
        uint256 baseType = 1 << 128;

        uint256 typedItem = baseType + itemID;

        assertFalse(isBaseType(typedItem)); //has fungible ID
        assertTrue(isTypedItem(typedItem)); //has fungible iD
        assertEq(getItemIndex(typedItem), itemID);
        assertEq(getBaseType(typedItem), baseType);

        // Add 1 to overflow into the next baseType
        uint256 overflowItem = typedItem + 1;

        assertTrue(isBaseType(overflowItem)); //has fungible ID
        assertFalse(isTypedItem(overflowItem)); //has fungible iD
        assertEq(getItemIndex(overflowItem), 0);
        assertEq(getBaseType(overflowItem), 2 << 128);
    }
}
