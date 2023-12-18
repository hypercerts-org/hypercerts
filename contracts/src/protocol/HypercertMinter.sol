// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IHypercertToken} from "./interfaces/IHypercertToken.sol";
import {SemiFungible1155} from "./SemiFungible1155.sol";
import {AllowlistMinter} from "./AllowlistMinter.sol";
import {PausableUpgradeable} from "oz-upgradeable/security/PausableUpgradeable.sol";

import {Errors} from "./libs/Errors.sol";

/// @title Contract for managing hypercert claims and whitelists
/// @author bitbeckers
/// @notice Implementation of the HypercertTokenInterface using { SemiFungible1155 } as underlying token.
/// @notice This contract supports whitelisted minting via { AllowlistMinter }.
/// @dev Wrapper contract to expose and chain functions.
contract HypercertMinter is IHypercertToken, SemiFungible1155, AllowlistMinter, PausableUpgradeable {
    // solhint-disable-next-line const-name-snakecase
    string public constant name = "HypercertMinter";
    /// @dev from typeID to a transfer policy
    mapping(uint256 => TransferRestrictions) internal typeRestrictions;

    /// INIT

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    function initialize() public virtual initializer {
        __SemiFungible1155_init();
        __Pausable_init();
    }

    /// EXTERNAL

    /// @notice Mint a semi-fungible token for the impact claim referenced via `uri`
    /// @dev see {IHypercertToken}
    function mintClaim(address account, uint256 units, string memory _uri, TransferRestrictions restrictions)
        external
        override
        whenNotPaused
    {
        // This enables us to release this restriction in the future
        if (msg.sender != account) revert Errors.NotAllowed();
        uint256 claimID = _mintNewTypeWithToken(account, units, _uri);
        typeRestrictions[claimID] = restrictions;
        emit ClaimStored(claimID, _uri, units);
    }

    /// @notice Mint semi-fungible tokens for the impact claim referenced via `uri`
    /// @dev see {IHypercertToken}
    function mintClaimWithFractions(
        address account,
        uint256 units,
        uint256[] calldata fractions,
        string memory _uri,
        TransferRestrictions restrictions
    ) external override whenNotPaused {
        // This enables us to release this restriction in the future
        if (msg.sender != account) revert Errors.NotAllowed();
        //Using sum to compare units and fractions (sanity check)
        if (_getSum(fractions) != units) revert Errors.Invalid();

        uint256 claimID = _mintNewTypeWithTokens(account, fractions, _uri);
        typeRestrictions[claimID] = restrictions;
        emit ClaimStored(claimID, _uri, units);
    }

    /// @notice Mint a semi-fungible token representing a fraction of the claim
    /// @dev Calls AllowlistMinter to verify `proof`.
    /// @dev Mints the `amount` of units for the hypercert stored under `claimID`
    function mintClaimFromAllowlist(address account, bytes32[] calldata proof, uint256 claimID, uint256 units)
        external
        whenNotPaused
    {
        _processClaim(proof, claimID, units);
        _mintToken(account, claimID, units);
    }

    /// @notice Mint semi-fungible tokens representing a fraction of the claims in `claimIDs`
    /// @dev Calls AllowlistMinter to verify `proofs`.
    /// @dev Mints the `amount` of units for the hypercert stored under `claimIDs`
    function batchMintClaimsFromAllowlists(
        address account,
        bytes32[][] calldata proofs,
        uint256[] calldata claimIDs,
        uint256[] calldata units
    ) external whenNotPaused {
        uint256 len = claimIDs.length;
        for (uint256 i; i < len;) {
            _processClaim(proofs[i], claimIDs[i], units[i]);
            unchecked {
                ++i;
            }
        }
        _batchMintTokens(account, claimIDs, units);
    }

    /// @notice Register a claim and the whitelist for minting token(s) belonging to that claim
    /// @dev Calls SemiFungible1155 to store the claim referenced in `uri` with amount of `units`
    /// @dev Calls AllowlistMinter to store the `merkleRoot` as proof to authorize claims
    function createAllowlist(
        address account,
        uint256 units,
        bytes32 merkleRoot,
        string memory _uri,
        TransferRestrictions restrictions
    ) external whenNotPaused {
        uint256 claimID = _createTokenType(account, units, _uri);
        _createAllowlist(claimID, merkleRoot, units);
        typeRestrictions[claimID] = restrictions;
        emit ClaimStored(claimID, _uri, units);
    }

    /// @notice Split a claimtokens value into parts with summed value equal to the original
    /// @dev see {IHypercertToken}
    function splitFraction(address _account, uint256 _tokenID, uint256[] calldata _newFractions)
        external
        whenNotPaused
    {
        _splitTokenUnits(_account, _tokenID, _newFractions);
    }

    /// @notice Merge the value of tokens belonging to the same claim
    /// @dev see {IHypercertToken}
    function mergeFractions(address _account, uint256[] calldata _fractionIDs) external whenNotPaused {
        _mergeTokensUnits(_account, _fractionIDs);
    }

    /// @notice Burn a claimtoken
    /// @dev see {IHypercertToken}
    function burnFraction(address _account, uint256 _tokenID) external whenNotPaused {
        _burnToken(_account, _tokenID);
    }

    /// @notice Burn a claimtoken
    /// @dev see {IHypercertToken}
    function batchBurnFraction(address _account, uint256[] memory _tokenIDs) external whenNotPaused {
        _batchBurnToken(_account, _tokenIDs);
    }

    /// @notice Burn a claimtoken; override is needed to update units/values
    /// @dev see {ERC1155Burnable}
    function burn(address account, uint256 id, uint256 /*value*/ ) public override whenNotPaused {
        _burnToken(account, id);
    }

    /// @notice Batch burn claimtokens; override is needed to update units/values
    /// @dev see {ERC1155Burnable}
    function burnBatch(address account, uint256[] memory ids, uint256[] memory /*values*/ )
        public
        override
        whenNotPaused
    {
        _batchBurnToken(account, ids);
    }

    /// @dev see {IHypercertToken}
    function unitsOf(uint256 tokenID) external view override returns (uint256 units) {
        units = _unitsOf(tokenID);
    }

    /// @dev see {IHypercertToken}
    function unitsOf(address account, uint256 tokenID) external view override returns (uint256 units) {
        units = _unitsOf(account, tokenID);
    }

    /// PAUSABLE

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// METADATA

    /// @dev see { IHypercertMetadata}
    function uri(uint256 tokenID)
        public
        view
        override(IHypercertToken, SemiFungible1155)
        returns (string memory _uri)
    {
        _uri = SemiFungible1155.uri(tokenID);
    }

    /// TRANSFER RESTRICTIONS

    function readTransferRestriction(uint256 tokenID) external view returns (string memory) {
        TransferRestrictions temp = typeRestrictions[getBaseType(tokenID)];
        if (temp == TransferRestrictions.AllowAll) return "AllowAll";
        if (temp == TransferRestrictions.DisallowAll) return "DisallowAll";
        if (temp == TransferRestrictions.FromCreatorOnly) return "FromCreatorOnly";
        return "";
    }

    /// INTERNAL

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol }
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {
        // solhint-disable-previous-line no-empty-blocks
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        // By-pass transfer restrictions for minting and burning
        if (from == address(0)) {
            // Minting
            return;
        } else if (to == address(0)) {
            // Burning
            return;
        }

        // Transfer case, where to and from are non-zero
        uint256 len = ids.length;
        for (uint256 i; i < len;) {
            uint256 typeID = getBaseType(ids[i]);
            TransferRestrictions policy = typeRestrictions[typeID];
            if (policy == TransferRestrictions.DisallowAll) {
                revert Errors.TransfersNotAllowed();
            } else if (policy == TransferRestrictions.FromCreatorOnly && from != creators[typeID]) {
                revert Errors.TransfersNotAllowed();
            }
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IHypercertToken).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     * Assuming 30 available slots (slots cost space, cost gas)
     * 1. typeRestrictions
     */
    uint256[29] private __gap;
}
