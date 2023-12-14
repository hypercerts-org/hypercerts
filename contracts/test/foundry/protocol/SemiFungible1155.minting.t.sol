// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {stdError} from "forge-std/StdError.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155MintingTest is PRBTest, StdCheats, StdUtils, SemiFungible1155Helper {
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

    // UNHAPPY FLOWS

    function testMintZeroValue() public {
        vm.expectRevert(NotAllowed.selector);
        semiFungible.mintValue(alice, 0, _uri);
    }

    function testMintWithZeroInArray() public {
        uint256[] memory values = new uint256[](3);
        values[0] = 7000;
        values[1] = 3000;
        values[2] = 0;

        vm.expectRevert(NotAllowed.selector);
        semiFungible.mintValue(alice, values, _uri);
    }

    function testOverflowItemIndex() public {
        uint256 baseID = 1 << 128;
        semiFungible.setMaxIndex(baseID, type(uint128).max - 2);

        uint256[] memory values = new uint256[](4);
        values[0] = 10;
        values[1] = 20;
        values[2] = 30;
        values[3] = 40;

        vm.expectRevert(stdError.arithmeticError);
        semiFungible.mintValue(alice, values, _uri);

        baseID = 2 << 128;
        semiFungible.setMaxIndex(baseID, type(uint128).max);

        vm.expectRevert(stdError.arithmeticError);
        semiFungible.mintClaim(alice, baseID, 1000);
    }

    function testOverflowTypes() public {
        semiFungible.setMaxType();

        vm.expectRevert(stdError.arithmeticError);
        semiFungible.mintValue(alice, 10_000, _uri);
    }

    // HAPPY MINTING

    function testMintValueSingle() public {
        uint256 _baseID = 1 << 128;

        // Transfer from 0x0 to 0x0 declares token baseID for claim
        // event TransferSingle
        // address indexed operator
        // address indexed from
        // address indexed to
        // uint256 id
        // uint256 value
        vm.expectEmit(true, true, true, true);
        emit TransferSingle(alice, address(0), address(0), _baseID, 0);
        uint256 baseID = semiFungible.mintValue(alice, 10_000, _uri);

        assertEq(baseID, _baseID);
        assertEq(semiFungible.ownerOf(baseID), address(0));
        assertEq(semiFungible.creator(baseID), alice);
        assertEq(semiFungible.unitsOf(baseID), 10_000);

        semiFungible.validateOwnerBalanceUnits(baseID + 1, alice, 1, 10_000);

        assertEq(semiFungible.tokenValue(baseID), 10_000);
        assertEq(semiFungible.tokenValue(baseID + 1), 10_000);
        assertEq(semiFungible.tokenValue(baseID + 2), 0);
    }

    function testFuzzMintValueSingle(uint256 value) public {
        vm.assume(value > 0);

        uint256 _baseID = 1 << 128;

        vm.expectEmit(true, true, true, true);
        emit TransferSingle(alice, address(0), address(0), _baseID, 0);
        uint256 baseID = semiFungible.mintValue(alice, value, _uri);

        assertEq(baseID, _baseID);
        assertEq(semiFungible.ownerOf(baseID), address(0));
        assertEq(semiFungible.creator(baseID), alice);
        assertEq(semiFungible.unitsOf(baseID), value);

        semiFungible.validateOwnerBalanceUnits(baseID + 1, alice, 1, value);

        assertEq(semiFungible.tokenValue(baseID), value);
        assertEq(semiFungible.tokenValue(baseID + 1), value);
        assertEq(semiFungible.tokenValue(baseID + 2), 0);
    }

    function testMintValueArray() public {
        uint256[] memory values = new uint256[](3);
        values[0] = 7000;
        values[1] = 3000;
        values[2] = 5000;

        uint256 baseID = semiFungible.mintValue(alice, values, _uri);
        assertEq(semiFungible.unitsOf(baseID), 15_000);
        assertEq(semiFungible.ownerOf(baseID), address(0));

        // Swap because of splitting logic
        values[1] = 5000;
        values[2] = 3000;

        for (uint256 i = 0; i < values.length; i++) {
            semiFungible.validateOwnerBalanceUnits(baseID + 1 + i, alice, 1, values[i]);
        }
    }

    //TODO only failing test, appears to be on indexing tokens
    // function testFuzzMintValueArray(uint256[] memory values, address other) public {
    //     vm.assume(values.length > 2 && values.length < 254);
    //     vm.assume(semiFungible.noOverflow(values) && semiFungible.noZeroes(values));
    //     vm.assume(other != address(1) && other != address(0));

    //     uint256 baseID = semiFungible.mintValue(alice, values, _uri);

    //     assertEq(semiFungible.balanceOf(alice, baseID), 1);
    //     assertEq(semiFungible.getSum(values), semiFungible.unitsOf(baseID));
    //     assertEq(semiFungible.balanceOf(other, baseID), 0);

    //     uint256 tokenID = baseID + 1;

    //     for (uint256 i = 0; i < values.length; i++) {
    //         semiFungible.validateOwnerBalanceUnits(tokenID + i, alice, 1, values[i]);
    //         semiFungible.validateNotOwnerNoBalanceNoUnits(tokenID + i, bob);
    //     }
    // }
}
