import { task } from "hardhat/config";

task("pause", "Pause deployed HypercertMinter contract")
  .addParam("address", "contract address")
  .setAction(async ({ address }, { ethers }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const hypercertMinter = await HypercertMinter.attach(address);

    const pauseTransaction = await hypercertMinter.pause();
    console.log("Sent pause transaction, waiting for transaction receipt...");

    const pauseReceipt = await pauseTransaction.wait();
    if (pauseReceipt == null || pauseReceipt.status == 0) {
      console.error(pauseReceipt);
      console.error("Transaction failed, failed to pause contract");
      return;
    }

    console.log(`Transaction succeeded. Transaction Hash: ${pauseReceipt.transactionHash}`);

    const isPaused = await hypercertMinter.paused();
    if (!isPaused) {
      console.error("Verification failed: the contract is not paused. This is a big deal.");
      return;
    }

    console.log(`Successfully verified that the HypercertMinter contract was paused. Contract address: ${address}`);
  });
