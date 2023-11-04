/// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ILooksRareProtocol} from "@hypercerts/marketplace/interfaces/ILooksRareProtocol.sol";
import {OrderStructs} from "@hypercerts/marketplace/libraries/OrderStructs.sol";

abstract contract MaliciousERC1271Wallet {
    enum FunctionToReenter {
        None,
        ExecuteTakerAsk,
        ExecuteTakerBid,
        ExecuteMultipleTakerBids
    }

    ILooksRareProtocol internal immutable looksRareProtocol;
    FunctionToReenter internal functionToReenter;

    constructor(address _looksRareProtocol) {
        looksRareProtocol = ILooksRareProtocol(_looksRareProtocol);
    }

    function setFunctionToReenter(FunctionToReenter _functionToReenter) external {
        functionToReenter = _functionToReenter;
    }

    function isValidSignature(bytes32, bytes calldata) external virtual returns (bytes4 magicValue) {
        magicValue = this.isValidSignature.selector;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        virtual
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function _executeTakerAsk(bytes memory signature) internal {
        OrderStructs.Taker memory takerAsk;
        OrderStructs.Maker memory makerBid;
        OrderStructs.MerkleTree memory merkleTree;

        looksRareProtocol.executeTakerAsk(takerAsk, makerBid, signature, merkleTree);
    }

    function _executeTakerBid(bytes memory signature) internal {
        OrderStructs.Taker memory takerBid;
        OrderStructs.Maker memory makerAsk;
        OrderStructs.MerkleTree memory merkleTree;

        looksRareProtocol.executeTakerBid(takerBid, makerAsk, signature, merkleTree);
    }

    function _executeMultipleTakerBids() internal {
        OrderStructs.Taker[] memory takerBids = new OrderStructs.Taker[](2);
        OrderStructs.Maker[] memory makerAsks = new OrderStructs.Maker[](2);
        bytes[] memory signatures = new bytes[](2);
        OrderStructs.MerkleTree[] memory merkleTrees = new OrderStructs.MerkleTree[](2);

        looksRareProtocol.executeMultipleTakerBids(takerBids, makerAsks, signatures, merkleTrees, false);
    }
}
