// Transfer eth from a test account so this can be used in metamask for either
// automated or local testing
import { recoverPublicKey } from "ethers/lib/utils";
import { task, types } from "hardhat/config";
import { setTimeout } from "timers/promises";

task("test-tx-client", "For testing only: generates transactions")
  .addOptionalParam("delayMs", "the delay between transactions", 1000, types.int)
  .setAction(async ({ delayMs }, { ethers }) => {
    const hre = require("hardhat");
    const accounts = await ethers.getSigners();
    // We should refuse to send if this isn't a test network
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.error("Not transferring tokens from a non-test account");
      return;
    }
    // Start on an account that isn't the first since we use that for testing
    const offset = 1;
    let src = accounts[1];
    let dest = accounts[2];
    let isOn = true;
    let counter = 1;

    process.on("SIGTERM", () => {
      isOn = false;
    });

    process.on("SIGINT", () => {
      isOn = false;
    });

    while (isOn) {
      let tx = {
        to: dest.address,
        value: ethers.utils.parseEther("0.01"),
      };
      const resp = await src.sendTransaction(tx);
      const receipt = await resp.wait(1);
      console.log(`sent a transaction from ${src.address} to ${dest.address} on block ${receipt.blockNumber}`);
      dest = accounts[(counter % 2) + offset];
      src = accounts[((counter + 1) % 2) + offset];
      await setTimeout(delayMs);
      counter += 1;
    }
  });
