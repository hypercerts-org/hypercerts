import { task } from "hardhat/config";

task("validate-upgrade", "Verify implementation upgrades")
  .addParam("proxy", "Provider current proxy address")
  .setAction(async ({ proxy }, { ethers, upgrades }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");

    console.log("Validating implementation..");
    await upgrades
      .validateImplementation(HypercertMinter, { kind: "uups" })
      .then(() => console.log("Valid implementation"));

    console.log("Validating upgrade..");
    await upgrades
      .validateUpgrade(proxy, HypercertMinter, { kind: "uups" })
      .then(() => console.log("Valid upgrade"))
      .catch((error) => {
        console.error(error);
      });
  });
