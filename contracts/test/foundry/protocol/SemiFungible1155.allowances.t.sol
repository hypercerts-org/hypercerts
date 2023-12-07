// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155AllowanceTest is PRBTest, StdCheats, StdUtils, SemiFungible1155Helper {
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

    function testTransferAllowance() public {
        uint256 typeID = semiFungible.mintValue(alice, 100, _uri);

        uint256[] memory values = new uint256[](2);
        values[0] = 50;
        values[1] = 50;

        changePrank(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        semiFungible.safeTransferFrom(alice, bob, typeID + 1, 1, "");

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, true);

        changePrank(bob);
        semiFungible.safeTransferFrom(alice, bob, typeID + 1, 1, "");
    }

    function testSplitAllowance() public {
        uint256 typeID = semiFungible.mintValue(alice, 100, _uri);

        uint256[] memory values = new uint256[](2);
        values[0] = 50;
        values[1] = 50;

        changePrank(bob);
        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.splitValue(alice, typeID + 1, values);

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, true);

        changePrank(bob);
        semiFungible.splitValue(alice, typeID + 1, values);
    }

    function testMergeAllowance() public {
        uint256[] memory values = new uint256[](2);
        values[0] = 50;
        values[1] = 50;

        uint256 typeID = semiFungible.mintValue(alice, values, _uri);

        uint256[] memory ids = new uint256[](2);
        ids[0] = typeID + 1;
        ids[1] = typeID + 2;

        changePrank(bob);
        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.mergeValue(alice, ids);

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, true);

        changePrank(bob);
        semiFungible.mergeValue(alice, ids);
    }

    function testBurnAllowance() public {
        uint256[] memory values = new uint256[](2);
        values[0] = 50;
        values[1] = 50;

        uint256 typeID = semiFungible.mintValue(alice, values, _uri);

        uint256[] memory ids = new uint256[](2);
        ids[0] = typeID + 1;
        ids[1] = typeID + 2;

        changePrank(bob);
        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.burnValue(alice, ids[0]);

        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.burnValue(alice, ids[1]);

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, true);

        changePrank(bob);
        semiFungible.burnValue(alice, ids[0]);
        semiFungible.burnValue(alice, ids[1]);
    }

    function testToggleAllowance() public {
        uint256[] memory values = new uint256[](2);
        values[0] = 50;
        values[1] = 50;

        uint256 typeID = semiFungible.mintValue(alice, values, _uri);

        uint256[] memory ids = new uint256[](2);
        ids[0] = typeID + 1;
        ids[1] = typeID + 2;

        changePrank(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        semiFungible.safeTransferFrom(alice, bob, ids[0], 1, "");

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, true);

        changePrank(bob);
        semiFungible.safeTransferFrom(alice, bob, ids[0], 1, "");

        changePrank(alice);
        semiFungible.setApprovalForAll(bob, false);

        changePrank(bob);
        vm.expectRevert("ERC1155: caller is not token owner or approved");
        semiFungible.safeTransferFrom(alice, bob, ids[1], 1, "");
    }
}
