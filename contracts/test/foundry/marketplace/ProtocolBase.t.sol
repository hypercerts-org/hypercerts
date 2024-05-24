// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

// WETH
import {WETH} from "solmate/src/tokens/WETH.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Core contracts
import {LooksRareProtocol, ILooksRareProtocol} from "@hypercerts/marketplace/LooksRareProtocol.sol";
import {TransferManager} from "@hypercerts/marketplace/TransferManager.sol";
import {ProtocolFeeRecipient} from "@hypercerts/marketplace/ProtocolFeeRecipient.sol";
import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

// Other contracts
import {OrderValidatorV2A} from "@hypercerts/marketplace/helpers/OrderValidatorV2A.sol";

// Mock files
import {MockERC20} from "../../mock/MockERC20.sol";
import {MockERC721} from "../../mock/MockERC721.sol";
import {MockERC721WithRoyalties} from "../../mock/MockERC721WithRoyalties.sol";
import {MockERC1155} from "../../mock/MockERC1155.sol";
import {MockRoyaltyFeeRegistry} from "../../mock/MockRoyaltyFeeRegistry.sol";
import {MockHypercertMinterUUPS} from "../../mock/MockHypercertMinterUUPS.sol";

// Utils
import {MockOrderGenerator} from "./utils/MockOrderGenerator.sol";

