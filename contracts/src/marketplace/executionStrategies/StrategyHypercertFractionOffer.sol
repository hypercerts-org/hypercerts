// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

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

import {IHypercert1155Token} from "../interfaces/IHypercert1155Token.sol";

/**
 * @title StrategyHypercertFractionOffer
 * @notice This contract offers a single execution strategy for users to bid on
 *         a specific amount of units in an hypercerts that's for sale.
 *         Example:
 *         Alice has 100 units of a hypercert (id: 42) for sale at a minimum price of 0.001 ETH/unit.
 *         Bob wants to buy 10 units.
 *         Bob can create a taker bid order with the following parameters:
 *         - unitAmount: 10000 // in `additionalParameters`
 *         - pricePerUnit: 10 // amount of accepted token paid; in `additionalParameters`
 *         - proof: [0xsdadfa....s9fds,0xdasdas...asff8e] // proof to the root defined in the maker ask; in
 * `additionalParameters`
 *         This strategy will validate the available units and the price.
 * @notice This contract offers execution strategies for users to create maker bid offers for items in a collection.
 *         There are three available functions:
 *         1. executeHypercertFractionStrategyWithTakerBid --> it applies to all itemIds in a collection
 *         2. executeHypercertFractionStrategyWithTakerBidWithAllowlist --> it allows adding merkle proof criteria for
 * accounts.
 * @notice The bidder can only bid on 1 item id at a time.
 *         1. If Hypercert, the amount must be 1 because the fractions are NFTs.
 * @dev Use cases can include tiered pricing; think early bird tickets.
 * @author LooksRare protocol team (👀,💎); bitbeckers;
 */
