// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import { ERC20 } from "oz-contracts/contracts/token/ERC20/ERC20.sol";
// import { WalletImpl } from "./WalletImpl.sol"; // Replace with your wallet implementation contract
import { IERC6551Registry } from "../../src/interfaces/IERC6551Registry.sol";
import { Hyperboard } from "../../src/hyperboards/HyperboardNFT.sol";
import { Test } from "forge-std/Test.sol";
import { TestToken } from "./helpers/ERC20.sol";
import { Strings } from "oz-contracts/contracts/utils/Strings.sol";

contract TestHyperboard is Test {
    Hyperboard private _hyperboard;
    // WalletImpl _walletImpl;
    IERC6551Registry private _erc6551Registry;
    address private _owner;
    address private _user1;
    address private _user2;

    constructor() {
        _owner = address(this); // Replace with your test account addresses
        _user1 = address(0x01); // Replace with user addresses as needed
        _user2 = address(0x02); // Replace with user addresses as needed

        // walletImpl = new WalletImpl(); // Deploy your wallet implementation contract
        // erc6551Registry = new ERC6551Registry(); // Deploy your ERC6551 registry contract

        _hyperboard = new Hyperboard(
            "Hyperboard NFT",
            "HBNFT",
            "https://example.com/subgraph",
            "ipfs://Qm12345/",
            0x3E5c63644E683549055b9Be8653de26E0B4CD36E,
            IERC6551Registry(0x02101dfB77FDE026414827Fdc604ddAF224F0921)
        );
    }

    function testMintHyperboard() public {
        address[] memory userArray = new address[](1);
        userArray[0] = _user1;
        uint256[][] memory claimIdArray = new uint256[][](1);
        claimIdArray[0] = new uint256[](1);
        claimIdArray[0][0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, userArray, claimIdArray, 12345);
        string memory uri = _hyperboard.tokenURI(tokenId);
        assertEq(
            uri,
            string.concat(
                string.concat("ipfs://Qm12345/?tokenId=", Strings.toString(tokenId)),
                "&subgraph=https://example.com/subgraph"
            )
        );
        assertEq(_hyperboard.ownerOf(tokenId), _user1, "Incorrect _owner after minting");
    }

    function testUpdateAllowListedCerts() public {
        address[] memory userArray = new address[](1);
        userArray[0] = _user1;
        uint256[][] memory claimIdArray = new uint256[][](1);
        claimIdArray[0] = new uint256[](1);
        claimIdArray[0][0] = 1;
        uint256 tokenId = _hyperboard.mint(_user1, userArray, claimIdArray, 12345);

        userArray[0] = _user2;
        claimIdArray[0][0] = 2;
        vm.prank(_user1);
        _hyperboard.updateAllowListedCerts(tokenId, userArray, claimIdArray);

        address[] memory allowlistedCerts = _hyperboard.getAllowListedCerts(tokenId);
        uint256[] memory claimIds = _hyperboard.getAllowListedClaimIds(tokenId, _user2);

        assertEq(allowlistedCerts.length, 1, "Incorrect number of allowlisted certificates");
        assertEq(claimIds.length, 1, "Incorrect number of claim IDs");
        assertEq(allowlistedCerts[0], _user2, "Incorrect updated allowlisted certificate");
        assertEq(claimIds[0], 2, "Incorrect updated claim ID");
    }

    function testSetSubgraphEndpoint() public {
        string memory newEndpoint = "https://newendpoint.com/subgraph";
        _hyperboard.setSubgraphEndpoint(newEndpoint);
        assertEq(_hyperboard.subgraphEndpoint(), newEndpoint, "Subgraph endpoint not set correctly");
    }

    function testSetWalletImpl() public {
        _hyperboard.setWalletImpl(address(1));
        assertEq(_hyperboard.walletImpl(), address(1), "Wallet implementation not set correctly");
    }

    function testSetErc6551Registry() public {
        _hyperboard.setErc6551Registry(IERC6551Registry(address(1)));
        assertEq(address(_hyperboard.erc6551Registry()), address(1), "ERC6551 registry not set correctly");
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
