// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import { ERC20 } from "oz-contracts/contracts/token/ERC20/ERC20.sol";
// import { WalletImpl } from "./WalletImpl.sol"; // Replace with your wallet implementation contract
import { IERC6551Registry } from "../../src/interfaces/IERC6551Registry.sol";
import { Hyperboard } from "../../src/hyperboards/HyperboardNFT.sol";
import { Test } from "forge-std/Test.sol";
import { TestToken } from "./helpers/ERC20.sol";
import { Strings } from "oz-contracts/contracts/utils/Strings.sol";
import { HypercertMinter } from "../../src/HypercertMinter.sol";

contract TestHyperboard is Test {
    Hyperboard private _hyperboard;
    // WalletImpl _walletImpl;
    IERC6551Registry private _erc6551Registry;
    address private _owner;
    address private _user1;
    address private _user2;
    HypercertMinter private _hypercertMinter = HypercertMinter(0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07);

    constructor() {
        _owner = address(this);
        _user1 = address(0x01);
        _user2 = address(0x02);
        _hyperboard = new Hyperboard(
            _hypercertMinter,
            "Hyperboard NFT",
            "HBNFT",
            "https://example.com/subgraph",
            "ipfs://Qm12345/"
        );
    }

    function testMintHyperboard() public {
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs://123");
        string memory uri = _hyperboard.tokenURI(tokenId);
        assertEq(
            uri,
            string.concat(
                string.concat("ipfs://Qm12345/?tokenId=", Strings.toString(tokenId)),
                "&subgraph=https://example.com/subgraph&tokenURI=ipfs://123"
            )
        );

        assertEq(_hyperboard.ownerOf(tokenId), _user1, "Incorrect _owner after minting");
    }

    function testConsentForHyperboard() public {
        uint256 hypercertClaimId = 4169139559515338054353265690254024126758919;
        address ownerOfHypercert = 0xf3419771c2551f88a91Db61cB874347f05640172;
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = hypercertClaimId;

        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs//123");
        vm.prank(ownerOfHypercert);
        _hyperboard.consentForHyperboard(tokenId, claimIdArray[0]);
        uint256 consentedCerts = _hyperboard.consentBasedCertsMapping(tokenId, 0);
        assertEq(consentedCerts, claimIdArray[0], "Invalid Consent");
    }

    function testUpdateAllowListedCerts() public {
        uint256[] memory claimIdArray = new uint256[](1);
        claimIdArray[0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, claimIdArray, "ipfs://123");

        claimIdArray[0] = 2;
        vm.prank(_user1);
        _hyperboard.updateAllowListedCerts(tokenId, claimIdArray);

        uint256[] memory allowlistedCerts = _hyperboard.getAllowListedCerts(tokenId);

        assertEq(allowlistedCerts.length, 1, "Incorrect number of allowlisted certificates");
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
}
