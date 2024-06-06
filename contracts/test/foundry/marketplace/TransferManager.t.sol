// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// LooksRare unopinionated libraries
import {IOwnableTwoSteps} from "@looksrare/contracts-libs/contracts/interfaces/IOwnableTwoSteps.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";
import {OrderInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";

// Core contracts
import {LooksRareProtocol} from "@hypercerts/marketplace/LooksRareProtocol.sol";
import {ITransferManager, TransferManager} from "@hypercerts/marketplace/TransferManager.sol";
import {AmountInvalid, LengthsInvalid} from "@hypercerts/marketplace/errors/SharedErrors.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

// Mocks and other utils
import {MockERC721} from "../../mock/MockERC721.sol";
import {MockERC1155} from "../../mock/MockERC1155.sol";
import {MockHypercertMinterUUPS} from "../../mock/MockHypercertMinterUUPS.sol";
import {TestHelpers} from "./utils/TestHelpers.sol";
import {TestParameters} from "./utils/TestParameters.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";

contract TransferManagerTest is ITransferManager, TestHelpers, TestParameters {
    address[] public operators;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;
    MockHypercertMinterUUPS public mockHypercertMinterUUPS;

    TransferManager public transferManager;
    HypercertMinter public mockHypercertMinter;

    uint256 private constant tokenIdERC721 = 55;
    uint256 private constant tokenId1ERC1155 = 1;
    uint256 private constant amount1ERC1155 = 2;
    uint256 private constant tokenId2ERC1155 = 2;
    uint256 private constant amount2ERC1155 = 5;

    // Set the hypercert claim and first fraction id
    uint256 private constant claimId1Hypercert = 1 << 128;
    uint256 private constant amount1Hypercert = 1;
    uint256 private constant units1Hypercert = 10_000;
    uint256 private constant fractionId1Hypercert = claimId1Hypercert + 1;

    uint256 private constant claimId2Hypercert = 2 << 128;
    uint256 private constant amount2Hypercert = 1;
    uint256 private constant units2Hypercert = 10_000;
    uint256 private constant fractionId2Hypercert = claimId2Hypercert + 1;

    IHypercertToken.TransferRestrictions private constant FROM_CREATOR_ONLY =
        IHypercertToken.TransferRestrictions.FromCreatorOnly;

    /**
     * 0. Internal helper functions
     */
    function _grantApprovals(address user) private asPrankedUser(user) {
        mockERC721.setApprovalForAll(address(transferManager), true);
        mockERC1155.setApprovalForAll(address(transferManager), true);
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);

        address[] memory approvedOperators = new address[](1);
        approvedOperators[0] = _transferrer;

        vm.expectEmit(true, false, false, true);
        emit ApprovalsGranted(user, approvedOperators);
        transferManager.grantApprovals(approvedOperators);
    }

    function _allowOperator(address transferrer) private {
        vm.prank(_owner);
        vm.expectEmit(true, false, false, true);
        emit OperatorAllowed(transferrer);
        transferManager.allowOperator(transferrer);
    }

    function setUp() public asPrankedUser(_owner) {
        transferManager = new TransferManager(_owner);
        mockERC721 = new MockERC721();
        mockERC1155 = new MockERC1155();
        mockHypercertMinterUUPS = new MockHypercertMinterUUPS();
        mockHypercertMinterUUPS.setUp();
        mockHypercertMinter = mockHypercertMinterUUPS.minter();
        operators.push(_transferrer);

        vm.deal(_transferrer, 100 ether);
        vm.deal(_sender, 100 ether);
    }

    /**
     * 1. Happy cases
     */
    function testTransferSingleItemERC721() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = 500;

        vm.prank(_sender);
        mockERC721.mint(_sender, itemId);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        vm.prank(_transferrer);
        transferManager.transferItemsERC721(address(mockERC721), _sender, _recipient, itemIds, amounts);

        assertEq(mockERC721.ownerOf(itemId), _recipient);
    }

    function testTransferSingleItemERC1155() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = 1;
        uint256 amount = 2;

        mockERC1155.mint(_sender, itemId, amount);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        vm.prank(_transferrer);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);

        assertEq(mockERC1155.balanceOf(_recipient, itemId), amount);
    }

    function testTransferSingleItemHypercert() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = fractionId1Hypercert;
        uint256 amount = amount1Hypercert;

        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        vm.prank(_transferrer);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);

        assertEq(mockHypercertMinter.balanceOf(_recipient, itemId), amount);
    }

    function testTransferBatchItemsERC721() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 tokenId1 = 1;
        uint256 tokenId2 = 2;

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = tokenId1;
        itemIds[1] = tokenId2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = 1;

        mockERC721.batchMint(_sender, itemIds);

        vm.prank(_transferrer);
        transferManager.transferItemsERC721(address(mockERC721), _sender, _recipient, itemIds, amounts);

        assertEq(mockERC721.ownerOf(tokenId1), _recipient);
        assertEq(mockERC721.ownerOf(tokenId2), _recipient);
    }

    function testTransferBatchItemsERC1155() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 tokenId1 = 1;
        uint256 amount1 = 2;
        uint256 tokenId2 = 2;
        uint256 amount2 = 5;

        mockERC1155.mint(_sender, tokenId1, amount1);
        mockERC1155.mint(_sender, tokenId2, amount2);

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = tokenId1;
        itemIds[1] = tokenId2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        vm.prank(_transferrer);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);

        assertEq(mockERC1155.balanceOf(_recipient, tokenId1), amount1);
        assertEq(mockERC1155.balanceOf(_recipient, tokenId2), amount2);
    }

    function testTransferBatchItemsHypercerts() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 tokenId1 = fractionId1Hypercert;
        uint256 amount1 = amount1Hypercert;
        uint256 tokenId2 = fractionId2Hypercert;
        uint256 amount2 = amount2Hypercert;

        vm.startPrank(_sender);
        mockHypercertMinter.mintClaim(_sender, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);
        mockHypercertMinter.mintClaim(_sender, units2Hypercert, "https://example.com/2", FROM_CREATOR_ONLY);
        vm.stopPrank();

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = tokenId1;
        itemIds[1] = tokenId2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        vm.prank(_transferrer);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);

        assertEq(mockHypercertMinter.balanceOf(_recipient, tokenId1), amount1);
        assertEq(mockHypercertMinter.balanceOf(_recipient, tokenId2), amount2);
    }

    function testTransferBatchItemsAcrossCollectionERC721AndERC1155AndHypercert() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);

        vm.prank(_transferrer);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);

        assertEq(mockERC721.ownerOf(tokenIdERC721), _recipient);
        assertEq(mockERC1155.balanceOf(_recipient, tokenId1ERC1155), amount1ERC1155);
        assertEq(mockERC1155.balanceOf(_recipient, tokenId2ERC1155), amount2ERC1155);
        assertEq(mockHypercertMinter.balanceOf(_recipient, fractionId1Hypercert), amount1Hypercert);
        assertEq(mockHypercertMinter.balanceOf(_recipient, fractionId2Hypercert), amount2Hypercert);
    }

    function testTransferBatchItemsAcrossCollectionERC721AndERC1155AndHypercertByOwner()
        public
        asPrankedUser(_sender)
    {
        mockERC721.setApprovalForAll(address(transferManager), true);
        mockERC1155.setApprovalForAll(address(transferManager), true);
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItems();

        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);

        assertEq(mockERC721.ownerOf(tokenIdERC721), _recipient);
        assertEq(mockERC1155.balanceOf(_recipient, tokenId1ERC1155), amount1ERC1155);
        assertEq(mockERC1155.balanceOf(_recipient, tokenId2ERC1155), amount2ERC1155);
        assertEq(mockHypercertMinter.balanceOf(_recipient, fractionId1Hypercert), amount1Hypercert);
        assertEq(mockHypercertMinter.balanceOf(_recipient, fractionId2Hypercert), amount2Hypercert);
    }

    /**
     * 2. Revertion patterns
     */
    function testTransferItemsERC721AmountIsNotOne(uint256 amount) public {
        vm.assume(amount != 1);

        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = 500;

        mockERC721.mint(_sender, itemId);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferItemsERC721(address(mockERC721), _sender, _recipient, itemIds, amounts);
    }

    function testTransferSingleItemERC1155AmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = 500;

        mockERC1155.mint(_sender, itemId, 1);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);
    }

    function testTransferSingleItemHypercertAmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemId = fractionId1Hypercert;

        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, 1, "https://example.com/1", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);
    }

    function testTransferMultipleItemsERC1155AmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemIdOne = 500;
        uint256 itemIdTwo = 501;

        mockERC1155.mint(_sender, itemIdOne, 1);
        mockERC1155.mint(_sender, itemIdTwo, 1);

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = itemIdOne;
        itemIds[1] = itemIdTwo;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 0;
        amounts[1] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);
    }

    function testTransferMultipleItemsHypercertAmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        uint256 itemIdOne = fractionId1Hypercert;
        uint256 itemIdTwo = fractionId2Hypercert;

        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, 1, "https://example.com/1", FROM_CREATOR_ONLY);
        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, 1, "https://example.com/2", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](2);
        itemIds[0] = itemIdOne;
        itemIds[1] = itemIdTwo;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 0;
        amounts[1] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);
    }

    function testTransferBatchItemsAcrossCollectionZeroLength() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = new ITransferManager.BatchTransferItem[](0);

        vm.expectRevert(LengthsInvalid.selector);
        vm.prank(_transferrer);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testCannotBatchTransferIfERC721AmountIsNotOne(uint256 amount) public {
        vm.assume(amount != 1);

        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);
        items[1].amounts[0] = amount;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_sender);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testCannotBatchTransferIfERC1155AmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);
        items[0].amounts[0] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_sender);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testCannotBatchTransferIfHypercertAmountIsZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);
        items[2].amounts[0] = 0;

        vm.expectRevert(AmountInvalid.selector);
        vm.prank(_sender);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testTransferBatchItemsAcrossCollectionPerCollectionItemIdsLengthZero() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);
        items[0].itemIds = new uint256[](0);
        items[0].amounts = new uint256[](0);

        vm.prank(_transferrer);
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testCannotTransferERC721IfOperatorApprovalsRevokedByUserOrOperatorRemovedByOwner() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        // 1. User revokes the operator
        vm.prank(_sender);
        vm.expectEmit(false, false, false, true);
        emit ApprovalsRemoved(_sender, operators);
        transferManager.revokeApprovals(operators);

        uint256 itemId = 500;
        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsERC721(address(mockERC721), _sender, _recipient, itemIds, amounts);

        // 2. Sender grants again approvals but owner removes the operators
        _grantApprovals(_sender);
        vm.prank(_owner);
        vm.expectEmit(false, false, false, true);
        emit OperatorRemoved(_transferrer);
        transferManager.removeOperator(_transferrer);

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsERC721(address(mockERC721), _sender, _recipient, itemIds, amounts);
    }

    function testCannotTransferERC1155IfOperatorApprovalsRevokedByUserOrOperatorRemovedByOwner() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        // 1. User revokes the operator
        vm.prank(_sender);
        vm.expectEmit(false, false, false, true);
        emit ApprovalsRemoved(_sender, operators);
        transferManager.revokeApprovals(operators);

        uint256 itemId = 500;
        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 5;

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);

        // 2. Sender grants again approvals but owner removes the operators
        _grantApprovals(_sender);
        vm.prank(_owner);
        vm.expectEmit(false, false, false, true);
        emit OperatorRemoved(_transferrer);
        transferManager.removeOperator(_transferrer);

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);
    }

    function testCannotTransferHypercertIfOperatorApprovalsRevokedByUserOrOperatorRemovedByOwner() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        // 1. User revokes the operator
        vm.prank(_sender);
        vm.expectEmit(false, false, false, true);
        emit ApprovalsRemoved(_sender, operators);
        transferManager.revokeApprovals(operators);

        uint256 itemId = fractionId1Hypercert;
        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 5;

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);

        // 2. Sender grants again approvals but owner removes the operators
        _grantApprovals(_sender);
        vm.prank(_owner);
        vm.expectEmit(false, false, false, true);
        emit OperatorRemoved(_transferrer);
        transferManager.removeOperator(_transferrer);

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);
    }

    function testCannotBatchTransferIfOperatorApprovalsRevoked() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        // 1. User revokes the operator
        vm.prank(_sender);
        vm.expectEmit(false, false, false, true);
        emit ApprovalsRemoved(_sender, operators);
        transferManager.revokeApprovals(operators);

        ITransferManager.BatchTransferItem[] memory items = _generateValidBatchTransferItemsPranked(_sender);

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);

        // 2. Sender grants again approvals but owner removes the operators
        _grantApprovals(_sender);
        vm.prank(_owner);
        vm.expectEmit(false, false, false, true);
        emit OperatorRemoved(_transferrer);
        transferManager.removeOperator(_transferrer);

        vm.prank(_transferrer);
        vm.expectRevert(ITransferManager.TransferCallerInvalid.selector);
        transferManager.transferBatchItemsAcrossCollections(items, _sender, _recipient);
    }

    function testCannotTransferERC721OrERC1155orHypercertIfArrayLengthIs0() public {
        uint256[] memory emptyArrayUint256 = new uint256[](0);

        // 1. ERC721
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferItemsERC721(
            address(mockERC721), _sender, _recipient, emptyArrayUint256, emptyArrayUint256
        );

        // 2. ERC1155 length is 0
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferItemsERC1155(
            address(mockERC1155), _sender, _recipient, emptyArrayUint256, emptyArrayUint256
        );

        // 3. Hypercert length is 0
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferItemsHypercert(
            address(mockHypercertMinter), _sender, _recipient, emptyArrayUint256, emptyArrayUint256
        );
    }

    function testCannotTransferERC1155IfArrayLengthDiffers() public {
        uint256[] memory itemIds = new uint256[](2);
        uint256[] memory amounts = new uint256[](3);

        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferItemsERC1155(address(mockERC1155), _sender, _recipient, itemIds, amounts);
    }

    function testCannotTransferHypercertsIfArrayLengthDiffers() public {
        uint256[] memory itemIds = new uint256[](2);
        uint256[] memory amounts = new uint256[](3);

        vm.expectRevert(LengthsInvalid.selector);
        transferManager.transferItemsHypercert(address(mockHypercertMinter), _sender, _recipient, itemIds, amounts);
    }

    function testUserCannotGrantOrRevokeApprovalsIfArrayLengthIs0() public {
        address[] memory emptyArrayAddresses = new address[](0);

        // 1. Grant approvals
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.grantApprovals(emptyArrayAddresses);

        // 2. Revoke approvals
        vm.expectRevert(LengthsInvalid.selector);
        transferManager.revokeApprovals(emptyArrayAddresses);
    }

    function testUserCannotGrantApprovalIfOperatorOperatorNotAllowed() public asPrankedUser(_owner) {
        address randomOperator = address(420);
        transferManager.allowOperator(randomOperator);
        vm.expectRevert(ITransferManager.OperatorAlreadyAllowed.selector);
        transferManager.allowOperator(randomOperator);
    }

    function testAllowOperatorNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        transferManager.allowOperator(address(0));
    }

    function testOwnerCannotallowOperatorIfOperatorAlreadyAllowed() public asPrankedUser(_owner) {
        address randomOperator = address(420);
        transferManager.allowOperator(randomOperator);
        vm.expectRevert(ITransferManager.OperatorAlreadyAllowed.selector);
        transferManager.allowOperator(randomOperator);
    }

    function testOwnerCannotRemoveOperatorIfOperatorNotAllowed() public asPrankedUser(_owner) {
        address notOperator = address(420);
        vm.expectRevert(ITransferManager.OperatorNotAllowed.selector);
        transferManager.removeOperator(notOperator);
    }

    function testUserCannotGrantApprovalsIfOperatorNotAllowed() public {
        address[] memory approvedOperators = new address[](1);
        approvedOperators[0] = _transferrer;

        vm.expectRevert(ITransferManager.OperatorNotAllowed.selector);
        vm.prank(_sender);
        transferManager.grantApprovals(approvedOperators);
    }

    function testUserCannotGrantApprovalsIfOperatorAlreadyApprovedByUser() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        address[] memory approvedOperators = new address[](1);
        approvedOperators[0] = _transferrer;

        vm.expectRevert(ITransferManager.OperatorAlreadyApprovedByUser.selector);
        vm.prank(_sender);
        transferManager.grantApprovals(approvedOperators);
    }

    function testUserCannotRevokeApprovalsIfOperatorNotApprovedByUser() public {
        address[] memory approvedOperators = new address[](1);
        approvedOperators[0] = _transferrer;

        vm.expectRevert(ITransferManager.OperatorNotApprovedByUser.selector);
        vm.prank(_sender);
        transferManager.revokeApprovals(approvedOperators);
    }

    function testRemoveOperatorNotOwner() public {
        vm.expectRevert(IOwnableTwoSteps.NotOwner.selector);
        transferManager.removeOperator(address(0));
    }

    function testCannotExecuteHypercertSplitWhenSignerNotApprovedOrOwner() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        address anon = address(666);
        _grantApprovals(anon);

        uint256 itemId = fractionId1Hypercert;

        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = units1Hypercert - 3000;

        vm.prank(_transferrer);
        vm.expectRevert(OrderInvalid.selector);
        transferManager.splitItemsHypercert(address(mockHypercertMinter), anon, _recipient, itemIds, amounts);

        assertEq(mockHypercertMinter.unitsOf(_sender, itemId), units1Hypercert);
        assertEq(mockHypercertMinter.unitsOf(_recipient, itemId + 1), 0);
    }

    function testCanExecuteHypercertSplitWhenSignerApprovedOrOwner() public {
        _allowOperator(_transferrer);
        _grantApprovals(_sender);

        address anon = address(666);
        _grantApprovals(anon);

        vm.prank(_sender);
        mockHypercertMinter.setApprovalForAll(anon, true);

        uint256 itemId = fractionId1Hypercert;

        vm.prank(_sender);
        mockHypercertMinter.mintClaim(_sender, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);

        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = units1Hypercert - 3000;

        vm.prank(_transferrer);
        transferManager.splitItemsHypercert(address(mockHypercertMinter), anon, _recipient, itemIds, amounts);

        assertEq(mockHypercertMinter.unitsOf(_sender, itemId), 3000);
        assertEq(mockHypercertMinter.unitsOf(_recipient, itemId + 1), units1Hypercert - 3000);
    }

    function _generateValidBatchTransferItems() private returns (BatchTransferItem[] memory items) {
        items = new ITransferManager.BatchTransferItem[](3);

        {
            mockERC721.mint(_sender, tokenIdERC721);
            mockERC1155.mint(_sender, tokenId1ERC1155, amount1ERC1155);
            mockERC1155.mint(_sender, tokenId2ERC1155, amount2ERC1155);

            mockHypercertMinter.mintClaim(_sender, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);
            mockHypercertMinter.mintClaim(_sender, units2Hypercert, "https://example.com/2", FROM_CREATOR_ONLY);

            uint256[] memory fractionIdsHypercerts = new uint256[](2);
            fractionIdsHypercerts[0] = fractionId1Hypercert;
            fractionIdsHypercerts[1] = fractionId2Hypercert;

            uint256[] memory amountsHypercerts = new uint256[](2);
            amountsHypercerts[0] = amount1Hypercert;
            amountsHypercerts[1] = amount2Hypercert;

            uint256[] memory tokenIdsERC1155 = new uint256[](2);
            tokenIdsERC1155[0] = tokenId1ERC1155;
            tokenIdsERC1155[1] = tokenId2ERC1155;

            uint256[] memory amountsERC1155 = new uint256[](2);
            amountsERC1155[0] = amount1ERC1155;
            amountsERC1155[1] = amount2ERC1155;

            uint256[] memory tokenIdsERC721 = new uint256[](1);
            tokenIdsERC721[0] = tokenIdERC721;

            uint256[] memory amountsERC721 = new uint256[](1);
            amountsERC721[0] = 1;

            items[0] = ITransferManager.BatchTransferItem({
                collection: address(mockERC1155),
                collectionType: CollectionType.ERC1155,
                itemIds: tokenIdsERC1155,
                amounts: amountsERC1155
            });
            items[1] = ITransferManager.BatchTransferItem({
                collection: address(mockERC721),
                collectionType: CollectionType.ERC721,
                itemIds: tokenIdsERC721,
                amounts: amountsERC721
            });
            items[2] = ITransferManager.BatchTransferItem({
                collection: address(mockHypercertMinter),
                collectionType: CollectionType.Hypercert,
                itemIds: fractionIdsHypercerts,
                amounts: amountsHypercerts
            });
        }
    }

    function _generateValidBatchTransferItemsPranked(address pranker)
        private
        returns (BatchTransferItem[] memory items)
    {
        items = new ITransferManager.BatchTransferItem[](3);

        {
            mockERC721.mint(_sender, tokenIdERC721);
            mockERC1155.mint(_sender, tokenId1ERC1155, amount1ERC1155);
            mockERC1155.mint(_sender, tokenId2ERC1155, amount2ERC1155);

            vm.startPrank(pranker);
            mockHypercertMinter.mintClaim(pranker, units1Hypercert, "https://example.com/1", FROM_CREATOR_ONLY);
            mockHypercertMinter.mintClaim(pranker, units2Hypercert, "https://example.com/2", FROM_CREATOR_ONLY);
            vm.stopPrank();

            uint256[] memory fractionIdsHypercerts = new uint256[](2);
            fractionIdsHypercerts[0] = fractionId1Hypercert;
            fractionIdsHypercerts[1] = fractionId2Hypercert;

            uint256[] memory amountsHypercerts = new uint256[](2);
            amountsHypercerts[0] = amount1Hypercert;
            amountsHypercerts[1] = amount2Hypercert;

            uint256[] memory tokenIdsERC1155 = new uint256[](2);
            tokenIdsERC1155[0] = tokenId1ERC1155;
            tokenIdsERC1155[1] = tokenId2ERC1155;

            uint256[] memory amountsERC1155 = new uint256[](2);
            amountsERC1155[0] = amount1ERC1155;
            amountsERC1155[1] = amount2ERC1155;

            uint256[] memory tokenIdsERC721 = new uint256[](1);
            tokenIdsERC721[0] = tokenIdERC721;

            uint256[] memory amountsERC721 = new uint256[](1);
            amountsERC721[0] = 1;

            items[0] = ITransferManager.BatchTransferItem({
                collection: address(mockERC1155),
                collectionType: CollectionType.ERC1155,
                itemIds: tokenIdsERC1155,
                amounts: amountsERC1155
            });
            items[1] = ITransferManager.BatchTransferItem({
                collection: address(mockERC721),
                collectionType: CollectionType.ERC721,
                itemIds: tokenIdsERC721,
                amounts: amountsERC721
            });
            items[2] = ITransferManager.BatchTransferItem({
                collection: address(mockHypercertMinter),
                collectionType: CollectionType.Hypercert,
                itemIds: fractionIdsHypercerts,
                amounts: amountsHypercerts
            });
        }
    }
}
