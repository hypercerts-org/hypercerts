// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { ERC1155Upgradeable } from "oz-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import { ERC1155BurnableUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import { ERC1155URIStorageUpgradeable } from "oz-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import { OwnableUpgradeable } from "oz-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "oz-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "oz-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Upgradeable1155 is
    Initializable,
    ERC1155Upgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol }
    // solhint-disable-next-line func-name-mixedcase
    function __Upgradeable1155_init() public virtual onlyInitializing {
        __ERC1155_init("");
        __ERC1155Burnable_init();
        __ERC1155URIStorage_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @dev see { openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol }
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {
        // solhint-disable-previous-line no-empty-blocks
    }

    /// @dev see { openzeppelin-contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol }
    function uri(
        uint256 tokenID
    ) public view virtual override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable) returns (string memory _uri) {
        _uri = ERC1155URIStorageUpgradeable.uri(tokenID);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
