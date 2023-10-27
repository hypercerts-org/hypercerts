// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {OwnableTwoSteps} from "@looksrare/contracts-libs/contracts/OwnableTwoSteps.sol";

/**
 * @title BaseStrategyChainlinkPriceLatency
 * @notice This contract allows the owner to define the maximum acceptable Chainlink price latency.
 * @author LooksRare protocol team (👀,💎)
 */
contract BaseStrategyChainlinkPriceLatency is OwnableTwoSteps {
    /**
     * @notice Maximum latency accepted after which
     *         the execution strategy rejects the retrieved price.
     *
     *         For ETH, it cannot be higher than 3,600 as Chainlink will at least update the
     *         price every 3,600 seconds, provided ETH's price does not deviate more than 0.5%.
     *
     *         For NFTs, it cannot be higher than 86,400 as Chainlink will at least update the
     *         price every 86,400 seconds, provided ETH's price does not deviate more than 2%.
     */
    uint256 public immutable maxLatency;

    /**
     * @notice Constructor
     * @param _owner Owner address
     * @param _maxLatency Maximum price latency allowed
     */
    constructor(address _owner, uint256 _maxLatency) OwnableTwoSteps(_owner) {
        maxLatency = _maxLatency;
    }
}
