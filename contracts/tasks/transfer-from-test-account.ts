// Transfer eth from a test account
import { task } from "hardhat/config";

task("transfer-from-test-account", "Transfer localchain ETH from a test account to a different account")
  .addParam("dest", "Destination address")
  .addParam("amount", "Token amount")
  .setAction(async ({ dest, amount }, { ethers }) => {
    const accounts = await ethers.getSigners();
    // We should refuse to send if this isn't a test address
    if (accounts[0].address !== "0xd671a2dD41365e49564d0fCF5F464EAF2E32ebFC") {
      console.log("Not transferring tokens from a non-test account");
    }
    const tx = {
      to: dest,
      value: ethers.utils.parseEther(amount),
    };
    await accounts[0].sendTransaction(tx);
  });
