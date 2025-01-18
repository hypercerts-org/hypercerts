/// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Murky (third-party) library is used to compute Merkle trees in Solidity
import {Merkle} from "murky/Merkle.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Errors and constants
import {MerkleProofTooLarge, MerkleProofInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {
    MERKLE_PROOF_PROOF_TOO_LARGE,
    ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";
import {
    ONE_HUNDRED_PERCENT_IN_BP,
    MAX_CALLDATA_PROOF_LENGTH
} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Helpers
import {EIP712MerkleTree} from "./utils/EIP712MerkleTree.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract BatchMakerOrdersTest is ProtocolBase {
    uint256 private constant price = 1.2222 ether; // Fixed price of sale
    EIP712MerkleTree private eip712MerkleTree;

    function setUp() public {
        _setUp();
        _setUpUsers();
        eip712MerkleTree = new EIP712MerkleTree(looksRareProtocol);
    }

    function testTakerBidMultipleOrdersSignedERC721(uint256 numberOrders, uint256 orderIndex) public {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(makerUser, numberOrders);

        OrderStructs.Maker[] memory makerAsks = _createBatchMakerAsks(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerAsks, orderIndex);

        OrderStructs.Maker memory makerAskToExecute = makerAsks[orderIndex];

        // Verify validity
        _assertValidMakerOrderWithMerkleTree(makerAskToExecute, signature, merkleTree);

        // Execute taker bid transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(_genericTakerOrder(), makerAskToExecute, signature, merkleTree);

        // Taker user has received the asset
        assertEq(mockERC721.ownerOf(orderIndex), takerUser);
        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - price);
        // Maker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(
            looksRareProtocol.userOrderNonce(makerUser, makerAskToExecute.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED
        );
    }

    function testTakerAskMultipleOrdersSignedERC721(uint256 numberOrders, uint256 orderIndex) public {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(takerUser, numberOrders);

        OrderStructs.Maker[] memory makerBids = _createBatchMakerBids(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerBids, orderIndex);

        OrderStructs.Maker memory makerBidToExecute = makerBids[orderIndex];

        // Verify validity
        _assertValidMakerOrderWithMerkleTree(makerBidToExecute, signature, merkleTree);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBidToExecute, signature, merkleTree);

        // Maker user has received the asset
        assertEq(mockERC721.ownerOf(orderIndex), makerUser);
        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        // Taker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(
            looksRareProtocol.userOrderNonce(makerUser, makerBidToExecute.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED
        );
    }

    function testTakerBidMultipleOrdersSignedERC721MerkleProofInvalid(uint256 numberOrders, uint256 orderIndex)
        public
    {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(makerUser, numberOrders);

        OrderStructs.Maker[] memory makerAsks = _createBatchMakerAsks(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerAsks, orderIndex);

        bytes32 tamperedRoot = bytes32(uint256(merkleTree.root) + 1);
        merkleTree.root = tamperedRoot;

        OrderStructs.Maker memory makerAskToExecute = makerAsks[orderIndex];

        // Verify invalidity of maker ask order
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerAskToExecute, signature, merkleTree, ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE
        );

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(_genericTakerOrder(), makerAskToExecute, signature, merkleTree);
    }

    function testTakerAskMultipleOrdersSignedERC721MerkleProofInvalid(uint256 numberOrders, uint256 orderIndex)
        public
    {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(takerUser, numberOrders);

        OrderStructs.Maker[] memory makerBids = _createBatchMakerBids(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerBids, orderIndex);

        bytes32 tamperedRoot = bytes32(uint256(merkleTree.root) + 1);
        merkleTree.root = tamperedRoot;

        OrderStructs.Maker memory makerBidToExecute = makerBids[orderIndex];

        // Verify invalidity of maker bid order
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerBidToExecute, signature, merkleTree, ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE
        );

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBidToExecute, signature, merkleTree);
    }

    function testTakerBidMultipleOrdersSignedERC721MerkleProofWrongPosition(uint256 numberOrders, uint256 orderIndex)
        public
    {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(makerUser, numberOrders);

        OrderStructs.Maker[] memory makerAsks = _createBatchMakerAsks(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerAsks, orderIndex);

        // Swap every node's position
        OrderStructs.MerkleTreeNode[] memory proof = merkleTree.proof;
        for (uint256 i; i < proof.length; i++) {
            if (proof[i].position == OrderStructs.MerkleTreeNodePosition.Left) {
                proof[i].position = OrderStructs.MerkleTreeNodePosition.Right;
            } else {
                proof[i].position = OrderStructs.MerkleTreeNodePosition.Left;
            }
        }

        OrderStructs.Maker memory makerAskToExecute = makerAsks[orderIndex];

        // Verify invalidity of maker ask order
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerAskToExecute, signature, merkleTree, ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE
        );

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerBid{value: price}(_genericTakerOrder(), makerAskToExecute, signature, merkleTree);
    }

    function testTakerAskMultipleOrdersSignedERC721MerkleProofWrongPosition(uint256 numberOrders, uint256 orderIndex)
        public
    {
        numberOrders = bound(numberOrders, 1, 2 ** MAX_CALLDATA_PROOF_LENGTH);
        orderIndex = bound(orderIndex, 0, numberOrders - 1);

        mockERC721.batchMint(takerUser, numberOrders);

        OrderStructs.Maker[] memory makerBids = _createBatchMakerBids(numberOrders);

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerBids, orderIndex);

        // Swap every node's position
        OrderStructs.MerkleTreeNode[] memory proof = merkleTree.proof;
        for (uint256 i; i < proof.length; i++) {
            if (proof[i].position == OrderStructs.MerkleTreeNodePosition.Left) {
                proof[i].position = OrderStructs.MerkleTreeNodePosition.Right;
            } else {
                proof[i].position = OrderStructs.MerkleTreeNodePosition.Left;
            }
        }

        OrderStructs.Maker memory makerBidToExecute = makerBids[orderIndex];

        // Verify invalidity of maker bid order
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerBidToExecute, signature, merkleTree, ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE
        );

        vm.prank(takerUser);
        vm.expectRevert(MerkleProofInvalid.selector);
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBidToExecute, signature, merkleTree);
    }

    function testTakerBidRevertsIfProofTooLarge() public {
        // Test just one case slightly above the limit
        uint256 proofLength = MAX_CALLDATA_PROOF_LENGTH + 1;
        uint256 numberOrders = 2 ** proofLength;
        mockERC721.batchMint(makerUser, numberOrders);

        OrderStructs.Maker[] memory makerAsks = _createBatchMakerAsks(numberOrders);
        uint256 orderIndex = numberOrders - 1;

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerAsks, orderIndex);

        OrderStructs.Maker memory makerAskToExecute = makerAsks[orderIndex];

        // Verify validity
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerAskToExecute, signature, merkleTree, MERKLE_PROOF_PROOF_TOO_LARGE
        );

        vm.prank(takerUser);
        vm.expectRevert(abi.encodeWithSelector(MerkleProofTooLarge.selector, proofLength));
        looksRareProtocol.executeTakerBid{value: price}(_genericTakerOrder(), makerAskToExecute, signature, merkleTree);
    }

    function testTakerAskRevertsIfProofTooLarge() public {
        // Test just one case slightly above the limit
        uint256 proofLength = MAX_CALLDATA_PROOF_LENGTH + 1;
        uint256 numberOrders = 2 ** proofLength;
        mockERC721.batchMint(takerUser, numberOrders);

        OrderStructs.Maker[] memory makerBids = _createBatchMakerBids(numberOrders);
        uint256 orderIndex = numberOrders - 1;

        (bytes memory signature, OrderStructs.MerkleTree memory merkleTree) =
            eip712MerkleTree.sign(makerUserPK, makerBids, orderIndex);

        OrderStructs.Maker memory makerBidToExecute = makerBids[orderIndex];

        // Verify validity
        _assertMakerOrderReturnValidationCodeWithMerkleTree(
            makerBidToExecute, signature, merkleTree, MERKLE_PROOF_PROOF_TOO_LARGE
        );

        vm.prank(takerUser);
        vm.expectRevert(abi.encodeWithSelector(MerkleProofTooLarge.selector, proofLength));
        looksRareProtocol.executeTakerAsk(_genericTakerOrder(), makerBidToExecute, signature, merkleTree);
    }

    function _createBatchMakerAsks(uint256 numberOrders) private view returns (OrderStructs.Maker[] memory makerAsks) {
        makerAsks = new OrderStructs.Maker[](numberOrders);
        for (uint256 i; i < numberOrders; i++) {
            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i, // incremental
                collection: address(mockERC721),
                currency: ETH,
                signer: makerUser,
                price: price,
                itemId: i
            });
        }
    }

    function _createBatchMakerBids(uint256 numberOrders) private view returns (OrderStructs.Maker[] memory makerBids) {
        makerBids = new OrderStructs.Maker[](numberOrders);
        for (uint256 i; i < numberOrders; i++) {
            makerBids[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Bid,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i, // incremental
                collection: address(mockERC721),
                currency: address(weth),
                signer: makerUser,
                price: price,
                itemId: i
            });
        }
    }

    function _assertMerkleTreeAssumptions(uint256 numberOrders, uint256 orderIndex) private pure {
        vm.assume(numberOrders > 0 && numberOrders <= 2 ** MAX_CALLDATA_PROOF_LENGTH);
        vm.assume(orderIndex < numberOrders);
    }
}
