/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Dependencies
import {BatchOrderTypehashRegistry} from "@hypercerts/marketplace/BatchOrderTypehashRegistry.sol";

// Libraries
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Other tests
import {TestHelpers} from "./TestHelpers.sol";
import {TestParameters} from "./TestParameters.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract ProtocolHelpers is TestHelpers, TestParameters {
    using OrderStructs for OrderStructs.Maker;

    bytes32 internal _domainSeparator;

    receive() external payable {}

    function _createSingleItemMakerOrder(
        QuoteType quoteType,
        uint256 globalNonce,
        uint256 subsetNonce,
        uint256 strategyId,
        CollectionType collectionType,
        uint256 orderNonce,
        address collection,
        address currency,
        address signer,
        uint256 price,
        uint256 itemId
    ) internal view returns (OrderStructs.Maker memory makerOrder) {
        uint256[] memory itemIds = new uint256[](1);
        itemIds[0] = itemId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;

        makerOrder = OrderStructs.Maker({
            quoteType: quoteType,
            globalNonce: globalNonce,
            subsetNonce: subsetNonce,
            orderNonce: orderNonce,
            strategyId: strategyId,
            collectionType: collectionType,
            collection: collection,
            currency: currency,
            signer: signer,
            startTime: block.timestamp,
            endTime: block.timestamp + 1,
            price: price,
            itemIds: itemIds,
            amounts: amounts,
            additionalParameters: abi.encode()
        });
    }

    function _createMultiItemMakerOrder(
        QuoteType quoteType,
        uint256 globalNonce,
        uint256 subsetNonce,
        uint256 strategyId,
        CollectionType collectionType,
        uint256 orderNonce,
        address collection,
        address currency,
        address signer,
        uint256 price,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) internal view returns (OrderStructs.Maker memory newMakerBid) {
        newMakerBid = OrderStructs.Maker({
            quoteType: quoteType,
            globalNonce: globalNonce,
            subsetNonce: subsetNonce,
            orderNonce: orderNonce,
            strategyId: strategyId,
            collectionType: collectionType,
            collection: collection,
            currency: currency,
            signer: signer,
            startTime: block.timestamp,
            endTime: block.timestamp + 1,
            price: price,
            itemIds: itemIds,
            amounts: amounts,
            additionalParameters: abi.encode()
        });
    }

    function _signMakerOrder(OrderStructs.Maker memory maker, uint256 signerKey) internal view returns (bytes memory) {
        bytes32 orderHash = _computeOrderHash(maker);

        (uint8 v, bytes32 r, bytes32 s) =
            vm.sign(signerKey, keccak256(abi.encodePacked("\x19\x01", _domainSeparator, orderHash)));

        return abi.encodePacked(r, s, v);
    }

    function _signTakerDataCollectionStrategy(
        OrderStructs.Maker memory maker,
        uint256 offeredItemId,
        bytes32[] memory proof,
        uint256 signerKey
    ) internal view returns (bytes memory) {
        bytes32 orderHash = _computeOrderHash(maker);
        bytes32 dataHash = keccak256(abi.encodePacked(orderHash, offeredItemId, proof));

        (uint8 v, bytes32 r, bytes32 s) =
            vm.sign(signerKey, keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash)));

        return abi.encodePacked(r, s, v);
    }

    function _computeOrderHash(OrderStructs.Maker memory maker) internal pure returns (bytes32) {
        return maker.hash();
    }
}
