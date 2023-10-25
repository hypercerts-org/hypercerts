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

contract HypercertTraderHelper is HypercertTrader, PRBTest, StdCheats, StdUtils {
    error NotAllowed();
    error InvalidOffer(string);
    error InvalidBuy(string);

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    HypercertMinter public hypercertMinter = new HypercertMinter();

    function getOfferCount() external view returns (uint256) {
        return _offerCounter;
    }

    function exposedValidateBuyOffer(
        Offer memory offer,
        uint256 unitAmount,
        address buyToken,
        uint256 tokenAmountPerUnit
    ) external payable {
        _validateBuyOffer(offer, unitAmount, buyToken, tokenAmountPerUnit);
    }

    function createDefaultOffer(bool full) external returns (uint256 offerID, uint256 fractionID) {
        vm.startPrank(alice);
        hypercertMinter.mintClaim(alice, 10000, "ipfs://test", IHypercertToken.TransferRestrictions.FromCreatorOnly);

        uint256 baseID = 1 << 128;
        uint256 tokenIndex = 1;
        fractionID = baseID + tokenIndex;

        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 3);

        hypercertMinter.setApprovalForAll(address(this), true);

        vm.expectEmit(true, true, true, true);
        emit OfferCreated(alice, address(hypercertMinter), fractionID, 0);
        if (full) {
            offerID = this.createOffer(address(hypercertMinter), fractionID, 10000, 10, 10000, acceptedTokens);
        } else {
            offerID = this.createOffer(address(hypercertMinter), fractionID, 1000, 10, 1000, acceptedTokens);
        }
    }
}

//TODO cleanup inheritance
contract HypercertTraderBuyOfferTest is HypercertTraderHelper {
    HypercertTraderHelper internal hypercertTrader;

    function setUp() public {
        hypercertTrader = new HypercertTraderHelper();
    }

    function testBuyOfferFullBid() public {
        // Alice has no balance
        assertEq(alice.balance, 0);

        // Alice creates a offer
        (uint256 offerID, uint256 fractionID) = hypercertTrader.createDefaultOffer(false);
        assertEq(hypercertTrader.getOfferCount(), 1);
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 1000);

        // Bob buys the full offer
        startHoax(bob, 10 ether);
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 1000, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 10000 }(bob, offerID, 1000, address(0), 10);

        // Bob owns the new fraction
        assertEq(hypercertTrader.hypercertMinter().ownerOf(fractionID + 1), bob);

        // Alice still owns the old fraction and the units that weren't sold
        assertEq(hypercertTrader.hypercertMinter().ownerOf(fractionID), alice);
        assertEq(hypercertTrader.hypercertMinter().unitsOf(fractionID), 9000);

        // The offer is closed
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Fulfilled));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 0);

        // And bob can't buy any more of the offer
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong status"));
        hypercertTrader.buyUnits{ value: 10000 }(bob, offerID, 10, address(0), 10);

        // Alice received the funds
        assertEq(alice.balance, 10000);
    }

    function testBuyOfferFullFraction() public {
        // Alice has no balance
        assertEq(alice.balance, 0);

        // Alice creates a offer
        (uint256 offerID, uint256 fractionID) = hypercertTrader.createDefaultOffer(true);
        assertEq(hypercertTrader.getOfferCount(), 1);
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 10000);

        // Bob buys the full offer for the full token
        startHoax(bob, 10 ether);
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 10000, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 100000 }(bob, offerID, 10000, address(0), 10);

        // Bob bought the full fraction and owns it
        assertEq(hypercertTrader.hypercertMinter().ownerOf(fractionID), bob);

        // No new fraction was minted
        assertEq(hypercertTrader.hypercertMinter().unitsOf(fractionID + 1), 0);

        // The offer is closed
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Fulfilled));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 0);

        // And bob can't buy any more of the offer
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong status"));
        hypercertTrader.buyUnits{ value: 10000 }(bob, offerID, 1, address(0), 10);

        // Alice received the funds
        assertEq(alice.balance, 100000);
    }

    function testBuyOfferPartial() public {
        // Alice creates a offer
        (uint256 offerID, uint256 fractionID) = hypercertTrader.createDefaultOffer(false);
        assertEq(hypercertTrader.getOfferCount(), 1);
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 1000);

        // Bob buys part of the offer
        startHoax(bob, 10 ether);
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 500, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 10);

        // Bob owns the new fraction worth 500 units
        assertEq(hypercertTrader.hypercertMinter().ownerOf(fractionID + 1), bob);
        assertEq(hypercertTrader.hypercertMinter().unitsOf(fractionID + 1), 500);

        // The offer is still open
        Offer memory offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Open));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 500);

        // And bob can buy the rest of the offer
        vm.expectEmit(true, true, true, true);
        emit Trade(alice, bob, address(hypercertTrader.hypercertMinter()), fractionID, 500, address(0), 10, offerID);
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 10);

        // Bob owns the new fraction worth 500 units
        assertEq(hypercertTrader.hypercertMinter().ownerOf(fractionID + 2), bob);
        assertEq(hypercertTrader.hypercertMinter().unitsOf(fractionID + 2), 500);

        // The offer is closed
        offer = hypercertTrader.getOffer(offerID);
        assertEq(uint256(offer.status), uint256(OfferStatus.Fulfilled));
        assertEq(hypercertTrader.totalUnitsForSale(address(hypercertTrader.hypercertMinter()), fractionID), 0);
    }

    function testBuyOfferFailsLowBid() public {
        // Alice creates a offer
        (uint256 offerID, ) = hypercertTrader.createDefaultOffer(false);
        assertEq(hypercertTrader.getOfferCount(), 1);

        // Bob tries to buy the offer with a low bid (tokenAmountPerUnit lower than min asking price)
        startHoax(bob, 10 ether);
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong token/value"));
        hypercertTrader.buyUnits{ value: 5000 }(bob, offerID, 500, address(0), 2);

        // Bob tries to buy the offer with a low bid (msg.value too low)
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong token/value"));
        hypercertTrader.buyUnits{ value: 4999 }(bob, offerID, 500, address(0), 10);

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

        vm.mockCall(
            address(hypercertMinter),
            abi.encodeWithSelector(IHypercertMinter.ownerOf.selector, 42),
            abi.encode(alice)
        );

        offer.acceptedTokens[0] = AcceptedToken(address(0), 2);

        // Expect revert on mix/maxUnitsPerTrade
        // Bid too low
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong token/value"));
        this.exposedValidateBuyOffer(offer, 3, address(0), 1);

        // Units bought too low
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Min/Max units"));
        this.exposedValidateBuyOffer(offer, 1, address(0), 3);

        // Too high
        // Units bought too high
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Min/Max units"));
        this.exposedValidateBuyOffer(offer, 11, address(0), 3);

        // Within range but no value
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong token/value"));
        this.exposedValidateBuyOffer(offer, 3, address(0), 3);

        this.exposedValidateBuyOffer{ value: 10 }(offer, 3, address(0), 3);

        // Expect revert on wrong token
        offer.acceptedTokens[0] = AcceptedToken(address(1337), 2);
        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Wrong token/value"));
        this.exposedValidateBuyOffer(offer, 3, address(1), 1);
    }
}
