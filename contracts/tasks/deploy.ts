import { task } from "hardhat/config";
import { writeFile } from "node:fs/promises";

task("deploy-minter", "Deploy contracts and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, { ethers, upgrades }) => {
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

    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      try {
        const code = await hypercertMinter.instance?.provider.getCode(hypercertMinter.address);
        if (code === "0x") {
          console.log(`${hypercertMinter.name} contract deployment has not completed. waiting to verify...`);
          await hypercertMinter.instance?.deployed();
        }
        await hre.run("verify:verify", {
          address: hypercertMinter.address,
        });
      } catch ({ message }) {
        if ((message as string).includes("Reason: Already Verified")) {
          console.log("Reason: Already Verified");
        }
        console.error(message);
      }
    }
  });

task("deploy-trader", "Deploy HypercertTrader and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, { ethers, upgrades }) => {
    const HypercertTrader = await ethers.getContractFactory("HypercertTrader");
    const hypercertTrader = await upgrades.deployProxy(HypercertTrader, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });
    const contract = await hypercertTrader.deployed();
    console.log(`hypercertTrader is deployed to proxy address: ${hypercertTrader.address}`);

    // If the `deploymentFile` option is set then write the deployed address to
    // a json object on disk. This is intended to be deliberate with how we
    // output the contract address and other contract information.
    if (output) {
      const txReceipt = await contract.provider.getTransactionReceipt(hypercertTrader.deployTransaction.hash);
      await writeFile(
        output,
        JSON.stringify({
          address: hypercertTrader.address,
          blockNumber: txReceipt.blockNumber,
        }),
        "utf-8",
      );
    }

    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      try {
        const code = await hypercertTrader.instance?.provider.getCode(hypercertTrader.address);
        if (code === "0x") {
          console.log(`${hypercertTrader.name} contract deployment has not completed. waiting to verify...`);
          await hypercertTrader.instance?.deployed();
        }
        await hre.run("verify:verify", {
          address: hypercertTrader.address,
        });
      } catch ({ message }) {
        if ((message as string).includes("Reason: Already Verified")) {
          console.log("Reason: Already Verified");
        }
        console.error(message);
      }
    }
  });

task("deploy-hyperboard", "Deploy Hyperboard and verify")
  .addParam("hypercerts", "Hypercerts smart contract address")
  .addParam("name", "Hyperboards NFT name", "Hyperboard")
  .addParam("symbol", "Hyperboards NFT symbol", "HBRD")
  .addParam("subgraph", "Subgraph endpoint")
  .addParam("baseUri", "Base NFT metadata URI")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ hypercerts, name, symbol, subgraph, baseUri, output }, { ethers, upgrades }) => {
    const version = "1";
    const hyperboard = await ethers.deployContract("Hyperboard", [
      hypercerts,
      name,
      symbol,
      subgraph,
      baseUri,
      version,
    ]);
    const contract = await hyperboard.deployed();
    console.log(`hyperboard is deployed to address: ${hyperboard.address}`);

    // If the `deploymentFile` option is set then write the deployed address to
    // a json object on disk. This is intended to be deliberate with how we
    // output the contract address and other contract information.
    if (output) {
      const txReceipt = await contract.provider.getTransactionReceipt(hyperboard.deployTransaction.hash);
      await writeFile(
        output,
        JSON.stringify({
          address: hyperboard.address,
          blockNumber: txReceipt.blockNumber,
        }),
        "utf-8",
      );
    }

    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      try {
        const code = await hyperboard.instance?.provider.getCode(hyperboard.address);
        if (code === "0x") {
          console.log(`${hyperboard.name} contract deployment has not completed. waiting to verify...`);
          await hyperboard.instance?.deployed();
        }
        await hre.run("verify:verify", {
          address: hyperboard.address,
          constructorArguments: [hypercerts, name, symbol, subgraph, baseUri, version],
        });
      } catch ({ message }) {
        if ((message as string).includes("Reason: Already Verified")) {
          console.log("Reason: Already Verified");
        }
        console.error(message);
      }
    }
  });
