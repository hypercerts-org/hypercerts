// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IOwnableTwoSteps} from "@looksrare/contracts-libs/contracts/interfaces/IOwnableTwoSteps.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Shared errors
import {
    AmountInvalid,
    CallerInvalid,
    CurrencyInvalid,
    OrderInvalid,
    QuoteTypeInvalid
} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    CURRENCY_NOT_ALLOWED,
    MAKER_ORDER_INVALID_STANDARD_SALE
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";
// Strategies
import {StrategyHypercertFractionOffer} from
    "@hypercerts/marketplace/executionStrategies/StrategyHypercertFractionOffer.sol";

// Other mocks and utils
import {MockERC20} from "../../mock/MockERC20.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract LooksRareProtocolTest is ProtocolBase {
    // Fixed price of sale
    uint256 private constant price = 1 ether;

    // Mock files
    MockERC20 private mockERC20;
    StrategyHypercertFractionOffer public strategyHypercertFractionOffer;
    bytes4 public selectorNoProof = StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector;
    bytes4 public selectorWithProofAllowlist =
        StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector;

    uint256 private constant minUnitAmount = 1;
    uint256 private constant maxUnitAmount = 100;
    uint256 private constant minUnitsToKeep = 5000;
    bool private constant sellLeftover = false;

    function setUp() public {
        _setUp();
        _setUpNewStrategies();
        vm.prank(_owner);
        mockERC20 = new MockERC20();
    }

    function _setUpNewStrategies() private asPrankedUser(_owner) {
        strategyHypercertFractionOffer = new StrategyHypercertFractionOffer();
        _addStrategy(address(strategyHypercertFractionOffer), selectorNoProof, false);
        _addStrategy(address(strategyHypercertFractionOffer), selectorWithProofAllowlist, false);
    }

    function testCannotTradeIfInvalidAmounts() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // 1. Amount = 0
        makerAsk.amounts[0] = 0;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // 2. Amount > 1 for ERC721
        makerAsk.amounts[0] = 2;

        // Sign order
        signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotTradeIfCurrencyInvalid() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.currency = address(mockERC20);

        mockERC20.mint(takerUser, 10 ether);
        vm.prank(takerUser);
        mockERC20.approve(address(looksRareProtocol), 10 ether);

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker ask order
        _assertMakerOrderReturnValidationCode(makerAsk, signature, CURRENCY_NOT_ALLOWED);

        vm.prank(takerUser);
        vm.expectRevert(CurrencyInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](1);
        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](1);
        bytes[] memory signatures = new bytes[](1);
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](1);

        makerAsks[0] = makerAsk;
        takerBids[0] = takerBid;
        signatures[0] = signature;

        vm.prank(takerUser);
        vm.expectRevert(CurrencyInvalid.selector);
        looksRareProtocol.executeMultipleTakerBids{value: price}(
            takerBids,
            makerAsks,
            signatures,
            merkleTrees,
            true // Atomic
        );

        vm.prank(takerUser);
        vm.expectRevert(CurrencyInvalid.selector);
        looksRareProtocol.executeMultipleTakerBids{value: price}(
            takerBids,
            makerAsks,
            signatures,
            merkleTrees,
            false // Non-atomic
        );

        vm.prank(_owner);
        looksRareProtocol.updateCurrencyStatus(address(mockERC20), true);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotTradeIfETHIsUsedForMakerBid() public {
        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), ETH);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Verify maker bid order
        _assertMakerOrderReturnValidationCode(makerBid, signature, CURRENCY_NOT_ALLOWED);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Execute taker ask transaction
        vm.prank(takerUser);
        vm.expectRevert(CurrencyInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotTradeIfInvalidQuoteType() public {
        // 1. QuoteType = BID but executeTakerBid
        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        vm.prank(takerUser);
        vm.expectRevert(QuoteTypeInvalid.selector);
        looksRareProtocol.executeTakerBid(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 2. QuoteType = ASK but executeTakerAsk
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.currency = address(weth);

        // Sign order
        signature = _signMakerOrder(makerAsk, makerUserPK);

        vm.prank(takerUser);
        vm.expectRevert(QuoteTypeInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testUpdateETHGasLimitForTransfer() public asPrankedUser(_owner) {
        vm.expectEmit(true, false, false, true);
        emit NewGasLimitETHTransfer(10_000);
        looksRareProtocol.updateETHGasLimitForTransfer(10_000);
        assertEq(uint256(vm.load(address(looksRareProtocol), bytes32(uint256(12)))), 10_000);
    }

    function testUpdateETHGasLimitForTransferRevertsIfTooLow() public asPrankedUser(_owner) {
        uint256 newGasLimitETHTransfer = 2300;
        vm.expectRevert(NewGasLimitETHTransferTooLow.selector);
        looksRareProtocol.updateETHGasLimitForTransfer(newGasLimitETHTransfer - 1);

        looksRareProtocol.updateETHGasLimitForTransfer(newGasLimitETHTransfer);
        assertEq(uint256(vm.load(address(looksRareProtocol), bytes32(uint256(12)))), newGasLimitETHTransfer);
    }

    function testUpdateETHGasLimitForTransferNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        looksRareProtocol.updateETHGasLimitForTransfer(10_000);
    }

    function testCannotCallRestrictedExecuteTakerBid() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        vm.prank(takerUser);
        vm.expectRevert(CallerInvalid.selector);
        looksRareProtocol.restrictedExecuteTakerBid(takerBid, makerAsk, takerUser, _computeOrderHash(makerAsk));
    }

    /**
     * Cannot execute two or more taker bids if the currencies are different
     */
    function testCannotExecuteMultipleTakerBidsIfDifferentCurrenciesIsAtomic() public {
        _testCannotExecuteMultipleTakerBidsIfDifferentCurrencies(true);
    }

    function testCannotExecuteMultipleTakerBidsIfDifferentCurrenciesIsNonAtomic() public {
        _testCannotExecuteMultipleTakerBidsIfDifferentCurrencies(false);
    }

    function _testCannotExecuteMultipleTakerBidsIfDifferentCurrencies(bool isAtomic) public {
        _setUpUsers();
        vm.prank(_owner);
        looksRareProtocol.updateCurrencyStatus(address(mockERC20), true);

        uint256 numberPurchases = 2;

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

            if (i == 1) {
                makerAsks[i].currency = address(mockERC20);
            }

            // Sign order
            signatures[i] = _signMakerOrder(makerAsks[i], makerUserPK);

            takerBids[i] = _genericTakerOrder();
        }

        // Other execution parameters
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

        vm.prank(takerUser);
        vm.expectRevert(CurrencyInvalid.selector);
        looksRareProtocol.executeMultipleTakerBids{value: price}(
            takerBids, makerAsks, signatures, merkleTrees, isAtomic
        );
    }

    function testCannotExecuteOnERC721TokensNotOwnedByMsgSender() public {
        (address anon, uint256 anonPK) = makeAddrAndKey("anon");

        _setUpUser(anon);
        _setUpUsers();
        vm.prank(_owner);
        looksRareProtocol.updateCurrencyStatus(address(mockERC20), true);

        uint256 itemId = 420;
        mockERC721.mint(makerUser, itemId);

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: ETH,
            signer: anon,
            price: 1 ether,
            itemId: itemId
        });

        OrderStructs.Taker memory takerBid = OrderStructs.Taker(takerUser, abi.encode());

        makerAsk.currency = address(mockERC20);

        mockERC20.mint(takerUser, 10 ether);
        vm.prank(takerUser);
        mockERC20.approve(address(looksRareProtocol), 10 ether);

        mockERC20.mint(anon, 10 ether);
        vm.prank(anon);
        mockERC20.approve(address(looksRareProtocol), 10 ether);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, anonPK);

        uint256 makerNftBalance = mockERC721.balanceOf(makerUser);
        uint256 makerErc20Balance = mockERC20.balanceOf(makerUser);

        vm.prank(anon);
        vm.expectRevert();
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        assertEq(makerNftBalance, 1);

        assertEq(mockERC721.balanceOf(anon), 0);
        assertEq(mockERC721.balanceOf(makerUser), 1);
        assertEq(mockERC721.balanceOf(takerUser), 0);

        assertEq(mockERC20.balanceOf(makerUser), makerErc20Balance);
    }
}
