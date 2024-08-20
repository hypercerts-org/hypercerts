import { task } from "hardhat/config";

task("force-import", "Deploy contracts and verify")
  .addParam("proxy", "Proxy contract address")
  .setAction(async ({ proxy }, { ethers, upgrades }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const hypercertMinter = await upgrades.forceImport(proxy, HypercertMinter, {
      kind: "uups",
    });
    console.log(`HypercertMinter imported: ${hypercertMinter}`);
    console.log(Object.keys(hypercertMinter));
  });
