// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {LowLevelERC20Transfer} from "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelERC20Transfer.sol";
import {IWETH} from "@looksrare/contracts-libs/contracts/interfaces/generic/IWETH.sol";
import {IERC20} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC20.sol";

/**
 * @title ProtocolFeeRecipient
 * @notice This contract is used to receive protocol fees and transfer them to the fee sharing setter.
 *         Fee sharing setter cannot receive ETH directly, so we need to use this contract as a middleman
 *         to convert ETH into WETH before sending it.
 * @author LooksRare protocol team (👀,💎)
 */
contract ProtocolFeeRecipient is LowLevelERC20Transfer {
    address public immutable FEE_SHARING_SETTER;
    IWETH public immutable WETH;

    error NothingToTransfer();

    constructor(address _feeSharingSetter, address _weth) {
        FEE_SHARING_SETTER = _feeSharingSetter;
        WETH = IWETH(_weth);
    }

    function transferETH() external {
        uint256 ethBalance = address(this).balance;

        if (ethBalance != 0) {
            WETH.deposit{value: ethBalance}();
        }

        uint256 wethBalance = IERC20(address(WETH)).balanceOf(address(this));

        if (wethBalance == 0) {
            revert NothingToTransfer();
        }
        _executeERC20DirectTransfer(address(WETH), FEE_SHARING_SETTER, wethBalance);
    }

    /**
     * @param currency ERC20 currency address
     */
    function transferERC20(address currency) external {
        uint256 balance = IERC20(currency).balanceOf(address(this));
        if (balance == 0) {
            revert NothingToTransfer();
        }
        _executeERC20DirectTransfer(currency, FEE_SHARING_SETTER, balance);
    }

    receive() external payable {}
}
