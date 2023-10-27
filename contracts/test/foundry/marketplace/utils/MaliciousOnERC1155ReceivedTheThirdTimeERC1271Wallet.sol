// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {MaliciousERC1271Wallet} from "./MaliciousERC1271Wallet.sol";

contract MaliciousOnERC1155ReceivedTheThirdTimeERC1271Wallet is MaliciousERC1271Wallet {
    uint256 private isValidSignatureEnterCount;

    constructor(address _looksRareProtocol) MaliciousERC1271Wallet(_looksRareProtocol) {}

    function onERC1155Received(address, address, uint256, uint256, bytes memory) external override returns (bytes4) {
        if (++isValidSignatureEnterCount == 3) {
            if (functionToReenter == FunctionToReenter.ExecuteTakerAsk) {
                _executeTakerAsk(new bytes(0));
            } else if (functionToReenter == FunctionToReenter.ExecuteTakerBid) {
                _executeTakerBid(new bytes(0));
            } else if (functionToReenter == FunctionToReenter.ExecuteMultipleTakerBids) {
                _executeMultipleTakerBids();
            }
        }

        return this.onERC1155Received.selector;
    }
}
