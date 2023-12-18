// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {PRBTest} from "prb-test/PRBTest.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

contract PausableTestHelper {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    function buildIDs(uint256 size) public pure returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }

    function buildFractions(uint256 size) public pure returns (uint256[] memory) {
        uint256[] memory fractions = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            fractions[i] = 100 * i + 1;
        }
        return fractions;
    }

    function buildBytes32(uint256 size) public pure returns (bytes32[] memory) {
        bytes32[] memory array = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            array[i] = bytes32("mockBytes");
        }
        return array;
    }
}

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract HypercertMinterPausableTest is PRBTest, StdCheats, StdUtils, PausableTestHelper {
    HypercertMinter internal hypercertMinter;
    string internal _uri;
    address internal owner;
    address internal alice;

    function setUp() public {
        owner = address(0);
        alice = address(1);

        hypercertMinter = new HypercertMinter();

        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
    }

    /// @dev Run Forge with `-vvvv` to see console logs.
    function testFailInitialize() public {
        hypercertMinter.initialize();
    }

    function testPause() public {
        uint256[] memory fractions = buildFractions(3);
        bytes32[] memory proofs = buildBytes32(3);
        uint256[] memory ids = buildIDs(3);
        bytes32[][] memory bytesArrayArray = new bytes32[][](1);
        bytesArrayArray[0] = proofs;

        // Only owner can pause
        vm.expectRevert("Ownable: caller is not the owner");
        hypercertMinter.pause();

        startHoax(owner);
        vm.expectEmit(true, false, false, false);
        emit Paused(owner);
        hypercertMinter.pause();

        // Validate methods blocked
        vm.expectRevert("Pausable: paused");
        hypercertMinter.mintClaim(owner, 1, _uri, IHypercertToken.TransferRestrictions.AllowAll);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.mintClaimWithFractions(owner, 1, fractions, _uri, IHypercertToken.TransferRestrictions.AllowAll);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.mintClaimFromAllowlist(owner, proofs, 2, 1000);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.batchMintClaimsFromAllowlists(owner, bytesArrayArray, ids, fractions);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.createAllowlist(owner, 10, proofs[0], _uri, IHypercertToken.TransferRestrictions.AllowAll);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.splitFraction(alice, 1, fractions);

        vm.expectRevert("Pausable: paused");
        hypercertMinter.burnFraction(alice, 1);

        vm.expectEmit(true, false, false, false);

        // Only owner can unpause
        changePrank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        hypercertMinter.unpause();

        changePrank(owner);
        emit Unpaused(alice);
        hypercertMinter.unpause();

        // Unpause releases blocked methods
        changePrank(alice);
        hypercertMinter.mintClaim(alice, 1, _uri, IHypercertToken.TransferRestrictions.AllowAll);
    }
}
