import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("HypercertMinter", function () {
  it("is upgradeable", async () => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const instance = await upgrades.deployProxy(HypercertMinter, {
      kind: "uups",
      unsafeAllow: ["constructor"],
      useDefenderDeploy: false,
    });

    await instance.waitForDeployment();
    const name = await instance.name();
    expect(name).to.equal("HypercertMinter");
    await expect(instance.initialize()).to.be.revertedWith("Initializable: contract is already initialized");
  });
});
