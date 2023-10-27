// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {MaliciousERC1271Wallet} from "./MaliciousERC1271Wallet.sol";

contract MaliciousIsValidSignatureERC1271Wallet is MaliciousERC1271Wallet {
    constructor(address _looksRareProtocol) MaliciousERC1271Wallet(_looksRareProtocol) {}

    function isValidSignature(bytes32, bytes calldata signature) external override returns (bytes4 magicValue) {
        if (functionToReenter == FunctionToReenter.ExecuteTakerAsk) {
            _executeTakerAsk(signature);
        } else if (functionToReenter == FunctionToReenter.ExecuteTakerBid) {
            _executeTakerBid(signature);
        } else if (functionToReenter == FunctionToReenter.ExecuteMultipleTakerBids) {
            _executeMultipleTakerBids();
        }

        magicValue = this.isValidSignature.selector;
    }
}
