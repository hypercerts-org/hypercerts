// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155BurnTest is PRBTest, StdCheats, StdUtils, SemiFungible1155Helper {
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

    function testBurnFraction() public {
        uint256 baseID = 1 << 128;

        uint256 size = 20;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        semiFungible.validateOwnerBalanceUnits(tokenIDs[1], alice, 1, values[1]);

        changePrank(bob);
        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.burnValue(alice, tokenIDs[1]);

        changePrank(alice);
        vm.expectEmit(true, true, true, true);
        emit TransferSingle(alice, alice, address(0), tokenIDs[1], 1);
        semiFungible.burnValue(alice, tokenIDs[1]);

        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[1], alice);
    }

    function testBatchBurnFractions() public {
        uint256 baseID = 1 << 128;

        uint256 size = 20;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        uint256[] memory valueToBurn = new uint256[](2);
        valueToBurn[0] = 1;
        valueToBurn[1] = 1;
        uint256[] memory idsToBurn = new uint256[](2);
        idsToBurn[0] = tokenIDs[1];
        idsToBurn[1] = tokenIDs[7];
        uint256[] memory toTokens = new uint256[](2);
        toTokens[0] = 0;
        toTokens[1] = 0;

        startHoax(alice, 100 ether);

        semiFungible.mintValue(alice, values, _uri);
        semiFungible.validateOwnerBalanceUnits(tokenIDs[1], alice, 1, values[1]);

        assertEq(semiFungible.unitsOf(tokenIDs[7]), 2000);
        assertEq(semiFungible.unitsOf(baseID), size * value);

        changePrank(bob);
        vm.expectRevert(NotApprovedOrOwner.selector);
        semiFungible.batchBurnValues(alice, idsToBurn);

        changePrank(alice);
        vm.expectEmit(true, true, true, true);
        emit TransferBatch(alice, alice, address(0), idsToBurn, valueToBurn);
        semiFungible.batchBurnValues(alice, idsToBurn);

        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[1], alice);
        assertEq(semiFungible.unitsOf(tokenIDs[1]), 0);

        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[7], alice);
        assertEq(semiFungible.unitsOf(tokenIDs[7]), 0);

        assertEq(semiFungible.unitsOf(baseID), size * value);
    }

    function testCannotBurnClaim() public {
        uint256 size = 20;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);

        startHoax(alice, 100 ether);

        uint256 baseID = semiFungible.mintValue(alice, values, _uri);

        vm.expectRevert("ERC1155: burn amount exceeds balance");
        semiFungible.burnValue(alice, baseID);
    }

    function testCannotBatchBurnClaim() public {
        uint256 size = 20;
        uint256 value = 2000;
        uint256[] memory values = semiFungible.buildValues(size, value);

        startHoax(alice, 100 ether);

        uint256 baseID = semiFungible.mintValue(alice, values, _uri);

        uint256[] memory idsToBurn = new uint256[](1);
        idsToBurn[0] = baseID;

        vm.expectRevert("ERC1155: burn amount exceeds balance");
        semiFungible.batchBurnValues(alice, idsToBurn);
    }
}
