/// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Strategies
import {StrategyCollectionOffer} from "@hypercerts/marketplace/executionStrategies/StrategyCollectionOffer.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Helpers
import {EIP712MerkleTree} from "./utils/EIP712MerkleTree.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract BatchMakerCollectionOrdersTest is ProtocolBase {
    StrategyCollectionOffer private strategy;
    uint256 private constant price = 1 ether; // Fixed price of sale
    EIP712MerkleTree private eip712MerkleTree;

    function setUp() public {
        _setUp();

        strategy = new StrategyCollectionOffer();
        vm.prank(_owner);
        looksRareProtocol.addStrategy(
            _standardProtocolFeeBp,
            _minTotalFeeBp,
            _maxProtocolFeeBp,
            StrategyCollectionOffer.executeCollectionStrategyWithTakerAsk.selector,
            true,
            address(strategy)
        );

        _setUpUsers();
        eip712MerkleTree = new EIP712MerkleTree(looksRareProtocol);
    }

    function testTakerAskMultipleOrdersSignedERC721(uint256 numberOrders) public {
        vm.assume(numberOrders > 0 && numberOrders <= 10);

        mockERC721.batchMint(takerUser, numberOrders);

        OrderStructs.Maker[] memory makerBids = _createBatchMakerBids(numberOrders);

        (bytes memory signature,) = eip712MerkleTree.sign(makerUserPK, makerBids, 0);

        for (uint256 i; i < numberOrders; i++) {
            // To prove that we only need 1 signature for multiple collection offers,
            // we are not using the signature from the sign call in the loop.
            (, OrderStructs.MerkleTree memory merkleTree) = eip712MerkleTree.sign(makerUserPK, makerBids, i);

            OrderStructs.Maker memory makerBidToExecute = makerBids[i];

            // Verify validity
            _assertValidMakerOrderWithMerkleTree(makerBidToExecute, signature, merkleTree);

            OrderStructs.Taker memory takerOrder = OrderStructs.Taker(takerUser, abi.encode(i));

            // Execute taker ask transaction
            vm.prank(takerUser);
            looksRareProtocol.executeTakerAsk(takerOrder, makerBidToExecute, signature, merkleTree);

            // Maker user has received the asset
            assertEq(mockERC721.ownerOf(i), makerUser);

            // Verify the nonce is marked as executed
            assertEq(
                looksRareProtocol.userOrderNonce(makerUser, makerBidToExecute.orderNonce),
                MAGIC_VALUE_ORDER_NONCE_EXECUTED
            );
        }

        uint256 totalValue = price * numberOrders;
        assertEq(
            weth.balanceOf(makerUser), _initialWETHBalanceUser - totalValue, "Maker bid user should pay the whole price"
        );
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser
                + (totalValue * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "Taker ask user should receive 99.5% of the whole price (0.5% protocol)"
        );
    }

    function _createBatchMakerBids(uint256 numberOrders) private view returns (OrderStructs.Maker[] memory makerBids) {
        makerBids = new OrderStructs.Maker[](numberOrders);
        for (uint256 i; i < numberOrders; i++) {
            makerBids[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Bid,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: 1,
                collectionType: CollectionType.ERC721,
                orderNonce: i, // incremental
                collection: address(mockERC721),
                currency: address(weth),
                signer: makerUser,
                price: price,
                itemId: 0 // Not used
            });
        }
    }
}
