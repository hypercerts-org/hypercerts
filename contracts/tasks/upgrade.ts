import { task } from "hardhat/config";

task("upgrade", "Upgrade implementation contract and verify")
  .addParam("proxy", "Provider proxy address")
  .setAction(async ({ proxy }, { ethers, upgrades }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");

    // Validate (redundant?)
    console.log("Validating upgrade..");
    await upgrades.validateUpgrade(proxy, HypercertMinter).then(() => console.log("Valid upgrade. Deploying.."));

    // Upgrade
    const hypercertMinterUpgrade = await upgrades.upgradeProxy(proxy, HypercertMinter, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });
    await hypercertMinterUpgrade.deployed();
    console.log(`HypercertMinter at proxy address ${hypercertMinterUpgrade.address} was upgraded`);

    try {
      const code = await hypercertMinterUpgrade.instance?.provider.getCode(hypercertMinterUpgrade.address);
      if (code === "0x") {
        console.log(`${hypercertMinterUpgrade.name} contract upgrade has not completed. waiting to verify...`);
        await hypercertMinterUpgrade.instance?.deployed();
      }
      await hre.run("verify:verify", {
        address: hypercertMinterUpgrade.address,
      });
    } catch ({ message }) {
      if ((message as string).includes("Reason: Already Verified")) {
        console.log("Reason: Already Verified");
      }
      console.error(message);
    }
  });
