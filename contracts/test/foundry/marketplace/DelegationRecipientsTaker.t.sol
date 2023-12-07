// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {CreatorFeeManagerWithRoyalties} from "@hypercerts/marketplace/CreatorFeeManagerWithRoyalties.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

contract DelegationRecipientsTakerTest is ProtocolBase {
    function setUp() public {
        _setUp();
        CreatorFeeManagerWithRoyalties creatorFeeManager =
            new CreatorFeeManagerWithRoyalties(address(royaltyFeeRegistry));
        vm.prank(_owner);
        looksRareProtocol.updateCreatorFeeManager(address(creatorFeeManager));
    }

    // Fixed price of sale
    uint256 private constant price = 1 ether;

    /**
     * One ERC721 is sold through a taker ask using WETH and the proceeds of the sale goes to a random recipient.
     */
    function testTakerAskERC721WithRoyaltiesFromRegistryWithDelegation() public {
        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);
        address randomRecipientSaleProceeds = address(420);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Adjust recipient
        takerAsk.recipient = randomRecipientSaleProceeds;

        // Verify maker bid order
        _assertValidMakerOrder(makerBid, signature);

        // Arrays for events
        address[2] memory expectedRecipients;
        expectedRecipients[0] = randomRecipientSaleProceeds;
        expectedRecipients[1] = _royaltyRecipient;

        uint256[3] memory expectedFees;
        expectedFees[2] = (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;
        expectedFees[1] = (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP;
        expectedFees[0] = price - (expectedFees[1] + expectedFees[2]);

        vm.prank(takerUser);
        vm.expectEmit(true, false, false, true);

        emit TakerAsk(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerBid),
                orderNonce: makerBid.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            makerUser,
            makerBid.strategyId,
            makerBid.currency,
            makerBid.collection,
            makerBid.itemIds,
            makerBid.amounts,
            expectedRecipients,
            expectedFees
        );
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the asset
        assertEq(mockERC721.ownerOf(makerBid.itemIds[0]), makerUser);
        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        // Random recipient user receives 99.5% of the whole price and taker user receives nothing.
        assertEq(weth.balanceOf(takerUser), _initialWETHBalanceUser);
        assertEq(
            weth.balanceOf(randomRecipientSaleProceeds),
            (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Royalty recipient receives 0.5% of the whole price
        assertEq(
            weth.balanceOf(_royaltyRecipient),
            _initialWETHBalanceRoyaltyRecipient + (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }

    /**
     * One ERC721 is sold through a taker bid and the NFT transfer goes to a random recipient.
     */
    function testTakerBidERC721WithRoyaltiesFromRegistryWithDelegation() public {
        address randomRecipientNFT = address(420);

        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Adjust recipient to random recipient
        takerBid.recipient = randomRecipientNFT;

        // Verify validity of maker ask order
        _assertValidMakerOrder(makerAsk, signature);

        // Arrays for events
        address[2] memory expectedRecipients;
        expectedRecipients[0] = makerUser;
        expectedRecipients[1] = _royaltyRecipient;

        uint256[3] memory expectedFees;
        expectedFees[0] = price - (expectedFees[1] + expectedFees[0]);
        expectedFees[1] = (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP;
        expectedFees[2] = (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP;

        vm.prank(takerUser);

        emit TakerBid(
            NonceInvalidationParameters({
                orderHash: _computeOrderHash(makerAsk),
                orderNonce: makerAsk.orderNonce,
                isNonceInvalidated: true
            }),
            takerUser,
            randomRecipientNFT,
            makerAsk.strategyId,
            makerAsk.currency,
            makerAsk.collection,
            makerAsk.itemIds,
            makerAsk.amounts,
            expectedRecipients,
            expectedFees
        );

        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Random recipient user has received the asset
        assertEq(mockERC721.ownerOf(makerAsk.itemIds[0]), randomRecipientNFT);
        // Taker bid user pays the whole price
        assertEq(address(takerUser).balance, _initialETHBalanceUser - price);
        // Maker ask user receives 99.5% of the whole price
        assertEq(
            address(makerUser).balance,
            _initialETHBalanceUser + (price * _sellerProceedBpWithStandardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // Royalty recipient receives 0.5% of the whole price
        assertEq(
            address(_royaltyRecipient).balance,
            _initialETHBalanceRoyaltyRecipient + (price * _standardRoyaltyFee) / ONE_HUNDRED_PERCENT_IN_BP
        );
        // No leftover in the balance of the contract
        assertEq(address(looksRareProtocol).balance, 0);
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerAsk.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }
}
