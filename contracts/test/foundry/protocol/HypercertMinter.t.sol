// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {Merkle} from "murky/Merkle.sol";
import {PRBTest} from "prb-test/PRBTest.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

contract MinterTestHelper {
    event ClaimStored(uint256 indexed claimID, string uri, uint256 totalUnits);

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

    function buildFractions(uint256 size) public pure returns (uint256[] memory) {
        uint256[] memory fractions = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            fractions[i] = 100 * i + 1;
        }
        return fractions;
    }
}

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract HypercertMinterTest is PRBTest, StdCheats, StdUtils, MinterTestHelper {
    Merkle internal merkle;
    HypercertMinter internal hypercertMinter;
    string internal _uri;
    address internal alice;

    function setUp() public {
        merkle = new Merkle();
        hypercertMinter = new HypercertMinter();
        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        alice = address(1);
        startHoax(alice, 10 ether);
    }

    function testSupportsInterface() public {
        // 721
        assertEq(hypercertMinter.supportsInterface(0x80ac58cd), false);

        // 1155
        assertEq(hypercertMinter.supportsInterface(0xd9b67a26), true);

        // IHypercertToken
        assertEq(hypercertMinter.supportsInterface(0xda69bafa), true);
    }

    /// @dev Run Forge with `-vvvv` to see console logs.
    function testFailInitialize() public {
        hypercertMinter.initialize();
    }

    function testName() public {
        assertEq(keccak256(abi.encodePacked(hypercertMinter.name())), keccak256("HypercertMinter"));
    }

    function testClaimSingleFraction() public {
        uint256 units = 10_000;

        vm.expectEmit(true, true, true, true);
        emit ClaimStored(1 << 128, _uri, units);
        hypercertMinter.mintClaim(alice, units, _uri, IHypercertToken.TransferRestrictions.AllowAll);
    }

    function testClaimTenFractions() public {
        uint256[] memory fractions = buildFractions(10);
        uint256 totalUnits = getSum(fractions);
        vm.expectEmit(true, true, true, true);
        emit ClaimStored(1 << 128, _uri, totalUnits);
        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.AllowAll
        );
    }

    function testClaimHundredFractions() public {
        uint256[] memory fractions = buildFractions(100);
        uint256 totalUnits = getSum(fractions);

        vm.expectEmit(true, true, true, true);
        emit ClaimStored(1 << 128, _uri, totalUnits);
        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.AllowAll
        );
    }

    function testClaimTenFractionsDisallowAll() public {
        uint256[] memory fractions = buildFractions(10);
        uint256 totalUnits = getSum(fractions);
        vm.expectEmit(true, true, true, true);
        emit ClaimStored(1 << 128, _uri, totalUnits);
        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.DisallowAll
        );
    }

    function testClaimTenFractionsFromCreatorOnly() public {
        uint256[] memory fractions = buildFractions(10);
        uint256 totalUnits = getSum(fractions);
        vm.expectEmit(true, true, true, true);
        emit ClaimStored(1 << 128, _uri, totalUnits);
        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.FromCreatorOnly
        );
    }
}
