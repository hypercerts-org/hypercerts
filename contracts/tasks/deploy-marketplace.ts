import { task } from "hardhat/config";
import { solidityPacked } from "ethers";
import { getContractAddress, slice, encodeDeployData, getContract, WalletClient, encodePacked } from "viem";
import { writeFile } from "node:fs/promises";
import creatorFeeManagerContract from "../out/CreatorFeeManagerWithRoyalties.sol/CreatorFeeManagerWithRoyalties.json";
import exchangeContract from "../out/LooksRareProtocol.sol/LooksRareProtocol.json";
import transferManagerContract from "../out/TransferManager.sol/TransferManager.json";
import orderValidatorContract from "../out/OrderValidatorV2A.sol/OrderValidatorV2A.json";
import strategyCollectionOfferContract from "../out/StrategyCollectionOffer.sol/StrategyCollectionOffer.json";
import protocolFeeRecipientContract from "../out/ProtocolFeeRecipient.sol/ProtocolFeeRecipient.json";

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

task("deploy-marketplace", "Deploy marketplace contracts and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, hre) => {
    //TODO multichain support
    const { ethers, network, run, viem } = hre;
    const owner = "0xdf2C3dacE6F31e650FD03B8Ff72beE82Cb1C199A";
    const create2Address = "0x0000000000ffe8b47b3e2130213b802212439497";
    const wethAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    const create2Instance = await viem.getContractAt("IImmutableCreate2Factory", create2Address, {
      walletClient: deployer,
    });

    console.log("Deployer: ", deployer.account.address);

    const _standardProtocolFeeBP = 50;
    const _minTotalFeeBp = 50;
    const _maxProtocolFeeBp = 200;

    const releaseCounter = "f";

    const salt = slice(
      encodePacked(["address", "string", "address"], [deployer.account?.address, releaseCounter, create2Address]),
      0,
      32,
    );
    console.log("Calculated salt: ", salt);

    // Create2 Transfermanager
    const transferManagerArgs = [deployer.account.address];
    const transferManagerCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: transferManagerContract.abi,
        bytecode: transferManagerContract.bytecode.object as `0x${string}`,
        args: transferManagerArgs,
      }),
      salt,
    );

    // read findCreate2Address from IImmutableCreate2Factory
    const findCreate2Address = await create2Instance.read.findCreate2Address([
      salt,
      encodeDeployData({
        abi: transferManagerContract.abi,
        bytecode: transferManagerContract.bytecode.object as `0x${string}`,
        args: transferManagerArgs,
      }),
    ]);

    console.log(`Comparing calculated address: ${transferManagerCreate2.address} with ${findCreate2Address}`);

    // Create2 ProtocolFeeRecipient
    const protocolFeeRecipientArgs = [deployer.account.address, wethAddress];
    const protocolFeeRecipientCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: protocolFeeRecipientContract.abi,
        bytecode: protocolFeeRecipientContract.bytecode.object as `0x${string}`,
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
        bytecode: exchangeContract.bytecode.object as `0x${string}`,
        args: hypercertsExchangeArgs,
      }),
      salt,
    );

    const orderValidatorArgs = [hypercertsExchangeCreate2.address];

    const strategyCollectionOfferCreate2 = await getCreate2Address(
      deployer,
      create2Address,
      encodeDeployData({
        abi: strategyCollectionOfferContract.abi,
        bytecode: strategyCollectionOfferContract.bytecode.object as `0x${string}`,
        args: [],
      }),
      salt,
    );

    console.log("Calculated exchange address using CREATE2: ", hypercertsExchangeCreate2.address);
    console.log("Calculated transferManager address using CREATE2: ", transferManagerCreate2.address);
    console.log("Calculated protocolFeeRecipient address using CREATE2: ", protocolFeeRecipientCreate2.address);
    console.log("Calculated strategyCollectionOffer address using CREATE2: ", strategyCollectionOfferCreate2.address);

    // Deploy transferManager
    console.log("Deploying TransferManager...");
    const transferManagerCreation = await create2Instance.write.safeCreate2([salt, transferManagerCreate2.deployData]);
    const transferManagerTx = await publicClient.waitForTransactionReceipt({
      hash: transferManagerCreation,
    });

    console.log(
      transferManagerTx.status === "success"
        ? "Deployed TransferManager successfully"
        : "Failed to deploy TransferManager",
    );

    // // Transfer 1 wei to hypercertsExchange
    await deployer.sendTransaction({
      to: hypercertsExchangeCreate2.address,
      value: 1n,
    });

    // Deploy ProtocolFeeRecipient
    console.log("Deploying ProtocolFeeRecipient...");
    const protocolFeeRecipientCreation = await create2Instance.write.safeCreate2([
      salt,
      protocolFeeRecipientCreate2.deployData,
    ]);

    const protocolFeeRecipientTx = await publicClient.waitForTransactionReceipt({
      hash: protocolFeeRecipientCreation,
    });

    console.log(
      protocolFeeRecipientTx.status === "success"
        ? "Deployed ProtocolFeeRecipient successfully"
        : "Failed to deploy ProtocolFeeRecipient",
    );

    // Deploy HypercertsExchange
    console.log("Deploying HypercertsExchange...");
    const hypercertsExchange = await create2Instance.write.safeCreate2([salt, hypercertsExchangeCreate2.deployData]);
    const hypercertsExchangeTx = await publicClient.waitForTransactionReceipt({
      hash: hypercertsExchange,
    });

    console.log(
      hypercertsExchangeTx.status === "success"
        ? "Deployed HypercertsExchange successfully"
        : "Failed to deploy HypercertsExchange",
    );

    // Parse logs to get the address of the deployed HypercertsExchange
    console.log("Deploying HypercertsExchange... done!");

    // Allow Exchange as operator on transferManager
    const transferManagerInstance = getContract({
      address: transferManagerCreate2.address,
      abi: transferManagerContract.abi,
      publicClient,
      walletClient: deployer,
    });

    // Deploy CreatorFeeManager
    const deployCreatorFeeManager = await deployer.deployContract({
      abi: creatorFeeManagerContract.abi,
      account: deployer.account,
      args: ["0x12405dB79325D06a973aD913D6e9BdA1343cD526"],
      bytecode: creatorFeeManagerContract.bytecode.object as `0x${string}`,
    });

    const creatorFeeManagerTx = await publicClient.waitForTransactionReceipt({
      hash: deployCreatorFeeManager,
    });

    console.log(
      creatorFeeManagerTx.status === "success"
        ? "Deployed CreatorFeeManager successfully"
        : "Failed to deploy CreatorFeeManager",
    );

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
    //
    // domainSeparator = looksRareProtocol.domainSeparator();
    // creatorFeeManager = looksRareProtocol.creatorFeeManager();
    // maxCreatorFeeBp = looksRareProtocol.maxCreatorFeeBp();

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

    //  Update currencyStatus address(weth) to true
    const updateCurrencyStatusTxWeth = await hypercertsExchangeInstance.write.updateCurrencyStatus([wethAddress, true]);
    const updateCurrencyStatusTxWethTx = await publicClient.waitForTransactionReceipt({
      hash: updateCurrencyStatusTxWeth,
    });

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

    console.log(
      updateCurrencyStatusEthTx.status === "success"
        ? "Updated currency status for ETH successfully"
        : "Failed to update currency status for ETH",
    );

    console.log(
      updateCurrencyStatusTxWethTx.status === "success"
        ? "Updated currency status for WETH successfully"
        : "Failed to update currency status for WETH",
    );

    // Deploy OrderValidator

    const deployOrderValidator = await deployer.deployContract({
      abi: orderValidatorContract.abi,
      account: deployer.account,
      args: orderValidatorArgs,
      bytecode: orderValidatorContract.bytecode.object as `0x${string}`,
    });

    const orderValidatorTx = await publicClient.waitForTransactionReceipt({
      hash: deployOrderValidator,
    });

    console.log(
      orderValidatorTx.status === "success"
        ? "Deployed OrderValidator successfully"
        : "Failed to deploy OrderValidator",
    );

    // Deploy strategyCollectionOffer

    const deployStrategyCollectionOffer = await deployer.deployContract({
      abi: strategyCollectionOfferContract.abi,
      account: deployer.account,
      args: [],
      bytecode: strategyCollectionOfferContract.bytecode.object as `0x${string}`,
    });

    const strategyCollectionOfferTx = await publicClient.waitForTransactionReceipt({
      hash: deployStrategyCollectionOffer,
    });

    console.log(
      strategyCollectionOfferTx.status === "success"
        ? "Deployed StrategyCollectionOffer successfully"
        : "Failed to deploy StrategyCollectionOffer",
    );

    // Add executeCollectionStrategyWithTakerAsk strategy to HypercertsExchange

    const strategyCollectionOfferFactory = await ethers.getContractFactory("StrategyCollectionOffer");

    const addStratTakerAsk = await hypercertsExchangeInstance.write.addStrategy([
      _standardProtocolFeeBP,
      _minTotalFeeBp,
      _maxProtocolFeeBp,
      strategyCollectionOfferFactory.interface.getFunction("executeCollectionStrategyWithTakerAsk")?.selector,
      true,
      strategyCollectionOfferTx.contractAddress,
    ]);

    console.log("Adding strategy CollectionWithTakerAsk to exchange...");
    const addStratTakerAskTx = await publicClient.waitForTransactionReceipt({
      hash: addStratTakerAsk,
    });

    console.log(
      addStratTakerAskTx.status === "success"
        ? "Added strategy executeCollectionStrategyWithTakerAsk to exchange successfully"
        : "Failed to add strategy executeCollectionStrategyWithTakerAsk to exchange",
    );

    const addStratTakerAskProof = await hypercertsExchangeInstance.write.addStrategy([
      _standardProtocolFeeBP,
      _minTotalFeeBp,
      _maxProtocolFeeBp,
      strategyCollectionOfferFactory.interface.getFunction("executeCollectionStrategyWithTakerAskWithProof")?.selector,
      true,
      strategyCollectionOfferTx.contractAddress,
    ]);

    console.log("Adding strategy CollectionWithTakerAskWithProof to exchange...");
    const addStratTakerAskProofTx = await publicClient.waitForTransactionReceipt({
      hash: addStratTakerAskProof,
    });

    console.log(
      addStratTakerAskProofTx.status === "success"
        ? "Added strategy executeCollectionStrategyWithTakerAskWithProof to exchange successfully"
        : "Failed to add strategy executeCollectionStrategyWithTakerAskWithProof to exchange",
    );

    console.log("🚀 Done!");

    interface ContractDeployment {
      address: string;
      abi: any;
      fullNamespace: string;
      args: string[];
      encodedArgs: string;
      tx: `0x${string}`;
    }

    type ContractDeployments = {
      [name: string]: ContractDeployment;
    };

    const contracts: ContractDeployments = {
      "hypercerts-exchange": {
        address: hypercertsExchangeCreate2.address,
        abi: exchangeContract.abi,
        fullNamespace: "LooksRareProtocol",
        args: hypercertsExchangeArgs,
        encodedArgs: solidityPacked(["address", "address", "address", "address"], hypercertsExchangeArgs),
        tx: hypercertsExchangeTx.transactionHash,
      },
      "protocol-fee-recipient": {
        address: protocolFeeRecipientCreate2.address,
        abi: protocolFeeRecipientContract.abi,
        fullNamespace: "ProtocolFeeRecipient",
        args: [deployer.account.address, wethAddress],
        encodedArgs: solidityPacked(["address", "address"], [deployer.account.address, wethAddress]),
        tx: protocolFeeRecipientTx.transactionHash,
      },
      "transfer-manager": {
        address: transferManagerCreate2.address,
        abi: transferManagerContract.abi,
        fullNamespace: "TransferManager",
        args: transferManagerArgs,
        encodedArgs: solidityPacked(["address"], transferManagerArgs),
        tx: transferManagerTx.transactionHash,
      },
      "order-validator": {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: orderValidatorTx.contractAddress!,
        abi: orderValidatorContract.abi,
        fullNamespace: "OrderValidatorV2A",
        args: orderValidatorArgs,
        encodedArgs: solidityPacked(["address"], orderValidatorArgs),
        tx: orderValidatorTx.transactionHash,
      },
      "strategy-collection-offer": {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: strategyCollectionOfferTx.contractAddress!,
        abi: strategyCollectionOfferContract.abi,
        fullNamespace: "StrategyCollectionOffer",
        args: [],
        encodedArgs: solidityPacked([], []),
        tx: strategyCollectionOfferTx.transactionHash,
      },
    };

    if (network.name !== "hardhat" && network.name !== "localhost") {
      await writeFile(
        `src/deployments/deployment-marketplace-${network.name}.json`,
        JSON.stringify(contracts),
        "utf-8",
      );

      // Verify contracts
      for (const [name, { address, tx }] of Object.entries(contracts)) {
        try {
          const code = await publicClient.getBytecode({ address: address as `0x${string}` });
          if (code === "0x") {
            console.log(`${name} contract deployment has not completed. waiting to verify...`);
            await publicClient.waitForTransactionReceipt({
              hash: tx,
            });
          }
          await run("verify:verify", {
            address,
            constructorArguments: contracts[name].args,
          });
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
