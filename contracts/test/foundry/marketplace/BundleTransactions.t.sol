// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Other tests
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

contract BundleTransactionsTest is ProtocolBase {
    function setUp() public {
        _setUp();
    }

    function testTakerAskERC721BundleNoRoyalties() public {
        _setUpUsers();
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAskWithBundle(address(mockERC721), address(weth), numberItemsInBundle);

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerBid, signature);

        // Mint the items
        mockERC721.batchMint(takerUser, makerBid.itemIds);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertMockERC721Ownership(makerBid.itemIds, makerUser);

        _assertSuccessfulTakerAskNoRoyalties(makerBid);
    }

    function testTakerAskERC1155BundleNoRoyalties() public {
        _setUpUsers();
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAskWithBundle(address(mockERC1155), address(weth), numberItemsInBundle);

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerBid, signature);

        // Mint the items
        mockERC1155.batchMint(takerUser, makerBid.itemIds, makerBid.amounts);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        for (uint256 i; i < makerBid.itemIds.length; i++) {
            // Maker user has received all the assets in the bundle
            assertEq(mockERC1155.balanceOf(makerUser, makerBid.itemIds[i]), makerBid.amounts[i]);
        }

        _assertSuccessfulTakerAskNoRoyalties(makerBid);
    }

    function testTakerAskERC721BundleWithRoyaltiesFromRegistry() public {
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAskWithBundle(address(mockERC721), address(weth), numberItemsInBundle);

        uint256 price = makerBid.price;

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerBid, signature);

        // Mint the items
        mockERC721.batchMint(takerUser, makerBid.itemIds);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertMockERC721Ownership(makerBid.itemIds, makerUser);

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        // Royalty recipient receives royalties
        assertEq(
            weth.balanceOf(_royaltyRecipient),
            _initialWETHBalanceRoyaltyRecipient + (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP
        );
        assertEq(
            weth.balanceOf(address(protocolFeeRecipient)),
            (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "ProtocolFeeRecipient should receive protocol fee"
        );
        // Taker ask user receives 99.5% of the whole price
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function testTakerBidERC721BundleNoRoyalties() public {
        _setUpUsers();
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBidWithBundle(address(mockERC721), numberItemsInBundle);

        uint256 price = makerAsk.price;

        // Mint the items and sign the order
        mockERC721.batchMint(makerUser, makerAsk.itemIds);
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker bid transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertMockERC721Ownership(makerAsk.itemIds, takerUser);

        _assertSuccessfulTakerBidNoRoyalties(makerAsk);
    }

    function testTakerBidERC1155BundleNoRoyalties() public {
        _setUpUsers();
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBidWithBundle(address(mockERC1155), numberItemsInBundle);

        uint256 price = makerAsk.price;

        // Mint the items and sign the order
        mockERC1155.batchMint(makerUser, makerAsk.itemIds, makerAsk.amounts);
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker bid transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        for (uint256 i; i < makerAsk.itemIds.length; i++) {
            // Taker user has received all the assets in the bundle
            assertEq(mockERC1155.balanceOf(takerUser, makerAsk.itemIds[i]), makerAsk.amounts[i]);
        }

        _assertSuccessfulTakerBidNoRoyalties(makerAsk);
    }

    function testTakerBidERC721BundleWithRoyaltiesFromRegistry() public {
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);
        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBidWithBundle(address(mockERC721), numberItemsInBundle);

        uint256 price = makerAsk.price;

        // Mint the items and sign the order
        mockERC721.batchMint(makerUser, makerAsk.itemIds);
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker bid transaction
        vm.prank(takerUser);

        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertMockERC721Ownership(makerAsk.itemIds, takerUser);

        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - price);
        // Royalty recipient receives the royalties
        assertEq(
            address(_royaltyRecipient).balance,
            _initialETHBalanceRoyaltyRecipient + (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP
        );
        assertEq(
            address(protocolFeeRecipient).balance,
            (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "ProtocolFeeRecipient should receive protocol fee"
        );
        // Maker ask user receives 99.5% of the whole price
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function _assertSuccessfulTakerAskNoRoyalties(OrderStructs.Maker memory makerBid) private {
        uint256 price = makerBid.price;

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        // Royalty recipient receives no royalty
        assertEq(weth.balanceOf(_royaltyRecipient), _initialWETHBalanceRoyaltyRecipient);
        assertEq(
            weth.balanceOf(address(protocolFeeRecipient)),
            (price * _minTotalFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "ProtocolFeeRecipient should receive protocol fee"
        );
        // Taker ask user receives 99.5% of the whole price (no royalties are paid)
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function _assertSuccessfulTakerBidNoRoyalties(OrderStructs.Maker memory makerAsk) private {
        uint256 price = makerAsk.price;

        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - price);
        // Royalty recipient receives no royalty
        assertEq(address(_royaltyRecipient).balance, _initialETHBalanceRoyaltyRecipient);
        assertEq(
            address(protocolFeeRecipient).balance,
            (price * _minTotalFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "ProtocolFeeRecipient should receive protocol fee"
        );
        // Maker ask user receives 99.5% of the whole price (no royalties are paid)
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }
}
