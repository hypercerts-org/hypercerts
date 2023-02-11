// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import { console2 } from "forge-std/console2.sol";
import { PRBTest } from "prb-test/PRBTest.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { StdUtils } from "forge-std/StdUtils.sol";

import { AllowlistMinter } from "../../src/AllowlistMinter.sol";
import { Merkle } from "murky/Merkle.sol";

contract MerkleHelper is AllowlistMinter, Merkle {
    function generateCustomData(
        address[] calldata addresses,
        uint256[] calldata units
    ) public pure returns (bytes32[] memory data) {
        data = new bytes32[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            data[i] = _calculateLeaf(addresses[i], units[i]);
        }
    }

    function generateData(uint256 size, uint256 value) public view returns (bytes32[] memory data) {
        data = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            data[i] = _calculateLeaf(msg.sender, value);
        }
    }

    function processClaim(bytes32[] calldata proof, uint256 claimID, uint256 amount) public returns (bool processed) {
        _processClaim(proof, claimID, amount);
        processed = true;
    }

    function createAllowlist(uint256 claimID, bytes32 root) public returns (bool created) {
        _createAllowlist(claimID, root);
        created = true;
    }
}

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract AllowlistTest is PRBTest, StdCheats, StdUtils {
    event WorkScopeAdded(bytes32 indexed id, string indexed text);
    event RightAdded(bytes32 indexed id, string indexed text);
    event ImpactScopeAdded(bytes32 indexed id, string indexed text);
    MerkleHelper internal merkle;

    function setUp() public {
        merkle = new MerkleHelper();
    }

    // Used for testing with FE merkle libs
    function testCustomAllowlist() public {
        address[] memory accounts = new address[](3);
        accounts[0] = address(0x23314160c752D6Bb544661DcE13d01C21c64331E);
        accounts[1] = address(0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91);
        accounts[2] = address(0x23314160c752D6Bb544661DcE13d01C21c64331E);

        uint256[] memory units = new uint256[](3);
        units[0] = 100;
        units[1] = 300;
        units[2] = 600;

        bytes32[] memory data = merkle.generateCustomData(accounts, units);
        for (uint256 i = 0; i < data.length; i++) {
            console2.logBytes32(data[i]);
        }

        bytes32 root = merkle.getRoot(data);

        bytes32[] memory proof = merkle.getProof(data, 0);

        uint256 claimID = 1;

        assertTrue(merkle.createAllowlist(claimID, root));

        assertTrue(merkle.isAllowedToClaim(proof, claimID, data[0]));
    }

    function testBasicAllowlist() public {
        bytes32[] memory data = merkle.generateData(4, 10_000);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        assertTrue(merkle.createAllowlist(claimID, root));

        assertTrue(merkle.isAllowedToClaim(proof, claimID, data[2]));
    }

    function testBasicAllowlistFuzz(uint256 size) public {
        size = bound(size, 4, 5_000);
        bytes32[] memory data = merkle.generateData(size, 10_000);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        assertTrue(merkle.createAllowlist(claimID, root));

        assertTrue(merkle.isAllowedToClaim(proof, claimID, data[2]));
    }

    function testProcessClaimFuzz(uint256 size) public {
        size = bound(size, 4, 5_000);
        uint256 value = 10_000;
        bytes32[] memory data = merkle.generateData(size, value);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        assertTrue(merkle.createAllowlist(claimID, root));

        assertTrue(merkle.isAllowedToClaim(proof, claimID, data[2]));

        assertTrue(merkle.processClaim(proof, claimID, value));

        assertTrue(merkle.hasBeenClaimed(claimID, data[2]));
    }
}
