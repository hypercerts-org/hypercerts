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

type WETHType = { sepolia: string; [key: string]: string };

const WETH: WETHType = {
  localhost: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", //dummy
  hardhat: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", //dummy
  sepolia: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
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
    const owner = "0xdf2C3dacE6F31e650FD03B8Ff72beE82Cb1C199A";
    const create2Address = "0x0000000000ffe8b47b3e2130213b802212439497";
    const wethAddress = WETH[network.name];

    if (!wethAddress) {
      throw new Error("WETH address not found for network");
    }

    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    const create2Instance = await viem.getContractAt("IImmutableCreate2Factory", create2Address, {
      walletClient: deployer,
    });

    console.log("Deployer: ", deployer.account.address);

    const _standardProtocolFeeBP = 50;
    const _minTotalFeeBp = 50;
    const _maxProtocolFeeBp = 200;

    const releaseCounter = "v0.7";

    const salt = slice(
      encodePacked(["address", "string", "address"], [deployer.account?.address, releaseCounter, create2Address]),
      0,
      32,
    );
    console.log("Calculated salt: ", salt);

    const contracts: ContractDeployments = {};

    const creatorFeeManagerContract = await hre.artifacts.readArtifact("CreatorFeeManagerWithRoyalties");
    const exchangeContract = await hre.artifacts.readArtifact("LooksRareProtocol");
    const transferManagerContract = await hre.artifacts.readArtifact("TransferManager");
    const orderValidatorContract = await hre.artifacts.readArtifact("OrderValidatorV2A");
    const strategyCollectionOfferContract = await hre.artifacts.readArtifact("StrategyCollectionOffer");
    const strategyDutchAuctionContract = await hre.artifacts.readArtifact("StrategyDutchAuction");
    const strategyItemIdsRangeContract = await hre.artifacts.readArtifact("StrategyItemIdsRange");
    const strategyHypercertCollectionOfferContract = await hre.artifacts.readArtifact(
      "StrategyHypercertCollectionOffer",
    );
    const strategyHypercertDutchAuctionContract = await hre.artifacts.readArtifact("StrategyHypercertDutchAuction");
    const strategyHypercertFractionOfferContract = await hre.artifacts.readArtifact("StrategyHypercertFractionOffer");
    const protocolFeeRecipientContract = await hre.artifacts.readArtifact("ProtocolFeeRecipient");
    const royaltyFeeRegistryContract = await hre.artifacts.readArtifact("RoyaltyFeeRegistry");

    const strategies = [
      {
        contract: strategyCollectionOfferContract,
        name: "StrategyCollectionOffer",
        isMakerBid: true,
        strategies: [
          "executeCollectionStrategyWithTakerAsk",
          "executeCollectionStrategyWithTakerAskWithProof",
          "executeCollectionStrategyWithTakerAskWithAllowlist",
        ],
      },
      {
        contract: strategyDutchAuctionContract,
        name: "StrategyDutchAuction",
        isMakerBid: false,
        strategies: ["executeStrategyWithTakerBid"],
      },
      {
        contract: strategyItemIdsRangeContract,
        name: "StrategyItemIdsRange",
        isMakerBid: true,
        strategies: ["executeStrategyWithTakerAsk"],
      },
      {
        contract: strategyHypercertCollectionOfferContract,
        name: "StrategyHypercertCollectionOffer",
        isMakerBid: true,
        strategies: [
          "executeHypercertCollectionStrategyWithTakerAsk",
          "executeHypercertCollectionStrategyWithTakerAskWithProof",
          "executeHypercertCollectionStrategyWithTakerAskWithAllowlist",
        ],
      },
      {
        contract: strategyHypercertDutchAuctionContract,
        name: "StrategyHypercertDutchAuction",
        isMakerBid: false,
        strategies: ["executeStrategyWithTakerBid"],
      },
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
    const transferManagerArgs = [deployer.account.address];
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
    const protocolFeeRecipientArgs = [deployer.account.address, wethAddress];
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
      deployer.account.address,
      protocolFeeRecipientCreate2.address,
      transferManagerCreate2.address,
      wethAddress,
    ];

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
    const royaltyFeeRegistryArgs = ["1000"];

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
      publicClient,
      walletClient: deployer,
    });

    // Deploy OrderValidator

    const orderValidatorArgs = [hypercertsExchangeCreate2.address];

    const deployOrderValidator = await deployer.deployContract({
      abi: orderValidatorContract.abi,
      account: deployer.account,
      args: orderValidatorArgs,
      bytecode: orderValidatorContract.bytecode as `0x${string}`,
    });

    const orderValidatorTx = await publicClient.waitForTransactionReceipt({
      hash: deployOrderValidator,
    });

    console.log(
      orderValidatorTx.status === "success"
        ? "Deployed OrderValidator successfully"
        : "Failed to deploy OrderValidator",
    );

    contracts.OrderValidator = {
      address: orderValidatorTx.contractAddress,
      fullNamespace: "OrderValidatorV2A",
      args: orderValidatorArgs,
      encodedArgs: solidityPacked(["address"], orderValidatorArgs),
      tx: orderValidatorTx.transactionHash,
    };

    // Deploy CreatorFeeManager

    const creatorFeeManagerArgs = [royaltyFeeRegistryCreate2.address];
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
      publicClient,
      walletClient: deployer,
    });

    // read transferManager from HypercertsExchange
    const transferManager = await hypercertsExchangeInstance.read.transferManager();
    console.log("TransferManager address: ", transferManager);

    // read deriveProtocolParams from HypercertsExchange
    const domainSeparator = await hypercertsExchangeInstance.read.domainSeparator();
    console.log("domainSeparator: ", domainSeparator);

    const creatorFeeManager = await hypercertsExchangeInstance.read.creatorFeeManager();
    console.log("creatorFeeManager: ", creatorFeeManager);

    const maxCreatorFeeBp = await hypercertsExchangeInstance.read.maxCreatorFeeBp();
    console.log("maxCreatorFeeBp: ", maxCreatorFeeBp);

    // Update currencyStatus address(0) to true
    const updateCurrencyStatusEth = await hypercertsExchangeInstance.write.updateCurrencyStatus([
      "0x0000000000000000000000000000000000000000",
      true,
    ]);
    const updateCurrencyStatusEthTx = await publicClient.waitForTransactionReceipt({
      hash: updateCurrencyStatusEth,
    });

    console.log(
      updateCurrencyStatusEthTx.status === "success"
        ? "Updated currency status for ETH successfully"
        : "Failed to update currency status for ETH",
    );

    //  Update currencyStatus address(weth) to true
    const updateCurrencyStatusTxWeth = await hypercertsExchangeInstance.write.updateCurrencyStatus([wethAddress, true]);
    const updateCurrencyStatusTxWethTx = await publicClient.waitForTransactionReceipt({
      hash: updateCurrencyStatusTxWeth,
    });

    console.log(
      updateCurrencyStatusTxWethTx.status === "success"
        ? "Updated currency status for WETH successfully"
        : "Failed to update currency status for WETH",
    );

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
          _standardProtocolFeeBP,
          _minTotalFeeBp,
          _maxProtocolFeeBp,
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

    console.log("🚀 Done!");

    if (network.name !== "hardhat" && network.name !== "localhost") {
      await writeFile(
        `src/deployments/deployment-marketplace-${network.name}.json`,
        JSON.stringify(contracts),
        "utf-8",
      );

      // Verify contracts
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
