import { task } from "hardhat/config";

task("unpause", "Unpause deployed HypercertMinter contract")
  .addParam("address", "contract address")
  .setAction(async ({ address }, { ethers }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const hypercertMinter = await HypercertMinter.attach(address);

    const unpauseTransaction = await hypercertMinter.unpause();
    console.log("Sent pause transaction, waiting for transaction receipt...");

    const unpauseReceipt = await unpauseTransaction.wait();
    if (unpauseReceipt == null || unpauseReceipt.status == 0) {
      console.error(unpauseReceipt);
      console.error("Transaction failed, failed to unpause contract");
      return;
    }

    console.log(`Transaction succeeded. Transaction Hash: ${unpauseReceipt.transactionHash}`);

    const isPaused = await hypercertMinter.paused();
    if (isPaused) {
      console.error("Verification failed: the contract is still paused");
      return;
    }

    console.log(
      `Successfully verified that the HypercertMinter contract is no longer paused. Contract address: ${address}`,
    );
  });
