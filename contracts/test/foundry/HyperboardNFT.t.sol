// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import { ERC20 } from "oz-contracts/contracts/token/ERC20/ERC20.sol";
// import { WalletImpl } from "./WalletImpl.sol"; // Replace with your wallet implementation contract
import { IERC6551Registry } from "../../src/interfaces/IERC6551Registry.sol";
import { Hyperboard } from "../../src/hyperboards/HyperboardNFT.sol";
import { Test } from "forge-std/Test.sol";
import { Vm } from "forge-std/Vm.sol";

import { TestToken } from "./helpers/ERC20.sol";
import { Strings } from "oz-contracts/contracts/utils/Strings.sol";
import { HypercertMinter } from "../../src/HypercertMinter.sol";
import { IHypercertToken } from "../../src/interfaces/IHypercertToken.sol";

contract TestHyperboard is Test {
    Hyperboard private _hyperboard;
    // WalletImpl _walletImpl;
    IERC6551Registry private _erc6551Registry;
    address private _owner;
    address private _user1;
    address private _user2;
    HypercertMinter private _hypercertMinter;
    string private _mnemonic = "test test test test test test test test test test test junk";

    constructor() {
        string memory url = vm.rpcUrl("goerli");
        uint256 goerliFork = vm.createFork(url);
        vm.selectFork(goerliFork);
        _hypercertMinter = new HypercertMinter();

        // _hypercertMinter = HypercertMinter(0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07);

        _owner = address(this);
        _user1 = address(0x01);
        _user2 = address(0x02);
        _hyperboard = new Hyperboard(
            _hypercertMinter,
            "Hyperboard NFT",
            "HBNFT",
            "https://example.com/subgraph",
            "ipfs://Qm12345/",
            "1"
        );
    }

    function testMintHyperboard() public {
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs://123");
        string memory uri = _hyperboard.tokenURI(tokenId);
        assertEq(uri, _buildUri(tokenId, "ipfs://123"), "Invalid URI");

        assertEq(_hyperboard.ownerOf(tokenId), _user1, "Incorrect _owner after minting");
    }

    function testConsentForHyperboardWithSignature() public {
        uint256 privateKey = vm.deriveKey(_mnemonic, 0);
        address signer = vm.addr(privateKey);
        vm.recordLogs();
        vm.prank(signer);
        uint256[] memory fractions = _buildFractions(10);
        uint256 totalUnits = _getSum(fractions);

        _hypercertMinter.mintClaim(signer, totalUnits, "ipfs//123", IHypercertToken.TransferRestrictions.AllowAll);
        Vm.Log[] memory entries = vm.getRecordedLogs();
        Vm.Log memory lastEntry = entries[entries.length - 1];

        uint256 claimId = uint256(lastEntry.topics[1]);

        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = claimId + 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs//123");

        bytes32 digest = _hyperboard.getDigestForConsent(tokenId, claimId + 1);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        _hyperboard.consentForHyperboardWithSignature(tokenId, claimId + 1, signer, r, s, v);
        uint256 consentedCerts = _hyperboard.consentBasedCertsMapping(tokenId, 0);
        assertEq(consentedCerts, claimIdArray[0], "Invalid Consent");
    }

    function testConsentForHyperboard() public {
        uint256 privateKey = vm.deriveKey(_mnemonic, 0);
        address signer = vm.addr(privateKey);
        vm.recordLogs();
        vm.prank(signer);
        uint256[] memory fractions = _buildFractions(10);
        uint256 totalUnits = _getSum(fractions);
        _hypercertMinter.mintClaim(signer, totalUnits, "ipfs//123", IHypercertToken.TransferRestrictions.AllowAll);
        Vm.Log[] memory entries = vm.getRecordedLogs();
        Vm.Log memory lastEntry = entries[entries.length - 1];
        uint256 claimId = uint256(lastEntry.topics[1]);
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = claimId + 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs//123");
        vm.prank(signer);
        _hyperboard.consentForHyperboard(tokenId, claimIdArray[0]);
        uint256 consentedCerts = _hyperboard.consentBasedCertsMapping(tokenId, 0);
        assertEq(consentedCerts, claimIdArray[0], "Invalid Consent");
    }

    function testUpdateHyperboard() public {
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs://123");
        claimIdArray[0] = 2;
        vm.prank(_user1);
        _hyperboard.updateHyperboad(tokenId, claimIdArray, "ipfs://1234");
        uint256[] memory allowlistedCerts = _hyperboard.getAllowListedCerts(tokenId);
        string memory updatedUri = _hyperboard.tokenURI(tokenId);
        assertEq(updatedUri, _buildUri(tokenId, "ipfs://1234"), "Incorrect updated metadata");

        assertEq(allowlistedCerts.length, 1, "Incorrsect number of allowlisted certificates");
        assertEq(allowlistedCerts[0], 2, "Incorrect updated claim ID");
    }

    function testSetSubgraphEndpoint() public {
        string memory newEndpoint = "https://newendpoint.com/subgraph";
        _hyperboard.setSubgraphEndpoint(newEndpoint);
        assertEq(_hyperboard.subgraphEndpoint(), newEndpoint, "Subgraph endpoint not set correctly");
    }

    function testWithdrawErc20() public {
        TestToken _erc20Token = new TestToken("Test Token", "TST");
        uint256 initialBalance = 1000;
        _erc20Token.mint(address(_hyperboard), initialBalance);
        uint256 withdrawalAmount = 500;
        _hyperboard.withdrawErc20((_erc20Token), withdrawalAmount, _owner);
        assertEq(
            _erc20Token.balanceOf(address(this)),
            initialBalance - withdrawalAmount,
            "Incorrect ERC20 balance after withdrawal"
        );
        assertEq(_erc20Token.balanceOf(_owner), withdrawalAmount, "Incorrect recipient balance after withdrawal");
    }

    function testWithdrawEther() public {
        address payable withdrawalAddress = payable(0xE5DF9e3137C578991044AB434217405669B477f9);
        vm.deal(address(_hyperboard), 2 ether);

        uint256 initialBalance = address(_hyperboard).balance;

        uint256 withdrawalAmount = 1 ether;

        _hyperboard.withdrawEther(withdrawalAmount, withdrawalAddress);

        assertEq(
            address(_hyperboard).balance,
            initialBalance - withdrawalAmount,
            "Incorrect Ether balance after withdrawal"
        );
        assertEq(withdrawalAddress.balance, withdrawalAmount, "Incorrect recipient balance after withdrawal");
    }

    function _buildFractions(uint256 size) internal pure returns (uint256[] memory) {
        uint256[] memory fractions = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            fractions[i] = 100 * i + 1;
        }
        return fractions;
    }

    function _getSum(uint256[] memory array) internal pure returns (uint256 sum) {
        if (array.length == 0) {
            return 0;
        }
        sum = 0;
        for (uint256 i = 0; i < array.length; i++) sum += array[i];
    }

    function _buildUri(uint256 tokenId_, string memory metadata_) internal pure returns (string memory) {
        return
            string.concat(
                string.concat("ipfs://Qm12345/?tokenId=", Strings.toString(tokenId_)),
                string.concat("&subgraph=https://example.com/subgraph&tokenURI=", metadata_)
            );
    }
}
