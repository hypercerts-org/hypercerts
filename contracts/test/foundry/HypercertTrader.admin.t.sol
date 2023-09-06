// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import { HypercertTrader } from "../../src/HypercertTrader.sol";
import { HypercertMinter } from "../../src/HypercertMinter.sol";
import { IHypercertToken } from "../../src/interfaces/IHypercertToken.sol";
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

    // TODO - Use UUPS pattern for contracts and getting owner
    address internal alice = address(1);
    address internal bob = address(2);

    HypercertMinter public hypercertMinter = new HypercertMinter();

    function getOfferCount() external view returns (uint256) {
        return _offerCounter;
    }
}

contract HypercertTraderAdminTest is HypercertTraderHelper, PRBTest, StdCheats, StdUtils {
    HypercertTraderHelper internal hypercertTrader;

    function setUp() public {
        hypercertTrader = new HypercertTraderHelper();
    }

    function testPausability() public {
        AcceptedToken[] memory acceptedTokens = new AcceptedToken[](1);
        acceptedTokens[0] = AcceptedToken(address(0), 1);

        // Contract is not paused
        assertEq(hypercertTrader.paused(), false);

        // Bob can't pause the contracts
        vm.startPrank(bob);
        vm.expectRevert("Ownable: caller is not the owner");
        hypercertTrader.pause();

        // Owner can pause the contract
        vm.startPrank(owner());
        vm.expectEmit(true, false, false, false);
        emit Paused(owner());
        hypercertTrader.pause();

        // All functions are paused
        vm.expectRevert("Pausable: paused");
        hypercertTrader.createOffer(address(hypercertMinter), 1, 1, 1, 1, acceptedTokens);

        vm.expectRevert("Pausable: paused");
        hypercertTrader.cancelOffer(1);

        vm.expectRevert("Pausable: paused");
        hypercertTrader.buyUnits(alice, 1, 1, address(0), 1);

        // Bob can't unpause the contract
        vm.startPrank(bob);
        vm.expectRevert("Ownable: caller is not the owner");
        hypercertTrader.unpause();

        // Owner can unpause the contract
        vm.startPrank(owner());
        vm.expectEmit(true, false, false, false);
        emit Unpaused(owner());
        hypercertTrader.unpause();

        // All functions are unpaused
        vm.expectRevert(NotAllowed.selector);
        hypercertTrader.createOffer(address(hypercertMinter), 1, 1, 1, 1, acceptedTokens);

        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "No contract address found"));
        hypercertTrader.cancelOffer(1);

        vm.expectRevert(abi.encodeWithSelector(InvalidOffer.selector, "Min/Max units"));
        hypercertTrader.buyUnits(alice, 1, 1, address(0), 1);
    }
}
