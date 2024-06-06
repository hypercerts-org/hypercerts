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
    QuoteTypeInvalid,
    CollectionTypeInvalid
} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE,
    ORDER_EXPECTED_TO_BE_VALID
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Strategies
import {StrategyHypercertCollectionOffer} from
    "@hypercerts/marketplace/executionStrategies/StrategyHypercertCollectionOffer.sol";

// Base test
import {ProtocolBase} from "../ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract HypercertCollectionOffersTest is ProtocolBase {
    error ERC1155SafeTransferFromFail();

    StrategyHypercertCollectionOffer public strategyHypercertCollectionOffer;
    bytes4 public selectorNoProof =
        strategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAsk.selector;
    bytes4 public selectorWithProof =
        strategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithProof.selector;
    bytes4 public selectorWithProofAllowlist =
        strategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithAllowlist.selector;

    uint256 private constant price = 1 ether; // Fixed price of sale
    bytes32 private constant mockMerkleRoot = bytes32(keccak256("Mock")); // Mock merkle root
    uint256 private constant firstHypercertFractionId = (1 << 128) + 1;

    function setUp() public {
        _setUp();
        _setUpNewStrategies();
    }

    function _setUpNewStrategies() private asPrankedUser(_owner) {
        strategyHypercertCollectionOffer = new StrategyHypercertCollectionOffer();
        _addStrategy(address(strategyHypercertCollectionOffer), selectorNoProof, true);
        _addStrategy(address(strategyHypercertCollectionOffer), selectorWithProof, true);
        _addStrategy(address(strategyHypercertCollectionOffer), selectorWithProofAllowlist, true);
    }

    function testNewStrategies() public {
        _assertStrategyAttributes(address(strategyHypercertCollectionOffer), selectorNoProof, true);

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
        assertEq(strategySelector, selectorWithProof);
        assertTrue(strategyIsMakerBid);
        assertEq(strategyImplementation, address(strategyHypercertCollectionOffer));
    }

    function testMakerBidAmountsLengthNotOne() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockHypercertMinter), address(weth), true);

        uint256 itemIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 5,
            itemIdInMerkleTree: itemIdInMerkleTree
        });

        // Adjust strategy for collection order and sign order
        // Change array to make it bigger than expected
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        makerBid.strategyId = 1;
        makerBid.amounts = amounts;
        makerBid.additionalParameters = abi.encode(10_000);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, selectorNoProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // With proof
        makerBid.strategyId = 2;
        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);
        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, proof);
        signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, selectorWithProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // With allowlist proof
        makerBid.strategyId = 3;
        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);
        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, proof);

        // Sign order
        bytes memory signatureMaker = _signMakerOrder(makerBid, makerUserPK);

        bytes memory signatureTaker = _signTakerDataCollectionStrategy(makerBid, ((1 << 128) + 1), proof, takerUserPK);

        proof[0] = bytes32(0); // Tamper with the proof

        // Prepare the taker ask
        takerAsk = OrderStructs.Taker(takerUser, abi.encode(((1 << 128) + 1), 10_000, proof, signatureTaker));

        _assertOrderIsInvalid(makerBid, selectorWithProofAllowlist);
        _assertMakerOrderReturnValidationCode(
            makerBid, signatureMaker, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE
        );

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signatureMaker, _EMPTY_MERKLE_TREE);
    }

    function testZeroAmount() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockHypercertMinter), address(weth), true);

        vm.prank(makerUser);
        mockHypercertMinter.mintClaim(makerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;
        makerBid.amounts = amounts;
        makerBid.strategyId = 1;
        makerBid.additionalParameters = abi.encode(10_000, mockMerkleRoot);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, 1);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, selectorNoProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCollectionTypeInvalid() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockHypercertMinter), address(weth), true);

        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerBid.amounts = amounts;
        makerBid.strategyId = 1;
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.additionalParameters = abi.encode(10_000, mockMerkleRoot);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, 1);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalidCollection(makerBid, selectorNoProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(CollectionTypeInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testUnitsHeldInvalid() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockHypercertMinter), address(weth), true);

        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerBid.amounts = amounts;
        makerBid.strategyId = 1;
        makerBid.collectionType = CollectionType.Hypercert;

        // Units held by maker don't match current token balance
        makerBid.additionalParameters = abi.encode(5000);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, 1);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsValid(makerBid, selectorNoProof);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Units offered by taker doesn't match maker bid
        makerBid.additionalParameters = abi.encode(10_000);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 5000, 1);
        signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsValid(makerBid, selectorNoProof);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Unit balance of item has changed since bid creation
        makerBid.additionalParameters = abi.encode(10_000);

        takerAsk.additionalParameters = abi.encode(firstHypercertFractionId, 10_000, 1);
        signature = _signMakerOrder(makerBid, makerUserPK);

        uint256[] memory fractions = new uint256[](2);
        fractions[0] = 5000;
        fractions[1] = 5000;

        vm.prank(takerUser);
        mockHypercertMinter.splitFraction(takerUser, firstHypercertFractionId, fractions);

        _assertOrderIsValid(makerBid, selectorNoProof);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * Any itemId for hypercert (where royalties come from the registry) is sold through a collection taker ask using
     * WETH.
     * We use fuzzing to generate the tokenId that is sold.
     */
    function testTakerAskCollectionOrderHypercert() public {
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        makerBid.additionalParameters = abi.encode(10_000);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(firstHypercertFractionId, 10_000));

        _assertOrderIsValid(makerBid, selectorNoProof);
        _assertValidMakerOrder(makerBid, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerAsk(makerBid, firstHypercertFractionId);
    }

    /**
     * A collection offer with merkle tree criteria
     *
     * COLLECTION TOKEN IDs
     */
    function testTakerAskCollectionOrderWithMerkleTreeHypercert() public {
        _setUpUsers();

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
            itemId: 0 // Not used
        });

        uint256 itemIdInMerkleTree = 2;
        uint256 offeredItemId = (1 + itemIdInMerkleTree << 128) + 1;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 5,
            itemIdInMerkleTree: itemIdInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(offeredItemId, 10_000, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, selectorWithProof);
        _assertValidMakerOrder(makerBid, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerAsk(makerBid, offeredItemId);
    }

    function testTakerAskCannotExecuteWithInvalidProof(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

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

        address owner = takerUser;
        uint256 numberOfItemsInMerkleTree = 6;
        uint256 itemIdInMerkleTree = 5;
        (bytes32 merkleRoot, bytes32[] memory proof) =
            _mintNFTsToOwnerAndGetMerkleRootAndProof(owner, numberOfItemsInMerkleTree, itemIdInMerkleTree);
        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        proof[0] = bytes32(0); // Tamper with the proof
        OrderStructs.Taker memory takerAsk =
            OrderStructs.Taker(takerUser, abi.encode(((itemIdInMerkleTree << 128) + 1), 10_000, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, selectorWithProof);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testTakerAskCannotExecuteSignatureForDifferentToken(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

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

        address owner = takerUser;
        uint256 numberOfItemsInMerkleTree = 6;
        uint256 itemIdInMerkleTree = 5;
        (bytes32 merkleRoot, bytes32[] memory proof) =
            _mintNFTsToOwnerAndGetMerkleRootAndProof(owner, numberOfItemsInMerkleTree, itemIdInMerkleTree);
        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk =
            OrderStructs.Taker(takerUser, abi.encode(((itemIdInMerkleTree << 128) + 2), 10_000, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, selectorWithProof);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * TAKER ALLOWLIST
     */
    function testTakerAskHypercertCollectionOrderWithMerkleTreeAccountAllowlist() public {
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
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

        address accountInMerkleTree = takerUser;
        uint256 tokenIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: takerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        // Sign order
        bytes memory signatureMaker = _signMakerOrder(makerBid, makerUserPK);

        bytes memory signatureTaker =
            _signTakerDataCollectionStrategy(makerBid, ((tokenIdInMerkleTree << 128) + 1), proof, takerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk =
            OrderStructs.Taker(takerUser, abi.encode(((tokenIdInMerkleTree << 128) + 1), 10_000, proof, signatureTaker));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, selectorWithProofAllowlist);
        _assertValidMakerOrder(makerBid, signatureMaker);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signatureMaker, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerAsk(makerBid, (tokenIdInMerkleTree << 128) + 1);
    }

    function testTakerAskCannotExecuteWithInvalidProofAccountAllowlist(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 3,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        address accountInMerkleTree = takerUser;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: takerUser,
            numberOfAccountsInMerkleTree: 5,
            // Doesn't matter what itemIdInMerkleTree is as we are are going to tamper with the proof
            accountInMerkleTree: accountInMerkleTree
        });
        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        // Sign order
        bytes memory signatureMaker = _signMakerOrder(makerBid, makerUserPK);

        bytes memory signatureTaker = _signTakerDataCollectionStrategy(makerBid, ((1 << 128) + 1), proof, takerUserPK);

        proof[0] = bytes32(0); // Tamper with the proof

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk =
            OrderStructs.Taker(takerUser, abi.encode(((1 << 128) + 1), 10_000, proof, signatureTaker));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, selectorWithProofAllowlist);
        _assertValidMakerOrder(makerBid, signatureMaker);

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signatureMaker, _EMPTY_MERKLE_TREE);
    }

    function testInvalidAmounts() public {
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
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

        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, 10_000, "https://example.com", FROM_CREATOR_ONLY);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(firstHypercertFractionId, 10_000));

        // 1. Amount is 0 (without merkle proof)
        makerBid.amounts[0] = 0;
        makerBid.additionalParameters = abi.encode(10_000);

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, selectorNoProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 2. Amount is too high for hypercert (without merkle proof)
        makerBid.amounts[0] = 2;
        makerBid.additionalParameters = abi.encode(10_000);

        signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, selectorNoProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 3. Amount is 0 (with merkle proof)
        makerBid.strategyId = 2;
        uint256 itemIdInMerkleTree = 5;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 6,
            itemIdInMerkleTree: itemIdInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);
        makerBid.amounts[0] = 0;
        signature = _signMakerOrder(makerBid, makerUserPK);

        takerAsk.additionalParameters = abi.encode(itemIdInMerkleTree, 10_000, proof);

        _assertOrderIsInvalid(makerBid, selectorWithProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 4. Amount is too high for hypercert (with merkle proof)
        makerBid.amounts[0] = 2;

        makerBid.additionalParameters = abi.encode(10_000, merkleRoot);

        signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, selectorWithProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(OrderInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testMerkleRootLengthIsNot64() public {
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

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, selectorWithProof);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(); // It should revert without data (since the root cannot be extracted since the
            // additionalParameters length is 0)
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testInvalidSelector() public {
        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
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
            strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, bytes4(0));
        assertFalse(orderIsValid);
        assertEq(errorSelector, FunctionSelectorInvalid.selector);
    }

    function testWrongQuoteType() public {
        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
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
            strategyHypercertCollectionOffer.isMakerOrderValid(makerAsk, selectorNoProof);

        assertFalse(orderIsValid);
        assertEq(errorSelector, QuoteTypeInvalid.selector);
    }

    function testCannotExecuteOnHypercertCollectionOfferNotOwnedBySigner() public {
        (address anon, uint256 anonPK) = makeAddrAndKey("anon");

        // All users and anon have given approval to the marketplace on hypercerts protocol
        _setUpUsers();
        _setUpUser(anon);
        vm.prank(_owner);
        looksRareProtocol.updateCurrencyStatus(address(weth), true);

        uint256 _units = 10_000;
        // Mint asset
        vm.prank(takerUser);
        mockHypercertMinter.mintClaim(takerUser, _units, "https://example.com", ALLOW_ALL);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = (1 << 128) + 1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        // Anon creates a maker bid order for a fraction owned by takerUser on behalf of makerUser
        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // not used
        });

        makerBid.additionalParameters = abi.encode(10_000);

        // The strategy will interpret the order as invalid
        (bool isValid,) = strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, selectorNoProof);
        assertTrue(isValid);

        // Prepare the taker ask where the anon will execute the order on behalf of the takerUser
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(anon, abi.encode(firstHypercertFractionId, 10_000));

        // Maker has signed the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        uint256 takerBeforeBalance = weth.balanceOf(takerUser);
        uint256 anonBeforeBalance = weth.balanceOf(anon);
        uint256 makerBeforeBalance = weth.balanceOf(makerUser);

        assertEq(mockHypercertMinter.ownerOf(itemIds[0]), takerUser);

        // Anon will get rejected because they're not allowed to execute the order on behalf of the taker
        vm.prank(anon);
        vm.expectRevert(ERC1155SafeTransferFromFail.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Anon pranks user to execute the order on behalf of the maker
        // This means a user want funds received from sale to go to a different account, which should be allowed
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Nothing changed
        assertEq(mockHypercertMinter.ownerOf(itemIds[0]), makerUser);
        assertEq(weth.balanceOf(takerUser), takerBeforeBalance);
        assertTrue(weth.balanceOf(anon) > anonBeforeBalance);
        assertTrue(weth.balanceOf(makerUser) < makerBeforeBalance);
    }

    function _assertOrderIsValid(OrderStructs.Maker memory makerBid, bytes4 strategySelector) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, strategySelector);
        assertTrue(orderIsValid);
        assertEq(errorSelector, _EMPTY_BYTES4);
    }

    function _assertOrderIsInvalid(OrderStructs.Maker memory makerBid, bytes4 strategySelector) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, strategySelector);

        assertFalse(orderIsValid);
        assertEq(errorSelector, OrderInvalid.selector);
    }

    function _assertOrderIsInvalidCollection(OrderStructs.Maker memory makerBid, bytes4 strategySelector) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, strategySelector);

        assertFalse(orderIsValid);
        assertEq(errorSelector, CollectionTypeInvalid.selector);
    }

    function _assertOrderIsInvalidAmount(OrderStructs.Maker memory makerBid, bytes4 strategySelector) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertCollectionOffer.isMakerOrderValid(makerBid, strategySelector);

        assertFalse(orderIsValid);
        assertEq(errorSelector, AmountInvalid.selector);
    }

    function _mintNFTsToOwnerAndGetMerkleRootAndProof(
        address owner,
        uint256 numberOfItemsInMerkleTree,
        uint256 itemIdInMerkleTree
    ) private returns (bytes32 merkleRoot, bytes32[] memory proof) {
        require(itemIdInMerkleTree < numberOfItemsInMerkleTree, "Invalid itemIdInMerkleTree");

        // Initialize Merkle Tree
        Merkle m = new Merkle();

        bytes32[] memory merkleTreeIds = new bytes32[](numberOfItemsInMerkleTree);
        vm.startPrank(owner);
        for (uint256 i; i < numberOfItemsInMerkleTree; i++) {
            mockHypercertMinter.mintClaim(owner, 10_000, "https://example.com", FROM_CREATOR_ONLY);
            merkleTreeIds[i] = keccak256(abi.encodePacked(((1 + i) << 128) + 1));
        }
        vm.stopPrank();

        // Compute merkle root
        merkleRoot = m.getRoot(merkleTreeIds);
        proof = m.getProof(merkleTreeIds, itemIdInMerkleTree);

        assertTrue(m.verifyProof(merkleRoot, proof, merkleTreeIds[itemIdInMerkleTree]));
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

    function _assertSuccessfulTakerAsk(OrderStructs.Maker memory makerBid, uint256 tokenId) private {
        // Taker user has received the asset
        assertEq(mockHypercertMinter.ownerOf(tokenId), makerUser);
        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        // Taker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }
}
