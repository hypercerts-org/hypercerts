// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Interfaces
import {IStrategyManager} from "@hypercerts/marketplace/interfaces/IStrategyManager.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

contract InitialStatesTest is ProtocolBase, IStrategyManager {
    function setUp() public {
        _setUp();
    }

    /**
     * Verify initial post-deployment states are as expected
     */
    function testInitialStates() public {
        assertEq(looksRareProtocol.owner(), _owner);
        assertEq(looksRareProtocol.protocolFeeRecipient(), address(protocolFeeRecipient));
        assertEq(address(looksRareProtocol.transferManager()), address(transferManager));
        assertEq(looksRareProtocol.WETH(), address(weth));
        assertEq(looksRareProtocol.chainId(), block.chainid);

        bytes32 domainSeparator = looksRareProtocol.domainSeparator();
        bytes32 expectedDomainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("LooksRareProtocol"),
                keccak256(bytes("2")),
                block.chainid,
                address(looksRareProtocol)
            )
        );
        assertEq(domainSeparator, expectedDomainSeparator);

        (
            bool strategyIsActive,
            uint16 strategyStandardProtocolFee,
            uint16 strategyMinTotalFee,
            uint16 strategyMaxProtocolFee,
            bytes4 strategySelector,
            bool strategyIsMakerBid,
            address strategyImplementation
        ) = looksRareProtocol.strategyInfo(0);

        assertTrue(strategyIsActive);
        assertEq(strategyStandardProtocolFee, _standardProtocolFeeBp);
        assertEq(strategyMinTotalFee, _minTotalFeeBp);
        assertEq(strategyMaxProtocolFee, _maxProtocolFeeBp);
        assertEq(strategySelector, _EMPTY_BYTES4);
        assertFalse(strategyIsMakerBid);
        assertEq(strategyImplementation, address(0));
    }
}
