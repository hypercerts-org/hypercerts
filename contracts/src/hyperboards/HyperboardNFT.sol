// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import { ERC721URIStorageUpgradeable } from "oz-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import { CountersUpgradeable } from "oz-upgradeable/utils/CountersUpgradeable.sol";
import { Errors } from "../libs/errors.sol";
import { IERC6551Registry } from "../interfaces/IERC6551Registry.sol";

contract Hyperboard is ERC721URIStorageUpgradeable {
    string public subgraphEndpoint;
    string public baseUri;
    address public walletImpl;
    uint256 public walletSalt;

    mapping(uint256 => AllowlistedCerts) private _allowListedCertsMapping;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _counter;

    struct AllowlistedCerts {
        address[] allowlistedCerts;
        mapping(address => uint256[]) claimIds;
    }

    constructor(
        SafeProxyFactory safeProxyFactory_,
        string memory name_,
        string memory symbol_,
        string memory subgraphEndpoint_,
        string memory baseUri_
    ) {
        __ERC721_init(name_, symbol_);
        subgraphEndpoint = subgraphEndpoint_;
        baseUri = baseUri_;
        _safeProxyFactory = safeProxyFactory_;
    }

    function mint(
        address to,
        address[] memory allowlistedCertsAddress_,
        uint256[][] memory allowlistedClaimIds_
    ) external returns (uint256 tokenId) {
        if (allowlistedCertsAddress_.length != allowlistedClaimIds_.length) revert Errors.ArrayLengthMismatch();
        if (to == address(0)) revert Errors.ZeroAddress();
        tokenId = _counter.current();
        _mint(to, tokenId);
        _setAllowlist(tokenId, allowlistedCertsAddress_, allowlistedClaimIds_);

        I
        _counter.increment();
        return tokenId;
    }

    function updateAllowListedCerts(
        uint256 tokenId,
        address[] memory allowlistedCertsAddress_,
        uint256[][] memory allowlistedClaimIds_
    ) external {
        if (ownerOf(tokenId) != msg.sender) revert Errors.NotOwner();
        _setAllowlist(tokenId, allowlistedCertsAddress_, allowlistedClaimIds_);
    }

    function getAllowListedCerts(uint256 tokenId) external returns (address[] memory) {
        return _allowListedCertsMapping[tokenId].allowlistedCerts;
    }

    function getAllowListedClaimIds(uint256 tokenId, address hypercertAddress) external returns (uint256[] memory) {
        return _allowListedCertsMapping[tokenId].claimIds[hypercertAddress];
    }

    function _setAllowlist(
        uint256 tokenId,
        address[] memory allowlistedCertsAddress_,
        uint256[][] memory allowlistedClaimIds_
    ) internal {
        if (allowlistedCertsAddress_.length != allowlistedClaimIds_.length) revert Errors.ArrayLengthMismatch();
        AllowlistedCerts storage allowListedCerts = _allowListedCertsMapping[tokenId];
        allowListedCerts.allowlistedCerts = allowlistedCertsAddress_;
        for (uint256 i = 0; i < allowlistedCertsAddress_.length; i++) {
            _allowListedCertsMapping[_counter.current()].claimIds[allowlistedCertsAddress_[i]] = allowlistedClaimIds_[
                i
            ];
        }
    }
}
