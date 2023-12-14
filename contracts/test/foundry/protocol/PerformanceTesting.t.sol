// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {Merkle} from "murky/Merkle.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

// forge test -vv --match-path test/foundry/PerformanceTesting.t.sol

contract PerformanceTestHelper is Merkle {
    struct MerkleDataSet {
        address[] accounts;
        uint256[] units;
        bytes32[] data;
        bytes32 root;
    }

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

    function generateData(uint256 size, uint256 value) public pure returns (bytes32[] memory data) {
        data = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            data[i] = keccak256(bytes.concat(keccak256(abi.encode(address(uint160(i + 1)), value))));
        }
    }

    function isContract(address _addr) internal view returns (bool) {
        uint32 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function _calculateLeaf(address account, uint256 amount) internal pure returns (bytes32 leaf) {
        leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
    }

    function generateCustomData(address[] memory addresses, uint256[] memory units)
        public
        pure
        returns (bytes32[] memory data)
    {
        data = new bytes32[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            data[i] = _calculateLeaf(addresses[i], units[i]);
        }
    }

    function buildFullDataset(uint256 size) internal pure returns (MerkleDataSet memory) {
        address[] memory users;
        uint256[] memory units;
        bytes32[] memory data;
        bytes32 root;
        users = new address[](size);
        units = new uint256[](size);

        for (uint256 i = 0; i < size; i++) {
            users[i] = address(1);
            units[i] = 100 * size * (i + 1);
        }

        data = generateCustomData(users, units);

        root = getRoot(data);
        return MerkleDataSet(users, units, data, root);
    }
}

/// @dev See the "Writing Tests" section in the Foundry Book if this is your first time with Forge.
/// https://book.getfoundry.sh/forge/writing-tests
contract PerformanceTesting is PRBTest, StdCheats, StdUtils, PerformanceTestHelper {
    HypercertMinter internal hypercertMinter;
    string internal _uri = "https://example.com/ipfsHash";
    bytes32 internal root = bytes32(bytes.concat("f1ef5e66fa78313ec3d3617a44c21a9061f1c87437f512625a50a5a29335a647"));
    bytes32 internal rootHash;
    bytes32[] internal proof;
    address internal alice;
    address internal allowlistUser;

    uint256 internal setSize = 30;

    MerkleDataSet[] internal datasets;
    bytes32[][] internal proofs = new bytes32[][](setSize);
    uint256[] internal ids = new uint256[](setSize);
    uint256[] internal units = new uint256[](setSize);

    function setUp() public {
        alice = address(1);
        hypercertMinter = new HypercertMinter();
        bytes32[] memory data = generateData(12, 10_000);
        rootHash = getRoot(data);
        proof = getProof(data, 6);

        startHoax(alice, 10 ether);

        if (datasets.length == 0) {
            for (uint256 i = 0; i < setSize; i++) {
                datasets.push(buildFullDataset(10 * (i + 1)));
            }

            uint256 index = 1;
            allowlistUser = datasets[0].accounts[index];

            for (uint256 i = 0; i < setSize; i++) {
                MerkleDataSet memory dataset = datasets[i];
                proofs[i] = getProof(dataset.data, index);
                ids[i] = (i + 1) << 128;
                units[i] = dataset.units[index];
                hypercertMinter.createAllowlist(
                    alice, dataset.units[index], dataset.root, _uri, IHypercertToken.TransferRestrictions.AllowAll
                );
            }
        }
    }

    /// @dev Run Forge with `-vvvv` to see console logs.
    function testFail() public {
        hypercertMinter.initialize();
    }

    function testName() public {
        assertEq(keccak256(abi.encodePacked(hypercertMinter.name())), keccak256("HypercertMinter"));
    }

    // Mint Hypercert with 1 fraction
    function testClaimSingleFraction() public {
        hypercertMinter.mintClaim(alice, 10_000, _uri, IHypercertToken.TransferRestrictions.AllowAll);
    }

    function testClaimSingleFractionFuzz(address account, uint256 value) public {
        vm.assume(value > 0);
        vm.assume(!isContract(account) && account != address(0) && account != address(this));

        changePrank(account);
        hypercertMinter.mintClaim(account, value, _uri, IHypercertToken.TransferRestrictions.AllowAll);
    }

    // Mint Hypercert with multiple fractions

    function testClaimTwoFractions() public {
        uint256[] memory fractions = buildFractions(2);
        uint256 totalUnits = getSum(fractions);

        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.AllowAll
        );
    }

    function testClaimHundredFractions() public {
        uint256[] memory fractions = buildFractions(100);
        uint256 totalUnits = getSum(fractions);

        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, _uri, IHypercertToken.TransferRestrictions.AllowAll
        );
    }

    function testClaimFractionsFuzz(uint8 size) public {
        uint256 scopedSize = bound(uint256(size), 2, 253);
        uint256[] memory fractions = buildFractions(scopedSize);
        uint256 totalUnits = getSum(fractions);

        hypercertMinter.mintClaimWithFractions(
            alice, totalUnits, fractions, "https://example.com/ipfsHash", IHypercertToken.TransferRestrictions.AllowAll
        );
    }

    function testBatchMintAllowlistLoad() public {
        changePrank(alice);
        hypercertMinter.batchMintClaimsFromAllowlists(alice, proofs, ids, units);
    }
}
