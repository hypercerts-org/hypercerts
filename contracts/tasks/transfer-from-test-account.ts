// Transfer eth from a test account so this can be used in metamask for either
// automated or local testing
import { task } from "hardhat/config";

task("transfer-from-test-account", "Transfer localchain tokens from a test account to an arbitrary account")
  .addParam("dest", "Destination address")
  .addParam("amount", "Token amount")
  .setAction(async ({ dest, amount }, { ethers }) => {
    const hre = require("hardhat");
    const accounts = await ethers.getSigners();

    // We should refuse to send if this isn't a test network
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.error("Not transferring tokens from a non-test account");
      return;
    }
    const tx = {
      to: dest,
      value: ethers.utils.parseEther(amount),
    };
    await accounts[0].sendTransaction(tx);
  });
