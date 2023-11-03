// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// LooksRare unopinionated libraries
import {IERC20} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC20.sol";
import {IWETH} from "@looksrare/contracts-libs/contracts/interfaces/generic/IWETH.sol";

// Core contracts
import {ProtocolFeeRecipient} from "@hypercerts/marketplace/ProtocolFeeRecipient.sol";

// Other mocks and utils
import {MockERC20} from "../../mock/MockERC20.sol";
import {TestParameters} from "./utils/TestParameters.sol";

contract ProtocolFeeRecipientTest is TestParameters {
    ProtocolFeeRecipient private protocolFeeRecipient;
    uint256 private feeSharingSetterInitialWETHBalance;

    address private constant FEE_SHARING_SETTER = 0x5924A28caAF1cc016617874a2f0C3710d881f3c1;
    uint256 private constant DUST = 0.6942 ether;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("mainnet"));
        protocolFeeRecipient = new ProtocolFeeRecipient(FEE_SHARING_SETTER, WETH_MAINNET);
        feeSharingSetterInitialWETHBalance = IERC20(WETH_MAINNET).balanceOf(FEE_SHARING_SETTER);

        vm.deal(address(protocolFeeRecipient), 0);
        deal(WETH_MAINNET, address(protocolFeeRecipient), 0);
    }

    function test_TransferETH_NoWETHBalance_WithETHBalance() public {
        _sendETHToProtocolFeeRecipient();

        protocolFeeRecipient.transferETH();

        assertEq(address(protocolFeeRecipient).balance, 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(address(protocolFeeRecipient)), 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(FEE_SHARING_SETTER), feeSharingSetterInitialWETHBalance + 1 ether);
    }

    function test_TransferETH_WithWETHBalance_WithETHBalance() public {
        _sendETHToProtocolFeeRecipient();
        _sendWETHToProtocolFeeRecipient();

        protocolFeeRecipient.transferETH();

        assertEq(address(protocolFeeRecipient).balance, 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(address(protocolFeeRecipient)), 0);
        assertEq(
            IERC20(WETH_MAINNET).balanceOf(FEE_SHARING_SETTER), feeSharingSetterInitialWETHBalance + 1 ether + DUST
        );
    }

    function test_TransferETH_WithWETHBalance_NoETHBalance() public {
        _sendWETHToProtocolFeeRecipient();

        protocolFeeRecipient.transferETH();

        assertEq(address(protocolFeeRecipient).balance, 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(address(protocolFeeRecipient)), 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(FEE_SHARING_SETTER), feeSharingSetterInitialWETHBalance + DUST);
    }

    function test_TransferETH_RevertIf_NothingToTransfer() public {
        vm.expectRevert(ProtocolFeeRecipient.NothingToTransfer.selector);
        protocolFeeRecipient.transferETH();
    }

    function test_TransferWETH() public {
        _sendWETHToProtocolFeeRecipient();

        protocolFeeRecipient.transferERC20(WETH_MAINNET);

        assertEq(IERC20(WETH_MAINNET).balanceOf(address(protocolFeeRecipient)), 0);
        assertEq(IERC20(WETH_MAINNET).balanceOf(FEE_SHARING_SETTER), feeSharingSetterInitialWETHBalance + DUST);
    }

    function test_TransferWETH_RevertIf_NothingToTransfer() public {
        vm.expectRevert(ProtocolFeeRecipient.NothingToTransfer.selector);
        protocolFeeRecipient.transferERC20(WETH_MAINNET);
    }

    function test_TransferERC20() public {
        MockERC20 mockERC20 = new MockERC20();
        mockERC20.mint(address(protocolFeeRecipient), DUST);

        protocolFeeRecipient.transferERC20(address(mockERC20));

        assertEq(mockERC20.balanceOf(address(protocolFeeRecipient)), 0);
        assertEq(mockERC20.balanceOf(FEE_SHARING_SETTER), DUST);
    }

    function test_TransferERC20_RevertIf_NothingToTransfer() public {
        MockERC20 mockERC20 = new MockERC20();
        vm.expectRevert(ProtocolFeeRecipient.NothingToTransfer.selector);
        protocolFeeRecipient.transferERC20(address(mockERC20));
    }

    function _sendETHToProtocolFeeRecipient() private {
        (bool success,) = address(protocolFeeRecipient).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(address(protocolFeeRecipient).balance, 1 ether);
    }

    function _sendWETHToProtocolFeeRecipient() private {
        IWETH(WETH_MAINNET).deposit{value: DUST}();
        IERC20(WETH_MAINNET).transfer(address(protocolFeeRecipient), DUST);
        assertEq(IERC20(WETH_MAINNET).balanceOf(address(protocolFeeRecipient)), DUST);
    }
}
