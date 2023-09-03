// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import { HypercertTrader } from "../../src/HypercertTrader.sol";
import { HypercertMinter } from "../../src/HypercertMinter.sol";
import { IHypercertToken } from "../../src/interfaces/IHypercertToken.sol";
import { PRBTest } from "prb-test/PRBTest.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { StdUtils } from "forge-std/StdUtils.sol";

contract HypercertTraderHelper is HypercertTrader, PRBTest, StdCheats, StdUtils {
    error NotAllowed();
    error InvalidOffer();

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    HypercertMinter public hypercertMinter = new HypercertMinter();

    function getOffer(uint256 key) external view returns (Offer memory) {
        return offers[key];
    }

    function getOfferCount() external view returns (uint256) {
        return _offerCounter;
    }

    function exposedValidateBuyOffer(
        Offer memory offer,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external {
        _validateBuyOffer(offer, unitAmount, buyToken, tokenAmountPerUnit);
    }

    function createDefaultOffer() external returns (uint256 offerID, uint256 fractionID) {
        vm.startPrank(alice);
        hypercertMinter.mintClaim(alice, 10000, "ipfs://test", IHypercertToken.TransferRestrictions.FromCreatorOnly);

        uint256 baseID = 1 << 128;
        uint256 tokenIndex = 1;
        fractionID = baseID + tokenIndex;

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);

        hypercertMinter.setApprovalForAll(address(this), true);

        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), fractionID, 0);
        offerID = this.createOffer(address(hypercertMinter), fractionID, 1000, 10, 1000, acceptedTokens);
    }
}

//TODO cleanup inheritance
contract HypercertTraderCreateOfferTest is HypercertTraderHelper {
    HypercertTraderHelper internal hypercertTrader;

    function setUp() public {
        hypercertTrader = new HypercertTraderHelper();
    }

    // TODO validate transfer of fractions
    function testBuyOfferFull() public {
        // Alice creates a offer
        (uint256 offerID, uint256 fractionID) = hypercertTrader.createDefaultOffer();
        assertEq(hypercertTrader.getOfferCount(), 1);

        // Bob buys the full offer
        startHoax(bob, 10 ether);
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 1000, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 10000 }(bob, offerID, 1000, address(0), 10);

        // The offer is closed
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Fulfilled));

        // And bob can't buy any more of the offer
        vm.expectRevert(InvalidOffer.selector);
        hypercertTrader.buyUnits{ value: 10000 }(bob, offerID, 1, address(0), 10);
    }

    function testBuyOfferPartial() public {
        // Alice creates a offer
        (uint256 offerID, uint256 fractionID) = hypercertTrader.createDefaultOffer();
        assertEq(hypercertTrader.getOfferCount(), 1);

        // Bob buys part of the offer
        startHoax(bob, 10 ether);
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 500, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 10);

        // The offer is still open
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));

        // And bob can buy the rest of the offer
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 500, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 10);

        // The offer is closed
        offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Fulfilled));
    }

    function testBuyOfferFailsLowBid() public {
        // Alice creates a offer
        (uint256 offerID, ) = hypercertTrader.createDefaultOffer();
        assertEq(hypercertTrader.getOfferCount(), 1);

        // Bob tries to buy the offer with a low bid (tokenAmountPerUnit lower than min asking price)
        startHoax(bob, 10 ether);
        vm.expectRevert(InvalidOffer.selector);
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 9);

        // The offer is still open
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));
    }

    function testBuyOfferValidations() public {
        Offer memory offer = Offer({
            offerer: alice,
            hypercertContract: address(hypercertMinter),
            fractionID: 42,
            unitsAvailable: 10,
            minUnitsPerTrade: 2,
            maxUnitsPerTrade: 5,
            status: OfferStatus.Open,
            offerType: OfferType.Units,
            acceptedTokens: new AcceptedToken[](1)
        });

        offer.acceptedTokens[0] = AcceptedToken(address(0), 1);

        // Expect revert on mix/maxUnitsPerTrade
        // Too low
        vm.expectRevert(InvalidOffer.selector("Min/Max"));
        this.exposedValidateBuyOffer(offer, 10, address(0), 1);

        // Too high
        vm.expectRevert(InvalidOffer.selector);
        this.exposedValidateBuyOffer(offer, 10, address(0), 6);

        // Within range
        this.exposedValidateBuyOffer(offer, 10, address(0), 3);
    }
}
