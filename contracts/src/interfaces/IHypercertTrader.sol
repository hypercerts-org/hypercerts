// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/// @title Interface for hypercert token trading
/// @author bitbeckers
/// @notice This interface declares the required functionality to interact with the hypercert marketplace
interface IHypercertTrader {
    /// @dev The Offer struct represents a single offer on the marketplace
    struct Offer {
        address offerer;
        address hypercertContract;
        uint256 fractionID;
        uint256 unitsAvailable;
        uint256 minUnitsPerTrade;
        uint256 maxUnitsPerTrade;
        OfferType offerType;
        AcceptedToken[] acceptedTokens;
    }

    enum OfferType {
        Units,
        Fraction
    }

    enum OfferStatus {
        Open,
        Fulfilled,
        Cancelled
    }

    struct AcceptedToken {
        address token;
        uint256 minimumAmountPerUnit;
    }

    event Trade(
        address indexed seller,
        address indexed buyer,
        address indexed hypercertContract,
        uint256 fractionID,
        address buyToken,
        uint256 amount,
        uint256 offerID
    );
    event OfferCreated(
        address indexed offerer,
        address indexed hypercertContract,
        uint256 indexed offerID,
        address buyToken,
        uint256 minimumAmountPerUnit
    );
    event OfferCancelled(
        address indexed creator,
        address indexed hypercertContract,
        uint256 indexed fractionID,
        uint256 offerID
    );

    /// UNITS; e.g. 100 of 10000 units of a claim
    function createOffer(
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        address buyToken,
        uint256 minAmountPerUnit
    ) external payable;

    function fulfillOffer(
        uint256 offerID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable;

    /// FRACTIONS; e.g. 1/5th of a claim
    function offerFraction(
        address hypercertContract,
        uint256 fractionID,
        uint256 unitsInFraction,
        uint256 fractionCount,
        address buyToken,
        uint256 minimumAmount
    ) external payable;

    function buyFraction(
        address hypercertContract,
        uint256 fractionID,
        uint256 fractionCount,
        address buyToken,
        uint256 tokenAmount
    ) external payable;

    function cancelOffer(uint256 offerID) external;
}
