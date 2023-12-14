// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interface
import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

// OpenZeppelin's library for verifying Merkle proofs
import {MerkleProofMemory} from "../libraries/OpenZeppelin/MerkleProofMemory.sol";

// Enums
import {QuoteType} from "../enums/QuoteType.sol";

// Shared errors
import {
    AmountInvalid,
    LengthsInvalid,
    OrderInvalid,
    FunctionSelectorInvalid,
    MerkleProofInvalid,
    QuoteTypeInvalid
} from "../errors/SharedErrors.sol";

// Base strategy contracts
import {BaseStrategy, IStrategy} from "./BaseStrategy.sol";

/**
 * @title StrategyHypercertFractionOffer
 * @notice This contract offers a single execution strategy for users to bid on
 *         a specific amount of units in an hypercerts that's for sale.
 *         Example:
 *         Alice has 100 units of a hypercert (id: 42) for sale at a minimum price of 0.001 ETH/unit.
 *         Bob wants to buy 10 units.
 *         Bob can create a taker bid order with the following parameters:
 *         - unitAmount: 10000 // Total amount for sale; in `amounts` array
 *         - minUnitAmount: 100 // Minimum amount to buy; in `additionalParameters`
 *         - maxUnitAmount: 1000 // Maximum amount to buy; in `additionalParameters`
 *         - acceptedTokenAmount: 1000000000000000 (0.001 ETH in wei)
 *         - acceptedTokenAddress: 0x0000000000000000000000000000000000000000
 *         - proof: [0xsdadfa....s9fds,0xdasdas...asff8e]
 *         This strategy will validate the available units and the price.
 * @notice This contract offers execution strategies for users to create maker bid offers for items in a collection.
 *         There are three available functions:
 *         1. executeCollectionStrategyWithTakerAsk --> it applies to all itemIds in a collection
 *         2. executeCollectionStrategyWithTakerAskWithAllowlist --> it allows adding merkle proof criteria for
 * accounts.
 * @notice The bidder can only bid on 1 item id at a time.
 *         1. If ERC721, the amount must be 1.
 *         2. If ERC1155, the amount can be greater than 1.
 *         3. If Hypercert, the amount can be greater than 1 because they represent units held by the hypercert.
 * @dev Use cases can include tiered pricing; think early bird tickets.
 * @author LooksRare protocol team (👀,💎); bitbeckers;
 */
