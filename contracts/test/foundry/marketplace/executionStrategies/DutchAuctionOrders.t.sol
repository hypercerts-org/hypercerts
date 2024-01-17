/// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {IExecutionManager} from "@hypercerts/marketplace/interfaces/IExecutionManager.sol";
import {IStrategyManager} from "@hypercerts/marketplace/interfaces/IStrategyManager.sol";

// Shared errors
import {
    AmountInvalid,
    BidTooLow,
    OrderInvalid,
    FunctionSelectorInvalid,
    QuoteTypeInvalid,
    CollectionTypeInvalid
} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    STRATEGY_NOT_ACTIVE,
    MAKER_ORDER_TEMPORARILY_INVALID_NON_STANDARD_SALE,
    MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Strategies
import {StrategyDutchAuction} from "@hypercerts/marketplace/executionStrategies/StrategyDutchAuction.sol";

// Other tests
import {ProtocolBase} from "../ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract DutchAuctionOrdersTest is ProtocolBase, IStrategyManager {
    StrategyDutchAuction public strategyDutchAuction;
    bytes4 public selector = StrategyDutchAuction.executeStrategyWithTakerBid.selector;

    function setUp() public {
        _setUp();
    }

    function _setUpNewStrategy() private asPrankedUser(_owner) {
        strategyDutchAuction = new StrategyDutchAuction();
        _addStrategy(address(strategyDutchAuction), selector, false);
    }

    function _createMakerAskAndTakerBid(
        uint256 numberOfItems,
        uint256 numberOfAmounts,
        uint256 startPrice,
        uint256 endPrice,
        uint256 endTime
    ) private returns (OrderStructs.Maker memory newMakerAsk, OrderStructs.Taker memory newTakerBid) {
        uint256[] memory itemIds = new uint256[](numberOfItems);
        for (uint256 i; i < numberOfItems;) {
            mockERC721.mint(makerUser, i + 1);
            itemIds[i] = i + 1;
            unchecked {
                ++i;
            }
        }

        uint256[] memory amounts = new uint256[](numberOfAmounts);
        for (uint256 i; i < numberOfAmounts;) {
            amounts[i] = 1;
            unchecked {
                ++i;
            }
        }

        newMakerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: endPrice,
            itemId: 1
        });

        newMakerAsk.itemIds = itemIds;
        newMakerAsk.amounts = amounts;

        newMakerAsk.endTime = endTime;
        newMakerAsk.additionalParameters = abi.encode(startPrice);

        // Using startPrice as the maxPrice
        newTakerBid = OrderStructs.Taker(takerUser, abi.encode(startPrice));
    }

    function testNewStrategy() public {
        _setUpNewStrategy();
        _assertStrategyAttributes(address(strategyDutchAuction), selector, false);
    }

    function _fuzzAssumptions(uint256 _startPrice, uint256 _duration, uint256 _decayPerSecond, uint256 _elapsedTime)
        private
        returns (uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime)
    {
        // Bound instead of assume to handle too many rejections
        // These limits should be realistically way more than enough
        // vm.assume(duration > 0 && duration <= 31_536_000);
        // Assume the NFT is worth at least 0.01 USD at today's ETH price (2023-01-13 18:00:00 UTC)
        // vm.assume(startPrice > 1e12 && startPrice <= 100_000 ether);
        // vm.assume(decayPerSecond > 0 && decayPerSecond < startPrice);
        // vm.assume(elapsedTime <= duration && startPrice > decayPerSecond * duration);

        duration = bound(_duration, 1, 31_536_600);
        startPrice = bound(_startPrice, 1e12, 100_000 ether);
        decayPerSecond = bound(_decayPerSecond, 1, startPrice);

        vm.assume(_elapsedTime <= duration && startPrice > decayPerSecond * duration);
        elapsedTime = _elapsedTime;
    }

    function _calculatePrices(uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime)
        private
        pure
        returns (uint256 endPrice, uint256 executionPrice)
    {
        endPrice = startPrice - decayPerSecond * duration;
        uint256 discount = decayPerSecond * elapsedTime;
        executionPrice = startPrice - discount;
    }

    function testDutchAuction(uint256 _startPrice, uint256 _duration, uint256 _decayPerSecond, uint256 _elapsedTime)
        public
    {
        (uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime) =
            _fuzzAssumptions(_startPrice, _duration, _decayPerSecond, _elapsedTime);
        _setUpUsers();
        _setUpNewStrategy();

        (uint256 endPrice, uint256 executionPrice) = _calculatePrices(startPrice, duration, decayPerSecond, elapsedTime);

        deal(address(weth), takerUser, executionPrice);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: startPrice,
            endPrice: endPrice,
            endTime: block.timestamp + duration
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsValid(makerAsk);
        _assertValidMakerOrder(makerAsk, signature);

        vm.warp(block.timestamp + elapsedTime);

        // Execute taker bid transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the asset
        assertEq(mockERC721.ownerOf(1), takerUser);

        // Taker bid user pays the whole price
        assertEq(weth.balanceOf(takerUser), 0, "taker balance incorrect");
        // Maker ask user receives 99.5% of the whole price (0.5% protocol)
        uint256 protocolFee = (executionPrice * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;
        assertEq(
            weth.balanceOf(makerUser),
            _initialWETHBalanceUser + (executionPrice - protocolFee),
            "maker balance incorrect"
        );
    }

    function testStartPriceTooLow(uint256 _startPrice, uint256 _duration, uint256 _decayPerSecond, uint256 _elapsedTime)
        public
    {
        (uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime) =
            _fuzzAssumptions(_startPrice, _duration, _decayPerSecond, _elapsedTime);
        _setUpUsers();
        _setUpNewStrategy();

        (uint256 endPrice, uint256 executionPrice) = _calculatePrices(startPrice, duration, decayPerSecond, elapsedTime);
        deal(address(weth), takerUser, executionPrice);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: startPrice,
            endPrice: endPrice,
            endTime: block.timestamp + duration
        });

        makerAsk.price = startPrice + 1 wei;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        bytes4 errorSelector = _assertOrderIsInvalid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(errorSelector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidTooLow(uint256 _startPrice, uint256 _duration, uint256 _decayPerSecond, uint256 _elapsedTime)
        public
    {
        (uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime) =
            _fuzzAssumptions(_startPrice, _duration, _decayPerSecond, _elapsedTime);
        _setUpUsers();
        _setUpNewStrategy();

        (uint256 endPrice, uint256 executionPrice) = _calculatePrices(startPrice, duration, decayPerSecond, elapsedTime);
        deal(address(weth), takerUser, executionPrice);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: startPrice,
            endPrice: endPrice,
            endTime: block.timestamp + duration
        });

        takerBid.additionalParameters = abi.encode(executionPrice - 1 wei);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Valid, taker struct validation only happens during execution
        _assertOrderIsValid(makerAsk);
        _assertValidMakerOrder(makerAsk, signature);

        vm.expectRevert(BidTooLow.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testInactiveStrategy() public {
        _setUpUsers();
        _setUpNewStrategy();
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: 10 ether,
            endPrice: 1 ether,
            endTime: block.timestamp + 1 hours
        });

        vm.prank(_owner);
        looksRareProtocol.updateStrategy(1, false, _standardProtocolFeeBp, _minTotalFeeBp);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsValid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, STRATEGY_NOT_ACTIVE);

        vm.prank(takerUser);
        vm.expectRevert(abi.encodeWithSelector(IExecutionManager.StrategyNotAvailable.selector, 1));
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testZeroItemIdsLength() public {
        _setUpUsers();
        _setUpNewStrategy();
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 0,
            numberOfAmounts: 0,
            startPrice: 10 ether,
            endPrice: 1 ether,
            endTime: block.timestamp + 1 hours
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        bytes4 errorSelector = _assertOrderIsInvalid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(errorSelector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testItemIdsAndAmountsLengthMismatch() public {
        _setUpUsers();
        _setUpNewStrategy();
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 2,
            startPrice: 10 ether,
            endPrice: 1 ether,
            endTime: block.timestamp + 1 hours
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        bytes4 errorSelector = _assertOrderIsInvalid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(errorSelector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testInvalidAmounts() public {
        _setUpUsers();
        _setUpNewStrategy();

        // 1. Amount = 0
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: 10 ether,
            endPrice: 1 ether,
            endTime: block.timestamp + 1 hours
        });

        makerAsk.amounts[0] = 0;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        bytes4 errorSelector = _assertOrderIsInvalid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // 2. ERC721 amount > 1
        makerAsk.amounts[0] = 2;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        errorSelector = _assertOrderIsInvalid(makerAsk);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testWrongQuoteType() public {
        _setUpNewStrategy();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: 1 ether,
            itemId: 420
        });

        (bool orderIsValid, bytes4 errorSelector) = strategyDutchAuction.isMakerOrderValid(makerBid, selector);

        assertFalse(orderIsValid);
        assertEq(errorSelector, QuoteTypeInvalid.selector);
    }

    function testInvalidSelector() public {
        _setUpNewStrategy();

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 2,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: 1 ether,
            itemId: 420
        });

        (bool orderIsValid, bytes4 errorSelector) = strategyDutchAuction.isMakerOrderValid(makerAsk, bytes4(0));
        assertFalse(orderIsValid);
        assertEq(errorSelector, FunctionSelectorInvalid.selector);
    }

    function testCollectionTypeInvalid(
        uint256 _startPrice,
        uint256 _duration,
        uint256 _decayPerSecond,
        uint256 _elapsedTime
    ) public {
        (uint256 startPrice, uint256 duration, uint256 decayPerSecond, uint256 elapsedTime) =
            _fuzzAssumptions(_startPrice, _duration, _decayPerSecond, _elapsedTime);
        _setUpUsers();
        _setUpNewStrategy();

        (uint256 endPrice, uint256 executionPrice) = _calculatePrices(startPrice, duration, decayPerSecond, elapsedTime);

        deal(address(weth), takerUser, executionPrice);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) = _createMakerAskAndTakerBid({
            numberOfItems: 1,
            numberOfAmounts: 1,
            startPrice: startPrice,
            endPrice: endPrice,
            endTime: block.timestamp + duration
        });

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;
        makerAsk.collectionType = CollectionType.Hypercert;
        makerAsk.additionalParameters = abi.encode(block.timestamp + 1000);

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(CollectionTypeInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function _assertOrderIsValid(OrderStructs.Maker memory makerAsk) private {
        (bool isValid, bytes4 errorSelector) = strategyDutchAuction.isMakerOrderValid(makerAsk, selector);
        assertTrue(isValid);
        assertEq(errorSelector, _EMPTY_BYTES4);
    }

    function _assertOrderIsInvalid(OrderStructs.Maker memory makerAsk) private returns (bytes4) {
        (bool isValid, bytes4 errorSelector) = strategyDutchAuction.isMakerOrderValid(makerAsk, selector);
        assertFalse(isValid);
        assertEq(errorSelector, OrderInvalid.selector);

        return errorSelector;
    }
}
