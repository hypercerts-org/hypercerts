// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {PRBTest} from "prb-test/PRBTest.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155TransferTest is PRBTest, StdCheats, StdUtils {
    SemiFungible1155Helper internal semiFungible;
    string internal _uri;
    address internal alice;
    address internal bob;

    function setUp() public {
        semiFungible = new SemiFungible1155Helper();
        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        alice = address(1);
        bob = address(2);
        startHoax(alice, 100 ether);
    }

    // UNHAPPY PATHS
    function testFailTransferTypeIDToken() public {
        semiFungible.mintValue(alice, 10_000, _uri);

        //NotApprovedOrOWner, since no owner
        semiFungible.safeTransferFrom(alice, bob, 1 << 128, 1, "");
    }

    function testFailTransferNonExistingFractionToken() public {
        semiFungible.mintValue(alice, 10_000, _uri);

        //NotApprovedOrOWner, since no owner
        semiFungible.safeTransferFrom(alice, bob, 1 << (128 + 2), 1, "");
    }

    function testTransferNonExistingTokenWithValue() public {
        uint256 baseID = 1 << 128;
        uint128 tokenID = 1;

        vm.expectRevert(bytes("ERC1155: insufficient balance for transfer"));
        semiFungible.safeTransferFrom(alice, bob, baseID + tokenID, 1, "");
    }

    function testTransferNonExistingFungibleTokenTokenNoValue() public {
        uint256 baseID = 1 << 128;
        uint128 tokenID = 1;

        // Pass because zero-value in call
        semiFungible.safeTransferFrom(alice, bob, baseID + tokenID, 0, "");
    }

    // FULL TOKENS

    function testTransferFullToken() public {
        uint256 baseID = 1 << 128;
        uint128 tokenID = 1;

        semiFungible.mintValue(alice, 10_000, _uri);

        assertEq(semiFungible.balanceOf(alice, baseID), 0);
        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, alice, 1, 10_000);

        assertEq(semiFungible.balanceOf(bob, baseID), 0);
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, bob);

        // Bloack transfer ownership of impact claim 'data'
        vm.expectRevert("ERC1155: insufficient balance for transfer");
        semiFungible.safeTransferFrom(alice, bob, baseID, 1, "");

        // Transfer ownership of hypercert
        semiFungible.safeTransferFrom(alice, bob, baseID + tokenID, 1, "");

        // Updates tokenFraction value for (new) owner
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, alice);

        // Updates token ownership
        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, bob, 1, 10_000);
    }

    function testFuzzTransferFullToken(address from, address to, uint256 units) public {
        vm.assume(units > 0);
        vm.assume(from != to && from != address(0) && to != address(0));
        vm.assume(!semiFungible.isContract(from) && !semiFungible.isContract(to));

        startHoax(from, 100 ether);

        uint256 baseID = 1 << 128;
        uint128 tokenID = 1;

        semiFungible.mintValue(from, units, _uri);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, from);
        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, from, 1, units);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, to);
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, to);

        semiFungible.safeTransferFrom(from, to, baseID + tokenID, 1, "");

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, from);
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, from);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, to);
        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, to, 1, units);
    }

    // FRACTIONS

    function testTransferFraction() public {
        uint256 baseID = 1 << 128;

        uint256 size = 20;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, alice);
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, bob);

        semiFungible.validateOwnerBalanceUnits(tokenIDs[0], alice, 1, value);
        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[0], bob);

        semiFungible.safeTransferFrom(alice, bob, tokenIDs[1], 1, "");

        // Updates tokenFraction value for (new) owner
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, alice);
        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, bob);

        // Updates token ownership
        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[1], alice);
        semiFungible.validateOwnerBalanceUnits(tokenIDs[1], bob, 1, value);
    }

    function testFuzzTransferFraction(address from, address to, uint256 size) public {
        vm.assume(from != to && from != address(0) && to != address(0));
        vm.assume(!semiFungible.isContract(from) && !semiFungible.isContract(to));
        size = bound(size, 2, 253);

        uint256 baseID = 1 << 128;

        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(from, 100 ether);

        semiFungible.mintValue(from, values, _uri);

        assertEq(semiFungible.balanceOf(from, baseID), 0);
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], from, 1, value);
        }

        assertEq(semiFungible.balanceOf(to, baseID), 0);
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], to);
        }

        // Transfer all except last one
        semiFungible.safeTransferFrom(from, to, tokenIDs[size - 1], 1, "");

        assertEq(semiFungible.balanceOf(from, baseID), 0);
        assertEq(semiFungible.balanceOf(to, baseID), 0);

        for (uint256 i = 0; i < tokenIDs.length - 1; i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], from, 1, value);
        }

        for (uint256 i = 0; i < tokenIDs.length - 1; i++) {
            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], to);
        }

        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[size - 1], from);
        semiFungible.validateOwnerBalanceUnits(tokenIDs[size - 1], to, 1, value);
    }
}
