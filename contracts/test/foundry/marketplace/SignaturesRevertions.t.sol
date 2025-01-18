// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries, interfaces, errors
import {
    SignatureParameterVInvalid,
    SignatureParameterSInvalid,
    SignatureEOAInvalid,
    NullSignerAddress,
    SignatureLengthInvalid
} from "@looksrare/contracts-libs/contracts/errors/SignatureCheckerErrors.sol";
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";
import {
    INVALID_S_PARAMETER_EOA,
    INVALID_V_PARAMETER_EOA,
    NULL_SIGNER_EOA,
    INVALID_SIGNATURE_LENGTH,
    INVALID_SIGNER_EOA
} from "@hypercerts/marketplace/constants/ValidationCodeConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract SignaturesRevertionsTest is ProtocolBase {
    uint256 internal constant _MAX_PRIVATE_KEY =
        115_792_089_237_316_195_423_570_985_008_687_907_852_837_564_279_074_904_382_605_163_141_518_161_494_337;

    function setUp() public {
        _setUp();
    }

    function testRevertIfSignatureEOAInvalid(uint256 itemId, uint256 price, uint256 randomPK) public {
        // @dev Private keys 1 and 2 are used for maker/taker users
        vm.assume(randomPK > 2 && randomPK < _MAX_PRIVATE_KEY);

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: ETH,
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        address randomUser = vm.addr(randomPK);
        _setUpUser(randomUser);
        bytes memory signature = _signMakerOrder(makerAsk, randomPK);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, INVALID_SIGNER_EOA);

        vm.expectRevert(SignatureEOAInvalid.selector);
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(_genericTakerOrder(), makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testRevertIfInvalidVParameter(uint256 itemId, uint256 price, uint8 v) public {
        vm.assume(v != 27 && v != 28);

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: ETH,
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign but replace v by the fuzzed v
        bytes32 orderHash = _computeOrderHash(makerAsk);
        (, bytes32 r, bytes32 s) =
            vm.sign(makerUserPK, keccak256(abi.encodePacked("\x19\x01", _domainSeparator, orderHash)));
        bytes memory signature = abi.encodePacked(r, s, v);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, INVALID_V_PARAMETER_EOA);

        vm.expectRevert(abi.encodeWithSelector(SignatureParameterVInvalid.selector, v));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(_genericTakerOrder(), makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testRevertIfInvalidSParameter(uint256 itemId, uint256 price, bytes32 s) public {
        vm.assume(uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0);

        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: ETH,
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign but replace s by the fuzzed s
        bytes32 orderHash = _computeOrderHash(makerAsk);
        (uint8 v, bytes32 r,) =
            vm.sign(makerUserPK, keccak256(abi.encodePacked("\x19\x01", _domainSeparator, orderHash)));
        bytes memory signature = abi.encodePacked(r, s, v);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, INVALID_S_PARAMETER_EOA);

        vm.expectRevert(abi.encodeWithSelector(SignatureParameterSInvalid.selector));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(_genericTakerOrder(), makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testRevertIfRecoveredSignerIsNullAddress(uint256 itemId, uint256 price) public {
        OrderStructs.Maker memory makerAsk = _createSingleItemMakerOrder({
            quoteType: QuoteType.Ask,
            globalNonce: 0,
            subsetNonce: 0,
            strategyId: STANDARD_SALE_FOR_FIXED_PRICE_STRATEGY,
            collectionType: CollectionType.ERC721,
            orderNonce: 0,
            collection: address(mockERC721),
            currency: ETH,
            signer: makerUser,
            price: price,
            itemId: itemId
        });

        // Sign but replace r by empty bytes32
        bytes32 orderHash = _computeOrderHash(makerAsk);
        (uint8 v,, bytes32 s) =
            vm.sign(makerUserPK, keccak256(abi.encodePacked("\x19\x01", _domainSeparator, orderHash)));

        bytes32 r;
        bytes memory signature = abi.encodePacked(r, s, v);

        _assertMakerOrderReturnValidationCode(makerAsk, signature, NULL_SIGNER_EOA);

        vm.expectRevert(abi.encodeWithSelector(NullSignerAddress.selector));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(_genericTakerOrder(), makerAsk, signature, _EMPTY_MERKLE_TREE);
    }

    function testRevertIfInvalidSignatureLength(uint256 itemId, uint256 price, uint256 length) public {
        // Bound length to reasonable values:
        // Use ranges that avoid valid signature lengths (64, 65)
        length = bound(length, 1, 63);
        if (length == 0) length = 66; // If we got 0, use 66 instead

        (OrderStructs.Maker memory makerAsk, OrderStructs.Taker memory takerBid) =
            _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.itemIds[0] = itemId;
        makerAsk.price = price;

        bytes memory signature = new bytes(length);
        _assertMakerOrderReturnValidationCode(makerAsk, signature, INVALID_SIGNATURE_LENGTH);

        vm.expectRevert(abi.encodeWithSelector(SignatureLengthInvalid.selector, length));
        vm.prank(takerUser);
        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, _EMPTY_MERKLE_TREE);
    }
}
