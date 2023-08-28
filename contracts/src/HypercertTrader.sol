// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { IHypercertTrader } from "./interfaces/IHypercertTrader.sol";
import { IHypercertToken } from "./interfaces/IHypercertToken.sol";
import { PausableUpgradeable } from "oz-upgradeable/security/PausableUpgradeable.sol";
import { IERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

import { Errors } from "./libs/Errors.sol";

error NotAllowed();
error InvalidOffer();

/// @title Contract for managing hypercert trades
/// @author bitbeckers
/// @notice Implementation of the HypercertTrader Interface
contract HypercertTrader is IHypercertTrader, PausableUpgradeable {
    mapping(uint256 => Offer) public offers;
    uint256 _offerCounter;

    function createOffer(
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedTokens[] memory acceptedTokens
    ) external payable returns (uint256 offerID) {
        if (!IERC1155Upgradeable(hypercertContract).isApprovedForAll(msg.sender, address(this))) revert NotAllowed();
        _validateOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            units,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );
        offerID = _createOffer(
            msg.sender,
            hypercertContract,
            fractionID,
            units,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        emit OfferCreated(msg.sender, hypercertContract, fractionID, offerID);
    }

    function buyUnits(
        address hypercertContract,
        uint256 fractionID,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable returns (uint256 fractionID) {
        Offer storage offer = offers[offerID];
        if (offer.status != OfferStatus.Open) revert InvalidOffer();
        if (offer.offerType != OfferType.Units) revert InvalidOffer();
        if (offer.unitsAvailable < unitAmount) revert InvalidOffer();
        if (offer.minUnitsPerTrade > unitAmount || offer.maxUnitsPerTrade < unitAmount) revert InvalidOffer();

        offer.unitsAvailable -= unitAmount;

        if (offer.unitsAvailable == 0) {
            offer.status = OfferStatus.Fulfilled;
        }

        // TODO split and transfer or full transfer
        IERC1155Upgradeable(hypercertContract).safeTransferFrom(
            offer.offerer,
            msg.sender,
            offer.fractionID,
            unitAmount,
            ""
        );

        emit Trade(
            offer.offerer,
            msg.sender,
            hypercertContract,
            offer.fractionID,
            buyToken,
            tokenAmountPerUnit,
            offerID
        );
    }

    function cancelOffer(uint256 offerID) external {
        Offer storage offer = offers[offerID];
        if (offer.offerer != msg.sender) revert NotAllowed();
        if (offer.status != OfferStatus.Open) revert InvalidOffer();

        offer.status = OfferStatus.Cancelled;
        emit OfferCancelled(msg.sender, offer.hypercertContract, offer.fractionID, offerID);
    }

    /// INTERNAL

    function _createOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 unitsAvailable,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] acceptedTokens
    ) internal returns (uint256 offerID) {
        Offer _offer = new Offer(
            offerer,
            hypercertContract,
            fractionID,
            unitsAvailable,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );

        if (minUnitsPerTrade == maxUnitsPerTrade) {
            _offer.offerType = OfferType.Fraction;
        }

        offerID = _offerCounter;
        offers[offerID] = _offer;
        _offerCounter++;
    }

    function _validateOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        address buyToken,
        uint256 minimumAmountPerUnit
    ) internal view {
        if (IERC1155Upgradeable(hypercertContract).ownerOf(fractionID) != offerer) revert InvalidOffer();

        // Validate units exist and are available
        if (units == 0 || IERC1155Upgradeable(hypercertContract).unitsOf(fractionID) <= units) revert InvalidOffer();

        // for now only accept the native token, ZERO_ADDRESS
        if (buyToken != address(0) || minimumAmountPerUnit == 0) revert InvalidOffer();

        // Validate min/max units per trade
        if (maxUnitsPerTrade > units || minUnitsPerTrade > maxUnitsPerTrade) revert InvalidOffer();

        // If sale is for a fraction, the units must be a multiple of the minimum units per trade
        if (minUnitsPerTrade == maxUnitsPerTrade && units % minUnitsPerTrade != 0) revert InvalidOffer();
    }
}
