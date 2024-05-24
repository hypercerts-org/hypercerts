// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Murky (third-party) library is used to compute Merkle trees in Solidity
import {Merkle} from "murky/Merkle.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Shared errors
import {
    AmountInvalid,
    LengthsInvalid,
    OrderInvalid,
    FunctionSelectorInvalid,
    MerkleProofInvalid,
    QuoteTypeInvalid
} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE} from
    "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Strategies
import {StrategyHypercertFractionOffer} from
    "@hypercerts/marketplace/executionStrategies/StrategyHypercertFractionOffer.sol";

// Base test
import {ProtocolBase} from "../ProtocolBase.t.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract HypercertFractionOrdersTest is ProtocolBase {
    using OrderStructs for OrderStructs.Maker;

    StrategyHypercertFractionOffer public strategyHypercertFractionOffer;
    bytes4 public selectorNoProof = StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector;
    bytes4 public selectorWithProofAllowlist =
        StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector;

    uint256 private constant price = 0.001 ether; // Fixed price of sale
    bytes32 private constant mockMerkleRoot = bytes32(keccak256("Mock")); // Mock merkle root

    uint256 private constant minUnitAmount = 1;
    uint256 private constant maxUnitAmount = 100;
    uint256 private constant minUnitsToKeep = 5000;
    bool private constant sellLeftover = false;

    function _createMakerAskAndTakerBidHypercert(bool mint)
        private
        returns (OrderStructs.Maker memory newMakerAsk, OrderStructs.Taker memory newTakerBid)
    {
        // Mint asset
        if (mint == true) {
            vm.prank(makerUser);
            mockHypercertMinter.mintClaim(makerUser, 10_000, "https://examle.com", FROM_CREATOR_ONLY);
        }

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = (1 << 128) + 1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        newMakerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0
        });

        newMakerAsk.itemIds = itemIds;
        newMakerAsk.amounts = amounts;
        newMakerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover);

        // Using startPrice as the maxPrice
        bytes32[] memory proofs = new bytes32[](0);

        newTakerBid = OrderStructs.Taker(takerUser, abi.encode(minUnitAmount, price, proofs));
    }

    function setUp() public {
        _setUp();
        _setUpNewStrategies();
    }

    function _setUpNewStrategies() private asPrankedUser(_owner) {
        strategyHypercertFractionOffer = new StrategyHypercertFractionOffer();
        _addStrategy(address(strategyHypercertFractionOffer), selectorNoProof, false);
        _addStrategy(address(strategyHypercertFractionOffer), selectorWithProofAllowlist, false);
    }

    function testNewStrategies() public {
        _assertStrategyAttributes(address(strategyHypercertFractionOffer), selectorNoProof, false);

        (
            bool strategyIsActive,
            uint16 strategyStandardProtocolFee,
            uint16 strategyMinTotalFee,
            uint16 strategyMaxProtocolFee,
            bytes4 strategySelector,
            bool strategyIsMakerBid,
            address strategyImplementation
        ) = looksRareProtocol.strategyInfo(2);

        assertTrue(strategyIsActive);
        assertEq(strategyStandardProtocolFee, _standardProtocolFeeBp);
        assertEq(strategyMinTotalFee, _minTotalFeeBp);
        assertEq(strategyMaxProtocolFee, _maxProtocolFeeBp);
        assertEq(strategySelector, selectorWithProofAllowlist);
        assertFalse(strategyIsMakerBid);
        assertEq(strategyImplementation, address(strategyHypercertFractionOffer));
    }

    function testmakerAskAmountsLengthNotOne() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Adjust strategy for collection order and sign order
        // Change array to make it bigger than expected
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        makerAsk.amounts = amounts;
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, false);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(LengthsInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // // With proof
        makerAsk.strategyId = 2;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(LengthsInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testZeroAmount() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;
        makerAsk.amounts = amounts;
        makerAsk.strategyId = 1;
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, false);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidCantBuyMoreThanMakerAskIntended() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Selling 5000 units out of 10000 (10000 - 5000 = 5000 minUnitsToKeep) at maximum of 3000 units per sale
        // (maxUnitAmount)
        makerAsk.additionalParameters = abi.encode(minUnitAmount, 3000, 5000, sellLeftover);
        takerBid.additionalParameters = abi.encode(3000, price);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Will pass because the taker bid is buying 3000 units out of 5000
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
        _assertSuccessfulTakerBid(makerAsk, takerBid, (1 << 128) + 1);

        // Will fail because the total amount of units bought is 6000, leaving 4000 units in the hypercert (less than
        // minUnitsToKeep)
        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Will pass on buying 2000 (unitAmount) out of 10000 units (maxUnitAmount) while minUnitsToKeep is 5000
        takerBid.additionalParameters = abi.encode(2000, price);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 1), makerUser);
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 2), takerUser);
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 3), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 1), 5000);
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 2), 3000);
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 3), 2000);
    }

    function testMakerAskInvalidation() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(false);

        uint256[] memory fractions = new uint256[](2);
        fractions[0] = 5000;
        fractions[1] = 5000;

        vm.prank(makerUser);
        mockHypercertMinter.mintClaimWithFractions(
            makerUser, 10_000, fractions, "https://example.com", FROM_CREATOR_ONLY
        );

        // Selling 2500 units out of 5000 (5000 - 2500 = 2500 minUnitsToKeep) at maximum of 2500 units per sale
        // (maxUnitAmount)
        makerAsk.additionalParameters = abi.encode(minUnitAmount, 2500, 2500, sellLeftover);
        takerBid.additionalParameters = abi.encode(2000, price);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Will pass because the taker bid is buying 2000 units out of 2500
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Will fail because the total amount of units bought will be 4000, leaving 1000 units in the hypercert (less
        // than
        // minUnitsToKeep)
        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Will pass on buying 500 (unitAmount) out of 2500 units (maxUnitAmount) while minUnitsToKeep is 2500
        takerBid.additionalParameters = abi.encode(500, price);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 1), makerUser);
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 2), makerUser);
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 3), takerUser);
        assertEq(mockHypercertMinter.ownerOf((1 << 128) + 4), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 1), 2500);
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 2), 5000); // 2nd fraction
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 3), 2000);
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 4), 500);

        // Will fail because the nonce has been invalidated
        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        // Merge to add more units to 'sold out' fraction
        uint256[] memory fractionIdsToMerge = new uint256[](2);
        fractionIdsToMerge[0] = ((1 << 128) + 2);
        fractionIdsToMerge[1] = ((1 << 128) + 1);

        vm.prank(makerUser);
        mockHypercertMinter.mergeFractions(makerUser, fractionIdsToMerge);

        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 1), 7500);
        assertEq(mockHypercertMinter.unitsOf((1 << 128) + 2), 0); // 2nd fraction

        // Will fail because nonce is still invalid, even though the fraction has more units now
        vm.prank(takerUser);
        vm.expectRevert(NoncesInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidHypercertFractionOrderFullFill() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.additionalParameters = abi.encode(minUnitAmount, 10_000, 0, sellLeftover);
        takerBid.additionalParameters = abi.encode(10_000, price);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBidFullFraction(makerAsk, takerBid, (1 << 128) + 1);
    }

    function testTakerBidHypercertFractionOrderPartialAndFullFill() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.amounts[0] = 1;
        makerAsk.additionalParameters = abi.encode(minUnitAmount, 10_000, 0, sellLeftover);

        takerBid.additionalParameters = abi.encode(3000, price);

        uint256 fractionId = (1 << 128) + 1;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction partial fill; buy 3000 units
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBid(makerAsk, takerBid, fractionId);

        takerBid.additionalParameters = abi.encode(7000, price);

        // Execute taker ask transaction full fill; buy remaining 7000 units
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        //units, amount, currency, proof[]
        (uint256 unitAmount) = abi.decode(takerBid.additionalParameters, (uint256));

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(fractionId), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf(fractionId), unitAmount);

        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function testTakerBidHypercertFractionOrderPartialAndFullFillSellLeftoverTrue() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.amounts[0] = 1;
        makerAsk.additionalParameters = abi.encode(100, 10_000, 0, true);

        takerBid.additionalParameters = abi.encode(9901, price);

        uint256 fractionId = (1 << 128) + 1;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction partial fill; buy 3000 units
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBid(makerAsk, takerBid, fractionId);

        // Try to but the remaining 99 units with sellLeftover is true
        takerBid.additionalParameters = abi.encode(99, price);

        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        //units, amount, currency, proof[]
        (uint256 unitAmount) = abi.decode(takerBid.additionalParameters, (uint256));

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(fractionId), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf(fractionId), unitAmount);

        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function testTakerBidHypercertFractionOrderPartialAndFullFillSellLeftoverFalse() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.amounts[0] = 1;
        makerAsk.additionalParameters = abi.encode(100, 10_000, 0, false);

        takerBid.additionalParameters = abi.encode(9901, price);

        uint256 fractionId = (1 << 128) + 1;

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction partial fill; buy 3000 units
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBid(makerAsk, takerBid, fractionId);

        // Try to but the remaining 99 units with sellLeftover is true
        takerBid.additionalParameters = abi.encode(99, price);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidHypercertFractionOrderUnitsOutOfMaxRange() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.additionalParameters = abi.encode(minUnitAmount, 100, 0, sellLeftover);
        takerBid.additionalParameters = abi.encode(101, price);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidHypercertFractionOrderUnitsOutOfMinRange() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.additionalParameters = abi.encode(5, 100, 0, sellLeftover);
        takerBid.additionalParameters = abi.encode(2, price);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerBidHypercertFractionOrderBidPriceTooLow() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        makerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, 0, sellLeftover);
        takerBid.additionalParameters = abi.encode(maxUnitAmount, price - 1);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * A collection offer without merkle tree criteria
     */
    function testTakerBidHypercertFractionOrderPartialFill() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, false);
        _assertValidMakerOrder(makerAsk, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBid(makerAsk, takerBid, (1 << 128) + 1);
    }

    /**
     * A collection offer with merkle tree criteria
     */
    /**
     * TAKER ALLOWLIST
     */
    function testTakerBidHypercertFractionOrderWithMerkleTreeHypercertAccountAllowlist() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(false);

        address accountInMerkleTree = takerUser;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: makerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerAsk.strategyId = 2;
        makerAsk.additionalParameters =
            abi.encode(minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Prepare the taker ask
        takerBid.additionalParameters = abi.encode(100, price, proof);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, true);
        _assertValidMakerOrder(makerAsk, signature);

        // // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerBid(makerAsk, takerBid, (1 << 128) + 1);
    }

    function testTakerAskCannotExecuteWithInvalidProofAccountAllowlist(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(false);

        address accountInMerkleTree = takerUser;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: makerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerAsk.strategyId = 2;
        makerAsk.additionalParameters =
            abi.encode(minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Prepare the taker ask
        proof[0] = bytes32(0); // Tamper with the proof
        takerBid.additionalParameters = abi.encode(100, price, proof);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, true);
        _assertValidMakerOrder(makerAsk, signature);

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testInvalidAmounts() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Prepare the taker ask
        takerBid.additionalParameters = abi.encode(1, price);

        // 1. Amount is 0 (without merkle proof)
        makerAsk.amounts[0] = 0;
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);
        _assertOrderIsInvalid(makerAsk, false);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // 2. Amount is 0 (with merkle proof)
        makerAsk.strategyId = 2;
        address accountInMerkleTree = takerUser;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: makerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, sellLeftover, merkleRoot);
        makerAsk.amounts[0] = 0;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        takerBid.additionalParameters = abi.encode(0, price, proof);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // 3. Amount is > 1 (without merkle proof)
        makerAsk.amounts[0] = 2;
        bytes memory signatureAmountsTwo = _signMakerOrder(makerAsk, makerUserPK);
        _assertOrderIsInvalid(makerAsk, false);
        _assertMakerOrderReturnValidationCode(
            makerAsk, signatureAmountsTwo, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE
        );

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signatureAmountsTwo, _EMPTY_MERKLE_TREE);

        // 4. Amount is > 1 (with merkle proof)
        makerAsk.strategyId = 2;
        makerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, sellLeftover, merkleRoot);
        makerAsk.amounts[0] = 2;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        takerBid.additionalParameters = abi.encode(0, price, proof);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testAdditionalParameterLengthAllowlistIsNotAbove128() public {
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Set to use allowlist
        makerAsk.strategyId = 2;
        // Only encode min-max units and min units to keep
        makerAsk.additionalParameters = abi.encode(1, 1, 1, sellLeftover);

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        // It should revert without data (since the root cannot be extracted since the additionalParameters length is 0)
        vm.prank(takerUser);
        vm.expectRevert();
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testAdditionalParameterLengthIsNot96() public {
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Set to use allowlist
        makerAsk.strategyId = 1;
        // Only encode min-max units and min units to keep
        makerAsk.additionalParameters = abi.encode(1, 1, 1);

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        // It should revert without data (since the root cannot be extracted since the additionalParameters length is 0)
        vm.prank(takerUser);
        vm.expectRevert();
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testInvalidSelector() public {
        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 3,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0
        });

        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerAsk, bytes4(0));
        assertFalse(orderIsValid);
        assertEq(errorSelector, FunctionSelectorInvalid.selector);
    }

    function testWrongQuoteType() public {
        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 2,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0
        });

        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerAsk, selectorNoProof);

        assertFalse(orderIsValid);
        assertEq(errorSelector, QuoteTypeInvalid.selector);
    }

    function testCannotExecuteOnHypercertFractionOfferNotOwnedBySigner() public {
        (address anon, uint256 anonPK) = makeAddrAndKey("anon");

        // All users and anon have given approval to the marketplace on hypercerts protocol
        _setUpUsers();
        _setUpUser(anon);
        vm.prank(_owner);
        looksRareProtocol.updateCurrencyStatus(address(weth), true);

        // Mint asset
        vm.prank(makerUser);
        mockHypercertMinter.mintClaim(makerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = (1 << 128) + 1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        // Anon creates a maker ask order for a fraction owner by makerUser
        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: anon,
            price: 1,
            itemId: itemIds[0]
        });

        makerAsk.itemIds = itemIds;
        makerAsk.amounts = amounts;
        makerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover);

        // The strategy will interpret the order as invalid
        (bool isValid,) = strategyHypercertFractionOffer.isMakerOrderValid(makerAsk, selectorNoProof);
        assertFalse(isValid);

        OrderStructs.Taker memory takerBid = OrderStructs.Taker(takerUser, abi.encode(10, 10));

        // Anon signs order, but the order is invalid because anon does not own the hypercert
        bytes memory signature = _signMakerOrder(makerAsk, anonPK);

        uint256 makerBeforeUnits = mockHypercertMinter.unitsOf(itemIds[0]);
        address fractionOwner = mockHypercertMinter.ownerOf(itemIds[0]);

        // Anon will get rejected
        vm.prank(anon);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Pranking makerUser to approve the transaction will also fail
        vm.prank(makerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Nothing changed
        assertEq(mockHypercertMinter.unitsOf(itemIds[0]), makerBeforeUnits);
        assertEq(mockHypercertMinter.ownerOf(itemIds[0]), fractionOwner);
    }

    function _assertOrderIsValid(OrderStructs.Maker memory makerAsk, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) = strategyHypercertFractionOffer.isMakerOrderValid(
            makerAsk, withProof ? selectorWithProofAllowlist : selectorNoProof
        );

        assertTrue(orderIsValid);
        assertEq(errorSelector, _EMPTY_BYTES4);
    }

    function _assertOrderIsInvalid(OrderStructs.Maker memory makerAsk, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) = strategyHypercertFractionOffer.isMakerOrderValid(
            makerAsk, withProof ? selectorWithProofAllowlist : selectorNoProof
        );

        assertFalse(orderIsValid);
        assertEq(errorSelector, OrderInvalid.selector);
    }

    function _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist(
        address owner,
        uint256 numberOfAccountsInMerkleTree,
        address accountInMerkleTree
    ) private returns (bytes32 merkleRoot, bytes32[] memory proof) {
        // Initialize Merkle Tree
        Merkle m = new Merkle();

        bytes32[] memory merkleTreeAccounts = new bytes32[](numberOfAccountsInMerkleTree);
        vm.startPrank(owner);
        for (uint256 i; i < numberOfAccountsInMerkleTree; i++) {
            mockHypercertMinter.mintClaim(owner, 10_000, "https://example.com", FROM_CREATOR_ONLY);
            merkleTreeAccounts[i] = keccak256(abi.encodePacked(accountInMerkleTree));
        }
        vm.stopPrank();

        // Compute merkle root
        merkleRoot = m.getRoot(merkleTreeAccounts);
        proof = m.getProof(merkleTreeAccounts, 2);

        assertTrue(m.verifyProof(merkleRoot, proof, merkleTreeAccounts[0]));
    }

    function _assertSuccessfulTakerBid(
        OrderStructs.Maker memory makerAsk,
        OrderStructs.Taker memory takerBid,
        uint256 fractionId
    ) private {
        //units, amount, currency, proof[]
        (uint256 unitAmount, uint256 bidPrice) = abi.decode(takerBid.additionalParameters, (uint256, uint256));

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(fractionId), makerUser);
        assertEq(mockHypercertMinter.ownerOf(fractionId + 1), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf(fractionId), 10_000 - unitAmount);
        assertEq(mockHypercertMinter.unitsOf(fractionId + 1), unitAmount);

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(takerUser), _initialWETHBalanceUser - (unitAmount * bidPrice));
        // Taker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            weth.balanceOf(makerUser),
            _initialWETHBalanceUser
                + (unitAmount * bidPrice * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), _computeOrderHash(makerAsk));
    }

    function _assertSuccessfulTakerBidFullFraction(
        OrderStructs.Maker memory makerAsk,
        OrderStructs.Taker memory takerBid,
        uint256 fractionId
    ) private {
        //units, amount, currency, proof[]
        (uint256 unitAmount, uint256 bidPrice) = abi.decode(takerBid.additionalParameters, (uint256, uint256));

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(fractionId), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf(fractionId), unitAmount);

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(takerUser), _initialWETHBalanceUser - (unitAmount * bidPrice));
        // Taker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            weth.balanceOf(makerUser),
            _initialWETHBalanceUser
                + (unitAmount * bidPrice * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }
}
