// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {WETH} from "solmate/src/tokens/WETH.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Mocks and other utils
import {GasGriefer} from "./utils/GasGriefer.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract GasGriefingTest is ProtocolBase {
    uint256 private constant price = 1 ether; // Fixed price of sale
    address private gasGriefer;

    // WETH events
    event Deposit(address indexed from, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function setUp() public {
        _setUp();
        gasGriefer = address(new GasGriefer());
        _setUpUser(gasGriefer);
        _setUpUser(takerUser);
    }

    function testTakerBidGasGriefing() public {
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.signer = gasGriefer;

        // Mint asset
        mockERC721.mint(gasGriefer, makerAsk.itemIds[0]);

        bytes memory signature;

        uint256 sellerProceed = (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;

        vm.expectEmit(true, true, false, true);
        emit Deposit(address(looksRareProtocol), sellerProceed);

        vm.expectEmit(true, true, true, true);
        emit Transfer(address(looksRareProtocol), gasGriefer, sellerProceed);

        vm.prank(takerUser);
        // Execute taker bid transaction
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the asset
        assertEq(mockERC721.ownerOf(makerAsk.itemIds[0]), takerUser);
        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - price);
        // Maker ask user receives 99.5% of the whole price
        assertEq(weth.balanceOf(gasGriefer), _initialWETHBalanceUser + sellerProceed);
        // Royalty recipient receives 0.5% of the whole price
        assertEq(
            address(_royaltyRecipient).balance,
            _initialETHBalanceRoyaltyRecipient + (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(gasGriefer, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    function testThreeTakerBidsGasGriefing() public {
        uint256 numberPurchases = 3;

        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](numberPurchases);
        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](numberPurchases);
        bytes[] memory signatures = new bytes[](numberPurchases);

        for (uint256 i; i < numberPurchases; i++) {
            // Mint asset
            mockERC721.mint(gasGriefer, i);

            makerAsks[i] = _createSingleItemMakerOrder({
                quoteType: QuoteType.Ask,
                globalNonce: 0,
                subsetNonce: 0,
                strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
                collectionType: CollectionType.ERC721,
                orderNonce: i,
                collection: address(mockERC721),
                currency: ETH,
                signer: gasGriefer,
                price: price, // Fixed
                itemId: i // (0, 1, etc.)
            });

            takerBids[i] = _genericTakerOrder();
        }

        // Other execution parameters
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](numberPurchases);

        uint256 sellerProceedPerItem = (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;

        vm.expectEmit(true, true, false, true);
        emit Deposit(address(looksRareProtocol), sellerProceedPerItem);

        vm.expectEmit(true, true, true, true);
        emit Transfer(address(looksRareProtocol), gasGriefer, sellerProceedPerItem);

        vm.prank(takerUser);
        // Execute taker bid transaction
        looksRareProtocol.executeMultipleTakerBids{value: price * numberPurchases}(
            takerBids, makerAsks, signatures, merkleTrees, false
        );

        for (uint256 i; i < numberPurchases; i++) {
            // Taker user has received the asset
            assertEq(mockERC721.ownerOf(i), takerUser);
            // Verify the nonce is marked as executed
            assertEq(looksRareProtocol.userOrderNonce(gasGriefer, i), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
        }
        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - (numberPurchases * price));
        // Maker ask user receives 99.5% of the whole price (0.5% protocol)
        assertEq(weth.balanceOf(gasGriefer), _initialWETHBalanceUser + sellerProceedPerItem * numberPurchases);
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
    }
}
