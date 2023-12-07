// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Test} from "forge-std/Test.sol";

// Assembly
import {
    OutsideOfTimeRange_error_selector,
    OutsideOfTimeRange_error_length,
    Error_selector_offset
} from "@hypercerts/marketplace/constants/AssemblyConstants.sol";

contract NonAssemblyCode {
    error OutsideOfTimeRange();

    function run(uint256 startTime, uint256 endTime) external view returns (bool) {
        if (startTime > block.timestamp || endTime < block.timestamp) revert OutsideOfTimeRange();
        return true;
    }
}

contract AssemblyCode {
    function run(uint256 startTime, uint256 endTime) external view returns (bool) {
        assembly {
            if or(gt(startTime, timestamp()), lt(endTime, timestamp())) {
                mstore(0x00, OutsideOfTimeRange_error_selector)
                revert(Error_selector_offset, OutsideOfTimeRange_error_length)
            }
        }
        return true;
    }
}

contract VerifyOrderTimestampValidityEquivalenceTest is Test {
    AssemblyCode private assemblyCode;
    NonAssemblyCode private nonAssemblyCode;

    function setUp() public {
        assemblyCode = new AssemblyCode();
        nonAssemblyCode = new NonAssemblyCode();
    }

    /**
     * @dev The gap between start and end time is always at least
     *      3 seconds so that we can test the 2 boundaries as well
     *      as the 2 timestamps inside the boundaries
     */
    function testEquivalenceWithinBoundaries(uint256 startTime, uint256 endTime) public {
        vm.assume(endTime > 3 && startTime < endTime - 3);

        vm.warp(startTime);
        assertTrue(assemblyCode.run(startTime, endTime));
        assertTrue(nonAssemblyCode.run(startTime, endTime));

        vm.warp(startTime + 1);
        assertTrue(assemblyCode.run(startTime, endTime));
        assertTrue(nonAssemblyCode.run(startTime, endTime));

        vm.warp(endTime - 1);
        assertTrue(assemblyCode.run(startTime, endTime));
        assertTrue(nonAssemblyCode.run(startTime, endTime));

        vm.warp(endTime);
        assertTrue(assemblyCode.run(startTime, endTime));
        assertTrue(nonAssemblyCode.run(startTime, endTime));
    }

    function testEquivalenceTooEarly(uint256 startTime, uint256 endTime) public {
        vm.assume(startTime > 0 && startTime < endTime);

        vm.warp(startTime - 1);

        vm.expectRevert(NonAssemblyCode.OutsideOfTimeRange.selector);
        assemblyCode.run(startTime, endTime);

        vm.expectRevert(NonAssemblyCode.OutsideOfTimeRange.selector);
        nonAssemblyCode.run(startTime, endTime);
    }

    function testEquivalenceTooLate(uint256 startTime, uint256 endTime) public {
        vm.assume(endTime > 0 && endTime < type(uint256).max && startTime < endTime);

        vm.warp(endTime + 1);

        vm.expectRevert(NonAssemblyCode.OutsideOfTimeRange.selector);
        assemblyCode.run(startTime, endTime);

        vm.expectRevert(NonAssemblyCode.OutsideOfTimeRange.selector);
        nonAssemblyCode.run(startTime, endTime);
    }
}
