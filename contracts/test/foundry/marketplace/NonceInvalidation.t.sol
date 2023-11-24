// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries, interfaces, errors
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {INonceManager} from "@hypercerts/marketplace/interfaces/INonceManager.sol";
import {LengthsInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    INVALID_USER_GLOBAL_BID_NONCE,
    INVALID_USER_GLOBAL_ASK_NONCE,
    USER_SUBSET_NONCE_CANCELLED,
    USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH,
    USER_ORDER_NONCE_EXECUTED_OR_CANCELLED
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Other utils and tests
import {StrategyTestMultiFillCollectionOrder} from "./utils/StrategyTestMultiFillCollectionOrder.sol";
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract NonceInvalidationTest is INonceManager, ProtocolBase {
    uint256 private constant price = 1 ether; // Fixed price of sale

    function setUp() public {
        _setUp();
    }

    /**
     * Cannot execute an order if subset nonce is used
     */
    function testCannotExecuteOrderIfSubsetNonceIsUsed(uint256 subsetNonce) public {
        uint256 itemId = 420;

        // Mint asset
        mockERC721.mint(makerUser, itemId);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.subsetNonce = subsetNonce;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        uint256[] memory subsetNonces = new uint256[](1);
        subsetNonces[0] = subsetNonce;

        vm.prank(makerUser);
        vm.expectEmit(false, false, false, true);
        emit SubsetNoncesCancelled(makerUser, subsetNonces);
        looksRareProtocol.cancelSubsetNonces(subsetNonces);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, USER_SUBSET_NONCE_CANCELLED);

        vm.deal(takerUser, price);

        // Execute taker bid transaction
        // Taker user actions
        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * Cannot execute an order if maker is at a different global ask nonce than signed
     */
    function testCannotExecuteOrderIfInvalidUserGlobalAskNonce(uint256 userGlobalAskNonce) public {
        uint256 quasiRandomNumber = 54_570_651_553_685_478_358_117_286_254_199_992_264;
        vm.assume(userGlobalAskNonce < quasiRandomNumber);
        // Change block number
        vm.roll(1);
        assertEq(quasiRandomNumber, uint256(blockhash(block.number - 1) >> 128));

        uint256 newAskNonce = 0 + quasiRandomNumber;

        vm.prank(makerUser);
        vm.expectEmit(false, false, false, true);
        emit NewBidAskNonces(makerUser, 0, newAskNonce);
        looksRareProtocol.incrementBidAskNonces(false, true);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, INVALID_USER_GLOBAL_ASK_NONCE);

        vm.deal(takerUser, price);

        // Execute taker bid transaction
        // Taker user actions
        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * Cannot execute an order if maker is at a different global bid nonce than signed
     */
    function testCannotExecuteOrderIfInvalidUserGlobalBidNonce(uint256 userGlobalBidNonce) public {
        uint256 quasiRandomNumber = 54_570_651_553_685_478_358_117_286_254_199_992_264;
        vm.assume(userGlobalBidNonce < quasiRandomNumber);
        // Change block number
        vm.roll(1);
        assertEq(quasiRandomNumber, uint256(blockhash(block.number - 1) >> 128));

        uint256 newBidNonce = 0 + quasiRandomNumber;

        vm.prank(makerUser);
        vm.expectEmit(false, false, false, true);
        emit NewBidAskNonces(makerUser, newBidNonce, 0);
        looksRareProtocol.incrementBidAskNonces(true, false);

        uint256 itemId = 420;

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: userGlobalBidNonce,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerBid, signature, INVALID_USER_GLOBAL_BID_NONCE);

        // Mint asset
        mockERC721.mint(takerUser, itemId);

        // Execute taker ask transaction
        // Taker user actions
        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * Cannot execute an order twice
     */
    function testCannotExecuteAnOrderTwice() public {
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Taker user actions
        vm.startPrank(takerUser);

        {
            looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

            _assertMakerOrderReturnValidationCode(makerBid, signature, USER_ORDER_NONCE_EXECUTED_OR_CANCELLED);

            // Second one fails
            vm.expectRevert(NoncesInvalid.selector);
            looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
        }

        vm.stopPrank();
    }

    /**
     * Cannot execute an order sharing the same order nonce as another that is being partially filled
     */
    function testCannotExecuteAnotherOrderAtNonceIfExecutionIsInProgress(uint256 orderNonce) public {
        _setUpUsers();

        // 0. Add the new strategy
        bytes4 selector = StrategyTestMultiFillCollectionOrder.executeStrategyWithTakerAsk.selector;

        StrategyTestMultiFillCollectionOrder strategyMultiFillCollectionOrder =
            new StrategyTestMultiFillCollectionOrder(address(looksRareProtocol));

        vm.prank(_owner);
        _addStrategy(address(strategyMultiFillCollectionOrder), selector, true);

        // 1. Maker signs a message and execute a partial fill on it
        uint256 amountsToFill = 4;

        uint256[] memory itemIds = new uint256[](0);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amountsToFill;

        // Prepare the first order
        OrderStructs.Maker memory makerBid = _createMultiItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1, // Multi-fill bid offer
            collectionType: CollectionType.ERC721,
            orderNonce: orderNonce,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemIds: itemIds,
            amounts: amounts
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // First taker user actions
        {
            itemIds = new uint256[](1);
            amounts = new uint256[](1);
            itemIds[0] = 0;
            amounts[0] = 1;

            mockERC721.mint(takerUser, itemIds[0]);

            // Prepare the taker ask
            OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(itemIds, amounts));

            vm.prank(takerUser);

            // Execute taker ask transaction
            looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
        }

        // 2. Second maker order is signed sharing the same order nonce as the first one
        {
            uint256 itemId = 420;

            itemIds = new uint256[](1);
            amounts = new uint256[](1);
            itemIds[0] = itemId;
            amounts[0] = 1;

            // Prepare the second order
            makerBid = _createMultiItemMakerOrder({
                quoteType: QuoteType.Bid,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: orderNonce,
                collection: address(mockERC721),
                currency: address(weth),
                signer: makerUser,
                price: price,
                itemIds: itemIds,
                amounts: amounts
            });

            // Sign order
            signature = _signMakerOrder(makerBid, makerUserPK);

            _assertMakerOrderReturnValidationCode(makerBid, signature, USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH);

            // Prepare the taker ask
            OrderStructs.Taker memory takerAsk =
                OrderStructs.Taker(takerUser, abi.encode(new uint256[](0), new uint256[](0)));

            vm.prank(takerUser);

            // Second one fails when a taker user tries to execute
            vm.expectRevert(NoncesInvalid.selector);
            looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
        }
    }

    function testCancelOrderNonces(uint256 nonceOne, uint256 nonceTwo) public asPrankedUser(makerUser) {
        assertEq(looksRareProtocol.userOrderNonce(makerUser, nonceOne), bytes32(0));
        assertEq(looksRareProtocol.userOrderNonce(makerUser, nonceTwo), bytes32(0));

        uint256[] memory orderNonces = new uint256[](2);
        orderNonces[0] = nonceOne;
        orderNonces[1] = nonceTwo;
        vm.expectEmit(true, false, false, true);
        emit OrderNoncesCancelled(makerUser, orderNonces);
        looksRareProtocol.cancelOrderNonces(orderNonces);

        assertEq(looksRareProtocol.userOrderNonce(makerUser, nonceOne), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
        assertEq(looksRareProtocol.userOrderNonce(makerUser, nonceTwo), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    /**
     * Cannot execute an order if its nonce has been cancelled
     */
    function testCannotExecuteAnOrderWhoseNonceIsCancelled(uint256 orderNonce) public {
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        uint256 itemId = 0;

        uint256[] memory orderNonces = new uint256[](1);
        orderNonces[0] = orderNonce;
        vm.prank(makerUser);
        looksRareProtocol.cancelOrderNonces(orderNonces);

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: orderNonce,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerBid, signature, USER_ORDER_NONCE_EXECUTED_OR_CANCELLED);

        // Mint asset
        mockERC721.mint(takerUser, itemId);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk =
            OrderStructs.Taker(takerUser, abi.encode(new uint256[](0), new uint256[](0)));

        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCancelNoncesRevertIfEmptyArrays() public {
        uint256[] memory nonces = new uint256[](0);

        vm.expectRevert(LengthsInvalid.selector);
        looksRareProtocol.cancelSubsetNonces(nonces);

        vm.expectRevert(LengthsInvalid.selector);
        looksRareProtocol.cancelOrderNonces(nonces);
    }
}
