// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC165, IERC2981} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC2981.sol";
import {MockERC721} from "./MockERC721.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

/**
 * @dev This contract allows adding a royalty basis points higher than 10,000, which
 *      reverts during the royaltyInfo call. The purpose is to create a scenario where
 *      royaltyInfo returns the correct response for some token IDs and reverts for some
 *      other token IDs. This can potentially happen in a bundle transaction.
 */
contract MockERC721WithRoyalties is MockERC721, IERC2981 {
    address public immutable DEFAULT_ROYALTY_RECIPIENT;
    uint256 public immutable DEFAULT_ROYALTY_FEE;

    mapping(uint256 => uint256) internal _royaltyFeeForTokenId;
    mapping(uint256 => address) internal _royaltyRecipientForTokenId;

    constructor(address _royaltyFeeRecipient, uint256 _royaltyFee) {
        DEFAULT_ROYALTY_RECIPIENT = _royaltyFeeRecipient;
        DEFAULT_ROYALTY_FEE = _royaltyFee;
    }

    function addCustomRoyaltyInformationForTokenId(uint256 tokenId, address royaltyRecipient, uint256 royaltyFee)
        external
    {
        _royaltyRecipientForTokenId[tokenId] = royaltyRecipient;
        _royaltyFeeForTokenId[tokenId] = royaltyFee;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address royaltyRecipient, uint256 royaltyAmount)
    {
        royaltyRecipient = _royaltyRecipientForTokenId[tokenId] == address(0)
            ? DEFAULT_ROYALTY_RECIPIENT
            : _royaltyRecipientForTokenId[tokenId];
        uint256 _royaltyFee = _royaltyFeeForTokenId[tokenId];
        uint256 royaltyFee = _royaltyFee == 0 ? DEFAULT_ROYALTY_FEE : _royaltyFee;
        require(royaltyFee <= ONE_HUNDRED_PERCENT_IN_BP, "Royalty too high");
        royaltyAmount = (royaltyFee * salePrice) / ONE_HUNDRED_PERCENT_IN_BP;
    }

    function supportsInterface(bytes4 interfaceId) public view override(MockERC721, IERC165) returns (bool) {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }
}
