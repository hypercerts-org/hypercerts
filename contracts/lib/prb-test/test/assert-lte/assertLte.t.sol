// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import { PRBTestTest } from "../PRBTestTest.t.sol";

contract PRBTestTest__AssertLte is PRBTestTest {
    function testAssertLte__Fail(int256 a, int256 b) external {
        vm.assume(a > b);

        vm.expectEmit(false, false, false, true);
        emit Log("Error: a <= b not satisfied [int256]");
        prbTest._assertLte(a, b, EXPECT_FAIL);
    }

    function testAssertLte__Err__Fail(int256 a, int256 b) external {
        vm.assume(a > b);

        vm.expectEmit(false, false, false, true);
        emit LogNamedString("Error", ERR);
        prbTest._assertLte(a, b, ERR, EXPECT_FAIL);
    }

    function testAssertLte__Err__Pass(int256 a, int256 b) external {
        vm.assume(a <= b);

        prbTest._assertLte(a, b, ERR, EXPECT_PASS);
    }

    function testAssertLte__Pass(int256 a, int256 b) external {
        vm.assume(a <= b);

        prbTest._assertLte(a, b, EXPECT_PASS);
    }

    function testAssertLte__Fail(uint256 a, uint256 b) external {
        vm.assume(a > b);

        vm.expectEmit(false, false, false, true);
        emit Log("Error: a <= b not satisfied [uint256]");
        prbTest._assertLte(a, b, EXPECT_FAIL);
    }

    function testAssertLte__Err__Fail(uint256 a, uint256 b) external {
        vm.assume(a > b);

        vm.expectEmit(false, false, false, true);
        emit LogNamedString("Error", ERR);
        prbTest._assertLte(a, b, ERR, EXPECT_FAIL);
    }

    function testAssertLte__Err__Pass(uint256 a, uint256 b) external {
        vm.assume(a <= b);

        prbTest._assertLte(a, b, ERR, EXPECT_PASS);
    }

    function testAssertLte__Pass(uint256 a, uint256 b) external {
        vm.assume(a <= b);

        prbTest._assertLte(a, b, EXPECT_PASS);
    }
}
