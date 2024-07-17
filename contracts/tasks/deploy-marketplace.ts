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

type TokenAddressType = { sepolia: string; [key: string]: string };

const WETH: TokenAddressType = {
  localhost: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", //dummy
  hardhat: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", //dummy
  sepolia: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  optimism: "0x4200000000000000000000000000000000000006",
};

// LINK faucet for Sepolia: https://faucets.chain.link/
const DAI: TokenAddressType = {
  localhost: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  hardhat: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  optimism: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
};

// USDC https://faucet.circle.com/
const USDC: TokenAddressType = {
  localhost: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  hardhat: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  optimism: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
};

const getTokenAddresses = (network: string) => {
  return {
    wethAddress: WETH[network],
    usdceAddress: USDC[network],
    daiAddress: DAI[network],
  };
};

const ADMIN_ACCOUNT: { [key: string]: string } = {
  localhost: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  hardhat: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  sepolia: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
};

const getAdminAccount = (network: string) => {
  return ADMIN_ACCOUNT[network];
};

const FEE_RECIPIENT: { [key: string]: string } = {
  localhost: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  hardhat: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
  sepolia: "0x4f37308832c6eFE5A74737955cBa96257d76De17",
};

const getFeeRecipient = (network: string) => {
  return FEE_RECIPIENT[network];
};

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

