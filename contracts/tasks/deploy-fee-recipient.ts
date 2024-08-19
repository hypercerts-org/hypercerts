import { task } from "hardhat/config";
import { solidityPacked } from "ethers";
import {
  getContractAddress,
  slice,
  encodeDeployData,
  getContract,
  WalletClient,
  encodePacked,
  PublicClient,
} from "viem";
import { writeFile } from "node:fs/promises";
import { getAdminAccount, getFeeRecipient, getTokenAddresses } from "./config";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getCreate2Address = async (
  deployer: WalletClient,
  factory: `0x${string}`,
  bytecode: `0x${string}`,
  salt: `0x${string}`,
) => {
  if (!deployer.account?.address) {
    throw new Error("Deployer account is undefined");
  }

  const address = getContractAddress({
    from: factory,
    salt,
    opcode: "CREATE2",
    bytecode,
  });
  return { address, salt, deployData: bytecode };
};

const runCreate2Deployment = async (
  publicClient: PublicClient,
  create2Instance: ReturnType<typeof getContract>,
  contractName: string,
  create2: {
    address: `0x${string}`;
    salt: `0x${string}`;
    deployData: `0x${string}`;
  },
  args: string[],
) => {
  console.log(`deploying ${contractName} with args: ${args}`);
  const { request } = await publicClient.simulateContract({
    address: create2Instance.address,
    abi: create2Instance.abi,
    functionName: "safeCreate2",
    args: [create2.salt, create2.deployData],
    account: "0xdc6d6f9ab5fcc398b92b017e8482749ae5afbf35",
  });

  const hash = await create2Instance.write.safeCreate2([create2.salt, create2.deployData]);
  const deployTx = await publicClient.waitForTransactionReceipt({
    hash,
  });

  console.log(
    deployTx.status === "success" ? `Deployed ${contractName} successfully` : `Failed to deploy ${contractName}`,
  );

  return hash;
};

interface ContractDeployment {
  address: string;
  fullNamespace: string;
  args: string[];
  encodedArgs: string;
  tx: `0x${string}`;
}

type ContractDeployments = {
  [name: string]: ContractDeployment;
};

task("deploy-fee-recipient", "Deploy marketplace fee recipient and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, hre) => {
    //TODO multichain support
    const { ethers, network, run, viem } = hre;
    const create2Address = "0x0000000000ffe8b47b3e2130213b802212439497";
    const { wethAddress, usdceAddress, daiAddress } = getTokenAddresses(network.name);

    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    const create2Instance = await viem.getContractAt("IImmutableCreate2Factory", create2Address, {
      walletClient: deployer,
    });

    console.log("Deployer: ", deployer.account.address);

    const releaseVersion = "v1.0.2";

    const salt = slice(
      encodePacked(["address", "string", "address"], [deployer.account?.address, releaseVersion, create2Address]),
      0,
      32,
    );
    console.log("Calculated salt: ", salt);

    const contracts: ContractDeployments = {};

    const protocolFeeRecipientContract = await hre.artifacts.readArtifact("ProtocolFeeRecipient");

    // Create2 ProtocolFeeRecipient
    const protocolFeeRecipientArgs = [getFeeRecipient(network.name), wethAddress];
    console.log("ProtocolFeeRecipient args: ", protocolFeeRecipientArgs);
    const protocolFeeRecipientCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: protocolFeeRecipientContract.abi,
        bytecode: protocolFeeRecipientContract.bytecode as `0x${string}`,
        args: protocolFeeRecipientArgs,
      }),
      salt,
    );

    // Deploy ProtocolFeeRecipient
    const protocolFeeRecipientTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "ProtocolFeeRecipient",
      protocolFeeRecipientCreate2,
      protocolFeeRecipientArgs,
    );

    // Add to deployed contracts object
    contracts.ProtocolFeeRecipient = {
      address: protocolFeeRecipientCreate2.address,
      fullNamespace: "ProtocolFeeRecipient",
      args: protocolFeeRecipientArgs,
      encodedArgs: solidityPacked(["address", "address"], protocolFeeRecipientArgs),
      tx: protocolFeeRecipientTx,
    };

    await sleep(2000);

    console.log("🚀 Done!");

    // Validate
    if (network.name !== "hardhat" && network.name !== "localhost") {
      // Write deployment details to file
      console.log("Writing deployment details to file. Make sure to update the marketplace deployment file");
      await writeFile(
        `src/deployments/deployment-fee-recipeint-${network.name}.json`,
        JSON.stringify(contracts),
        "utf-8",
      );

      // Verify contracts
      console.log("Verifying contracts...");
      for (const [name, { address, tx, args }] of Object.entries(contracts)) {
        try {
          console.log(`Verifying ${name}...`);

          const code = await publicClient.getBytecode({ address: address as `0x${string}` });
          if (code === "0x") {
            console.log(`${name} contract deployment has not completed. waiting to verify...`);
            const receipt = await publicClient.waitForTransactionReceipt({
              hash: tx,
            });

            await run("verify:verify", {
              address: receipt.contractAddress,
              constructorArguments: args,
            });
          } else {
            await run("verify:verify", {
              address,
              constructorArguments: args,
            });
          }
        } catch (error) {
          const errorMessage = (error as Error).message;

          if (errorMessage.includes("Reason: Already Verified")) {
            console.log("Reason: Already Verified");
          }
          console.error(errorMessage);
        }
      }
    }
  });
