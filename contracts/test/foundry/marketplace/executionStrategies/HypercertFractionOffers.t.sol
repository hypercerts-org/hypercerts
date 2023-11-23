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

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract HypercertFractionOffersTest is ProtocolBase {
    StrategyHypercertFractionOffer public strategyHypercertFractionOffer;
    bytes4 public selectorNoProof = StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector;
    bytes4 public selectorWithProof =
        StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithProof.selector;
    bytes4 public selectorWithProofAllowlist =
        StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector;

    uint256 private constant price = 1 ether; // Fixed price of sale
    bytes32 private constant mockMerkleRoot = bytes32(keccak256("Mock")); // Mock merkle root

    function _createMakerAskAndTakerBidHypercert(uint256 numberOfItems)
        private
        returns (OrderStructs.Maker memory newMakerAsk, OrderStructs.Taker memory newTakerBid)
    {
        uint256[] memory itemIds = new uint256[](numberOfItems);
        vm.startPrank(makerUser);
        for (uint256 i; i < numberOfItems;) {
            // Mint asset
            mockHypercertMinter.mintClaim(makerUser, 10_000, "https://examle.com", FROM_CREATOR_ONLY);
            itemIds[i] = ((i + 1) << 128) + 1;
            unchecked {
                ++i;
            }
        }

        vm.stopPrank();

        uint256[] memory amounts = new uint256[](numberOfItems);
        for (uint256 i; i < numberOfItems;) {
            amounts[i] = 1;
            unchecked {
                ++i;
            }
        }

        newMakerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 2,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinter),
            currency: address(0),
            signer: makerUser,
            price: 10_000,
            itemId: 0
        });

        newMakerAsk.itemIds = itemIds;
        newMakerAsk.amounts = amounts;

        uint256 minUnitAmount = 1;
        uint256 maxUnitAmount = 100;
        newMakerAsk.additionalParameters = abi.encode(mockMerkleRoot, minUnitAmount, maxUnitAmount);

        // Using startPrice as the maxPrice
        uint256 offeredItemId = itemIds[0];
        bytes32[] memory proofs = new bytes32[](0);
        uint256 unitAmount = amounts[0];
        uint256 acceptedTokenAmount = 0.001 ether;
        address acceptedTokenAddress = address(0);

        newTakerBid = OrderStructs.Taker(
            takerUser, abi.encode(offeredItemId, proofs, unitAmount, acceptedTokenAmount, acceptedTokenAddress)
        );
    }

    function setUp() public {
        _setUp();
        _setUpNewStrategies();
    }

    function _setUpNewStrategies() private asPrankedUser(_owner) {
        strategyHypercertFractionOffer = new StrategyHypercertFractionOffer();
        _addStrategy(address(strategyHypercertFractionOffer), selectorNoProof, true);
        _addStrategy(address(strategyHypercertFractionOffer), selectorWithProof, true);
        _addStrategy(address(strategyHypercertFractionOffer), selectorWithProofAllowlist, true);
    }

    function testNewStrategies() public {
        _assertStrategyAttributes(address(strategyHypercertFractionOffer), selectorNoProof, true);

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
        assertEq(strategyImplementation, address(strategyHypercertFractionOffer));
    }

    function testmakerAskAmountsLengthNotOne() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMakerAskAndTakerBidHypercert(1);

        // Adjust strategy for collection order and sign order
        // Change array to make it bigger than expected
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        makerAsk.strategyId = 1;
        makerAsk.amounts = amounts;
        takerBid.additionalParameters = abi.encode(mockMerkleRoot, 1);
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        _assertOrderIsInvalid(makerAsk, false);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        // vm.expectRevert(OrderInvalid.selector);
        // looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // // With proof
        // makerAsk.strategyId = 2;
        // makerAsk.additionalParameters = abi.encode(mockMerkleRoot);
        // signature = _signMakerOrder(makerAsk, makerUserPK);

        // _assertOrderIsInvalid(makerAsk, true);
        // _assertMakerOrderReturnValidationCode(makerAsk, signature,
        // MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        // vm.expectRevert(OrderInvalid.selector);
        // looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testZeroAmount() public {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMakerAskAndTakerBidHypercert(1);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;
        makerBid.amounts = amounts;
        makerBid.strategyId = 1;
        makerBid.additionalParameters = abi.encode(mockMerkleRoot);
        takerAsk.additionalParameters = abi.encode(1, 1);
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, false);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * A collection offer with merkle tree criteria
     *
     * COLLECTION TOKEN IDs
     */
    function testTakerBidHypecertFractionOrderWithMerkleTree() public {
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 1,
            collectionType: CollectionType.Hypercert,
            orderNonce: 0,
            collection: address(mockHypercertMinterUUPS),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        uint256 itemIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 5,
            itemIdInMerkleTree: itemIdInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(itemIdInMerkleTree, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, true);
        _assertValidMakerOrder(makerBid, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerAsk(makerBid, itemIdInMerkleTree);
    }

    function testTakerAskCannotExecuteWithInvalidProof(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 2,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 5,
            // Doesn't matter what itemIdInMerkleTree is as we are are going to tamper with the proof
            itemIdInMerkleTree: 4
        });
        makerBid.additionalParameters = abi.encode(merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        proof[0] = bytes32(0); // Tamper with the proof
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(itemIdSold, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, true);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    /**
     * TAKER ALLOWLIST
     */
    function testTakerAskCollectionOrderWithMerkleTreeERC721AccountAllowlist() public {
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 3,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        address accountInMerkleTree = takerUser;
        uint256 tokenIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: takerUser,
            numberOfAccountsInMerkleTree: 5,
            accountInMerkleTree: accountInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(tokenIdInMerkleTree, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, true);
        _assertValidMakerOrder(makerBid, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        _assertSuccessfulTakerAsk(makerBid, tokenIdInMerkleTree);
    }

    function testTakerAskCannotExecuteWithInvalidProofAccountAllowlist(uint256 itemIdSold) public {
        vm.assume(itemIdSold > 5);
        _setUpUsers();

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 3,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0 // Not used
        });

        address accountInMerkleTree = takerUser;
        uint256 tokenIdInMerkleTree = 2;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProofAccountAllowlist({
            owner: takerUser,
            numberOfAccountsInMerkleTree: 5,
            // Doesn't matter what itemIdInMerkleTree is as we are are going to tamper with the proof
            accountInMerkleTree: accountInMerkleTree
        });
        makerBid.additionalParameters = abi.encode(merkleRoot);

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        proof[0] = bytes32(0); // Tamper with the proof
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(tokenIdInMerkleTree, proof));

        // Verify validity of maker bid order
        _assertOrderIsValid(makerBid, true);
        _assertValidMakerOrder(makerBid, signature);

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testInvalidAmounts() public {
        _setUpUsers();

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
            price: price,
            itemId: 0
        });

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = OrderStructs.Taker(takerUser, abi.encode(5));

        // 1. Amount is 0 (without merkle proof)
        makerBid.amounts[0] = 0;
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, false);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 2. Amount is too high for ERC721 (without merkle proof)
        makerBid.amounts[0] = 2;
        signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, false);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 3. Amount is 0 (with merkle proof)
        makerBid.strategyId = 2;
        uint256 itemIdInMerkleTree = 5;
        (bytes32 merkleRoot, bytes32[] memory proof) = _mintNFTsToOwnerAndGetMerkleRootAndProof({
            owner: takerUser,
            numberOfItemsInMerkleTree: 6,
            itemIdInMerkleTree: itemIdInMerkleTree
        });

        makerBid.additionalParameters = abi.encode(merkleRoot);
        makerBid.amounts[0] = 0;
        signature = _signMakerOrder(makerBid, makerUserPK);

        takerAsk.additionalParameters = abi.encode(itemIdInMerkleTree, proof);

        _assertOrderIsInvalid(makerBid, true);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // 4. Amount is too high for ERC721 (with merkle proof)
        makerBid.amounts[0] = 2;
        signature = _signMakerOrder(makerBid, makerUserPK);
        _assertOrderIsInvalid(makerBid, true);
        _assertMakerOrderReturnValidationCode(makerBid, signature, MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE);

        vm.prank(takerUser);
        vm.expectRevert(AmountInvalid.selector);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testMerkleRootLengthIsNot32() public {
        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: 2,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0
        });

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertOrderIsInvalid(makerBid, true);
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
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: 0
        });

        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerBid, bytes4(0));
        assertFalse(orderIsValid);
        assertEq(errorSelector, FunctionSelectorInvalid.selector);
    }

    function testWrongQuoteType() public {
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
            price: price,
            itemId: 0
        });

        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerAsk, selectorNoProof);

        assertFalse(orderIsValid);
        assertEq(errorSelector, QuoteTypeInvalid.selector);
    }

    function _assertOrderIsValid(OrderStructs.Maker memory makerBid, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerBid, withProof ? selectorWithProof : selectorNoProof);
        assertTrue(orderIsValid);
        assertEq(errorSelector, _EMPTY_BYTES4);
    }

    function _assertOrderIsInvalid(OrderStructs.Maker memory makerBid, bool withProof) private {
        (bool orderIsValid, bytes4 errorSelector) =
            strategyHypercertFractionOffer.isMakerOrderValid(makerBid, withProof ? selectorWithProof : selectorNoProof);

        assertFalse(orderIsValid);
        assertEq(errorSelector, OrderInvalid.selector);
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
        for (uint256 i; i < numberOfItemsInMerkleTree; i++) {
            mockERC721.mint(owner, i);
            merkleTreeIds[i] = keccak256(abi.encodePacked(i));
        }

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
        for (uint256 i; i < numberOfAccountsInMerkleTree; i++) {
            mockERC721.mint(owner, i);
            merkleTreeAccounts[i] = keccak256(abi.encodePacked(accountInMerkleTree));
        }

        // Compute merkle root
        merkleRoot = m.getRoot(merkleTreeAccounts);
        proof = m.getProof(merkleTreeAccounts, 2);

        assertTrue(m.verifyProof(merkleRoot, proof, merkleTreeAccounts[0]));
    }

    function _assertSuccessfulTakerAsk(OrderStructs.Maker memory makerBid, uint256 tokenId) private {
        // Taker user has received the asset
        assertEq(mockERC721.ownerOf(tokenId), makerUser);
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