contract ProtocolBase is MockOrderGenerator, ILooksRareProtocol {
    address[] public operators;

    MockERC20 public looksRareToken;
    MockERC721WithRoyalties public mockERC721WithRoyalties;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;
    MockHypercertMinterUUPS public mockHypercertMinterUUPS;
    HypercertMinter public mockHypercertMinter;

    // enum TransferRestrictions {
    //     AllowAll,
    //     DisallowAll,
    //     FromCreatorOnly
    // }

    IHypercertToken.TransferRestrictions public constant FROM_CREATOR_ONLY =
        IHypercertToken.TransferRestrictions.FromCreatorOnly;

    IHypercertToken.TransferRestrictions public constant ALLOW_ALL = IHypercertToken.TransferRestrictions.AllowAll;

    ProtocolFeeRecipient public protocolFeeRecipient;
    LooksRareProtocol public looksRareProtocol;
    TransferManager public transferManager;
    MockRoyaltyFeeRegistry public royaltyFeeRegistry;
    OrderValidatorV2A public orderValidator;

    WETH public weth;

    function _assertMakerOrderReturnValidationCode(
        OrderStructs.Maker memory makerOrder,
        bytes memory signature,
        uint256 expectedValidationCode
    ) internal {
        _assertMakerOrderReturnValidationCode(makerOrder, signature, _EMPTY_MERKLE_TREE, expectedValidationCode);
    }

    function _assertMakerOrderReturnValidationCodeWithMerkleTree(
        OrderStructs.Maker memory makerOrder,
        bytes memory signature,
        OrderStructs.MerkleTree memory merkleTree,
        uint256 expectedValidationCode
    ) internal {
        _assertMakerOrderReturnValidationCode(makerOrder, signature, merkleTree, expectedValidationCode);
    }

    function _assertMakerOrderReturnValidationCode(
        OrderStructs.Maker memory makerOrder,
        bytes memory signature,
        OrderStructs.MerkleTree memory merkleTree,
        uint256 expectedValidationCode
    ) private {
        OrderStructs.Maker[] memory makerOrders = new OrderStructs.Maker[](1);
        makerOrders[0] = makerOrder;

        bytes[] memory signatures = new bytes[](1);
        signatures[0] = signature;

        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](1);
        merkleTrees[0] = merkleTree;

        uint256[9][] memory validationCodes =
            orderValidator.checkMultipleMakerOrderValidities(makerOrders, signatures, merkleTrees);

        uint256 index = expectedValidationCode / 100;
        assertEq(validationCodes[0][index - 1], expectedValidationCode);
    }

    function _assertValidMakerOrder(OrderStructs.Maker memory makerOrder, bytes memory signature) internal {
        _assertValidMakerOrder(makerOrder, signature, _EMPTY_MERKLE_TREE);
    }

    function _assertValidMakerOrderWithMerkleTree(
        OrderStructs.Maker memory makerOrder,
        bytes memory signature,
        OrderStructs.MerkleTree memory merkleTree
    ) internal {
        _assertValidMakerOrder(makerOrder, signature, merkleTree);
    }

    function _assertValidMakerOrder(
        OrderStructs.Maker memory makerOrder,
        bytes memory signature,
        OrderStructs.MerkleTree memory merkleTree
    ) private {
        OrderStructs.Maker[] memory makerOrders = new OrderStructs.Maker[](1);
        makerOrders[0] = makerOrder;

        bytes[] memory signatures = new bytes[](1);
        signatures[0] = signature;

        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](1);
        merkleTrees[0] = merkleTree;

        uint256[9][] memory validationCodes =
            orderValidator.checkMultipleMakerOrderValidities(makerOrders, signatures, merkleTrees);

        _assertValidationCodesAllZeroes(validationCodes);
    }

    function _assertValidationCodesAllZeroes(uint256[9][] memory validationCodes) private {
        for (uint256 i; i < validationCodes.length; i++) {
            for (uint256 j; j < 9; j++) {
                assertEq(validationCodes[i][j], 0);
            }
        }
    }

    function _setUpUser(address user) internal asPrankedUser(user) {
        // Do approvals for collections and WETH
        mockERC721.setApprovalForAll(address(transferManager), true);
        mockERC1155.setApprovalForAll(address(transferManager), true);
        mockERC721WithRoyalties.setApprovalForAll(address(transferManager), true);
        mockHypercertMinter.setApprovalForAll(address(transferManager), true);

        weth.approve(address(looksRareProtocol), type(uint256).max);

        // Grant approvals for transfer manager
        transferManager.grantApprovals(operators);

        // Receive ETH and WETH
        vm.deal(user, _initialETHBalanceUser + _initialWETHBalanceUser);
        weth.deposit{value: _initialWETHBalanceUser}();
    }

    function _setUpUsers() internal {
        _setUpUser(makerUser);
        _setUpUser(takerUser);
    }

    function _setupRegistryRoyalties(address collection, uint256 standardRoyaltyFee) internal {
        vm.prank(royaltyFeeRegistry.owner());
        royaltyFeeRegistry.updateRoyaltyInfoForCollection(
            collection, _royaltyRecipient, _royaltyRecipient, standardRoyaltyFee
        );
    }

    function _setUp() internal {
        vm.startPrank(_owner);
        weth = new WETH();
        looksRareToken = new MockERC20();
        mockERC721 = new MockERC721();
        mockERC1155 = new MockERC1155();
        mockHypercertMinterUUPS = new MockHypercertMinterUUPS();
        mockHypercertMinterUUPS.setUp();
        mockHypercertMinter = mockHypercertMinterUUPS.minter();

        transferManager = new TransferManager(_owner);
        royaltyFeeRegistry = new MockRoyaltyFeeRegistry(_owner, 9500);
        protocolFeeRecipient = new ProtocolFeeRecipient(0x5924A28caAF1cc016617874a2f0C3710d881f3c1, address(weth));
        looksRareProtocol =
            new LooksRareProtocol(_owner, address(protocolFeeRecipient), address(transferManager), address(weth));
        mockERC721WithRoyalties = new MockERC721WithRoyalties(_royaltyRecipient, _standardRoyaltyFee);

        // Operations
        transferManager.allowOperator(address(looksRareProtocol));
        looksRareProtocol.updateCurrencyStatus(ETH, true);
        looksRareProtocol.updateCurrencyStatus(address(weth), true);

        // Fetch domain separator and store it as one of the operators
        _domainSeparator = looksRareProtocol.domainSeparator();
        operators.push(address(looksRareProtocol));

        // Deploy order validator contract
        orderValidator = new OrderValidatorV2A(address(looksRareProtocol));

        // Distribute ETH and WETH to protocol owner
        vm.deal(_owner, _initialETHBalanceOwner + _initialWETHBalanceOwner);
        weth.deposit{value: _initialWETHBalanceOwner}();
        vm.stopPrank();

        // Distribute ETH and WETH to royalty recipient
        vm.deal(_royaltyRecipient, _initialETHBalanceRoyaltyRecipient + _initialWETHBalanceRoyaltyRecipient);
        vm.startPrank(_royaltyRecipient);
        weth.deposit{value: _initialWETHBalanceRoyaltyRecipient}();
        vm.stopPrank();
    }

    function _genericTakerOrder() internal pure returns (OrderStructs.Taker memory takerOrder) {
        takerOrder = OrderStructs.Taker(takerUser, abi.encode());
    }

    function _addStrategy(address strategy, bytes4 selector, bool isMakerBid) internal {
        looksRareProtocol.addStrategy(
            _standardProtocolFeeBp, _minTotalFeeBp, _maxProtocolFeeBp, selector, isMakerBid, strategy
        );
    }

    function _assertStrategyAttributes(
        address expectedStrategyAddress,
        bytes4 expectedSelector,
        bool expectedIsMakerBid
    ) internal {
        (
            bool strategyIsActive,
            uint16 strategyStandardProtocolFee,
            uint16 strategyMinTotalFee,
            uint16 strategyMaxProtocolFee,
            bytes4 strategySelector,
            bool strategyIsMakerBid,
            address strategyImplementation
        ) = looksRareProtocol.strategyInfo(1);

        assertTrue(strategyIsActive);
        assertEq(strategyStandardProtocolFee, _standardProtocolFeeBp);
        assertEq(strategyMinTotalFee, _minTotalFeeBp);
        assertEq(strategyMaxProtocolFee, _maxProtocolFeeBp);
        assertEq(strategySelector, expectedSelector);
        assertEq(strategyIsMakerBid, expectedIsMakerBid);
        assertEq(strategyImplementation, expectedStrategyAddress);
    }

    function _assertMockERC721Ownership(uint256[] memory itemIds, address owner) internal {
        for (uint256 i; i < itemIds.length; i++) {
            assertEq(mockERC721.ownerOf(itemIds[i]), owner);
        }
    }

    /**
     * NOTE: It inherits from ILooksRareProtocol, so it
     *       needs to at least define the functions below.
     */
    function executeTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external {}

    function executeTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external payable {}

    function executeMultipleTakerBids(
        OrderStructs.Taker[] calldata takerBids,
        OrderStructs.Maker[] calldata makerAsks,
        bytes[] calldata makerSignatures,
        OrderStructs.MerkleTree[] calldata merkleTrees,
        bool isAtomic
    ) external payable {}
}
