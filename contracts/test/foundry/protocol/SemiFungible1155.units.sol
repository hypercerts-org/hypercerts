// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SemiFungible1155Helper} from "./SemiFungibleHelper.sol";

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract SemiFungible1155UnitsTest is PRBTest, StdCheats, StdUtils {
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

    // FULL TOKENS

    function testUnitsSingleFraction() public {
        uint256 baseID = 1 << 128;
        uint128 tokenID = 1;

        semiFungible.mintValue(alice, 10_000, _uri);

        assertEq(semiFungible.unitsOf(baseID), 10_000);

        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, alice, 1, 10_000);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, bob);

        // All tokens have value/supply of 1
        assertEq(semiFungible.balanceOf(alice, baseID + tokenID), 1);

        // Block 'regular' transfer of base type ID token
        vm.expectRevert("ERC1155: insufficient balance for transfer");
        semiFungible.safeTransferFrom(alice, bob, baseID, 1, "");

        // Transfer ownership of fractional token
        semiFungible.safeTransferFrom(alice, bob, baseID + tokenID, 1, "");

        assertEq(semiFungible.unitsOf(baseID), 10_000);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID + tokenID, alice);

        assertEq(semiFungible.balanceOf(bob, baseID), 0);
        semiFungible.validateOwnerBalanceUnits(baseID + tokenID, bob, 1, 10_000);
    }

    function testUnitsMultipleFractions() public {
        uint256 baseID = 1 << 128;

        uint256 size = 20;
        uint256 value = 2000;
        uint256 totalValue = size * value;
        uint256[] memory values = semiFungible.buildValues(size, value);
        uint256[] memory tokenIDs = semiFungible.buildIDs(baseID, size);

        semiFungible.mintValue(alice, values, _uri);

        assertEq(semiFungible.unitsOf(baseID), totalValue);

        semiFungible.validateNotOwnerNoBalanceNoUnits(baseID, bob);

        values = semiFungible.swapFirstLast(values);

        for (uint256 i = 0; i < tokenIDs.length - 1; i++) {
            semiFungible.validateOwnerBalanceUnits(tokenIDs[i], alice, 1, value);
            semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[i], bob);
        }
    }
}
