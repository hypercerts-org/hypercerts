// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Murky (third-party) library is used to compute Merkle trees in Solidity
import {Merkle} from "murky/Merkle.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Shared errors
import {
    AmountInvalid,
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

import "forge-std/console2.sol";

contract HypercertFractionOffersTest is ProtocolBase {
    using OrderStructs for OrderStructs.Maker;

    StrategyHypercertFractionOffer public strategyHypercertFractionOffer;
    bytes4 public selectorNoProof = StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector;
    bytes4 public selectorWithProofAllowlist =
        StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector;

    uint256 private constant price = 0.001 ether; // Fixed price of sale
    bytes32 private constant mockMerkleRoot = bytes32(keccak256("Mock")); // Mock merkle root

    uint256 private constant minUnitAmount = 1;
    uint256 private constant maxUnitAmount = 100;

    function _createMakerAskAndTakerBidHypercert(bool mint)
        private
        returns (OrderStructs.Maker memory newMakerAsk, OrderStructs.Taker memory newTakerBid)
    {
        vm.prank(makerUser);
        // Mint asset
        if (mint == true) mockHypercertMinter.mintClaim(makerUser, 10_000, "https://examle.com", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = (1 << 128) + 1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 5000;

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
        newMakerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, mockMerkleRoot);

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

        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // // With proof
        makerAsk.strategyId = 2;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.expectRevert(OrderInvalid.selector);
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

    /**
     * A collection offer with merkle tree criteria
     */
    /**
     * TAKER ALLOWLIST
     */
    function testTakerBidCollectionOrderWithMerkleTreeHypercertAccountAllowlist() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(false);

        address accountInMerkleTree = takerUser;
        uint256 tokenIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: makerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerAsk.strategyId = 2;
        makerAsk.additionalParameters = abi.encode(minUnitAmount, maxUnitAmount, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Prepare the taker ask
        takerBid.additionalParameters = abi.encode(100, price, proof);

        // Verify validity of maker bid order
        _assertOrderIsValid(makerAsk, true);
        _assertValidMakerOrder(makerAsk, signature);

        // // Execute taker ask transaction
        vm.prank(takerUser);
        console2.log("length amounts: ", makerAsk.amounts.length);
        console2.log("length itemIds: ", makerAsk.itemIds.length);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // _assertSuccessfulTakerBid(makerAsk, takerBid, (1 << 128) + 1);
    }

    // function testTakerAskCannotExecuteWithInvalidProofAccountAllowlist(uint256 itemIdSold) public {
    //     vm.assume(itemIdSold > 5);
    //     _setUpUsers();

    //     OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
    //         quoteType: QuoteType.Bid,
    //         globalNonce: 0,
    //         subsetNonce: 0,
    //         strategyId: 3,
    //         collectionType: CollectionType.ERC721,
    //         orderNonce: 0,
    //         collection: address(mockERC721),
    //         currency: address(weth),
    //         signer: makerUser,
    //         price: price,
    //         itemId: 0 // Not used
    //     });

    //     address accountInMerkleTree = takerUser;
    //     uint256 tokenIdInMerkleTree = 2;
    //     (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
    //         owner: takerUser,
    //         numberOfAccountsInMerkleTree: 5,
    //         // Doesn't matter what itemIdInMerkleTree is as we are are going to tamper with the proof
    //         accountInMerkleTree: accountInMerkleTree
    //     });
    //     makerBid.additionalParameters = abi.encode(merkleRoot);

    //     // Sign order
    //     bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

    //     // Prepare the taker ask
    //     proof[0] = bytes32(0); // Tamper with the proof
    //     OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(tokenIdInMerkleTree, proof));

    //     // Verify validity of maker bid order
    //     _assertOrderIsValid(makerBid, true);
    //     _assertValidMakerOrder(makerBid, signature);

    //     vm.prank(takerUser);
    //     vm.expectRevert(MerkleProofInvalid.selector);
    //     looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    // }

    // function testInvalidAmounts() public {
    //     _setUpUsers();

    //     OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
    //         quoteType: QuoteType.Bid,
    //         globalNonce: 0,
    //         subsetNonce: 0,
    //         strategyId: 1,
    //         collectionType: CollectionType.ERC721,
    //         orderNonce: 0,
    //         collection: address(mockERC721),
    //         currency: address(weth),
    //         signer: makerUser,
    //         price: price,
    //         itemId: 0
    //     });

    //     // Prepare the taker ask
    //     OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(5));

    //     // 1. Amount is 0 (without merkle proof)
    //     makerBid.amounts[0] = 0;
    //     bytes memory signature = _signMakerOrder(makerBid, makerUserPK);
    //     _assertOrderIsInvalid(makerBid, false);
    //     _assertMakerOrderReturnValidationCode(makerBid, signature,
    // MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

    //     vm.prank(takerUser);
    //     vm.expectRevert(AmountInvalid.selector);
    //     looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

    //     // 2. Amount is too high for ERC721 (without merkle proof)
    //     makerBid.amounts[0] = 2;
    //     signature = _signMakerOrder(makerBid, makerUserPK);
    //     _assertOrderIsInvalid(makerBid, false);
    //     _assertMakerOrderReturnValidationCode(makerBid, signature,
    // MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

    //     vm.prank(takerUser);
    //     vm.expectRevert(AmountInvalid.selector);
    //     looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

    //     // 3. Amount is 0 (with merkle proof)
    //     makerBid.strategyId = 2;
    //     uint256 itemIdInMerkleTree = 5;
    //     (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
    //         owner: takerUser,
    //         numberOfItemsInMerkleTree: 6,
    //         itemIdInMerkleTree: itemIdInMerkleTree
    //     });

    //     makerBid.additionalParameters = abi.encode(merkleRoot);
    //     makerBid.amounts[0] = 0;
    //     signature = _signMakerOrder(makerBid, makerUserPK);

    //     takerAsk.additionalParameters = abi.encode(itemIdInMerkleTree, proof);

    //     _assertOrderIsInvalid(makerBid, true);
    //     _assertMakerOrderReturnValidationCode(makerBid, signature,
    // MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

    //     vm.prank(takerUser);
    //     vm.expectRevert(AmountInvalid.selector);
    //     looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

    //     // 4. Amount is too high for ERC721 (with merkle proof)
    //     makerBid.amounts[0] = 2;
    //     signature = _signMakerOrder(makerBid, makerUserPK);
    //     _assertOrderIsInvalid(makerBid, true);
    //     _assertMakerOrderReturnValidationCode(makerBid, signature,
    // MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

    //     vm.prank(takerUser);
    //     vm.expectRevert(AmountInvalid.selector);
    //     looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    // }

    function testMerkleRootLengthIsNot200() public {
        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(true);

        // Set to use allowlist
        makerAsk.strategyId = 2;
        // Only encode min-max units
        makerAsk.additionalParameters = abi.encode(1, 1);

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, true);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(); // It should revert without data (since the root cannot be extracted since the
            // additionalParameters length is 0)
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
        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
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
            strategyHypercertFractionOffer.isMakerOrderValid(makerBid, selectorNoProof);

        assertFalse(orderIsValid);
        assertEq(errorSelector, QuoteTypeInvalid.selector);
    }

    function _assertOrderIsValid(OrderStructs.Maker memory makerBid, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) = strategyHypercertFractionOffer.isMakerOrderValid(
            makerBid, withProof ? selectorWithProofAllowlist : selectorNoProof
        );

        console2.logBytes4(errorSelector);
        assertTrue(orderIsValid);
        assertEq(errorSelector, _EMPTY_BYTES4);
    }

    function _assertOrderIsInvalid(OrderStructs.Maker memory makerBid, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) = strategyHypercertFractionOffer.isMakerOrderValid(
            makerBid, withProof ? selectorWithProofAllowlist : selectorNoProof
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
            mockHypercertMinter.mintClaim(owner, 10_000, "https://examle.com", FROM_CREATOR_ONLY);
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
        (uint256 unitAmount, uint256 price) = abi.decode(takerBid.additionalParameters, (uint256, uint256));

        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(fractionId), makerUser);
        assertEq(mockHypercertMinter.ownerOf(fractionId + 1), takerUser);

        // Units have been transfered
        assertEq(mockHypercertMinter.unitsOf(fractionId), 10_000 - unitAmount);
        assertEq(mockHypercertMinter.unitsOf(fractionId + 1), unitAmount);

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(takerUser), _initialWETHBalanceUser - (unitAmount * price));
        // Taker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            weth.balanceOf(makerUser),
            _initialWETHBalanceUser
                + (unitAmount * price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), _computeOrderHash(makerAsk));
    }
}
