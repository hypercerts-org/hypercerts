// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries, interfaces, errors
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {LengthsInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";

import {CreatorFeeManagerWithRoyalties} from "@hypercerts/marketplace/CreatorFeeManagerWithRoyalties.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract StandardTransactionsTest is ProtocolBase {
    error ERC721TransferFromFail();

    uint256 private constant itemId = 420;
    uint16 private constant NEW_ROYALTY_FEE = uint16(50);

    function setUp() public {
        _setUp();
        CreatorFeeManagerWithRoyalties creatorFeeManager = new CreatorFeeManagerWithRoyalties(
            address(royaltyFeeRegistry)
        );
        vm.prank(_owner);
        looksRareProtocol.updateCreatorFeeManager(address(creatorFeeManager));
    }

    /**
     * One ERC721 (where royalties come from the registry) is sold through a taker bid
     */
    function testTakerBidERC721WithRoyaltiesFromRegistry(uint256 price) public {
        vm.assume(price <= 2 ether);
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), NEW_ROYALTY_FEE);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.price = price;

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // Verify validity of maker ask order
        _assertValidMakerOrder(makerAsk, signature);

        // Arrays for events
        uint256[3] memory expectedFees = _calculateExpectedFees({price: price, royaltyFeeBp: NEW_ROYALTY_FEE});
        address[2] memory expectedRecipients;

        expectedRecipients[0] = makerUser;
        expectedRecipients[1] = _royaltyRecipient;

        // Execute taker bid transaction
        vm.prank(takerUser);
        vm.expectEmit(true, false, false, true);

        emit TakerBid(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerAsk),
                orderNonce: makerAsk.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            takerUser,
            makerAsk.strategyId,
            makerAsk.currency,
            makerAsk.collection,
            makerAsk.itemIds,
            makerAsk.amounts,
            expectedRecipients,
            expectedFees
        );

        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulExecutionThroughETH(takerUser, makerUser, price, expectedFees);

        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    /**
     * One ERC721 is sold through taker bid. Address zero is specified as the recipient in the taker struct.
     */
    function testTakerBidERC721WithAddressZeroSpecifiedAsRecipient(uint256 price) public {
        vm.assume(price <= 2 ether);
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.price = price;

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // Adjustment
        takerBid.recipient = address(0);

        // Verify validity of maker ask order
        _assertValidMakerOrder(makerAsk, signature);

        // Arrays for events
        uint256[3] memory expectedFees = _calculateExpectedFees({price: price, royaltyFeeBp: 0});
        address[2] memory expectedRecipients;

        expectedRecipients[0] = makerUser;
        expectedRecipients[1] = address(0); // No royalties

        // Execute taker bid transaction
        vm.prank(takerUser);
        vm.expectEmit(true, false, false, true);

        emit TakerBid(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerAsk),
                orderNonce: makerAsk.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            takerUser,
            makerAsk.strategyId,
            makerAsk.currency,
            makerAsk.collection,
            makerAsk.itemIds,
            makerAsk.amounts,
            expectedRecipients,
            expectedFees
        );

        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulExecutionThroughETH(takerUser, makerUser, price, expectedFees);
    }

    /**
     * One ERC721 (where royalties come from the registry) is sold through a taker ask using WETH
     */
    function testTakerAskERC721WithRoyaltiesFromRegistry(uint256 price) public {
        vm.assume(price <= 2 ether);

        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), NEW_ROYALTY_FEE);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));
        makerBid.price = price;

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify maker bid order
        _assertValidMakerOrder(makerBid, signature);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Arrays for events
        uint256[3] memory expectedFees = _calculateExpectedFees({price: price, royaltyFeeBp: NEW_ROYALTY_FEE});
        address[2] memory expectedRecipients;

        expectedRecipients[0] = takerUser;
        expectedRecipients[1] = _royaltyRecipient;

        // Execute taker ask transaction
        vm.prank(takerUser);

        vm.expectEmit(true, false, false, true);

        emit TakerAsk(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerBid),
                orderNonce: makerBid.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            makerUser,
            makerBid.strategyId,
            makerBid.currency,
            makerBid.collection,
            makerBid.itemIds,
            makerBid.amounts,
            expectedRecipients,
            expectedFees
        );

        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulExecutionThroughWETH(makerUser, takerUser, price, expectedFees);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    /**
     * One ERC721 is sold through a taker ask using WETH. Address zero is specified as the recipient in the taker
     * struct.
     */
    function testTakerAskERC721WithAddressZeroSpecifiedAsRecipient(uint256 price) public {
        vm.assume(price <= 2 ether);
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));
        makerBid.price = price;

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify maker bid order
        _assertValidMakerOrder(makerBid, signature);

        // Adjustment
        takerAsk.recipient = address(0);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Arrays for events
        uint256[3] memory expectedFees = _calculateExpectedFees({price: price, royaltyFeeBp: 0});
        address[2] memory expectedRecipients;

        expectedRecipients[0] = takerUser;
        expectedRecipients[1] = address(0); // No royalties

        // Execute taker ask transaction
        vm.prank(takerUser);
        vm.expectEmit(true, false, false, true);

        emit TakerAsk(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerBid),
                orderNonce: makerBid.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            makerUser,
            makerBid.strategyId,
            makerBid.currency,
            makerBid.collection,
            makerBid.itemIds,
            makerBid.amounts,
            expectedRecipients,
            expectedFees
        );

        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulExecutionThroughWETH(makerUser, takerUser, price, expectedFees);
    }

    /**
     * Three ERC721 are sold through 3 taker bids in one transaction with non-atomicity.
     */
    function testThreeTakerBidsERC721() public {
        uint256 price = 0.015 ether;
        _setUpUsers();

        uint256 numberPurchases = 3;

        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](numberPurchases);
        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](numberPurchases);
        bytes[] memory signatures = new bytes[](numberPurchases);

        for (uint256 i; i < numberPurchases; i++) {
            // Mint asset
            mockERC721.mint(makerUser, i);

            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i,
                collection: address(mockERC721),
                currency: ETH,
                signer: makerUser,
                price: price, // Fixed
                itemId: i // (0, 1, etc.)
            });

            // Sign order
            signatures[i] = _signMakerOrder(makerAsks[i], makerUserPK);

            takerBids[i] = _genericTakerOrder();
        }

        // Other execution parameters
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

        // Execute taker bid transaction
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        for (uint256 i; i < numberPurchases; i++) {
            // Taker user has received the asset
            assertEq(mockERC721.ownerOf(i), takerUser);
            // Verify the nonce is marked as executed
            assertEq(looksRareProtocol.userOrderNonce(makerUser, i), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
        }

        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - (numberPurchases * price));
        // Maker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser
                + ((price * _sellerProceedBpWithStandardProtocolFeeBp) * numberPurchases) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
    }

    /**
     * Transaction cannot go through if atomic, goes through if non-atomic (fund returns to buyer).
     */
    function testThreeTakerBidsERC721OneFails() public {
        _setUpUsers();

        uint256 numberPurchases = 3;
        uint256 faultyTokenId = numberPurchases - 1;

        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](numberPurchases);
        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](numberPurchases);
        bytes[] memory signatures = new bytes[](numberPurchases);

        for (uint256 i; i < numberPurchases; i++) {
            // Mint asset
            mockERC721.mint(makerUser, i);

            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i,
                collection: address(mockERC721),
                currency: ETH,
                signer: makerUser,
                price: 1.4 ether, // Fixed
                itemId: i // (0, 1, etc.)
            });

            // Sign order
            signatures[i] = _signMakerOrder(makerAsks[i], makerUserPK);

            takerBids[i] = _genericTakerOrder();
        }

        // Transfer tokenId = 2 to random user
        address randomUser = address(55);
        vm.prank(makerUser);
        mockERC721.transferFrom(makerUser, randomUser, faultyTokenId);

        /**
         * 1. The whole purchase fails if execution is atomic
         */
        {
            // Other execution parameters
            OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

            vm.expectRevert(abi.encodeWithSelector(ERC721TransferFromFail.selector));
            vm.prank(takerUser);
            looksRareProtocol.executeMultipleTakerBids{value: 1.4 ether * numberPurchases}(
                takerBids, makerAsks, signatures, merkleTrees, true
            );
        }

        /**
         * 2. The whole purchase doesn't fail if execution is not-atomic
         */
        {
            // Other execution parameters
            OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

            vm.prank(takerUser);
            // Execute taker bid transaction
            looksRareProtocol.executeMultipleTakerBids{value: 1.4 ether * numberPurchases}(
                takerBids, makerAsks, signatures, merkleTrees, false
            );
        }

        for (uint256 i; i < faultyTokenId; i++) {
            // Taker user has received the first two assets
            assertEq(mockERC721.ownerOf(i), takerUser);
            // Verify the first two nonces are marked as executed
            assertEq(looksRareProtocol.userOrderNonce(makerUser, i), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
        }

        // Taker user has not received the asset
        assertEq(mockERC721.ownerOf(faultyTokenId), randomUser);
        // Verify the nonce is NOT marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, faultyTokenId), bytes32(0));
        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - 1 - ((numberPurchases - 1) * 1.4 ether));
        // Maker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser
                + ((1.4 ether * _sellerProceedBpWithStandardProtocolFeeBp) * (numberPurchases - 1))
                    / ONE_HUNDRED_PERCENT_IN_BP
        );
        // 1 wei left in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 1);
    }

    function testThreeTakerBidsERC721LengthsInvalid() public {
        _setUpUsers();

        uint256 price = 1.12121111111 ether;
        uint256 numberPurchases = 3;

        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](numberPurchases);
        bytes[] memory signatures = new bytes[](numberPurchases);
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

        // 1. Invalid maker asks length
        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](numberPurchases - 1);

        vm.expectRevert(LengthsInvalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        // 2. Invalid signatures length
        makerAsks = new OrderStructs.Maker[](numberPurchases);
        signatures = new bytes[](numberPurchases - 1);

        vm.expectRevert(LengthsInvalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        // 3. Invalid merkle trees length
        signatures = new bytes[](numberPurchases);
        merkleTrees = new OrderStructs.MerkleTree[](numberPurchases - 1);

        vm.expectRevert(LengthsInvalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );
    }

    function _calculateExpectedFees(uint256 price, uint256 royaltyFeeBp)
        private
        pure
        returns (uint256[3] memory expectedFees)
    {
        expectedFees[2] = (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;
        expectedFees[1] = (price * royaltyFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;
        if (expectedFees[2] + expectedFees[1] < ((price * _minTotalFeeBp) / ONE_HUNDRED_PERCENT_IN_BP)) {
            expectedFees[2] = ((price * _minTotalFeeBp) / ONE_HUNDRED_PERCENT_IN_BP) - expectedFees[1];
        }
        expectedFees[0] = price - (expectedFees[1] + expectedFees[2]);
    }

    function _assertSuccessfulExecutionThroughWETH(
        address buyer,
        address seller,
        uint256 price,
        uint256[3] memory expectedFees
    ) private {
        // Buyer has received the asset
        assertEq(mockERC721.ownerOf(itemId), buyer);
        // Buyer pays the whole price
        assertEq(weth.balanceOf(buyer), _initialWETHBalanceUser - price);
        // Seller receives 99.5% of the whole price
        assertEq(weth.balanceOf(seller), _initialWETHBalanceUser + expectedFees[0]);
        assertEq(
            weth.balanceOf(address(protocolFeeRecipient)),
            expectedFees[2],
            "ProtocolFeeRecipient should receive 1.5% of the whole price"
        );
        // Royalty recipient receives 0.5% of the whole price
        assertEq(weth.balanceOf(_royaltyRecipient), _initialWETHBalanceRoyaltyRecipient + expectedFees[1]);
    }

    function _assertSuccessfulExecutionThroughETH(
        address buyer,
        address seller,
        uint256 price,
        uint256[3] memory expectedFees
    ) private {
        assertEq(mockERC721.ownerOf(itemId), buyer);
        // Buyer pays the whole price
        assertEq(address(buyer).balance, _initialETHBalanceUser - price);
        // Seller receives 99.5% of the whole price
        assertEq(address(seller).balance, _initialETHBalanceUser + expectedFees[0]);
        // Royalty recipient receives 0.5% of the whole price
        assertEq(address(_royaltyRecipient).balance, _initialETHBalanceRoyaltyRecipient + expectedFees[1]);
    }
}
