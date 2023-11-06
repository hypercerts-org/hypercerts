// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

contract MockSmartWallet {
    address public owner;

    bytes4 internal constant MAGICVALUE = bytes4(keccak256("isValidSignature(bytes32,bytes)"));

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert("Unauthorized");
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function executeBatch(address[] calldata dest, bytes[] calldata calldata_) external onlyOwner {
        if (dest.length != calldata_.length) {
            revert("Invalid array length");
        }
        for (uint256 i = 0; i < dest.length; ++i) {
            execute(dest[i], 0, calldata_[i]);
        }
    }

    function isValidSignature(bytes32 _hash, bytes memory _signature) external view returns (bytes4 magicValue) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        address recovered = ecrecover(_hash, v, r, s);
        if (recovered == address(0)) {
            revert("Invalid signature");
        }
        if (owner != recovered) {
            revert("Invalid signer");
        }

        return MAGICVALUE;
    }

    function execute(address dest, uint256 value, bytes calldata calldata_) public onlyOwner {
        (bool success, bytes memory result) = dest.call{value: value}(calldata_);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }
}
