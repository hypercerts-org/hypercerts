// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import { ERC721URIStorageUpgradeable } from "oz-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import { CountersUpgradeable } from "oz-upgradeable/utils/CountersUpgradeable.sol";
import { Errors } from "../libs/errors.sol";

contract Hyperboard is ERC721URIStorageUpgradeable, CountersUpgradeable {
    string public subgraphEndpoint;
    string public baseUri;
    mapping(uint256 => AllowlistedCerts) _allowlistedCertsMapping;

    struct AllowlistedCerts {
        address[] allowlistedCerts;
        mapping(address => uint256[]) claimIds;
    }

    constructor(string memory name_, string memory symbol_, string memory subgraphEndpoint_, string memory baseUri_) {
        __ERC721_init(name_, symbol_);
        subgraphEndpoint = subgraphEndpoint_;
        baseUri = baseUri_;
    }

    function mint(
        address to,
        address[] memory allowlistedCertsAddress_,
        uint256[][] memory allowlistedClaimIds_
    ) external returns (uint256 tokenId) {
        if (allowlistedCertsAddress_.length != allowlistedClaimIds_) revert Error.ArrayLengthMismatch();
        if (to == address(0)) revert Error.ZeroAddress();
        AllowlistedCerts memory allowlistedCerts = AllowlistedCerts({ allowlistedCerts: allowlistedCertsAddress_ });
        for (uint256 i = 0; i < allowlistedCertsAddress_.length; i++) {
            allowlistedCerts[allowlistedCertsAddress_[i]] = allowlistedClaimIds_[i];
        }

        _mint(to, current());
        _allowlistedCertsMapping[current()] = allowlistedCerts;
        increment();
    }
}
