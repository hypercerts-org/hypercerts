import { task } from "hardhat/config";
import { getAddress, getContract } from "viem";
import { writeFile } from "node:fs/promises";
import { deployments } from "src";
import deployments_marketplace_sepolia from "../src/deployments/deployment-marketplace-sepolia.json";

task("propose-owner-marketplace", "Propose a new owner for the marketplace contract")
  .addParam("propose", "address to propose")
  .setAction(async ({ output, propose }, hre) => {
    //TODO multichain support
    const { ethers, network, run, viem } = hre;
    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    const exchangeContract = await hre.artifacts.readArtifact("LooksRareProtocol");
    const transferManagerContract = await hre.artifacts.readArtifact("TransferManager");

    const proposedOwner = getAddress(propose);
    const heAddress = getAddress(deployments_marketplace_sepolia.HypercertExchange.address);
    const tmAddress = getAddress(deployments_marketplace_sepolia.TransferManager.address);

    const transferManagerInstance = getContract({
      address: tmAddress,
      abi: transferManagerContract.abi,
      publicClient,
      walletClient: deployer,
    });

    const hypercertsExchangeInstance = getContract({
      address: heAddress,
      abi: exchangeContract.abi,
      publicClient,
      walletClient: deployer,
    });

    // Transfer ownership to admin
    console.log(`Proposing ownership transfer to ${proposedOwner}`);
    const tmHash = await transferManagerInstance.write.initiateOwnershipTransfer([proposedOwner]);
    const heHash = await hypercertsExchangeInstance.write.initiateOwnershipTransfer([proposedOwner]);

    console.log(`TransferManager proposal tx: ${tmHash}`);
    console.log(`HypercertsExchange proposal tx: ${heHash}`);
  });
