// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries, interfaces, errors
import "@looksrare/contracts-libs/contracts/errors/SignatureCheckerErrors.sol";
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

// Base test
import {ProtocolBase} from "./ProtocolBase.t.sol";

// Constants
import {ONE_HUNDRED_PERCENT_IN_BP} from "@hypercerts/marketplace/constants/NumericConstants.sol";

// Enums
import {CollectionType} from "@hypercerts/marketplace/enums/CollectionType.sol";
import {QuoteType} from "@hypercerts/marketplace/enums/QuoteType.sol";

contract SignaturesEIP2098Test is ProtocolBase {
    function setUp() public {
        _setUp();
    }

    function testCanSignValidMakerAskEIP2098(uint256 price, uint256 itemId) public {
        vm.assume(price <= 2 ether);

        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        (OrderStructs.Maker memory makerAsk,) = _createMockMakerAskAndTakerBid(address(mockERC721));
        makerAsk.price = price;
        makerAsk.itemIds[0] = itemId;

        bytes memory signature = _signMakerOrder(makerAsk, makerUserPK);

        // Mint asset
        mockERC721.mint(makerUser, makerAsk.itemIds[0]);

        // Adjust the signature
        signature = _eip2098Signature(signature);

        // Verify validity of maker ask order
        _assertValidMakerOrder(makerAsk, signature);
    }

    function testCanSignValidMakerBidEIP2098(uint256 price, uint256 itemId) public {
        vm.assume(price <= 2 ether);

        _setUpUsers();
        _setupRegistryRoyalties(address(mockERC721), _standardRoyaltyFee);

        (OrderStructs.Maker memory makerBid,) = _createMockMakerBidAndTakerAsk(address(mockERC721), address(weth));
        makerBid.price = price;
        makerBid.itemIds[0] = itemId;

        bytes memory signature = _signMakerOrder(makerBid, makerUserPK);

        // Adjust the signature
        signature = _eip2098Signature(signature);

        // Mint asset
        mockERC721.mint(takerUser, makerBid.itemIds[0]);

        // Verify validity of maker bid order
        _assertValidMakerOrder(makerBid, signature);
    }
}
