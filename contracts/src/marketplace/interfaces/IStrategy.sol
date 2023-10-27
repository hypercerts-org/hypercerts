// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

/**
 * @title IStrategy
 * @author LooksRare protocol team (👀,💎)
 */
interface IStrategy {
    /**
     * @notice Validate *only the maker* order under the context of the chosen strategy. It does not revert if
     *         the maker order is invalid. Instead it returns false and the error's 4 bytes selector.
     * @param makerOrder Maker struct (maker specific parameters for the execution)
     * @param functionSelector Function selector for the strategy
     * @return isValid Whether the maker struct is valid
     * @return errorSelector If isValid is false, it returns the error's 4 bytes selector
     */
    function isMakerOrderValid(OrderStructs.Maker calldata makerOrder, bytes4 functionSelector)
        external
        view
        returns (bool isValid, bytes4 errorSelector);

    /**
     * @notice This function acts as a safety check for the protocol's owner when adding new execution strategies.
     * @return isStrategy Whether it is a LooksRare V2 protocol strategy
     */
    function isLooksRareV2Strategy() external pure returns (bool isStrategy);
}
