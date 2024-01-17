// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";

import {AllowlistMinter} from "@hypercerts/protocol/AllowlistMinter.sol";
import {Errors} from "@hypercerts/protocol/libs/Errors.sol";

import {Merkle} from "murky/Merkle.sol";

contract MerkleHelper is AllowlistMinter, Merkle {
    function generateCustomData(address[] calldata addresses, uint256[] calldata units)
        public
        pure
        returns (bytes32[] memory data)
    {
        data = new bytes32[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            data[i] = _calculateLeaf(addresses[i], units[i]);
        }
    }

    function generateData(uint256 size, uint256 value) public pure returns (bytes32[] memory data) {
        data = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            address user = address(uint160(i + 1));
            data[i] = _calculateLeaf(user, value);
        }
    }

    function processClaim(bytes32[] calldata proof, uint256 claimID, uint256 amount) public {
        _processClaim(proof, claimID, amount);
    }

    function createAllowlist(uint256 claimID, bytes32 root, uint256 units) public {
        _createAllowlist(claimID, root, units);
    }

    function _getSum(uint256[] memory array) public pure returns (uint256 sum) {
        uint256 len = array.length;
        for (uint256 i; i < len;) {
            sum += array[i];
            unchecked {
                ++i;
            }
        }
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

        bytes32 root = merkle.getRoot(data);

        bytes32[] memory proof = merkle.getProof(data, 0);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, merkle._getSum(units));

        merkle.isAllowedToClaim(proof, claimID, data[0]);
    }

    function testCustomAllowlistMultiple() public {
        address[] memory accounts = new address[](3);
        accounts[0] = address(0x23314160c752D6Bb544661DcE13d01C21c64331E);
        accounts[1] = address(0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91);
        accounts[2] = address(0x23314160c752D6Bb544661DcE13d01C21c64331E);

        uint256[] memory units = new uint256[](3);
        units[0] = 100;
        units[1] = 300;
        units[2] = 600;

        bytes32[] memory data = merkle.generateCustomData(accounts, units);

        bytes32 root = merkle.getRoot(data);

        bytes32[] memory proofZero = merkle.getProof(data, 0);
        bytes32[] memory proofTwo = merkle.getProof(data, 2);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, merkle._getSum(units));

        merkle.isAllowedToClaim(proofZero, claimID, data[0]);
        merkle.isAllowedToClaim(proofTwo, claimID, data[2]);

        startHoax(0x23314160c752D6Bb544661DcE13d01C21c64331E, 10 ether);
        merkle.processClaim(proofZero, claimID, units[0]);
        merkle.processClaim(proofTwo, claimID, units[2]);

        assertEq(merkle.getMinted(claimID), units[0] + units[2]);
    }

    function testBasicAllowlist() public {
        uint256 size = 4;
        uint256 units = 10_000;
        bytes32[] memory data = merkle.generateData(size, units);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, size * units);

        merkle.isAllowedToClaim(proof, claimID, data[2]);
    }

    function testLimitCheckUnits() public {
        uint256 size = 4;
        uint256 units = 10_000;
        bytes32[] memory data = merkle.generateData(size, units);
        bytes32 root = merkle.getRoot(data);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, size * units);

        startHoax(address(1));
        bytes32[] memory proof = merkle.getProof(data, 0);
        merkle.processClaim(proof, claimID, units);

        changePrank(address(2));
        proof = merkle.getProof(data, 1);
        merkle.processClaim(proof, claimID, units);

        changePrank(address(3));
        proof = merkle.getProof(data, 2);
        merkle.processClaim(proof, claimID, units);

        changePrank(address(4));
        proof = merkle.getProof(data, 3);
        vm.expectRevert(Errors.Invalid.selector);
        merkle.processClaim(proof, claimID, units + 1);
    }

    function testBasicAllowlistFuzz(uint256 size) public {
        size = bound(size, 4, 5000);
        uint256 units = 10_000;
        bytes32[] memory data = merkle.generateData(size, 10_000);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, size * units);

        merkle.isAllowedToClaim(proof, claimID, data[2]);
    }

    function testProcessClaimFuzz(uint256 size) public {
        size = bound(size, 4, 5000);
        uint256 value = 10_000;
        bytes32[] memory data = merkle.generateData(size, value);
        bytes32 root = merkle.getRoot(data);
        bytes32[] memory proof = merkle.getProof(data, 2);

        uint256 claimID = 1;

        merkle.createAllowlist(claimID, root, size * value);

        startHoax(address(3));

        merkle.isAllowedToClaim(proof, claimID, data[2]);

        merkle.processClaim(proof, claimID, value);

        merkle.hasBeenClaimed(claimID, data[2]);
    }
}
