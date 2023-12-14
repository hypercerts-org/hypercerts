// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries and interfaces
import {IReentrancyGuard} from "@looksrare/contracts-libs/contracts/interfaces/IReentrancyGuard.sol";
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Mocks and other utils
import {ERC1271Wallet} from "./utils/ERC1271Wallet.sol";
import {MaliciousERC1271Wallet} from "./utils/MaliciousERC1271Wallet.sol";
import {MaliciousIsValidSignatureERC1271Wallet} from "./utils/MaliciousIsValidSignatureERC1271Wallet.sol";

// Errors
import {SignatureERC1271Invalid} from "@looksrare/contracts-libs/contracts/errors/SignatureCheckerErrors.sol";
import {SIGNATURE_INVALID_EIP1271} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

/**
 * @dev ERC1271Wallet recovers a signature's signer using ECDSA. If it matches the mock wallet's
 *      owner, it returns the magic value. Otherwise it returns an empty bytes4 value.
 */
contract SignaturesERC1271WalletForERC721Test is ProtocolBase {
    uint256 private constant price = 1 ether; // Fixed price of sale
    bytes private constant _EMPTY_SIGNATURE = new bytes(0);

    function setUp() public {
        _setUp();
        _setUpUser(takerUser);
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);
    }

    function testTakerBid() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _takerBidSetup(address(wallet));

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        vm.startPrank(address(wallet));
        mockERC721.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        _assertValidMakerOrder(makerAsk, signature);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        assertEq(mockERC721.ownerOf(makerAsk.itemIds[0]), takerUser);
    }

    function testTakerBidInvalidSignature() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _takerBidSetup(address(wallet));

        // Signed by a different private key
        bytes memory signature = _signMakerOrder(makerAsk, takerUserPK);

        vm.startPrank(address(wallet));
        mockERC721.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        _assertMakerOrderReturnValidationCode(makerAsk, signature, SIGNATURE_INVALID_EIP1271);

        vm.expectRevert(SignatureERC1271Invalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidReentrancy() public {
        MaliciousIsValidSignatureERC1271Wallet maliciousERC1271Wallet =
            new MaliciousIsValidSignatureERC1271Wallet(address(looksRareProtocol));
        _setUpUser(address(maliciousERC1271Wallet));
        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteTakerBid);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _takerBidSetup(address(maliciousERC1271Wallet));

        vm.expectRevert(IReentrancyGuard.ReentrancyFail.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, _EMPTY_SIGNATURE, _EMPTY_MERKLE_TREE);
    }

    function testTakerAsk() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) = _takerAskSetup(address(wallet));

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Wallet needs to hold WETH and have given WETH approval
        deal(address(weth), address(wallet), price);
        vm.prank(address(wallet));
        weth.approve(address(looksRareProtocol), price);

        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        assertEq(mockERC721.ownerOf(makerBid.itemIds[0]), address(wallet));
    }

    function testTakerAskInvalidSignature() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) = _takerAskSetup(address(wallet));

        // Signed by a different private key
        bytes memory signature = _signMakerOrder(makerBid, takerUserPK);

        // Wallet needs to hold WETH and have given WETH approval
        deal(address(weth), address(wallet), price);
        vm.prank(address(wallet));
        weth.approve(address(looksRareProtocol), price);

        _assertMakerOrderReturnValidationCode(makerBid, signature, SIGNATURE_INVALID_EIP1271);

        vm.expectRevert(SignatureERC1271Invalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerAskReentrancy() public {
        MaliciousIsValidSignatureERC1271Wallet maliciousERC1271Wallet =
            new MaliciousIsValidSignatureERC1271Wallet(address(looksRareProtocol));
        _setUpUser(address(maliciousERC1271Wallet));
        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteTakerAsk);

        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) =
            _takerAskSetup(address(maliciousERC1271Wallet));

        vm.expectRevert(IReentrancyGuard.ReentrancyFail.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, _EMPTY_SIGNATURE, _EMPTY_MERKLE_TREE);
    }

    uint256 private constant numberPurchases = 3;

    function testExecuteMultipleTakerBids() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));

        (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        ) = _multipleTakerBidsSetup(address(wallet));

        vm.startPrank(address(wallet));
        mockERC721.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        for (uint256 i; i < numberPurchases; i++) {
            assertEq(mockERC721.ownerOf(i), takerUser);
        }
    }

    function testExecuteMultipleTakerBidsInvalidSignatures() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));

        (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        ) = _multipleTakerBidsSetup(address(wallet));

        // Signed by a different private key
        for (uint256 i; i < signatures.length; i++) {
            signatures[i] = _signMakerOrder(makerAsks[i], takerUserPK);
        }

        vm.startPrank(address(wallet));
        mockERC721.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        vm.expectRevert(SignatureERC1271Invalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );
    }

    function testExecuteMultipleTakerBidsReentrancy() public {
        MaliciousIsValidSignatureERC1271Wallet maliciousERC1271Wallet =
            new MaliciousIsValidSignatureERC1271Wallet(address(looksRareProtocol));
        _setUpUser(address(maliciousERC1271Wallet));
        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteMultipleTakerBids);

        (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        ) = _multipleTakerBidsSetup(address(maliciousERC1271Wallet));

        vm.expectRevert(IReentrancyGuard.ReentrancyFail.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );
    }

    function _takerBidSetup(address signer)
        private
        returns (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid)
    {
        (makerAsk, takerBid) = _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.signer = signer;
        // Mint asset
        mockERC721.mint(signer, makerAsk.itemIds[0]);
    }

    function _takerAskSetup(address signer)
        private
        returns (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid)
    {
        (makerBid, takerAsk) = _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));
        makerBid.signer = signer;
        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);
    }

    function _multipleTakerBidsSetup(address signer)
        private
        returns (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        )
    {
        makerAsks = new OrderStructs.Maker[](numberPurchases);
        takerBids = new OrderStructs.Taker[](numberPurchases);
        signatures = new bytes[](numberPurchases);

        for (uint256 i; i < numberPurchases; i++) {
            // Mint asset
            mockERC721.mint(signer, i);

            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i,
                collection: address(mockERC721),
                currency: ETH,
                signer: signer,
                price: price,
                itemId: i // 0, 1, etc.
            });

            signatures[i] = _signMakerOrder(makerAsks[i], makerUserPK);

            takerBids[i] = _genericTakerOrder();
        }

        // Other execution parameters
        merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);
    }
}
