// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/// @title Interface for hypercert token trading
/// @author bitbeckers
/// @notice This interface declares the required functionality to interact with the hypercert marketplace
interface IHypercertTrader {
    event Trade(
        address indexed seller,
        address indexed buyer,
        address indexed hypercertContract,
        uint256 claimID,
        address buyToken,
        uint256 amount,
        uint256 offerID
    );
    event OfferCreated(
        address indexed creator,
        address indexed hypercertContract,
        uint256 indexed claimID,
        address buyToken,
        uint256 minimumAmount,
        uint256 offerID
    );
    event OfferCancelled(address indexed creator, address indexed hypercertContract, uint256 indexed claimID);

    /// UNITS; e.g. 100 of 10000 units of a claim
    function offerUnits(
        address hypercertContract,
        uint256 claimID,
        uint256 unitAmount,
        address buyToken,
        uint256 minimumAmountPerUnit
    ) external payable;

    function buyUnits(
        address hypercertContract,
        uint256 claimID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable;

    /// FRACTIONS; e.g. 1/5th of a claim
    function offerFraction(
        address hypercertContract,
        uint256 claimID,
        uint256 unitsInFraction,
        uint256 fractionCount,
        address buyToken,
        uint256 minimumAmount
    ) external payable;

    function buyFraction(
        address hypercertContract,
        uint256 claimID,
        uint256 fractionCount,
        address buyToken,
        uint256 tokenAmount
    ) external payable;

    function cancelOffer(uint256 offerID) external;
}
