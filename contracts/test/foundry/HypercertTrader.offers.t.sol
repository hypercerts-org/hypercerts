// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import { HypercertTrader } from "../../src/HypercertTrader.sol";
import { HypercertMinter } from "../../src/HypercertMinter.sol";
import { IHypercertToken } from "../../src/interfaces/IHypercertToken.sol";
import { PRBTest } from "prb-test/PRBTest.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { StdUtils } from "forge-std/StdUtils.sol";

contract HypercertTraderHelper is HypercertTrader {
    error NotAllowed();
    error InvalidOffer();

    address alice = address(1);
    address bob = address(2);

    HypercertMinter public hypercertMinter = new HypercertMinter();

    function getOffer(uint256 key) external view returns (Offer memory) {
        return offers[key];
    }

    function getOfferCount() external view returns (uint256) {
        return _offerCounter;
    }
}

contract HypercertTraderCreateOfferTest is HypercertTraderHelper, PRBTest, StdCheats, StdUtils {
    HypercertTraderHelper internal hypercertTrader;

    function setUp() public {
        hypercertTrader = new HypercertTraderHelper();
    }

    function testCreateOfferWithAllowance() public {
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

        hypercertMinter.setApprovalForAll(address(hypercertTrader), true);

        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), tokenID, 0);
        uint256 offerID = hypercertTrader.createOffer(address(hypercertMinter), tokenID, 1, 1, 1, acceptedTokens);

        assertEq(hypercertTrader.getOfferCount(), 1);

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
        vm.expectRevert(InvalidOffer.selector);
        hypercertTrader.createOffer(address(hypercertMinter), 1, 1, 1, 1, acceptedTokens);
    }

    function testCanCancelOffer() public {
        vm.startPrank(alice);
        hypercertMinter.mintClaim(alice, 10000, "ipfs://test", IHypercertToken.TransferRestrictions.FromCreatorOnly);

        uint256 baseID = 1 << 128;
        uint256 tokenIndex = 1;
        uint256 tokenID = baseID + tokenIndex;

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);

        hypercertMinter.setApprovalForAll(address(hypercertTrader), true);

        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), tokenID, 0);
        uint256 offerID = hypercertTrader.createOffer(address(hypercertMinter), tokenID, 1, 1, 1, acceptedTokens);

        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(offer.fractionID, tokenID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));

        changePrank(bob);
        vm.expectRevert(NotAllowed.selector);
        hypercertTrader.cancelOffer(offerID);

        changePrank(alice);
        vm.expectEmit(true, true, true, true);
        emit OfferCancelled(alice, address(hypercertMinter), tokenID, 0);
        hypercertTrader.cancelOffer(offerID);

        Offer memory updatedOffer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(updatedOffer.status), uint256(OfferStatus.Cancelled));
    }
}
