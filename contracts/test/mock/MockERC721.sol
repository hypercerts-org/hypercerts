// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {IERC165} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC165.sol";

contract MockERC721 is ERC721("MockERC721", "MockERC721") {
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function batchMint(address to, uint256 amount) external {
        for (uint256 i; i < amount; i++) {
            _mint(to, i);
        }
    }

    function batchMint(address to, uint256[] memory tokenIds) public {
        for (uint256 i; i < tokenIds.length; i++) {
            _mint(to, tokenIds[i]);
        }
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "tokenURI";
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
