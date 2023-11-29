// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Interfaces
import {IHypercertToken} from "../../protocol/interfaces/IHypercertToken.sol";

/**
 * @title LowLevelHypercertCaller
 * @notice This contract contains low-level calls to transfer ERC1155 tokens.
 * @author bitbeckers
 */
contract LowLevelHypercertCaller {
    error NotAContract();
    error HypercertSplitFractionError();

    /**
     * @notice Execute Hypercert splitFraction
     * @param collection Address of the collection
     * @param from Address of the sender
     * @param to Address of the recipient
     * @param tokenId tokenId to transfer
     * @param amounts split distribution
     */

    function _executeHypercertSplitFraction(
        address collection,
        address from,
        address to,
        uint256 tokenId,
        uint256[] memory amounts
    ) internal {
        if (collection.code.length == 0) {
            revert NotAContract();
        }

        (bool status,) = collection.call(abi.encodeCall(IHypercertToken.splitFraction, (to, tokenId, amounts)));

        if (!status) {
            revert HypercertSplitFractionError();
        }
    }
}
