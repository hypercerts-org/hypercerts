// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import { HypercertTrader } from "@hypercerts/protocol/HypercertTrader.sol";
import { HypercertMinter } from "@hypercerts/protocol/HypercertMinter.sol";
import { IHypercertToken } from "@hypercerts/protocol/interfaces/IHypercertToken.sol";
import { PRBTest } from "prb-test/PRBTest.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { StdUtils } from "forge-std/StdUtils.sol";

interface IHypercertMinter {
    function ownerOf(uint256 id) external view returns (address);

    function unitsOf(uint256 id) external view returns (uint256);
}

contract HypercertTraderHelper is HypercertTrader {
    error NotAllowed();
    error InvalidOffer(string);

    address alice = address(1);
    address bob = address(2);

    HypercertMinter public hypercertMinter = new HypercertMinter();

    function getOfferCount() external view returns (uint256) {
        return _offerCounter;
    }

    function exposedValidateBuyOffer(
        address offerer,
        address hypercertContract,
        uint256 fractionID,
        uint256 units,
        uint256 minUnitsPerTrade,
        uint256 maxUnitsPerTrade,
        AcceptedToken[] memory acceptedTokens
    ) external payable {
        _validateOffer(
            offerer,
            hypercertContract,
            fractionID,
            units,
            minUnitsPerTrade,
            maxUnitsPerTrade,
            acceptedTokens
        );
    }
}

contract HypercertTraderCreateOfferTest is HypercertTraderHelper, PRBTest, StdCheats, StdUtils {
    HypercertTraderHelper internal hypercertTrader;

    function setUp() public {
        hypercertTrader = new HypercertTraderHelper();
    }

    function testCreateOfferWithAllowance() public {
        // Setup
        vm.startPrank(alice);
        hypercertMinter.mintClaim(alice, 10000, "ipfs://test", IHypercertToken.TransferRestrictions.FromCreatorOnly);

        uint256 baseID = 1 << 128;
        uint256 tokenIndex = 1;
        uint256 tokenID = baseID + tokenIndex;

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);

        // Reverts when Trader contract is not approved
        vm.expectRevert(NotAllowed.selector);
        hypercertTrader.createOffer(address(hypercertMinter), tokenID, 1, 1, 1, acceptedTokens);

        // Set approval
        hypercertMinter.setApprovalForAll(address(hypercertTrader), true);

        // Alice creates an offer
        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), tokenID, 0);
        uint256 offerID = hypercertTrader.createOffer(address(hypercertMinter), tokenID, 1, 1, 1, acceptedTokens);

        assertEq(hypercertTrader.getOfferCount(), 1);
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertMinter), tokenID), 1);

        // Offer is created
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(offer.fractionID, tokenID);
        assertEq(offer.unitsAvailable, 1);
        assertEq(offer.minUnitsPerTrade, 1);
        assertEq(offer.maxUnitsPerTrade, 1);
        assertEq(offer.acceptedTokens.length, 1);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));
    }

    function testCannotCreateOfferForNonExistentToken() public {
        hypercertMinter.setApprovalForAll(address(hypercertTrader), true);

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Not owner"));
        hypercertTrader.createOffer(address(hypercertMinter), 1, 1, 1, 1, acceptedTokens);
    }

    function testCanCancelOffer() public {
        // Setup
        vm.startPrank(alice);
        hypercertMinter.mintClaim(alice, 10000, "ipfs://test", IHypercertToken.TransferRestrictions.FromCreatorOnly);

        uint256 baseID = 1 << 128;
        uint256 tokenIndex = 1;
        uint256 tokenID = baseID + tokenIndex;

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);

        hypercertMinter.setApprovalForAll(address(hypercertTrader), true);

        // Alice creates an offer
        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), tokenID, 0);
        uint256 offerID = hypercertTrader.createOffer(address(hypercertMinter), tokenID, 1, 1, 1, acceptedTokens);

        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(offer.fractionID, tokenID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertMinter), tokenID), 1);

        // Bob tries to cancel the offer and is rejected
        changePrank(bob);
        vm.expectRevert(NotAllowed.selector);
        hypercertTrader.cancelOffer(offerID);

        // Alice cancels the offer
        changePrank(alice);
        vm.expectEmit(true, true, true, true);
        emit OfferCancelled(alice, address(hypercertMinter), tokenID, 0);
        hypercertTrader.cancelOffer(offerID);

        // The offer is cancelled
        Offer memory updatedOffer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(updatedOffer.status), uint256(OfferStatus.Cancelled));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertMinter), tokenID), 0);
    }

    function testOfferValidations() public {
        vm.mockCall(
            address(hypercertMinter),
            abi.encodeWithSelector(IHypercertMinter.ownerOf.selector, 42),
            abi.encode(alice)
        );
        vm.mockCall(
            address(hypercertMinter),
            abi.encodeWithSelector(IHypercertMinter.unitsOf.selector, 42),
            abi.encode(10)
        );
        AcceptedToken[] memory acceptedToken = new AcceptedToken[](1);
        acceptedToken[0] = AcceptedToken(address(0), 1);

        // Fail on 0 units
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Insufficient units"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 0, 1, 1, acceptedToken);

        // Fail on more units than in the fraction
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Insufficient units"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 11, 1, 1, acceptedToken);

        // Fail on higher than max units
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Min/Max units"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 1, 999, acceptedToken);

        // Fail on lower than min units
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Min/Max units"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 999, 1, acceptedToken);

        // Fail when min-max are equal but the units are not divisible by the min-max value
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Units indivisible by fractions"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 7, 2, 2, acceptedToken);

        // Fail when there's no accepted token
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "No accepted tokens"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 1, 1, new AcceptedToken[](0));

        // Fail when the accepted token has a minimum amount per unit of 0
        AcceptedToken[] memory invalidAcceptedToken = new AcceptedToken[](1);
        invalidAcceptedToken[0] = AcceptedToken(address(0), 0);
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "No accepted tokens"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 1, 1, invalidAcceptedToken);

        // Fail when accepted token that's not the native token
        AcceptedToken[] memory nonNativeAcceptedToken = new AcceptedToken[](1);
        nonNativeAcceptedToken[0] = AcceptedToken(address(1), 1);
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Only zero token"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 1, 1, nonNativeAcceptedToken);

        // Fail on insufficient units in fraction
        vm.mockCall(
            address(hypercertMinter),
            abi.encodeWithSelector(IHypercertMinter.unitsOf.selector, 42),
            abi.encode(1)
        );
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Insufficient units"));
        hypercertTrader.exposedValidateBuyOffer(alice, address(hypercertMinter), 42, 2, 1, 1, new AcceptedToken[](0));
    }
}
