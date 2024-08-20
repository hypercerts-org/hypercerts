import { task } from "hardhat/config";

task("deploy-propose-upgrade", "Validate, deploy and verify an upgraded implementation")
  .addParam("proxy", "Provider current proxy address")
  .setAction(async ({ proxy }, { ethers, upgrades, network, run }) => {
    console.log("network: ", network);
    console.log("Using address: ", await ethers.getSigners().then((res) => res[0].address));
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");

    console.log("Validating implementation..");
    await upgrades
      .validateImplementation(HypercertMinter, { kind: "uups" })
      .then(() => console.log("Valid implementation"));

    console.log("Preparing upgrade..");
    const newImplementationAddress = await upgrades
      .prepareUpgrade(proxy, HypercertMinter, {
        useDefenderDeploy: false,
        redeployImplementation: "always",
        kind: "uups",
      })
      .then((res) => {
        return res;
      });

    console.log(`Deployed upgraded contract to ${newImplementationAddress}`);

    if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log(`Starting verification process...`);

      try {
        const code = await ethers.provider.getCode(newImplementationAddress);
        if (code === "0x") {
          console.log(`Contract deployment has not completed. waiting to verify...`);
          await HypercertMinter.attach(newImplementationAddress).deployed();
        }

        await run("verify:verify", {
          address: newImplementationAddress,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        if (errorMessage.includes("Reason: Already Verified")) {
          console.log("Reason: Already Verified");
        }
        console.error(errorMessage);
      }
    }

    console.log(`Done 🚀`);
  });
