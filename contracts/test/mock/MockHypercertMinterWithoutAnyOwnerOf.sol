// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IHypercertToken} from "@hypercerts/protocol/interfaces/IHypercertToken.sol";

import {HypercertMinter} from "@hypercerts/protocol/HypercertMinter.sol";

// Empty contract that acts like it's a HypercertMinter by declaring the supported interface
contract MockHypercertMinterWithoutOwnerOf {
    constructor() {}

    // Since ownerOf is non-virtual in SemiFungible1155, we need to 'mock' it here
    function ownerOf(uint256) public view virtual returns (address) {
        revert("Not implemented");
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IHypercertToken).interfaceId;
    }
}
