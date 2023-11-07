import { task } from "hardhat/config";

task("transfer-owner-minter", "Transfer ownership of ProxyAdmin contract HypercertMinter")
  .addParam("proxy", "Proxy contract address")
  .addParam("owner", "Address of new owner")
  .setAction(async ({ proxy, owner }, { ethers, upgrades }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    const hypercertMinter = await HypercertMinter.attach(proxy);

    console.log("Transferring ownership of proxy contract...");
    const transferTransaction = await hypercertMinter.transferOwnership(owner);
    console.log("Sent transfer transaction, waiting for transaction receipt...");

    const transferReceipt = await transferTransaction.wait();
    if (transferReceipt == null || transferReceipt.status == 0) {
      console.error(transferReceipt);
      console.error("Transaction failed, failed to transfer contract");
      return;
    }

    console.log(`Transaction succeeded. Transaction Hash: ${transferReceipt.transactionHash}`);

    const newOwner = await hypercertMinter.owner();
    if (newOwner !== owner) {
      console.error(`Verification failed: the contract is owned by ${newOwner}.`);
      return;
    }

    console.log(`Successfully verified that the HypercertMinter contract was transferred. Contract address: ${proxy}`);
  });

task("transfer-owner-trader", "Transfer ownership of ProxyAdmin contract HypercertTrader")
  .addParam("proxy", "Proxy contract address")
  .addParam("owner", "Address of new owner")
  .setAction(async ({ proxy, owner }, { ethers, upgrades }) => {
    const HypercertTrader = await ethers.getContractFactory("HypercertTrader");
    const hypercertTrader = await HypercertTrader.attach(proxy);

    console.log("Transferring ownership of proxy contract...");
    const transferTransaction = await hypercertTrader.transferOwnership(owner);
    console.log("Sent transfer transaction, waiting for transaction receipt...");

    const transferReceipt = await transferTransaction.wait();
    if (transferReceipt == null || transferReceipt.status == 0) {
      console.error(transferReceipt);
      console.error("Transaction failed, failed to transfer contract");
      return;
    }

    console.log(`Transaction succeeded. Transaction Hash: ${transferReceipt.transactionHash}`);

    const newOwner = await hypercertTrader.owner();
    if (newOwner !== owner) {
      console.error(`Verification failed: the contract is owned by ${newOwner}.`);
      return;
    }

    console.log(`Successfully verified that the HypercertTrader contract was transferred. Contract address: ${proxy}`);
  });
