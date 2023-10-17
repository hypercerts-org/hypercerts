// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.16;

import { PRBTest } from "prb-test/PRBTest.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { StdUtils } from "forge-std/StdUtils.sol";
import { SemiFungible1155Helper } from "./SemiFungibleHelper.sol";

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

        vm.expectEmit(true, true, true, true);
        emit TransferSingle(alice, alice, address(0), tokenIDs[1], 1);
        semiFungible.burnValue(alice, tokenIDs[1]);

        semiFungible.validateNotOwnerNoBalanceNoUnits(tokenIDs[1], alice);
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
}