contract StrategyHypercertFractionOffer is BaseStrategy {
    /**
     * @notice This function validates the order under the context of the chosen strategy and
     *         returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order without the need of merkle proofs.
     * @param takerBid Taker ask struct (taker ask-specific parameters for the execution)
     * @param makerAsk Maker bid struct (maker bid-specific parameters for the execution)
     */
    function executeHypercertFractionStrategyWithTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk
    )
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        itemIds = makerAsk.itemIds;

        // A collection order can only be executable for 1 itemId but the actual quantity to fill can vary
        if (makerAsk.amounts.length != 1 || itemIds.length != 1) {
            revert LengthsInvalid();
        }

        if (makerAsk.amounts[0] == 0) {
            revert AmountInvalid();
        }

        //units, pricePerUnit
        (uint256 unitAmount, uint256 pricePerUnit) = abi.decode(takerBid.additionalParameters, (uint256, uint256));

        //minUnitAmount, maxUnitAmount, root
        (uint256 minUnitAmount, uint256 maxUnitAmount) = abi.decode(makerAsk.additionalParameters, (uint256, uint256));

        // A collection order can only be executable for 1 itemId but quantity to fill can vary
        if (
            minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount < minUnitAmount || unitAmount > maxUnitAmount
                || pricePerUnit < makerAsk.price || makerAsk.price == 0
                || IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) < unitAmount
        ) {
            revert OrderInvalid();
        }

        uint256[] memory amountsToFill = new uint256[](1);
        amountsToFill[0] = unitAmount;
        amounts = amountsToFill;

        price = unitAmount * pricePerUnit;
        // If the amount to fill is equal to the amount of units in the hypercert, we transfer the fraction.
        // Otherwise, we do not invalidate the nonce because it is a partial fill.
        isNonceInvalidated = IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) == unitAmount;
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a fraction offer against a taker bid order with the need of a merkle proof
     *         that the address is allowed to fullfil the ask.
     * @param takerBid Taker bid struct (taker bid-specific parameters for the execution)
     * @param makerAsk Maker ask struct (maker ask-specific parameters for the execution)
     * @dev The transaction reverts if the maker does not include a merkle root in the additionalParameters.
     */
    function executeHypercertFractionStrategyWithTakerBidWithAllowlist(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk
    )
        external
        view
        returns (uint256 price, uint256[] memory itemIds, uint256[] memory amounts, bool isNonceInvalidated)
    {
        itemIds = makerAsk.itemIds;

        // A collection order can only be executable for 1 itemId but the actual quantity to fill can vary
        if (makerAsk.amounts.length != 1 || itemIds.length != 1) {
            revert LengthsInvalid();
        }

        if (makerAsk.amounts[0] == 0) {
            revert AmountInvalid();
        }

        //units, pricePerUnit, proof[]
        (uint256 unitAmount, uint256 pricePerUnit, bytes32[] memory proof) =
            abi.decode(takerBid.additionalParameters, (uint256, uint256, bytes32[]));

        //minUnitAmount, maxUnitAmount, root
        (uint256 minUnitAmount, uint256 maxUnitAmount, bytes32 root) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256, bytes32));

        // A collection order can only be executable for 1 itemId but quantity to fill can vary
        if (
            minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount < minUnitAmount || unitAmount > maxUnitAmount
                || pricePerUnit < makerAsk.price || makerAsk.price == 0
                || IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) < unitAmount
        ) {
            revert OrderInvalid();
        }

        uint256[] memory amountsToFill = new uint256[](1);
        amountsToFill[0] = unitAmount;
        amounts = amountsToFill;

        price = unitAmount * pricePerUnit;

        // If the amount to fill is equal to the amount of units in the hypercert, we transfer the fraction.
        // Otherwise, we do not invalidate the nonce because it is a partial fill.
        isNonceInvalidated = IHypercertToken(makerAsk.collection).unitsOf(itemIds[0]) == unitAmount;

        bytes32 node = keccak256(abi.encodePacked(takerBid.recipient));

        // Verify the merkle root for the given merkle proof
        if (!MerkleProofMemory.verify(proof, root, node)) {
            revert MerkleProofInvalid();
        }
    }

    /**
     * @inheritdoc IStrategy
     */
    function isMakerOrderValid(OrderStructs.Maker calldata makerAsk, bytes4 functionSelector)
        external
        view
        override
        returns (bool isValid, bytes4 errorSelector)
    {
        if (
            functionSelector != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                && functionSelector
                    != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
        ) {
            return (isValid, FunctionSelectorInvalid.selector);
        }

        if (makerAsk.quoteType != QuoteType.Ask) {
            return (isValid, QuoteTypeInvalid.selector);
        }

        (uint256 minUnitAmount, uint256 maxUnitAmount) = abi.decode(makerAsk.additionalParameters, (uint256, uint256));

        if (
            makerAsk.amounts.length != 1 || makerAsk.amounts[0] == 0
                || IHypercertToken(makerAsk.collection).unitsOf(makerAsk.itemIds[0]) < makerAsk.amounts[0]
                || makerAsk.itemIds.length != 1 || minUnitAmount > maxUnitAmount || makerAsk.price == 0
                || maxUnitAmount == 0
        ) {
            return (isValid, OrderInvalid.selector);
        }

        // If no root is provided or invalid length, it should be invalid.
        // @dev It does not mean the merkle root is valid against a specific itemId that exists in the collection.
        // @dev 96 is the length of the bytes32 array when the merkle root is provided together with two uint256 params
        // declared in the additionalParameters.
        if (
            functionSelector
                == StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
                && makerAsk.additionalParameters.length != 96
        ) {
            return (isValid, OrderInvalid.selector);
        }

        isValid = true;
    }
}
