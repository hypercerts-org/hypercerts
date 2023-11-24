// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// LooksRare unopinionated libraries
import {IOwnableTwoSteps} from "@looksrare/contracts-libs/contracts/interfaces/IOwnableTwoSteps.sol";

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {IExecutionManager} from "@hypercerts/marketplace/interfaces/IExecutionManager.sol";
import {IStrategyManager} from "@hypercerts/marketplace/interfaces/IStrategyManager.sol";

// Shared errors
import {OrderInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    MAKER_ORDER_INVALID_STANDARD_SALE,
    STRATEGY_INVALID_QUOTE_TYPE,
    STRATEGY_INVALID_QUOTE_TYPE,
    STRATEGY_NOT_ACTIVE,
    START_TIME_GREATER_THAN_END_TIME,
    TOO_LATE_TO_EXECUTE_ORDER,
    TOO_EARLY_TO_EXECUTE_ORDER
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

contract ExecutionManagerTest is ProtocolBase, IExecutionManager, IStrategyManager {
    function setUp() public {
        _setUp();
    }

    function testUpdateCreatorFeeManager() public asPrankedUser(_owner) {
        vm.expectEmit(true, false, false, true);
        emit NewCreatorFeeManager(address(1));
        looksRareProtocol.updateCreatorFeeManager(address(1));
        assertEq(address(looksRareProtocol.creatorFeeManager()), address(1));
    }

    function testUpdateCreatorFeeManagerNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        looksRareProtocol.updateCreatorFeeManager(address(1));
    }

    function testUpdateMaxCreatorFeeBp(uint16 newMaxCreatorFeeBp) public asPrankedUser(_owner) {
        vm.assume(newMaxCreatorFeeBp <= 2500);
        vm.expectEmit(true, false, false, true);
        emit NewMaxCreatorFeeBp(newMaxCreatorFeeBp);
        looksRareProtocol.updateMaxCreatorFeeBp(newMaxCreatorFeeBp);
        assertEq(looksRareProtocol.maxCreatorFeeBp(), newMaxCreatorFeeBp);
    }

    function testUpdateMaxCreatorFeeBpNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        looksRareProtocol.updateMaxCreatorFeeBp(uint16(2500));
    }

    function testUpdateMaxCreatorFeeBpTooHigh(uint16 newMaxCreatorFeeBp) public asPrankedUser(_owner) {
        vm.assume(newMaxCreatorFeeBp > 2500);
        vm.expectRevert(CreatorFeeBpTooHigh.selector);
        looksRareProtocol.updateMaxCreatorFeeBp(newMaxCreatorFeeBp);
    }

    function testUpdateProtocolFeeRecipient() public asPrankedUser(_owner) {
        vm.expectEmit(true, false, false, true);
        emit NewProtocolFeeRecipient(address(1));
        looksRareProtocol.updateProtocolFeeRecipient(address(1));
        assertEq(looksRareProtocol.protocolFeeRecipient(), address(1));
    }

    function testUpdateProtocolFeeRecipientCannotBeNullAddress() public asPrankedUser(_owner) {
        vm.expectRevert(IExecutionManager.NewProtocolFeeRecipientCannotBeNullAddress.selector);
        looksRareProtocol.updateProtocolFeeRecipient(address(0));
    }

    function testUpdateProtocolFeeRecipientNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        looksRareProtocol.updateProtocolFeeRecipient(address(1));
    }

    function testCannotValidateOrderIfTooEarlyToExecute(uint256 timestamp) public asPrankedUser(takerUser) {
        // 300 because because it is deducted by 5 minutes + 1 second
        vm.assume(timestamp > 300 && timestamp < type(uint256).max);
        // Change timestamp to avoid underflow issues
        vm.warp(timestamp);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        makerBid.startTime = block.timestamp;
        makerBid.endTime = block.timestamp + 1 seconds;

        // Maker bid is valid if its start time is within 5 minutes into the future
        vm.warp(makerBid.startTime - 5 minutes);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);
        _assertMakerOrderReturnValidationCode(makerBid, signature, TOO_EARLY_TO_EXECUTE_ORDER);

        // Maker bid is invalid if its start time is not within 5 minutes into the future
        vm.warp(makerBid.startTime - 5 minutes - 1 seconds);
        vm.expectRevert(OutsideOfTimeRange.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfTooLateToExecute(uint256 timestamp) public asPrankedUser(takerUser) {
        vm.assume(timestamp > 0 && timestamp < type(uint256).max);
        // Change timestamp to avoid underflow issues
        vm.warp(timestamp);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        makerBid.startTime = block.timestamp - 1 seconds;
        makerBid.endTime = block.timestamp;
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        vm.warp(block.timestamp);
        _assertMakerOrderReturnValidationCode(makerBid, signature, TOO_LATE_TO_EXECUTE_ORDER);

        vm.warp(block.timestamp + 1 seconds);
        vm.expectRevert(OutsideOfTimeRange.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfStartTimeLaterThanEndTime(uint256 timestamp) public asPrankedUser(takerUser) {
        vm.assume(timestamp < type(uint256).max);
        // Change timestamp to avoid underflow issues
        vm.warp(timestamp);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        makerBid.startTime = block.timestamp + 1 seconds;
        makerBid.endTime = block.timestamp;
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerBid, signature, START_TIME_GREATER_THAN_END_TIME);

        vm.expectRevert(OutsideOfTimeRange.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfMakerBidItemIdsIsEmpty() public {
        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        uint256[] memory itemIds = new uint256[](0);
        makerBid.itemIds = itemIds;
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfMakerBidItemIdsLengthMismatch(uint256 makerBidItemIdsLength)
        public
        asPrankedUser(takerUser)
    {
        vm.assume(makerBidItemIdsLength > 1 && makerBidItemIdsLength < 100_000);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        uint256[] memory itemIds = new uint256[](makerBidItemIdsLength);
        makerBid.itemIds = itemIds;
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfMakerAskItemIdsIsEmpty() public asPrankedUser(takerUser) {
        vm.deal(takerUser, 100 ether);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        // Change maker itemIds array to make its length equal to 0
        uint256[] memory itemIds = new uint256[](0);
        makerAsk.itemIds = itemIds;
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid{value: makerAsk.price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testCannotValidateOrderIfMakerAskItemIdsLengthMismatch(uint256 makerAskItemIdsLength)
        public
        asPrankedUser(takerUser)
    {
        vm.deal(takerUser, 100 ether);

        vm.assume(makerAskItemIdsLength > 1 && makerAskItemIdsLength < 100_000);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        uint256[] memory itemIds = new uint256[](makerAskItemIdsLength);
        makerAsk.itemIds = itemIds;
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_INVALID_STANDARD_SALE);

        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid{value: makerAsk.price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }
}
