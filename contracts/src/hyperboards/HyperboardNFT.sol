// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import { ERC721URIStorageUpgradeable } from "oz-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import { CountersUpgradeable } from "oz-upgradeable/utils/CountersUpgradeable.sol";
import { Errors } from "../libs/errors.sol";

contract Hyperboard is ERC721URIStorageUpgradeable {
    string public subgraphEndpoint;
    string public baseUri;
    mapping(uint256 => AllowlistedCerts) _allowListedCertsMapping;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter _counter;

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
        if (allowlistedCertsAddress_.length != allowlistedClaimIds_.length) revert Errors.ArrayLengthMismatch();
        if (to == address(0)) revert Errors.ZeroAddress();

        _mint(to, _counter.current());
        AllowlistedCerts storage allowListedCerts = _allowListedCertsMapping[_counter.current()];
        allowListedCerts.allowlistedCerts = allowlistedCertsAddress_;
        for (uint256 i = 0; i < allowlistedCertsAddress_.length; i++) {
            _allowListedCertsMapping[_counter.current()].claimIds[allowlistedCertsAddress_[i]] = allowlistedClaimIds_[
                i
            ];
        }

        _counter.increment();
    }
}
