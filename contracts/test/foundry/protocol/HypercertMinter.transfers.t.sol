// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {PRBTest} from "prb-test/PRBTest.sol";
import {Errors} from "@hypercerts/protocol/libs/Errors.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

/// @dev Testing transfer restrictions on hypercerts
contract HypercertMinterTransferTest is PRBTest, StdCheats, StdUtils {
    HypercertMinter internal hypercertMinter;
    string internal _uri;
    uint256 internal _units;
    uint256 internal baseID;
    uint128 internal tokenIndex;
    uint256 internal tokenID;
    address internal alice;
    address internal bob;

    function setUp() public {
        hypercertMinter = new HypercertMinter();
        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        _units = 10_000;
        baseID = 1 << 128;
        tokenIndex = 1;
        tokenID = baseID + tokenIndex;
        alice = address(1);
        bob = address(2);
    }

    function testTransferAllowAll() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.AllowAll);
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 1);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 0);

        // Alice transfers ownership of hypercert to Bob
        vm.prank(alice);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 0);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 1);

        // Bob transfers back it back to Alice
        vm.prank(bob);
        hypercertMinter.safeTransferFrom(bob, alice, tokenID, 1, "");
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 1);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 0);
    }

    function testTransferDisallowAll() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.DisallowAll);
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 1);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 0);

        // Alice fails to transfer token
        vm.prank(alice);
        vm.expectRevert(Errors.TransfersNotAllowed.selector);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 1);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 0);
    }

    function testTransferFromCreatorOnly() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.FromCreatorOnly);
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 1);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 0);

        // Alice transfers ownership of hypercert to Bob
        vm.prank(alice);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 0);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 1);

        // Bob fails to transfer token
        vm.prank(bob);
        vm.expectRevert(Errors.TransfersNotAllowed.selector);
        hypercertMinter.safeTransferFrom(bob, alice, tokenID, 1, "");
        assertEq(hypercertMinter.balanceOf(alice, tokenID), 0);
        assertEq(hypercertMinter.balanceOf(bob, tokenID), 1);
    }

    function testTransferAllowancesAllowAll() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.AllowAll);

        startHoax(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");

        changePrank(alice);
        hypercertMinter.setApprovalForAll(bob, true);

        changePrank(bob);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
    }

    function testTransferAllowancesDisallowAll() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.DisallowAll);

        startHoax(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");

        changePrank(alice);
        hypercertMinter.setApprovalForAll(bob, true);

        changePrank(bob);
        vm.expectRevert(Errors.TransfersNotAllowed.selector);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
    }

    function testTransferAllowancesFromCreatorOnly() public {
        // Alice creates a hypercert
        vm.prank(alice);
        hypercertMinter.mintClaim(alice, _units, _uri, IHypercertToken.TransferRestrictions.FromCreatorOnly);

        startHoax(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");

        changePrank(alice);
        hypercertMinter.setApprovalForAll(bob, true);

        changePrank(bob);
        hypercertMinter.safeTransferFrom(alice, bob, tokenID, 1, "");
    }
}
