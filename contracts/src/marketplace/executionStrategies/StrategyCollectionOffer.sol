// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

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
    CollectionTypeInvalid
} from "../errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "./BaseStrategy.sol";

/**
 * @title StrategyCollectionOffer
 * @notice This contract offers execution strategies for users to create maker bid offers for items in a collection.
 *         There are two available functions:
 *         1. executeCollectionStrategyWithTakerAsk --> it applies to all itemIds in a collection
 *         2. executeCollectionStrategyWithTakerAskWithProof --> it allows adding merkle proof criteria for tokenIds.
 *         2. executeCollectionStrategyWithTakerAskWithAllowlist --> it allows adding merkle proof criteria for
 * accounts.
 * @notice The bidder can only bid on 1 item id at a time.
 *         1. If ERC721, the amount must be 1.
 *         2. If ERC1155, the amount can be greater than 1.
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract StrategyCollectionOffer is BaseStrategy {
    /**
     * @notice This function validates the order under the context of the chosen strategy and
     *         returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order without the need of merkle proofs.
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     */
    function executeCollectionStrategyWithTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        pure
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.ERC721 && makerBid.collectionType != CollectionType.ERC1155) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        // A collection order can only be executable for 1 itemId but quantity to fill can vary
        if (amounts.length != 1) {
            revert OrderInvalid();
        }

        uint256 offeredItemId = abi.decode(takerAsk.additionalParameters, (uint256));
        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order with the need of a merkle proof.
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     * @dev The transaction reverts if the maker does not include a merkle root in the additionalParameters.
     */
    function executeCollectionStrategyWithTakerAskWithProof(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        pure
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.ERC721 && makerBid.collectionType != CollectionType.ERC1155) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        // A collection order can only be executable for 1 itemId but the actual quantity to fill can vary
        if (amounts.length != 1) {
            revert OrderInvalid();
        }

        (uint256 offeredItemId, bytes32[] memory proof) =
            abi.decode(takerAsk.additionalParameters, (uint256, bytes32[]));
        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;

        bytes32 root = abi.decode(makerBid.additionalParameters, (bytes32));
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
     * @param takerAsk Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerBid Maker bid struct (maker bid-specific parameters for the execution)
     * @dev The transaction reverts if the maker does not include a merkle root in the additionalParameters.
     */
    function executeCollectionStrategyWithTakerAskWithAllowlist(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid
    )
        external
        pure
        returns (uint256 price, uint256[] memory itemIds, uint256[] calldata amounts, bool isNonceInvalidated)
    {
        if (makerBid.collectionType != CollectionType.ERC721 && makerBid.collectionType != CollectionType.ERC1155) {
            revert CollectionTypeInvalid();
        }

        price = makerBid.price;
        amounts = makerBid.amounts;

        // A collection order can only be executable for 1 itemId but the actual quantity to fill can vary
        if (amounts.length != 1) {
            revert OrderInvalid();
        }

        (uint256 offeredItemId, bytes32[] memory proof) =
            abi.decode(takerAsk.additionalParameters, (uint256, bytes32[]));
        itemIds = new uint256[](1);
        itemIds[0] = offeredItemId;
        isNonceInvalidated = true;

        bytes32 root = abi.decode(makerBid.additionalParameters, (bytes32));
        bytes32 node = keccak256(abi.encodePacked(takerAsk.recipient));

        // Verify the merkle root for the given merkle proof
        if (!MerkleProofMemory.verify(proof, root, node)) {
            revert MerkleProofInvalid();
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
        if (makerBid.collectionType != CollectionType.ERC721 && makerBid.collectionType != CollectionType.ERC1155) {
            return (isValid, CollectionTypeInvalid.selector);
        }

        if (
            functionSelector != StrategyCollectionOffer.executeCollectionStrategyWithTakerAskWithProof.selector
                && functionSelector != StrategyCollectionOffer.executeCollectionStrategyWithTakerAsk.selector
                && functionSelector != StrategyCollectionOffer.executeCollectionStrategyWithTakerAskWithAllowlist.selector
        ) {
            return (isValid, FunctionSelectorInvalid.selector);
        }

        if (makerBid.quoteType != QuoteType.Bid) {
            return (isValid, QuoteTypeInvalid.selector);
        }

        if (makerBid.amounts.length != 1) {
            return (isValid, OrderInvalid.selector);
        }

        _validateAmountNoRevert(makerBid.amounts[0], makerBid.collectionType);

        // If no root is provided or invalid length, it should be invalid.
        // @dev It does not mean the merkle root is valid against a specific itemId that exists in the collection.
        if (
            (
                functionSelector == StrategyCollectionOffer.executeCollectionStrategyWithTakerAskWithProof.selector
                    || functionSelector
                        == StrategyCollectionOffer.executeCollectionStrategyWithTakerAskWithAllowlist.selector
            ) && makerBid.additionalParameters.length != 32
        ) {
            return (isValid, OrderInvalid.selector);
        }

        isValid = true;
    }
}
