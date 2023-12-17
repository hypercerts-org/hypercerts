// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {LooksRareProtocol} from "@hypercerts/marketplace/LooksRareProtocol.sol";
import {TransferManager} from "@hypercerts/marketplace/TransferManager.sol";
import {CreatorFeeManagerWithRoyalties} from "@hypercerts/marketplace/CreatorFeeManagerWithRoyalties.sol";

import {OrderValidatorV2A} from "@hypercerts/marketplace/helpers/OrderValidatorV2A.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Shared errors
import {
    ERC20_APPROVAL_INFERIOR_TO_PRICE,
    ERC721_ITEM_ID_NOT_IN_BALANCE,
    ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID,
    ERC1155_BALANCE_OF_DOES_NOT_EXIST,
    ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT,
    ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST,
    ERC1155_NO_APPROVAL_FOR_ALL,
    HYPERCERT_FRACTION_NOT_HELD_BY_USER,
    HYPERCERT_OWNER_OF_DOES_NOT_EXIST,
    MAKER_ORDER_INVALID_STANDARD_SALE,
    MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271,
    POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721,
    POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155,
    POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_HYPERCERT,
    STRATEGY_NOT_IMPLEMENTED,
    TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Utils
import {TestParameters} from "./utils/TestParameters.sol";

// Mocks
import {MockRoyaltyFeeRegistry} from "../../mock/MockRoyaltyFeeRegistry.sol";
import {MockERC721} from "../../mock/MockERC721.sol";
import {MockERC1155} from "../../mock/MockERC1155.sol";
import {MockERC1155WithoutBalanceOfBatch} from "../../mock/MockERC1155WithoutBalanceOfBatch.sol";
import {MockERC1155WithoutAnyBalanceOf} from "../../mock/MockERC1155WithoutAnyBalanceOf.sol";
import {MockERC1155WithoutIsApprovedForAll} from "../../mock/MockERC1155WithoutIsApprovedForAll.sol";
import {MockERC721SupportsNoInterface} from "../../mock/MockERC721SupportsNoInterface.sol";
import {MockERC1155SupportsNoInterface} from "../../mock/MockERC1155SupportsNoInterface.sol";
import {MockHypercertMinter} from "../../mock/MockHypercertMinter.sol";
import {MockHypercertMinterSupportsNoInterface} from "../../mock/MockHypercertMinterSupportsNoInterface.sol";
import {MockHypercertMinterWithoutAnyBalanceOf} from "../../mock/MockHypercertMinterWithoutAnyBalanceOf.sol";
import {MockHypercertMinterWithoutAnyUnitsOf} from "../../mock/MockHypercertMinterWithoutAnyUnitsOf.sol";
import {MockHypercertMinterWithoutOwnerOf} from "../../mock/MockHypercertMinterWithoutAnyOwnerOf.sol";

import {MockERC20} from "../../mock/MockERC20.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

/**
 * @dev Not everything is tested in this file. Most tests live in other files
 * with the assert functions living in ProtocolBase.t.sol.
 */
contract OrderValidatorV2ATest is TestParameters {
    CreatorFeeManagerWithRoyalties private creatorFeeManager;
    LooksRareProtocol private looksRareProtocol;
    MockRoyaltyFeeRegistry private royaltyFeeRegistry;
    OrderValidatorV2A private orderValidator;
    TransferManager private transferManager;

    function setUp() public {
        transferManager = new TransferManager(address(this));
        looksRareProtocol = new LooksRareProtocol(
            address(this), address(this), address(transferManager), 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        );
        royaltyFeeRegistry = new MockRoyaltyFeeRegistry(address(this), 9500);
        creatorFeeManager = new CreatorFeeManagerWithRoyalties(address(royaltyFeeRegistry));
        looksRareProtocol.updateCreatorFeeManager(address(creatorFeeManager));
        looksRareProtocol.updateCurrencyStatus(ETH, true);
        orderValidator = new OrderValidatorV2A(address(looksRareProtocol));
    }

    function testDeriveProtocolParameters() public {
        orderValidator.deriveProtocolParameters();
        assertEq(
            orderValidator.domainSeparator(),
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256("LooksRareProtocol"),
                    keccak256(bytes("2")),
                    block.chainid,
                    address(looksRareProtocol)
                )
            )
        );

        assertEq(address(orderValidator.creatorFeeManager()), address(creatorFeeManager));
        assertEq(orderValidator.maxCreatorFeeBp(), 1000);
    }

    function testMakerAskStrategyNotImplemented() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.strategyId = 1;
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[0], STRATEGY_NOT_IMPLEMENTED);
    }

    function testMakerBidStrategyNotImplemented() public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        address currency = address(1); // it cannot be 0
        looksRareProtocol.updateCurrencyStatus(currency, true);
        makerBid.currency = currency;
        makerBid.strategyId = 1;
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[0], STRATEGY_NOT_IMPLEMENTED);
    }

    function testMakerAskLooksRareProtocolIsNotAWhitelistedOperator() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC721;
        makerAsk.collection = address(new MockERC721());

        address[] memory operators = new address[](1);
        operators[0] = address(orderValidator.looksRareProtocol());

        transferManager.allowOperator(operators[0]);

        vm.prank(makerUser);
        transferManager.grantApprovals(operators);

        transferManager.removeOperator(operators[0]);

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[7], TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE);
    }

    function testMakerAskWrongCollectionTypeERC721() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC721;
        makerAsk.collection = address(new MockERC721SupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721);
    }

    function testMakerBidWrongCollectionTypeERC721() public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.collection = address(new MockERC721SupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721);
    }

    function testMakerBidZeroAmount() public {
        _testMakerBidERC721InvalidAmount(0);
    }

    function testMakerBidERC721AmountNotEqualToOne() public {
        _testMakerBidERC721InvalidAmount(2);
    }

    function _testMakerBidERC721InvalidAmount(uint256 amount) public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.collection = address(new MockERC721());
        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = amount;
        makerBid.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;
        makerBid.amounts = amounts;
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[1], MAKER_ORDER_INVALID_STANDARD_SALE);
    }

    function testMakerBidMissingIsValidSignature() public {
        OrderStructs.Maker memory makerBid;
        // This contract does not have isValidSignature implemented
        makerBid.quoteType = QuoteType.Bid;
        makerBid.signer = address(this);
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.collection = address(new MockERC721());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[3], MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271);
    }

    function testMakerAskWrongCollectionTypeERC1155() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.collectionType = CollectionType.ERC1155;
        makerAsk.collection = address(new MockERC1155SupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155);
    }

    function testMakerBidWrongCollectionTypeERC1155() public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        makerBid.collectionType = CollectionType.ERC1155;
        makerBid.collection = address(new MockERC1155SupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155);
    }

    function testMakerAskWrongCollectionTypeHypercert() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.collectionType = CollectionType.Hypercert;
        makerAsk.collection = address(new MockHypercertMinterSupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_HYPERCERT);
    }

    function testMakerBidWrongCollectionTypeHypercert() public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        makerBid.collectionType = CollectionType.Hypercert;
        makerBid.collection = address(new MockHypercertMinterSupportsNoInterface());
        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[6], POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_HYPERCERT);
    }

    function testMakerBidInsufficientERC20Allowance() public {
        OrderStructs.Maker memory makerBid;
        makerBid.quoteType = QuoteType.Bid;
        MockERC20 mockERC20 = new MockERC20();
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.collection = address(new MockERC721());
        makerBid.signer = makerUser;
        makerBid.currency = address(mockERC20);
        makerBid.collectionType = CollectionType.ERC721;
        makerBid.price = 1 ether;

        mockERC20.mint(makerUser, 1 ether);

        vm.startPrank(makerUser);
        mockERC20.approve(address(orderValidator.looksRareProtocol()), makerBid.price - 1 wei);
        vm.stopPrank();

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerBid, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC20_APPROVAL_INFERIOR_TO_PRICE);
    }

    function testMakerAskERC721NotAllTokensAreApproved() public {
        MockERC721 mockERC721 = new MockERC721();
        mockERC721.mint(makerUser, 0);
        mockERC721.mint(makerUser, 1);

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC721;
        makerAsk.collection = address(mockERC721);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC721;

        // Only approve token 0 but not token 1, this is to test the loop
        vm.prank(makerUser);
        mockERC721.approve(address(transferManager), 0);

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = 0;
        itemIds[1] = 1;
        makerAsk.itemIds = itemIds;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID);
    }

    function testMakerAskDoesNotOwnERC721() public {
        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC721;
        MockERC721 mockERC721 = new MockERC721();
        mockERC721.mint(address(this), 0);
        makerAsk.collection = address(mockERC721);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC721;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);

        assertEq(validationCodes[5], ERC721_ITEM_ID_NOT_IN_BALANCE);
    }

    function testMakerAskERC1155BalanceInferiorToAmountThroughBalanceOfBatch() public {
        _testMakerAskERC1155BalanceInferiorToAmount(true);
    }

    function testMakerAskERC1155BalanceInferiorToAmountThroughBalanceOf() public {
        _testMakerAskERC1155BalanceInferiorToAmount(false);
    }

    function _testMakerAskERC1155BalanceInferiorToAmount(bool revertBalanceOfBatch) public {
        address collection;
        if (revertBalanceOfBatch) {
            MockERC1155WithoutBalanceOfBatch mockERC1155 = new MockERC1155WithoutBalanceOfBatch();
            collection = address(mockERC1155);
        } else {
            MockERC1155 mockERC1155 = new MockERC1155();
            collection = address(mockERC1155);
        }

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC1155;
        makerAsk.collection = collection;
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC1155;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT);
    }

    function testMakerAskERC1155BalanceOfDoesNotExist() public {
        MockERC1155WithoutAnyBalanceOf mockERC1155 = new MockERC1155WithoutAnyBalanceOf();

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC1155;
        makerAsk.collection = address(mockERC1155);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC1155;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC1155_BALANCE_OF_DOES_NOT_EXIST);
    }

    function testMakerAskERC1155IsApprovedForAllDoesNotExist() public {
        MockERC1155WithoutIsApprovedForAll mockERC1155 = new MockERC1155WithoutIsApprovedForAll();
        mockERC1155.mint({to: makerUser, tokenId: 0, amount: 1});

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC1155;
        makerAsk.collection = address(mockERC1155);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC1155;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST);
    }

    function testMakerAskERC1155IsApprovedForAllReturnsFalse() public {
        MockERC1155 mockERC1155 = new MockERC1155();
        mockERC1155.mint({to: makerUser, tokenId: 0, amount: 1});

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.ERC1155;
        makerAsk.collection = address(mockERC1155);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.ERC1155;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], ERC1155_NO_APPROVAL_FOR_ALL);
    }

    // HYPERCERTS

    function _testMakerAskHypercertFractionNotHeldByMaker() public {
        address collection;

        MockHypercertMinter mockHypercert = new MockHypercertMinter();
        collection = address(mockHypercert);

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.Hypercert;
        makerAsk.collection = collection;
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.Hypercert;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], HYPERCERT_FRACTION_NOT_HELD_BY_USER);
    }

    function testMakerAskHypercertOwnerOfDoesNotExist() public {
        MockHypercertMinterWithoutOwnerOf mockHypercert = new MockHypercertMinterWithoutOwnerOf();

        OrderStructs.Maker memory makerAsk;
        makerAsk.quoteType = QuoteType.Ask;
        makerAsk.collectionType = CollectionType.Hypercert;
        makerAsk.collection = address(mockHypercert);
        makerAsk.signer = makerUser;
        makerAsk.collectionType = CollectionType.Hypercert;
        uint256[] memory itemIds = new uint256[](1);
        makerAsk.itemIds = itemIds;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        makerAsk.amounts = amounts;

        uint256[9] memory validationCodes =
            orderValidator.checkMakerOrderValidity(makerAsk, new bytes(65), _EMPTY_MERKLE_TREE);
        assertEq(validationCodes[5], HYPERCERT_OWNER_OF_DOES_NOT_EXIST);
    }
}
