// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";
import {Errors} from "@hypercerts/protocol/libs/Errors.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155DefaultTest is PRBTest, StdCheats, StdUtils, SemiFungible1155Helper {
    SemiFungible1155Helper internal semiFungible;
    string internal _uri;
    address internal alice;
    address internal bob;

    function setUp() public {
        semiFungible = new SemiFungible1155Helper();
        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        alice = address(1);
        bob = address(2);
    }

    /// @dev Run Forge with `-vvvv` to see console logs.
    function testFailInitialize() public {
        semiFungible.__SemiFungible1155_init();
    }

    function testSplitValue() public {
        uint256 baseID = 1 << 128;
        uint256 tokenID = baseID + 1;
        uint256[] memory values = new uint256[](2);
        values[0] = 7000;
        values[1] = 3000;

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, 10_000, _uri);
        semiFungible.splitValue(alice, tokenID, values);

        assertEq(semiFungible.unitsOf(baseID), 10_000);

        semiFungible.validateOwnerBalanceUnits(tokenID, alice, 1, values[0]);
        semiFungible.validateOwnerBalanceUnits(tokenID + 1, alice, 1, values[1]);

        // Units
        assertEq(semiFungible.unitsOf(baseID), 10_000);
        assertEq(semiFungible.unitsOf(tokenID), 7000);
        assertEq(semiFungible.unitsOf(tokenID + 1), 3000);
    }

    function testSplitValueLarge() public {
        uint256 baseID = 1 << 128;
        uint256 tokenID = baseID + 1;
        uint256 size = 100;
        uint256 value = 1000;
        uint256 totalValue = size * value;

        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, totalValue, _uri);

        semiFungible.splitValue(alice, tokenID, values);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, alice);

        for (uint256 i = 0; i < tokenIDs.length; i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], alice, 1, value);
            assertEq(semiFungible.unitsOf(tokenIDs[i]), value);
        }
    }

    function testMergeValue() public {
        uint256 baseID = 1 << 128;
        uint256 size = 10;
        uint256 value = 2000;
        uint256 totalValue = size * value;

        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        assertEq(semiFungible.unitsOf(baseID), totalValue);

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], alice, 1, value);

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], bob);
        }

        semiFungible.mergeValue(alice, tokenIDs);

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            assertEq(semiFungible.ownerOf(tokenIDs[i]), address(0));

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], alice);
        }

        assertEq(semiFungible.balanceOf(alice, tokenIDs[tokenIDs.length - 1]), 1);
        assertEq(semiFungible.unitsOf(alice, tokenIDs[tokenIDs.length - 1]), totalValue);
    }

    function testMergeValueFuzz(uint256 size) public {
        size = bound(size, 2, 253);

        uint256 baseID = 1 << 128;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256 totalValue = size * value;

        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        assertEq(semiFungible.unitsOf(baseID), totalValue);

        semiFungible.mergeValue(alice, tokenIDs);

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            assertEq(semiFungible.ownerOf(tokenIDs[i]), address(0));

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], alice);
        }

        assertEq(semiFungible.balanceOf(alice, tokenIDs[tokenIDs.length - 1]), 1);
        assertEq(semiFungible.unitsOf(alice, tokenIDs[tokenIDs.length - 1]), totalValue);
    }

    function testCannotMergeValueToZeroOrOther() public {
        uint256 baseID = 1 << 128;
        uint256 size = 10;
        uint256 value = 2000;
        uint256 totalValue = size * value;

        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        assertEq(semiFungible.unitsOf(baseID), totalValue);

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], alice, 1, value);

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], bob);
        }

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(address(0), tokenIDs);

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(bob, tokenIDs);

        semiFungible.mergeValue(alice, tokenIDs);

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            assertEq(semiFungible.ownerOf(tokenIDs[i]), address(0));

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], alice);
        }

        assertEq(semiFungible.balanceOf(alice, tokenIDs[tokenIDs.length - 1]), 1);
        assertEq(semiFungible.unitsOf(alice, tokenIDs[tokenIDs.length - 1]), totalValue);
    }

    function testAllFractionsOwnedByAccount() public {
        uint256 baseID = 1 << 128;
        uint256 size = 10;
        uint256 value = 2000;
        uint256 totalValue = size * value;

        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        assertEq(semiFungible.unitsOf(baseID), totalValue);

        semiFungible.safeTransferFrom(alice, bob, tokenIDs[tokenIDs.length - 1], 1, "");

        for (uint256 i = 0; i < (tokenIDs.length - 1); i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], alice, 1, value);

            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], bob);
        }

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(alice, tokenIDs);

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(bob, tokenIDs);

        semiFungible.setApprovalForAll(bob, true);

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(alice, tokenIDs);

        vm.expectRevert(Errors.NotAllowed.selector);
        semiFungible.mergeValue(bob, tokenIDs);
    }
}
