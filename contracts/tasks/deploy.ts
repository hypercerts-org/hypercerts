import { task } from "hardhat/config";
import { writeFile } from "node:fs/promises";

task("deploy-minter", "Deploy contracts and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, { ethers, upgrades, network, run }) => {
    console.log("Using address: ", await ethers.getSigners().then((res) => res[0]));
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const hypercertMinter = await upgrades.deployProxy(HypercertMinter, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });
    const contract = await hypercertMinter.deployed();
    console.log(`HypercertMinter is deployed to proxy address: ${hypercertMinter.address}`);

    // If the `deploymentFile` option is set then write the deployed address to
    // a json object on disk. This is intended to be deliberate with how we
    // output the contract address and other contract information.
    if (output) {
      const txReceipt = await contract.provider.getTransactionReceipt(hypercertMinter.deployTransaction.hash);
      await writeFile(
        output,
        JSON.stringify({
          address: hypercertMinter.address,
          blockNumber: txReceipt.blockNumber,
        }),
        "utf-8",
      );
    }

    if (network.name !== "hardhat" && network.name !== "localhost") {
      try {
        const code = await hypercertMinter.instance?.provider.getCode(hypercertMinter.address);
        if (code === "0x") {
          console.log(`${hypercertMinter.name} contract deployment has not completed. waiting to verify...`);
          await hypercertMinter.instance?.deployed();
        }
        await run("verify:verify", {
          address: hypercertMinter.address,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        if (errorMessage.includes("Reason: Already Verified")) {
          console.log("Reason: Already Verified");
        }
        console.error(errorMessage);
      }
    }
  });
