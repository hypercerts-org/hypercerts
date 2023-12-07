// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// LooksRare unopinionated libraries
import {IOwnableTwoSteps} from "@looksrare/contracts-libs/contracts/interfaces/IOwnableTwoSteps.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Interfaces
import {IStrategyManager} from "@hypercerts/marketplace/interfaces/IStrategyManager.sol";
import {IStrategy} from "@hypercerts/marketplace/interfaces/IStrategy.sol";

// Random strategy
import {StrategyCollectionOffer} from "@hypercerts/marketplace/executionStrategies/StrategyCollectionOffer.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

contract FalseBaseStrategy is IStrategy {
    /**
     * @inheritdoc IStrategy
     */
    function isMakerOrderValid(OrderStructs.Maker calldata, bytes4)
        external
        view
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        //
    }

    /**
     * @inheritdoc IStrategy
     */
    function isLooksRareV2Strategy() external pure override returns (bool) {
        return false;
    }
}

contract StrategyManagerTest is ProtocolBase, IStrategyManager {
    function setUp() public {
        _setUp();
    }

    /**
     * Owner can discontinue strategy
     */
    function testOwnerCanDiscontinueStrategy() public asPrankedUser(_owner) {
        uint256 strategyId = 0;
        uint16 standardProtocolFeeBp = 100;
        uint16 minTotalFeeBp = 200;
        bool isActive = false;

        vm.expectEmit(false, false, false, true);
        emit StrategyUpdated(strategyId, isActive, standardProtocolFeeBp, minTotalFeeBp);
        looksRareProtocol.updateStrategy(strategyId, isActive, standardProtocolFeeBp, minTotalFeeBp);

        (
            bool strategyIsActive,
            uint16 strategyStandardProtocolFee,
            uint16 strategyMinTotalFee,
            uint16 strategyMaxProtocolFee,
            bytes4 strategySelector,
            bool strategyIsMakerBid,
            address strategyImplementation
        ) = looksRareProtocol.strategyInfo(strategyId);

        assertFalse(strategyIsActive);
        assertEq(strategyStandardProtocolFee, standardProtocolFeeBp);
        assertEq(strategyMinTotalFee, minTotalFeeBp);
        assertEq(strategyMaxProtocolFee, _maxProtocolFeeBp);
        assertEq(strategySelector, _EMPTY_BYTES4);
        assertFalse(strategyIsMakerBid);
        assertEq(strategyImplementation, address(0));
    }

    function testNewStrategyEventIsEmitted() public asPrankedUser(_owner) {
        StrategyCollectionOffer strategy = new StrategyCollectionOffer();

        uint256 strategyId = 1;
        bytes4 selector = StrategyCollectionOffer.executeCollectionStrategyWithTakerAsk.selector;
        bool isMakerBid = true;
        address implementation = address(strategy);

        vm.expectEmit(true, false, false, true);
        emit NewStrategy(
            strategyId, _standardProtocolFeeBp, _minTotalFeeBp, _maxProtocolFeeBp, selector, isMakerBid, implementation
        );

        _addStrategy(implementation, selector, isMakerBid);
    }

    /**
     * Owner can change protocol fee information
     */
    function testOwnerCanChangeStrategyProtocolFees() public asPrankedUser(_owner) {
        uint256 strategyId = 0;
        uint16 newStandardProtocolFeeBp = 100;
        uint16 newMinTotalFeeBp = 200;
        bool isActive = true;

        vm.expectEmit(false, false, false, true);
        emit StrategyUpdated(strategyId, isActive, newStandardProtocolFeeBp, newMinTotalFeeBp);
        looksRareProtocol.updateStrategy(strategyId, isActive, newStandardProtocolFeeBp, newMinTotalFeeBp);

        (
            bool strategyIsActive,
            uint16 strategyStandardProtocolFee,
            uint16 strategyMinTotalFee,
            uint16 strategyMaxProtocolFee,
            bytes4 strategySelector,
            bool strategyIsMakerBid,
            address strategyImplementation
        ) = looksRareProtocol.strategyInfo(strategyId);

        assertTrue(strategyIsActive);
        assertEq(strategyStandardProtocolFee, newStandardProtocolFeeBp);
        assertEq(strategyMinTotalFee, newMinTotalFeeBp);
        assertEq(strategyMaxProtocolFee, _maxProtocolFeeBp);
        assertEq(strategySelector, _EMPTY_BYTES4);
        assertFalse(strategyIsMakerBid);
        assertEq(strategyImplementation, address(0));
    }

    /**
     * Owner functions for strategy updates revert as expected under multiple revertion scenarios
     */
    function testOwnerRevertionsForInvalidParametersUpdateStrategy() public asPrankedUser(_owner) {
        (, uint16 currentStandardProtocolFee, uint16 currentMinTotalFee, uint16 maxProtocolFeeBp,,,) =
            looksRareProtocol.strategyInfo(0);

        // 1. newStandardProtocolFee is higher than maxProtocolFeeBp
        uint16 newStandardProtocolFee = maxProtocolFeeBp + 1;
        uint16 newMinTotalFee = currentMinTotalFee;
        vm.expectRevert(StrategyProtocolFeeTooHigh.selector);
        looksRareProtocol.updateStrategy(0, true, newStandardProtocolFee, newMinTotalFee);

        // 2. newMinTotalFee is higher than maxProtocolFeeBp
        newStandardProtocolFee = currentStandardProtocolFee;
        newMinTotalFee = maxProtocolFeeBp + 1;
        vm.expectRevert(StrategyProtocolFeeTooHigh.selector);
        looksRareProtocol.updateStrategy(0, true, newStandardProtocolFee, newMinTotalFee);

        // 3. It reverts if strategy doesn't exist
        vm.expectRevert(StrategyNotUsed.selector);
        looksRareProtocol.updateStrategy(1, true, currentStandardProtocolFee, currentMinTotalFee);
    }

    /**
     * Owner functions for strategy additions revert as expected under multiple revertion scenarios
     */
    function testOwnerRevertionsForInvalidParametersAddStrategy() public asPrankedUser(_owner) {
        uint16 standardProtocolFeeBp = 250;
        uint16 minTotalFeeBp = 300;
        uint16 maxProtocolFeeBp = 300;
        address implementation = address(0);

        // 1. standardProtocolFeeBp is higher than maxProtocolFeeBp
        maxProtocolFeeBp = standardProtocolFeeBp - 1;
        vm.expectRevert(abi.encodeWithSelector(IStrategyManager.StrategyProtocolFeeTooHigh.selector));
        looksRareProtocol.addStrategy(
            standardProtocolFeeBp, minTotalFeeBp, maxProtocolFeeBp, _EMPTY_BYTES4, true, implementation
        );

        // 2. minTotalFeeBp is higher than maxProtocolFeeBp
        maxProtocolFeeBp = minTotalFeeBp - 1;
        vm.expectRevert(abi.encodeWithSelector(IStrategyManager.StrategyProtocolFeeTooHigh.selector));
        looksRareProtocol.addStrategy(
            standardProtocolFeeBp, minTotalFeeBp, maxProtocolFeeBp, _EMPTY_BYTES4, true, implementation
        );

        // 3. maxProtocolFeeBp is higher than _MAX_PROTOCOL_FEE
        maxProtocolFeeBp = 500 + 1;
        vm.expectRevert(abi.encodeWithSelector(IStrategyManager.StrategyProtocolFeeTooHigh.selector));
        looksRareProtocol.addStrategy(
            standardProtocolFeeBp, minTotalFeeBp, maxProtocolFeeBp, _EMPTY_BYTES4, true, implementation
        );
    }

    function testAddStrategyNoSelector() public asPrankedUser(_owner) {
        vm.expectRevert(IStrategyManager.StrategyHasNoSelector.selector);
        _addStrategy(address(0), _EMPTY_BYTES4, true);
    }

    function testAddStrategyNotV2Strategy() public asPrankedUser(_owner) {
        bytes4 randomSelector = StrategyCollectionOffer.executeCollectionStrategyWithTakerAsk.selector;

        // 1. EOA
        vm.expectRevert();
        _addStrategy(address(0), randomSelector, true);

        // 2. Invalid contract (e.g. LooksRareProtocol)
        vm.expectRevert();
        _addStrategy(address(looksRareProtocol), randomSelector, true);

        // 3. Contract that implements the function but returns false
        FalseBaseStrategy falseStrategy = new FalseBaseStrategy();

        vm.expectRevert(NotV2Strategy.selector);
        _addStrategy(address(falseStrategy), randomSelector, true);
    }

    function testAddStrategyNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        _addStrategy(address(0), _EMPTY_BYTES4, true);
    }

    function testUpdateStrategyNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        looksRareProtocol.updateStrategy(0, false, 299, 100);
    }
}
