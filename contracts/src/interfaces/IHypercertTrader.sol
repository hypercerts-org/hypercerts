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
        OfferStatus status;
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
        address buyToken,
        uint256 amount,
        uint256 offerID
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
        AcceptedToken[] memory acceptedTokens
    ) external payable returns (uint256 offerID);

    function buyUnits(
        address recipient,
        uint256 offerID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable;

    function cancelOffer(uint256 offerID) external;
}