task("deploy-marketplace", "Deploy marketplace contracts and verify")
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

    // 10_000 = 100%
    // Sepolia admin Safe = sep:0x4f37308832c6eFE5A74737955cBa96257d76De17
    const marketplaceParameters = {
      owner: getAdminAccount(network.name), // hc admin safe
      protocolFeeRecipient: getFeeRecipient(network.name), // hc fee safe
      standardProtocolFeeBP: 100,
      minTotalFeeBp: 100,
      maxProtocolFeeBp: 200,
      royaltyFeeLimit: "1000",
    };

    const releaseVersion = "v1.0.1";

    const salt = slice(
      encodePacked(["address", "string", "address"], [deployer.account?.address, releaseVersion, create2Address]),
      0,
      32,
    );
    console.log("Calculated salt: ", salt);

    const contracts: ContractDeployments = {};

    const creatorFeeManagerContract = await hre.artifacts.readArtifact("CreatorFeeManagerWithRoyalties");
    const exchangeContract = await hre.artifacts.readArtifact("LooksRareProtocol");
    const transferManagerContract = await hre.artifacts.readArtifact("TransferManager");
    const orderValidatorContract = await hre.artifacts.readArtifact("OrderValidatorV2A");
    const strategyHypercertFractionOfferContract = await hre.artifacts.readArtifact("StrategyHypercertFractionOffer");
    const protocolFeeRecipientContract = await hre.artifacts.readArtifact("ProtocolFeeRecipient");
    const royaltyFeeRegistryContract = await hre.artifacts.readArtifact("RoyaltyFeeRegistry");

    const strategies = [
      {
        contract: strategyHypercertFractionOfferContract,
        name: "StrategyHypercertFractionOffer",
        isMakerBid: false,
        strategies: [
          "executeHypercertFractionStrategyWithTakerBid",
          "executeHypercertFractionStrategyWithTakerBidWithAllowlist",
        ],
      },
    ];

    // Create2 Transfermanager
    const transferManagerArgs = [deployer.account.address]; // initial owner is deployer
    console.log("TransferManager args: ", transferManagerArgs);
    const transferManagerCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: transferManagerContract.abi,
        bytecode: transferManagerContract.bytecode as `0x${string}`,
        args: transferManagerArgs,
      }),
      salt,
    );

    // Create2 ProtocolFeeRecipient
    const protocolFeeRecipientArgs = [marketplaceParameters.protocolFeeRecipient, wethAddress];
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

    // Create2 HypercertsExchange
    const hypercertsExchangeArgs = [
      deployer.account?.address, // initial owner is deployer
      protocolFeeRecipientCreate2.address,
      transferManagerCreate2.address,
      wethAddress,
    ];

    console.log("HypercertsExchange args: ", hypercertsExchangeArgs);

    const hypercertsExchangeCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: exchangeContract.abi,
        bytecode: exchangeContract.bytecode as `0x${string}`,
        args: hypercertsExchangeArgs,
      }),
      salt,
    );

    // Create2 RoyaltyFeeManager
    const royaltyFeeRegistryArgs = [marketplaceParameters.royaltyFeeLimit];

    console.log("RoyaltyFeeRegistry args: ", royaltyFeeRegistryArgs);

    const royaltyFeeRegistryCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: royaltyFeeRegistryContract.abi,
        bytecode: royaltyFeeRegistryContract.bytecode as `0x${string}`,
        args: royaltyFeeRegistryArgs,
      }),
      salt,
    );

    console.log("Calculated exchange address using CREATE2: ", hypercertsExchangeCreate2.address);
    console.log("Calculated transferManager address using CREATE2: ", transferManagerCreate2.address);
    console.log("Calculated protocolFeeRecipient address using CREATE2: ", protocolFeeRecipientCreate2.address);
    console.log("Calculated royaltyFeeRegistry address using CREATE2: ", royaltyFeeRegistryCreate2.address);

    // Deploy transferManager
    const transferManagerTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "TransferManager",
      transferManagerCreate2,
      transferManagerArgs,
    );

    contracts.TransferManager = {
      address: transferManagerCreate2.address,
      fullNamespace: "TransferManager",
      args: transferManagerArgs,
      encodedArgs: solidityPacked(["address"], transferManagerArgs),
      tx: transferManagerTx,
    };

    // Transfer 1 wei to hypercertsExchange
    await deployer.sendTransaction({
      to: hypercertsExchangeCreate2.address,
      value: 1n,
    });

    // Deploy ProtocolFeeRecipient
    const protocolFeeRecipientTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "ProtocolFeeRecipient",
      protocolFeeRecipientCreate2,
      protocolFeeRecipientArgs,
    );

    contracts.ProtocolFeeRecipient = {
      address: protocolFeeRecipientCreate2.address,
      fullNamespace: "ProtocolFeeRecipient",
      args: protocolFeeRecipientArgs,
      encodedArgs: solidityPacked(["address", "address"], protocolFeeRecipientArgs),
      tx: protocolFeeRecipientTx,
    };

    // Deploy HypercertsExchange
    const hypercertsExchangeTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "HypercertExchange",
      hypercertsExchangeCreate2,
      hypercertsExchangeArgs,
    );

    contracts.HypercertExchange = {
      address: hypercertsExchangeCreate2.address,
      fullNamespace: "LooksRareProtocol",
      args: hypercertsExchangeArgs,
      encodedArgs: solidityPacked(["address", "address", "address", "address"], hypercertsExchangeArgs),
      tx: hypercertsExchangeTx,
    };

    // Deploy RoyaltyFeeRegistry
    const royaltyFeeRegistryTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "RoyaltyFeeRegistry",
      royaltyFeeRegistryCreate2,
      royaltyFeeRegistryArgs,
    );

    contracts.RoyaltyFeeRegistry = {
      address: royaltyFeeRegistryCreate2.address,
      fullNamespace: "RoyaltyFeeRegistry",
      args: royaltyFeeRegistryArgs,
      encodedArgs: solidityPacked(["uint256"], royaltyFeeRegistryArgs),
      tx: royaltyFeeRegistryTx,
    };

    // Allow Exchange as operator on transferManager
    const transferManagerInstance = getContract({
      address: transferManagerCreate2.address,
      abi: transferManagerContract.abi,
      client: { public: publicClient, wallet: deployer },
    });

    // Deploy OrderValidator

    const orderValidatorArgs = [hypercertsExchangeCreate2.address];

    console.log("OrderValidator args: ", orderValidatorArgs);

    const orderValidatorCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: orderValidatorContract.abi,
        bytecode: orderValidatorContract.bytecode as `0x${string}`,
        args: orderValidatorArgs,
      }),
      salt,
    );

    const orderValidatorTx = await runCreate2Deployment(
      publicClient,
      create2Instance,
      "OrderValidatorV2A",
      orderValidatorCreate2,
      orderValidatorArgs,
    );

    console.log(
      orderValidatorTx.status === "success"
        ? "Deployed OrderValidator successfully"
        : "Failed to deploy OrderValidator",
    );

    contracts.OrderValidator = {
      address: orderValidatorCreate2.address,
      fullNamespace: "OrderValidatorV2A",
      args: orderValidatorArgs,
      encodedArgs: solidityPacked(["address"], orderValidatorArgs),
      tx: orderValidatorTx.transactionHash,
    };

    // Deploy CreatorFeeManager

    const creatorFeeManagerArgs = [royaltyFeeRegistryCreate2.address];

    console.log("CreatorFeeManager args: ", creatorFeeManagerArgs);
    const deployCreatorFeeManager = await deployer.deployContract({
      abi: creatorFeeManagerContract.abi,
      account: deployer.account,
      args: creatorFeeManagerArgs,
      bytecode: creatorFeeManagerContract.bytecode as `0x${string}`,
    });

    const creatorFeeManagerTx = await publicClient.waitForTransactionReceipt({
      hash: deployCreatorFeeManager,
    });

    console.log(
      creatorFeeManagerTx.status === "success"
        ? "Deployed CreatorFeeManager successfully"
        : "Failed to deploy CreatorFeeManager",
    );

    contracts.CreatorFeeManager = {
      address: creatorFeeManagerTx.contractAddress,
      fullNamespace: "CreatorFeeManagerWithRoyalties",
      args: creatorFeeManagerArgs,
      encodedArgs: solidityPacked(["address"], creatorFeeManagerArgs),
      tx: creatorFeeManagerTx.transactionHash,
    };

    await transferManagerInstance.write.allowOperator([hypercertsExchangeCreate2.address]);

    const hypercertsExchangeInstance = getContract({
      address: hypercertsExchangeCreate2.address,
      abi: exchangeContract.abi,
      client: { public: publicClient, wallet: deployer },
    });

    // Update currency status for accepted tokens
    await allowCurrency("0x0000000000000000000000000000000000000000", "native");
    await allowCurrency(wethAddress, "WETH");
    await allowCurrency(usdceAddress, "USDC");
    await allowCurrency(daiAddress, "DAI");

    // Update creatorFeeManager address
    const updateCreatorFeeManager = await hypercertsExchangeInstance.write.updateCreatorFeeManager([
      creatorFeeManagerTx.contractAddress,
    ]);

    const updateCreatorFeeManagerTx = await publicClient.waitForTransactionReceipt({
      hash: updateCreatorFeeManager,
    });

    console.log(
      updateCreatorFeeManagerTx.status === "success"
        ? "Updated creatorFeeManager successfully"
        : "Failed to update creatorFeeManager",
    );

    // DEPLOYING STRATEGIES

    console.log("Deploying and adding strategies....");

    await addStrategiesToExchange(strategies, marketplaceParameters);

    console.log("Creating proposal for new owner...");

    const ownershipTransferTx = await hypercertsExchangeInstance.write.initiateOwnershipTransfer([
      marketplaceParameters.owner,
    ]);

    const ownershipTransferReceipt = await publicClient.waitForTransactionReceipt({
      hash: ownershipTransferTx,
    });

    console.log(
      ownershipTransferReceipt.status === "success"
        ? "Ownership transfer initiated successfully"
        : "Failed to initiate ownership transfer",
    );

    console.log("🚀 Done!");

    // Validate
    if (network.name !== "hardhat" && network.name !== "localhost") {
      // Write deployment details to file
      console.log("Writing deployment details to file...");
      await writeFile(
        `src/deployments/deployment-marketplace-${network.name}.json`,
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

    async function addStrategiesToExchange(
      strategies: {
        contract: any;
        name: string;
        isMakerBid: boolean;
        strategies: string[];
      }[],
      marketplaceParameters: {
        standardProtocolFeeBP: number;
        minTotalFeeBp: number;
        maxProtocolFeeBp: number;
      },
    ) {
      for (const strategy of strategies) {
        // Deploy strategy
        const deployStrategy = await deployer.deployContract({
          abi: strategy.contract.abi,
          account: deployer.account,
          args: [],
          bytecode: strategy.contract.bytecode as `0x${string}`,
        });

        const strategyTx = await publicClient.waitForTransactionReceipt({
          hash: deployStrategy,
        });

        console.log(
          strategyTx.status === "success"
            ? `Deployed ${strategy.name} successfully`
            : `Failed to deploy ${strategy.name}`,
        );

        // Add strategies to HypercertsExchange
        const strategyFactory = await ethers.getContractFactory(strategy.name);

        for (const strat of strategy.strategies) {
          const addStrat = await hypercertsExchangeInstance.write.addStrategy([
            marketplaceParameters.standardProtocolFeeBP,
            marketplaceParameters.minTotalFeeBp,
            marketplaceParameters.maxProtocolFeeBp,
            strategyFactory.interface.getFunction(strat)?.selector,
            strategy.isMakerBid,
            strategyTx.contractAddress,
          ]);

          console.log(`Adding strategy ${strat} to exchange...`);
          const addStratTx = await publicClient.waitForTransactionReceipt({
            hash: addStrat,
          });

          console.log(
            addStratTx.status === "success"
              ? `Added strategy ${strat} to exchange successfully`
              : `Failed to add ${strat}`,
          );
        }

        contracts[strategy.name] = {
          address: strategyTx.contractAddress,
          fullNamespace: strategy.name,
          args: [],
          encodedArgs: solidityPacked([], []),
          tx: strategyTx.transactionHash,
        };
      }
    }

    async function allowCurrency(tokenAddress: string, name?: string) {
      const hash = await hypercertsExchangeInstance.write.updateCurrencyStatus([tokenAddress, true]);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log(
        receipt.status === "success"
          ? `Updated currency status for  ${tokenAddress} (${name}) successfully`
          : `Failed to update currency status for ${tokenAddress} (${name})`,
      );
    }
  });