contract StrategyHypercertFractionOffer is BaseStrategy {
    /**
     * @notice This function validates the order under the context of the chosen strategy and
     *         returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a collection offer against a taker ask order without the need of merkle proofs.
     * @dev Taker bid additionalParameters uint256 unitAmount, uint256 pricePerUnit
     * @dev Maker ask additionalParameters uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep,
     * bool sellLeftover
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

        //TODO Apply to other HC strats
        if (
            makerAsk.signer != IHypercert1155Token(makerAsk.collection).ownerOf(itemIds[0])
                && !IHypercert1155Token(makerAsk.collection).isApprovedForAll(
                    IHypercert1155Token(makerAsk.collection).ownerOf(itemIds[0]), makerAsk.signer
                )
        ) {
            revert OrderInvalid();
        }

        // The amount to fill must be 1 because fractions are NFTs
        if (makerAsk.amounts[0] != 1) {
            revert AmountInvalid();
        }

        //units, pricePerUnit
        (uint256 unitAmount, uint256 pricePerUnit) = abi.decode(takerBid.additionalParameters, (uint256, uint256));

        //minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover, root
        (uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep, bool sellLeftover) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256, uint256, bool));

        // Check on prices
        if (pricePerUnit < makerAsk.price || makerAsk.price == 0) {
            revert OrderInvalid();
        }

        // Check on unitAmount except for selling leftover units
        if (minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount > maxUnitAmount) {
            revert OrderInvalid();
        }

        // Handle the case where the user wants to sell the leftover units (to prevent dusting)
        if (sellLeftover) {
            // If the unitAmount is lower than the specified minUnitAmount to sell
            if (unitAmount < minUnitAmount) {
                // We expect to sale to be executed only if the units held are equal to the minUnitsToKeep
                if (IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount != minUnitsToKeep) {
                    revert OrderInvalid();
                }
            } else {
                // Don't allow the sale to let the units held get below the minUnitsToKeep
                if ((IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep) {
                    revert OrderInvalid();
                }
            }
        } else {
            // If selling the leftover is not allowed, the unitAmount must not be smaller than the minUnitAmount
            if (unitAmount < minUnitAmount) {
                revert OrderInvalid();
            }

            // Don't allow the sale to let the units held get below the minUnitsToKeep
            if ((IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep) {
                revert OrderInvalid();
            }
        }

        // A collection order can only be executable for 1 itemId but quantity to fill can vary
        uint256[] memory amountsToFill = new uint256[](1);
        amountsToFill[0] = unitAmount;
        amounts = amountsToFill;

        price = unitAmount * pricePerUnit;
        // If the amount to fill is equal to the amount of units in the hypercert, we transfer the fraction.
        // Otherwise, we do not invalidate the nonce because it is a partial fill.
        isNonceInvalidated =
            (IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) == minUnitsToKeep;
    }

    /**
     * @notice This function validates the order under the context of the chosen strategy
     *         and returns the fulfillable items/amounts/price/nonce invalidation status.
     *         This strategy executes a fraction offer against a taker bid order with the need of a merkle proof
     *         that the address is allowed to fullfil the ask.
     * @dev Taker bid additionalParameters uint256 unitAmount, uint256 pricePerUnit, bytes32[] memory
     * proof
     * @dev Maker ask additionalParameters uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep,
     * bool sellLeftover, bytes32 root
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

        if (makerAsk.amounts[0] != 1) {
            revert AmountInvalid();
        }

        //units, pricePerUnit, proof[]
        (uint256 unitAmount, uint256 pricePerUnit, bytes32[] memory proof) =
            abi.decode(takerBid.additionalParameters, (uint256, uint256, bytes32[]));

        //minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftover, root
        (uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep, bool sellLeftover, bytes32 root) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256, uint256, bool, bytes32));

        // A collection order can only be executable for 1 itemId but quantity to fill can vary
        if (sellLeftover) {
            // Allow for selling a fraction holding units lower
            if (
                minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount > maxUnitAmount
                    || pricePerUnit < makerAsk.price || makerAsk.price == 0
                    || (IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep
            ) {
                revert OrderInvalid();
            }
        } else {
            if (
                minUnitAmount > maxUnitAmount || unitAmount == 0 || unitAmount < minUnitAmount
                    || unitAmount > maxUnitAmount || pricePerUnit < makerAsk.price || makerAsk.price == 0
                    || (IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) < minUnitsToKeep
            ) {
                revert OrderInvalid();
            }
        }

        uint256[] memory amountsToFill = new uint256[](1);
        amountsToFill[0] = unitAmount;
        amounts = amountsToFill;

        price = unitAmount * pricePerUnit;

        // If the amount to fill is equal to the amount of units in the hypercert, we transfer the fraction.
        // Otherwise, we do not invalidate the nonce because it is a partial fill.
        isNonceInvalidated =
            (IHypercert1155Token(makerAsk.collection).unitsOf(itemIds[0]) - unitAmount) == minUnitsToKeep;

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

        (uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep) =
            abi.decode(makerAsk.additionalParameters, (uint256, uint256, uint256));

        if (
            makerAsk.amounts.length != 1 || makerAsk.itemIds.length != 1 || minUnitAmount > maxUnitAmount
                || makerAsk.price == 0 || maxUnitAmount == 0
                || IHypercert1155Token(makerAsk.collection).unitsOf(makerAsk.itemIds[0]) <= minUnitsToKeep
        ) {
            return (isValid, OrderInvalid.selector);
        }

        // Because the split call is made by the marketplace which has the makers approval, we need to check whether the
        // signer is the owner of the hypercert
        // This is a side-effect of the procotol design as theres no `operator` declared in the split function
        if (
            makerAsk.signer != IHypercert1155Token(makerAsk.collection).ownerOf(makerAsk.itemIds[0])
                && !IHypercert1155Token(makerAsk.collection).isApprovedForAll(
                    IHypercert1155Token(makerAsk.collection).ownerOf(makerAsk.itemIds[0]), makerAsk.signer
                )
        ) {
            return (isValid, OrderInvalid.selector);
        }

        _validateAmountNoRevert(makerAsk.amounts[0], makerAsk.collectionType);

        // If no root is provided or invalid length, it should be invalid.
        // @dev It does not mean the merkle root is valid against a specific itemId that exists in the collection.
        // @dev 128 is the length of the bytes32 array when the merkle root is provided together with three uint256
        // params declared in the additionalParameters (minUnits, maxUnits, minUnitsToKeep, sellLeftover, root). Boolean
        // is at least 1 byte.
        if (
            functionSelector
                == StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
                && makerAsk.additionalParameters.length <= 128
        ) {
            return (isValid, OrderInvalid.selector);
        }

        // without root
        if (
            functionSelector == StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                && makerAsk.additionalParameters.length <= 96
        ) {
            return (isValid, OrderInvalid.selector);
        }

        isValid = true;
    }
}
