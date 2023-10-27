// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IERC721} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC721.sol";

import {CreatorFeeManagerWithRebates} from "@hypercerts/marketplace/CreatorFeeManagerWithRebates.sol";

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {ICreatorFeeManager} from "@hypercerts/marketplace/interfaces/ICreatorFeeManager.sol";
import {IExecutionManager} from "@hypercerts/marketplace/interfaces/IExecutionManager.sol";

// Shared errors
import {BUNDLE_ERC2981_NOT_SUPPORTED} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

contract CreatorFeeManagerWithRebatesTest is ProtocolBase {
    function setUp() public {
        _setUp();
        CreatorFeeManagerWithRebates creatorFeeManager = new CreatorFeeManagerWithRebates(address(royaltyFeeRegistry));
        vm.prank(_owner);
        looksRareProtocol.updateCreatorFeeManager(address(creatorFeeManager));
        orderValidator.deriveProtocolParameters();
    }

    function _setUpRoyaltiesRegistry(uint256 fee) private {
        vm.prank(_owner);
        royaltyFeeRegistry.updateRoyaltyInfoForCollection(
            address(mockERC721), _royaltyRecipient, _royaltyRecipient, fee
        );
    }

    function _testCreatorFeeRebatesArePaid(address erc721) private {
        _setUpUsers();

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAsk(erc721, address(weth));

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        if (erc721 == address(mockERC721)) {
            // Adjust royalties
            _setUpRoyaltiesRegistry(_standardRoyaltyFee);
            // Mint asset
            mockERC721.mint(takerUser, makerBid.itemIds[0]);
        } else if (erc721 == address(mockERC721WithRoyalties)) {
            // Adjust ERC721 with royalties
            mockERC721WithRoyalties.addCustomRoyaltyInformationForTokenId(
                makerBid.itemIds[0], _royaltyRecipient, _standardRoyaltyFee
            );
            // Mint asset
            mockERC721WithRoyalties.mint(takerUser, makerBid.itemIds[0]);
        }

        _assertValidMakerOrder(makerBid, signature);

        // Execute taker ask transaction
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Verify ownership is transferred
        assertEq(IERC721(erc721).ownerOf(makerBid.itemIds[0]), makerUser);
        _assertSuccessfulTakerAsk(makerBid);
    }

    function _testCreatorFeeRebatesArePaidForBundles(address erc721) private {
        _setUpUsers();
        _setUpRoyaltiesRegistry(_standardRoyaltyFee);

        // Parameters
        uint256 numberItemsInBundle = 5;

        // Create order
        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
            _createMockMakerBidAndTakerAskWithBundle(erc721, address(weth), numberItemsInBundle);

        if (erc721 == address(mockERC721)) {
            // Adjust royalties
            _setUpRoyaltiesRegistry(_standardRoyaltyFee);
            // Mint the items
            mockERC721.batchMint(takerUser, makerBid.itemIds);
        } else if (erc721 == address(mockERC721WithRoyalties)) {
            // Adjust ERC721 with royalties
            for (uint256 i; i < makerBid.itemIds.length; i++) {
                mockERC721WithRoyalties.addCustomRoyaltyInformationForTokenId(
                    makerBid.itemIds[i], _royaltyRecipient, _standardRoyaltyFee
                );
            }
            // Mint the items
            mockERC721WithRoyalties.batchMint(takerUser, makerBid.itemIds);
        }

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        _assertValidMakerOrder(makerBid, signature);

        // Taker user actions
        vm.prank(takerUser);

        // Execute taker ask transaction
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Verify ownership is transferred
        for (uint256 i; i < makerBid.itemIds.length; i++) {
            // Maker user has received all the assets in the bundle
            assertEq(IERC721(erc721).ownerOf(makerBid.itemIds[i]), makerUser);
        }
        _assertSuccessfulTakerAsk(makerBid);
    }

    function testCreatorRebatesArePaidForRoyaltyFeeManager() public {
        _testCreatorFeeRebatesArePaid(address(mockERC721));
    }

    function testCreatorRebatesArePaidForERC2981() public {
        _testCreatorFeeRebatesArePaid(address(mockERC721WithRoyalties));
    }

    function testCreatorRebatesArePaidForRoyaltyFeeManagerWithBundles() public {
        _testCreatorFeeRebatesArePaidForBundles(address(mockERC721));
    }

    function testCreatorRoyaltiesGetPaidForERC2981WithBundles() public {
        _testCreatorFeeRebatesArePaidForBundles(address(mockERC721WithRoyalties));
    }

    function testCreatorRoyaltiesRevertForEIP2981WithBundlesIfInfoDiffer() public {
        _setUpUsers();

        uint256 numberItemsInBundle = 5;

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
        _createMockMakerBidAndTakerAskWithBundle(address(mockERC721WithRoyalties), address(weth), numberItemsInBundle);

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Mint the items
        mockERC721WithRoyalties.batchMint(takerUser, makerBid.itemIds);

        _assertValidMakerOrder(makerBid, signature);

        /**
         * Different recipient
         */

        // Adjust ERC721 with royalties
        for (uint256 i; i < makerBid.itemIds.length; i++) {
            mockERC721WithRoyalties.addCustomRoyaltyInformationForTokenId(
                makerBid.itemIds[i], i == 0 ? _royaltyRecipient : address(50), 50
            );
        }

        _assertMakerOrderReturnValidationCode(makerBid, signature, BUNDLE_ERC2981_NOT_SUPPORTED);

        vm.prank(takerUser);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICreatorFeeManager.BundleEIP2981NotAllowed.selector, address(mockERC721WithRoyalties)
            )
        );
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function testCreatorRoyaltiesRevertForEIP2981WithBundlesIfAtLeastOneCallReverts(uint256 revertIndex) public {
        _setUpUsers();

        uint256 numberItemsInBundle = 5;
        vm.assume(revertIndex < numberItemsInBundle);

        (OrderStructs.Maker memory makerBid, OrderStructs.Taker memory takerAsk) =
        _createMockMakerBidAndTakerAskWithBundle(address(mockERC721WithRoyalties), address(weth), numberItemsInBundle);

        // Sign the order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Mint the items
        mockERC721WithRoyalties.batchMint(takerUser, makerBid.itemIds);

        _assertValidMakerOrder(makerBid, signature);

        // Adjust ERC721 with royalties
        for (uint256 i; i < makerBid.itemIds.length; i++) {
            mockERC721WithRoyalties.addCustomRoyaltyInformationForTokenId(
                makerBid.itemIds[i],
                _royaltyRecipient,
                // if greater than 10,000, will revert in royaltyInfo
                i == revertIndex ? 10_001 : 50
            );
        }

        _assertMakerOrderReturnValidationCode(makerBid, signature, BUNDLE_ERC2981_NOT_SUPPORTED);

        vm.prank(takerUser);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICreatorFeeManager.BundleEIP2981NotAllowed.selector, address(mockERC721WithRoyalties)
            )
        );
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);
    }

    function _assertSuccessfulTakerAsk(OrderStructs.Maker memory makerBid) private {
        uint256 price = makerBid.price;

        // Maker bid user pays the whole price
        assertEq(weth.balanceOf(makerUser), _initialWETHBalanceUser - price);
        assertEq(
            weth.balanceOf(address(protocolFeeRecipient)),
            (price * _standardProtocolFeeBp) / ONE_HUNDRED_PERCENT_IN_BP,
            "Protocol fee recipient should receive 0.5% of the whole price"
        );
        assertEq(
            weth.balanceOf(takerUser),
            _initialWETHBalanceUser + (price * 9900) / ONE_HUNDRED_PERCENT_IN_BP,
            "Taker ask user should receive 99% of the whole price"
        );
        assertEq(
            weth.balanceOf(_royaltyRecipient),
            _initialWETHBalanceRoyaltyRecipient + (price * 50) / ONE_HUNDRED_PERCENT_IN_BP,
            "Royalty recipient receives 0.5% of the whole price"
        );
        // Verify the nonce is marked as executed
        assertEq(looksRareProtocol.userOrderNonce(makerUser, makerBid.orderNonce), MAGIC_VALUE_ORDER_NONCE_EXECUTED);
    }
}
