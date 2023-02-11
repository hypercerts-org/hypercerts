import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

import { HypercertMinter } from "../typechain";

describe("Hypercert Minter", function () {
  it("is upgradeable", async () => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const instance = <HypercertMinter>await upgrades.deployProxy(HypercertMinter, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });

    const name = await instance.name();
    expect(name).to.equal("HypercertMinter");
    await expect(instance.initialize()).to.be.revertedWith("Initializable: contract is already initialized");
  });
});
