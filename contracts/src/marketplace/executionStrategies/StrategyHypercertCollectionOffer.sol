// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interface
import {IHypercert1155Token} from "../interfaces/IHypercert1155Token.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// OpenZeppelin's library for verifying Merkle proofs
import {MerkleProofMemory} from "../libraries/OpenZeppelin/MerkleProofMemory.sol";

// Enums
import {QuoteType} from "../enums/QuoteType.sol";
import {CollectionType} from "../enums/CollectionType.sol";

// Shared errors
import {
    OrderInvalid,
    FunctionSelectorInvalid,
    MerkleProofInvalid,
    QuoteTypeInvalid,
    CollectionTypeInvalid,
    AmountInvalid
} from "../errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "./BaseStrategy.sol";

/**
 * @title StrategyHypercertCollectionOffer
 * @notice This contract offers execution strategies for users to create maker bid offers for items in a collection.
 *         There are two available functions:
 *         1. executeCollectionStrategyWithTakerAsk --> it applies to all itemIds in a collection
 *         2. executeCollectionStrategyWithTakerAskWithProof --> it allows adding merkle proof criteria for tokenIds.
 *         2. executeCollectionStrategyWithTakerAskWithAllowlist --> it allows adding merkle proof criteria for
 * accounts.
 * @notice The bidder can only bid on 1 item id at a time.
 *         1. The amount must be 1.
 *         2. The units held at bid creation and ask execution time must be the same.
 *         3. The units held by the item sold must be the same as the units held by the item bid.
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract StrategyHypercertCollectionOffer is BaseStrategy {
    using OrderStructs for OrderStructs.Maker;
    /**
     * @notice This function validates the order under the context of the chosen strategy and
     *         returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order without the need of merkle proofs.
     * @dev Taker ask additionalParameters: uint256 offeredItemId, uint256 itemUnitsTaker
     * @dev Maker bid additionalParameters: uint256 itemUnitsMaker
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     */

    function executeHypercertCollectionStrategyWithTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.Hypercert) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        (uint256 offeredItemId, uint256 itemUnitsTaker) = abi.decode(takerAsk.additionalParameters, (uint256, uint256));
        (uint256 itemUnitsMaker) = abi.decode(makerBid.additionalParameters, (uint256));

        // A collection order can only be executable for 1 fraction
        if (
            amounts.length != 1 || amounts[0] != 1 || itemUnitsTaker != itemUnitsMaker
                || IHypercert1155Token(makerBid.collection).unitsOf(offeredItemId) != itemUnitsMaker
        ) {
            revert OrderInvalid();
        }

        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order with the need of a merkle proof.
     * @dev Taker ask additionalParameters: uint256 offeredItemId, uint256 itemUnitsTaker, bytes32[] proof
     * @dev Maker bid additionalParameters: uint256 itemUnitsMaker, bytes32 root
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     * @dev The transaction reverts if the maker does not include a merkle root in the additionalParameters.
     */
    function executeHypercertCollectionStrategyWithTakerAskWithProof(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.Hypercert) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        (uint256 offeredItemId, uint256 itemUnitsTaker, bytes32[] memory proof) =
            abi.decode(takerAsk.additionalParameters, (uint256, uint256, bytes32[]));

        (uint256 itemUnitsMaker, bytes32 root) = abi.decode(makerBid.additionalParameters, (uint256, bytes32));

        // A collection order can only be executable for 1 fraction
        if (
            amounts.length != 1 || amounts[0] != 1 || itemUnitsTaker != itemUnitsMaker
                || IHypercert1155Token(makerBid.collection).unitsOf(offeredItemId) != itemUnitsMaker
        ) {
            revert OrderInvalid();
        }

        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;

        bytes32 node = keccak256(abi.encodePacked(offeredItemId));

        // Verify the merkle root for the given merkle proof
        if (!MerkleProofMemory.verify(proof, root, node)) {
            revert MerkleProofInvalid();
        }
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order with the need of a merkle proof
     *         that the address is allowed to fullfil the ask.
     * @dev Taker ask additionalParameters: uint256 offeredItemId, uint256 itemUnitsTaker, bytes32[] proof, bytes
     * signature
     * @dev Maker bid additionalParameters: uint256 itemUnitsMaker, bytes32 root
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     * @dev The transaction reverts if the maker does not include a merkle root in the additionalParameters.
     */
    function executeHypercertCollectionStrategyWithTakerAskWithAllowlist(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.Hypercert) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        (uint256 offeredItemId, uint256 itemUnitsTaker, bytes32[] memory proof, bytes memory signature) =
            abi.decode(takerAsk.additionalParameters, (uint256, uint256, bytes32[], bytes));

        (uint256 itemUnitsMaker, bytes32 root) = abi.decode(makerBid.additionalParameters, (uint256, bytes32));

        validateAmountsAndUnits(makerBid.collection, offeredItemId, amounts, itemUnitsTaker, itemUnitsMaker);

        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;
        address recipient = takerAsk.recipient;

        // Verify the merkle root for the given merkle proof
        if (!MerkleProofMemory.verify(proof, root, keccak256(abi.encodePacked(recipient)))) {
            revert MerkleProofInvalid();
        }

        if (!verifyTakerSignature(makerBid.hash(), offeredItemId, proof, signature, recipient)) {
            revert OrderInvalid();
        }
    }

    function validateAmountsAndUnits(
        address collection,
        uint256 offeredItemId,
        uint256[] memory amounts,
        uint256 itemUnitsTaker,
        uint256 itemUnitsMaker
    ) internal view {
        // A collection order can only be executable for 1 fraction
        if (
            amounts.length != 1 || amounts[0] != 1 || itemUnitsTaker != itemUnitsMaker
                || IHypercert1155Token(collection).unitsOf(offeredItemId) != itemUnitsMaker
        ) {
            revert OrderInvalid();
        }
    }

    /**
     * @inheritdoc IStrategy
     */
    function isMakerOrderValid(OrderStructs.Maker calldata makerBid, bytes4 functionSelector)
        external
        pure
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        if (makerBid.collectionType != CollectionType.Hypercert) {
            return (isValid, CollectionTypeInvalid.selector);
        }

        if (
            functionSelector != StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAsk.selector
                && functionSelector
                    != StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithProof.selector
                && functionSelector
                    != StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithAllowlist.selector
        ) {
            return (isValid, FunctionSelectorInvalid.selector);
        }

        if (makerBid.quoteType != QuoteType.Bid) {
            return (isValid, QuoteTypeInvalid.selector);
        }

        // Check if amounts is length 1 with value 1 and additionalParameters is length 32 to check on expected units
        // received
        if (makerBid.amounts.length != 1) {
            return (isValid, OrderInvalid.selector);
        }

        _validateAmountNoRevert(makerBid.amounts[0], makerBid.collectionType);

        // If no root is provided or invalid length, it should be invalid.
        // @dev It does not mean the merkle root is valid against a specific itemId that exists in the collection.
        // @dev 64 is the length of the bytes32 array when the merkle root is provided together with 1 uint256
        // param declared in the additionalParameters (unitsInItem, root).
        if (
            (
                functionSelector
                    == StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithProof.selector
                    || functionSelector
                        == StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAskWithAllowlist.selector
            ) && makerBid.additionalParameters.length != 64
        ) {
            return (isValid, OrderInvalid.selector);
        }

        // Without root
        if (
            functionSelector == StrategyHypercertCollectionOffer.executeHypercertCollectionStrategyWithTakerAsk.selector
                && makerBid.additionalParameters.length != 32
        ) {
            return (isValid, OrderInvalid.selector);
        }

        isValid = true;
    }

    // Function to verify the taker's signature
    function verifyTakerSignature(
        bytes32 orderHash,
        uint256 offeredItemId,
        bytes32[] memory proof,
        bytes memory signature,
        address expectedSigner
    ) internal pure returns (bool) {
        bytes32 messageHash = getMessageHash(orderHash, offeredItemId, proof);

        return recoverSigner(messageHash, signature) == expectedSigner;
    }

    // Internal function to recreate the message hash
    function getMessageHash(bytes32 orderHash, uint256 offeredItemId, bytes32[] memory proof)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(orderHash, offeredItemId, proof));
    }

    // Internal function to recover the signer from the signature
    function recoverSigner(bytes32 messageHash, bytes memory signature) private pure returns (address) {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Helper function to split the signature into r, s, and v
    function splitSignature(bytes memory sig) private pure returns (bytes32 r, bytes32 s, uint8 v) {
        if (sig.length != 65) {
            revert OrderInvalid();
        }

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
