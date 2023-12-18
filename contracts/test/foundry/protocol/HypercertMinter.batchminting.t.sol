// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {PRBTest} from "prb-test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
//solhint-disable-next-line max-line-length
import {ERC1155HolderUpgradeable} from
    "openzeppelin-contracts-upgradeable/contracts/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import {Merkle} from "murky/Merkle.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

contract BatchMintingHelper is Merkle, ERC1155HolderUpgradeable {
    event BatchValueTransfer(uint256[] claimIDs, uint256[] fromTokenIDs, uint256[] toTokenIDs, uint256[] values);

    struct MerkleDataSet {
        address[] accounts;
        uint256[] units;
        bytes32[] data;
        bytes32 root;
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

    function generateData(uint256 size, uint256 value) public view returns (bytes32[] memory data) {
        data = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            data[i] = _calculateLeaf(msg.sender, value);
        }
    }

    function _calculateLeaf(address account, uint256 amount) internal pure returns (bytes32 leaf) {
        leaf = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
    }

    function buildFullDataset(uint256 size) internal pure returns (MerkleDataSet memory) {
        address[] memory users;
        uint256[] memory units;
        bytes32[] memory data;
        bytes32 root;
        users = new address[](size);
        units = new uint256[](size);

        for (uint256 i = 0; i < users.length; i++) {
            users[i] = address(uint160(i + 1));
            units[i] = 100 * size * (i + 1);
        }

        data = generateCustomData(users, units);

        root = getRoot(data);
        return MerkleDataSet(users, units, data, root);
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
contract HypercertBatchMintingTest is PRBTest, StdCheats, StdUtils, BatchMintingHelper {
    HypercertMinter internal minter;
    string internal _uri;
    address internal alice;
    address internal bob;
    MerkleDataSet[] internal datasets;

    function setUp() public {
        minter = new HypercertMinter();
        _uri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        alice = address(1);
        bob = address(2);

        for (uint256 i = 0; i < 30; i++) {
            datasets.push(buildFullDataset(10 * (i + 1)));
        }
    }

    // UNHAPPY MINTING

    function testFailBatchMintWrongData() public {
        MerkleDataSet memory one = datasets[0];
        uint256 index = 1;
        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](4);
        uint256[] memory ids = new uint256[](4);
        uint256[] memory units = new uint256[](4);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            proofs[i] = getProof(dataset.data, index);
            ids[i] = (i + 1) << 128;
            units[i] = dataset.units[index];
            minter.createAllowlist(user, 10_000, dataset.root, _uri, IHypercertToken.TransferRestrictions.AllowAll);
        }

        units[3] = 0;

        startHoax(user, 10 ether);

        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            uint256 tokenID = ((i + 1) << 128) + 1;
            assertEq(minter.unitsOf(user, tokenID), dataset.units[index]);
        }
    }

    // HAPPY MINTING

    function testBatchMintTwoAllowlists() public {
        MerkleDataSet memory one = datasets[0];
        MerkleDataSet memory two = datasets[1];

        uint256 index = 1;

        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](2);
        proofs[0] = getProof(one.data, index);
        proofs[1] = getProof(two.data, index);

        uint256[] memory ids = new uint256[](2);
        ids[0] = 1 << 128;
        ids[1] = 2 << 128;

        uint256[] memory tokenIDs = new uint256[](2);
        tokenIDs[0] = ids[0] + 1;
        tokenIDs[1] = ids[1] + 1;

        uint256[] memory units = new uint256[](2);
        units[0] = one.units[index];
        units[1] = two.units[index];

        uint256[] memory zeroes = new uint256[](2);

        minter.createAllowlist(user, 10_000, one.root, _uri, IHypercertToken.TransferRestrictions.AllowAll);
        minter.createAllowlist(user, 10_000, two.root, _uri, IHypercertToken.TransferRestrictions.AllowAll);

        startHoax(user, 10 ether);

        vm.expectEmit(true, true, true, true);
        emit BatchValueTransfer(ids, zeroes, tokenIDs, units);
        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);
        assertEq(minter.unitsOf(user, (1 << 128) + 1), one.units[index]);
        assertEq(minter.unitsOf(user, (2 << 128) + 1), two.units[index]);
    }

    function testBatchMintFourAllowlists() public {
        MerkleDataSet memory one = datasets[0];
        uint256 index = 1;
        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](4);
        uint256[] memory ids = new uint256[](4);
        uint256[] memory units = new uint256[](4);
        uint256[] memory tokenIDs = new uint256[](4);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            proofs[i] = getProof(dataset.data, index);
            ids[i] = (i + 1) << 128;
            tokenIDs[i] = ids[i] + 1;
            units[i] = dataset.units[index];
            minter.createAllowlist(user, 10_000, dataset.root, _uri, IHypercertToken.TransferRestrictions.AllowAll);
        }

        startHoax(user, 10 ether);

        uint256[] memory zeroes = new uint256[](4);

        vm.expectEmit(true, true, true, true);
        emit BatchValueTransfer(ids, zeroes, tokenIDs, units);
        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            uint256 tokenID = ((i + 1) << 128) + 1;
            assertEq(minter.unitsOf(user, tokenID), dataset.units[index]);
        }
    }

    function testBatchMintAllowlistsFuzz(uint8 setSize) public {
        vm.assume(setSize < 30);
        MerkleDataSet memory one = datasets[0];
        uint256 index = 1;
        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](setSize);
        uint256[] memory ids = new uint256[](setSize);
        uint256[] memory units = new uint256[](setSize);
        uint256[] memory tokenIDs = new uint256[](setSize);

        for (uint256 i = 0; i < setSize; i++) {
            MerkleDataSet memory dataset = datasets[i];
            proofs[i] = getProof(dataset.data, index);
            ids[i] = (i + 1) << 128;
            tokenIDs[i] = ids[i] + 1;
            units[i] = dataset.units[index];
            minter.createAllowlist(
                user, _getSum(units), dataset.root, _uri, IHypercertToken.TransferRestrictions.AllowAll
            );
        }

        startHoax(user, 10 ether);

        uint256[] memory zeroes = new uint256[](setSize);

        vm.expectEmit(true, true, true, true);
        emit BatchValueTransfer(ids, zeroes, tokenIDs, units);
        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);

        for (uint256 i = 0; i < setSize; i++) {
            MerkleDataSet memory dataset = datasets[i];
            uint256 tokenID = ((i + 1) << 128) + 1;
            assertEq(minter.unitsOf(user, tokenID), dataset.units[index]);
        }
    }

    function testBatchMintFourAllowlistsDisallowAll() public {
        MerkleDataSet memory one = datasets[0];
        uint256 index = 1;
        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](4);
        uint256[] memory ids = new uint256[](4);
        uint256[] memory units = new uint256[](4);
        uint256[] memory tokenIDs = new uint256[](4);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            proofs[i] = getProof(dataset.data, index);
            ids[i] = (i + 1) << 128;
            tokenIDs[i] = ids[i] + 1;
            units[i] = dataset.units[index];
            minter.createAllowlist(user, 10_000, dataset.root, _uri, IHypercertToken.TransferRestrictions.DisallowAll);
        }

        startHoax(user, 10 ether);

        uint256[] memory zeroes = new uint256[](4);

        vm.expectEmit(true, true, true, true);
        emit BatchValueTransfer(ids, zeroes, tokenIDs, units);
        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            uint256 tokenID = ((i + 1) << 128) + 1;
            assertEq(minter.unitsOf(user, tokenID), dataset.units[index]);
        }
    }

    function testBatchMintFourAllowlistsFromCreatorOnly() public {
        MerkleDataSet memory one = datasets[0];
        uint256 index = 1;
        address user = one.accounts[index];

        bytes32[][] memory proofs = new bytes32[][](4);
        uint256[] memory ids = new uint256[](4);
        uint256[] memory units = new uint256[](4);
        uint256[] memory tokenIDs = new uint256[](4);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            proofs[i] = getProof(dataset.data, index);
            ids[i] = (i + 1) << 128;
            tokenIDs[i] = ids[i] + 1;
            units[i] = dataset.units[index];
            minter.createAllowlist(
                user, 10_000, dataset.root, _uri, IHypercertToken.TransferRestrictions.FromCreatorOnly
            );
        }

        startHoax(user, 10 ether);

        uint256[] memory zeroes = new uint256[](4);

        vm.expectEmit(true, true, true, true);
        emit BatchValueTransfer(ids, zeroes, tokenIDs, units);
        minter.batchMintClaimsFromAllowlists(user, proofs, ids, units);

        for (uint256 i = 0; i < 4; i++) {
            MerkleDataSet memory dataset = datasets[i];
            uint256 tokenID = ((i + 1) << 128) + 1;
            assertEq(minter.unitsOf(user, tokenID), dataset.units[index]);
        }
    }
}
