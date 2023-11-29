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
import {MaliciousOnERC1155ReceivedERC1271Wallet} from "./utils/MaliciousOnERC1155ReceivedERC1271Wallet.sol";
import {MaliciousOnERC1155ReceivedTheThirdTimeERC1271Wallet} from
    "./utils/MaliciousOnERC1155ReceivedTheThirdTimeERC1271Wallet.sol";
import {MaliciousIsValidSignatureERC1271Wallet} from "./utils/MaliciousIsValidSignatureERC1271Wallet.sol";

// Errors
import {SignatureERC1271Invalid} from "@looksrare/contracts-libs/contracts/errors/SignatureCheckerErrors.sol";
import {
    ERC1155SafeTransferFromFail,
    ERC1155SafeBatchTransferFromFail
} from "@looksrare/contracts-libs/contracts/errors/LowLevelErrors.sol";
import {SIGNATURE_INVALID_EIP1271} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

/**
 * @dev ERC1271Wallet recovers a signature's signer using ECDSA. If it matches the mock wallet's
 *      owner, it returns the magic value. Otherwise it returns an empty bytes4 value.
 */
contract SignaturesERC1271WalletForHypercertTest is ProtocolBase {
    uint256 private constant price = 1 ether; // Fixed price of sale
    uint256 private constant fractionId = (1 << 128) + 1;
    bytes private constant _EMPTY_SIGNATURE = new bytes(0);

    function setUp() public {
        _setUp();
        _setUpUser(takerUser);
        _setupRegistryRoyalties(address(mockHypercertMinter), _standardRoyaltyFee);
    }

    function testTakerBid() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _takerBidSetup(address(wallet));

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        vm.startPrank(address(wallet));
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        _assertValidMakerOrder(makerAsk, signature);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        assertEq(mockHypercertMinter.balanceOf(takerUser, fractionId), 1);
    }

    function testTakerBidInvalidSignature() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _takerBidSetup(address(wallet));

        // Signed by a different private key
        bytes memory signature = _signMakerOrder(makerAsk, takerUserPK);

        vm.startPrank(address(wallet));
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        _assertMakerOrderReturnValidationCode(makerAsk, signature, SIGNATURE_INVALID_EIP1271);

        vm.expectRevert(SignatureERC1271Invalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidIsInvalidSignatureReentrancy() public {
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

        assertEq(mockHypercertMinter.balanceOf(address(wallet), fractionId), 1);
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

    function testTakerAskIsValidSignatureReentrancy() public {
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

    function testTakerAskOnERC1155ReceivedReentrancy() public {
        MaliciousOnERC1155ReceivedERC1271Wallet maliciousERC1271Wallet =
            new MaliciousOnERC1155ReceivedERC1271Wallet(address(looksRareProtocol));
        _setUpUser(address(maliciousERC1271Wallet));

        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) =
            _takerAskSetup(address(maliciousERC1271Wallet));

        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteTakerAsk);

        vm.expectRevert(ERC1155SafeTransferFromFail.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, _EMPTY_SIGNATURE, _EMPTY_MERKLE_TREE);
    }

    function testBatchTakerAsk() public {
        ERC1271Wallet wallet = new ERC1271Wallet(makerUser);
        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) = _batchTakerAskSetup(address(wallet));

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Wallet needs to hold WETH and have given WETH approval
        deal(address(weth), address(wallet), price);
        vm.prank(address(wallet));
        weth.approve(address(looksRareProtocol), price);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        for (uint256 i; i < 10; i++) {
            assertEq(mockHypercertMinter.balanceOf(address(wallet), (((1 + i) << 128) + 1)), 1);
        }
    }

    function testBatchTakerAskOnERC1155BatchReceivedReentrancy() public {
        MaliciousOnERC1155ReceivedERC1271Wallet maliciousERC1271Wallet =
            new MaliciousOnERC1155ReceivedERC1271Wallet(address(looksRareProtocol));
        _setUpUser(address(maliciousERC1271Wallet));

        (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid) =
            _batchTakerAskSetup(address(maliciousERC1271Wallet));

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Wallet needs to hold WETH and have given WETH approval
        deal(address(weth), address(maliciousERC1271Wallet), price);
        vm.prank(address(maliciousERC1271Wallet));
        weth.approve(address(looksRareProtocol), price);

        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteTakerAsk);

        vm.expectRevert(ERC1155SafeBatchTransferFromFail.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    uint256 private constant numberOfPurchases = 3;

    function testExecuteMultipleTakerBids() public {
        ERC1271Wallet wallet = new ERC1271Wallet(address(makerUser));

        (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        ) = _multipleTakerBidsSetup(address(wallet));

        vm.startPrank(address(wallet));
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberOfPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        for (uint256 i; i < numberOfPurchases; i++) {
            assertEq(mockHypercertMinter.balanceOf(takerUser, (((1 + i) << 128) + 1)), 1);
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
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);
        transferManager.grantApprovals(operators);
        vm.stopPrank();

        vm.expectRevert(SignatureERC1271Invalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberOfPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );
    }

    function testExecuteMultipleTakerBidsIsValidSignatureReentrancy() public {
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
        looksRareProtocol.executeMultipleTakerBids{value: price * numberOfPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        for (uint256 i; i < numberOfPurchases - 1; i++) {
            assertEq(mockHypercertMinter.balanceOf(takerUser, i), 0);
        }
    }

    function testExecuteMultipleTakerBidsOnERC1155ReceivedReentrancyOnlyInTheLastCall() public {
        MaliciousOnERC1155ReceivedTheThirdTimeERC1271Wallet maliciousERC1271Wallet =
            new MaliciousOnERC1155ReceivedTheThirdTimeERC1271Wallet(takerUser);
        _setUpUser(makerUser);
        maliciousERC1271Wallet.setFunctionToReenter(MaliciousERC1271Wallet.FunctionToReenter.ExecuteMultipleTakerBids);

        (
            OrderStructs.Maker[] memory makerAsks,
            OrderStructs.Taker[] memory takerBids,
            OrderStructs.MerkleTree[] memory merkleTrees,
            bytes[] memory signatures
        ) = _multipleTakerBidsSetup(makerUser);

        // Set the NFT recipient as the ERC1271 wallet to trigger onERC1155Received
        for (uint256 i; i < numberOfPurchases; i++) {
            takerBids[i].recipient = address(maliciousERC1271Wallet);
        }

        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberOfPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        // First 2 purchases should go through, but the last one fails silently
        for (uint256 i; i < numberOfPurchases - 1; i++) {
            assertEq(mockHypercertMinter.balanceOf(address(maliciousERC1271Wallet), (((1 + i) << 128) + 1)), 1);
        }
        assertEq(mockHypercertMinter.balanceOf(address(maliciousERC1271Wallet), numberOfPurchases - 1), 0);
    }

    function _takerBidSetup(address signer)
        private
        returns (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid)
    {
        // Mint asset
        vm.prank(signer);
        mockHypercertMinter.mintClaim(signer, 10_000, "http://example.com/takerBid", FROM_CREATOR_ONLY);

        makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: ETH,
            signer: signer,
            price: price,
            itemId: fractionId
        });

        // Prepare the taker bid
        takerBid = _genericTakerOrder();
    }

    function _takerAskSetup(address signer)
        private
        returns (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid)
    {
        makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: signer,
            price: price,
            itemId: fractionId
        });

        // Mint asset
        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, 10_000, "http://example.com/takerBid", FROM_CREATOR_ONLY);

        // Prepare the taker ask
        takerAsk = _genericTakerOrder();
    }

    function _batchTakerAskSetup(address signer)
        private
        returns (OrderStructs.Taker memory takerAsk, OrderStructs.Maker memory makerBid)
    {
        uint256[] memory itemIds = new uint256[](10);
        uint256[] memory amounts = new uint256[](10);

        vm.startPrank(takerUser);
        for (uint256 i; i < 10; i++) {
            uint256 claimID = (1 + i) << 128;
            itemIds[i] = claimID + 1;
            amounts[i] = 1;

            // Mint asset
            mockHypercertMinter.mintClaim(takerUser, 10_000, "http://example.com/takerBid", FROM_CREATOR_ONLY);
        }
        vm.stopPrank();

        // Prepare the first order
        makerBid = _createMultiItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: signer,
            price: price,
            itemIds: itemIds,
            amounts: amounts
        });

        // Prepare the taker ask
        takerAsk = _genericTakerOrder();
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
        makerAsks = new OrderStructs.Maker[](numberOfPurchases);
        takerBids = new OrderStructs.Taker[](numberOfPurchases);
        signatures = new bytes[](numberOfPurchases);

        vm.startPrank(signer);
        for (uint256 i; i < numberOfPurchases; i++) {
            // Mint asset
            mockHypercertMinter.mintClaim(signer, 10_000, "http://example.com/takerBid", FROM_CREATOR_ONLY);

            uint256 fractionID = ((1 + i) << 128) + 1;

            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC1155,
                orderNonce: i,
                collection: address(mockHypercertMinter),
                currency: ETH,
                signer: signer,
                price: price,
                itemId: fractionID // 0, 1, etc.
            });

            signatures[i] = _signMakerOrder(makerAsks[i], makerUserPK);

            takerBids[i] = _genericTakerOrder();
        }
        vm.stopPrank();

        // Other execution parameters
        merkleTrees = new OrderStructs.MerkleTree[](numberOfPurchases);
    }
}
