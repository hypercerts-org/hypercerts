// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/// @title Interface for hypercert token trading
/// @author bitbeckers
/// @notice This interface declares the required functionality to interact with the hypercert marketplace
interface IHypercertTrader {
    /**
     * @dev Struct for an offer to sell Hypercert tokens.
     */
    struct Offer {
        address offerer;
        address hypercertContract;
        uint256 fractionID;
        uint256 unitsAvailable;
        uint256 minUnitsPerTrade;
        uint256 maxUnitsPerTrade;
        OfferType offerType;
        OfferStatus status;
        AcceptedToken[] acceptedTokens;
    }

    /**
     * @dev Enum for the type of offer (Units or Fraction).
     */
    enum OfferType {
        Units,
        Fraction
    }

    /**
     * @dev Enum for the status of an offer (Open, Fulfilled, or Cancelled).
     */
    enum OfferStatus {
        Open,
        Fulfilled,
        Cancelled
    }

    /**
     * @dev Struct for a token that is accepted for payment.
     */
    struct AcceptedToken {
        address token;
        uint256 minimumAmountPerUnit;
    }

    event OfferCreated(
        address indexed offerer,
        address indexed hypercertContract,
        uint256 indexed fractionID,
        uint256 offerID
    );

    event Trade(
        address indexed seller,
        address indexed buyer,
        address indexed hypercertContract,
        uint256 fractionID,
        uint256 unitsBought,
        address buyToken,
        uint256 tokenAmountPerUnit,
        uint256 offerID
    );

    event OfferCancelled(
        address indexed creator,
        address indexed hypercertContract,
        uint256 indexed fractionID,
        uint256 offerID
    );

    /**
     * @dev Creates a new offer to sell Hypercert tokens.
     * @param hypercertContract The address of the Hypercert token contract.
     * @param fractionID The ID of the fraction to sell.
     * @param units The number of units available for sale.
     * @param minUnitsPerTrade The minimum number of units that can be bought in a single trade.
     * @param maxUnitsPerTrade The maximum number of units that can be bought in a single trade.
     * @param acceptedTokens The list of tokens that are accepted for payment.
     */
    function createOffer(
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) external payable returns (uint256 offerID);

    /**
     * @dev Buys Hypercert tokens from an existing offer.
     * @param recipient The address that will receive the Hypercert tokens.
     * @param offerID The ID of the offer to buy from.
     * @param unitAmount The number of units to buy.
     * @param buyToken The address of the token used for payment.
     * @param tokenAmountPerUnit The amount of tokens to pay per unit.
     */
    function buyUnits(
        address recipient,
        uint256 offerID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable;

    /**
     * @dev Buys Hypercert tokens from multiple existing offers in a single transaction.
     * @param recipient The address that will receive the Hypercert tokens.
     * @param offerIDs The list of IDs of the offers to buy from.
     * @param unitAmounts The list of numbers of units to buy for each offer.
     * @param buyTokens The list of addresses of the tokens used for payment for each offer.
     * @param tokenAmountsPerUnit The list of amounts of tokens to pay per unit for each offer.
     */
    function batchBuyUnits(
        address recipient,
        uint256[] calldata offerIDs,
        uint256[] calldata unitAmounts,
        address[] calldata buyTokens,
        uint256[] calldata tokenAmountsPerUnit
    ) external payable;

    /**
     * @dev Cancels an existing offer.
     * @param offerID The ID of the offer to cancel.
     */
    function cancelOffer(uint256 offerID) external;
}
