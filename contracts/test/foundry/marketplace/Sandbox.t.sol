// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IERC721} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC721.sol";
import {IERC1155} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC1155.sol";

// Libraries and interfaces
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract SandboxTest is ProtocolBase {
    error ERC721TransferFromFail();

    // Fixed price of sale
    uint256 private constant price = 1 ether;

    // Sandbox on Ethereum mainnet
    address private constant SANDBOX = 0xa342f5D851E866E18ff98F351f2c6637f4478dB5;

    // Forked block number to run the tests
    uint256 private constant FORKED_BLOCK_NUMBER = 16_268_000;

    function _transferItemIdToUser(address user) private returns (uint256 itemId) {
        // @dev This user had 23 of the itemId at the forked block number
        address ownerOfItemId = 0x7A9fe22691c811ea339D9B73150e6911a5343DcA;
        itemId = 55_464_657_044_963_196_816_950_587_289_035_428_064_568_320_970_692_304_673_817_341_489_688_428_423_171;
        vm.prank(ownerOfItemId);
        IERC1155(SANDBOX).safeTransferFrom(ownerOfItemId, user, itemId, 23, "");
    }

    function _setUpApprovalsForSandbox(address user) internal {
        vm.prank(user);
        IERC1155(SANDBOX).setApprovalForAll(address(transferManager), true);
    }

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"), FORKED_BLOCK_NUMBER);
        _setUp();
        _setUpUsers();
    }

    /**
     * @notice Sandbox implements both ERC721 and ERC1155 interfaceIds.
     *         This test verifies that only collectionType = 1 works.
     *         It is for taker ask (matching maker bid).
     */
    function testTakerAskCannotTransferSandboxWithERC721CollectionTypeButERC1155CollectionTypeWorks() public {
        // Taker user is the one selling the item
        _setUpApprovalsForSandbox(takerUser);
        uint256 itemId = _transferItemIdToUser(takerUser);

        OrderStructs.Maker memory makerBid = _createSingleItemMakerOrder({
            quoteType: QuoteType.Bid,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721, // it should be ERC1155
            orderNonce: 0,
            collection: SANDBOX,
            currency: address(weth),
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Prepare the taker ask
        OrderStructs.Taker memory takerAsk = _genericTakerOrder();

        // It should fail with collectionType = 0
        vm.expectRevert(abi.encodeWithSelector(ERC721TransferFromFail.selector));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Adjust the collection type and sign order again
        makerBid.collectionType = CollectionType.ERC1155;
        signature = _signMakerOrder(makerBid, makerUserPK);

        // It shouldn't fail with collectionType = 0
        vm.prank(takerUser);
        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, _EMPTY_MERKLE_TREE);

        // Maker user has received the Sandbox asset
        assertEq(IERC1155(SANDBOX).balanceOf(makerUser, itemId), makerBid.amounts[0]);
    }

    /**
     * @notice Sandbox implements both ERC721 and ERC1155 interfaceIds.
     *         This test verifies that only collectionType = 1 works.
     *         It is for taker bid (matching maker ask).
     */
    function testTakerBidCannotTransferSandboxWithERC721CollectionTypeButERC1155CollectionTypeWorks() public {
        // Maker user is the one selling the item
        _setUpApprovalsForSandbox(makerUser);
        uint256 itemId = _transferItemIdToUser(makerUser);

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721, // it should be ERC1155
            orderNonce: 0,
            collection: SANDBOX,
            currency: ETH,
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign order
        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Prepare the taker bid
        OrderStructs.Taker memory takerBid = _genericTakerOrder();

        // It should fail with collectionType = 0
        vm.expectRevert(abi.encodeWithSelector(ERC721TransferFromFail.selector));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Adjust the collection type and sign order again
        makerAsk.collectionType = CollectionType.ERC1155;
        signature = _signMakerOrder(makerAsk, makerUserPK);

        // It shouldn't fail with collectionType = 0
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid{value: price}(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);

        // Taker user has received the Sandbox asset
        assertEq(IERC1155(SANDBOX).balanceOf(takerUser, itemId), makerAsk.amounts[0]);
    }
}
