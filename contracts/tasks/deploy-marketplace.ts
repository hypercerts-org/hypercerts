import { task } from "hardhat/config";
import { BytesLike, getAddress, keccak256, solidityPacked } from "ethers";

function getCreate2Address(name: string, factoryAddress: `0x${string}`, bytecode: BytesLike) {
  const deployer = "0xdf2C3dacE6F31e650FD03B8Ff72beE82Cb1C199A";
  const version = 1;

  const salt = keccak256(solidityPacked(["address", "uint256", "string"], [deployer, version, name]));

  const create2Inputs = ["0xff", factoryAddress, salt, keccak256(bytecode)];
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
  return { address: getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`), salt };
}

task("deploy-marketplace", "Deploy marketplace contracts and verify")
  .addOptionalParam("output", "write the details of the deployment to this file if this is set")
  .setAction(async ({ output }, hre) => {
    const { ethers, network, defender, run } = hre;

    const HypercertsExchange = await ethers.getContractFactory("LooksRareProtocol");
    const TransferManager = await ethers.getContractFactory("TransferManager");
    const OrderValidator = await ethers.getContractFactory("OrderValidatorV2A");
    const StrategyCollectionOffer = await ethers.getContractFactory("StrategyCollectionOffer");

    const _standardProtocolFeeBP = 50;
    const _minTotalFeeBp = 50;
    const _maxProtocolFeeBp = 200;

    const owner = "0xdf2C3dacE6F31e650FD03B8Ff72beE82Cb1C199A";
    const create2Address = "0x0000000000FFe8B47B3e2130213B802212439497";

    const defaultApprovalProcess = await defender.getDefaultApprovalProcess();

    if (defaultApprovalProcess.address === undefined) {
      throw new Error(
        `Upgrade approval process with id ${defaultApprovalProcess.approvalProcessId} has no assigned address`,
      );
    }

    // Determine create2 address HypercertsExchange
    const { address: hypercertsExchangeAddress, salt } = getCreate2Address(
      "HypercertsExchange",
      create2Address,
      HypercertsExchange.bytecode,
    );

    console.log("Calculated address using CREATE2: ", hypercertsExchangeAddress);
    // Deploy transferManager
    const transferManager = await defender.deployContract(TransferManager, [owner], { salt });
    await transferManager.deployed();

    // Transfer 1 wei to hypercertsExchange
    await (
      await ethers.provider.getSigner()
    ).sendTransaction({
      to: hypercertsExchangeAddress,
      value: 1,
    });

    // Deploy HypercertsExchange
    const protocolFeeRecipient = owner;
    const transferManagerAddress = transferManager.address;
    const wethAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
    const hypercertsExchange = await defender.deployContract(HypercertsExchange, [
      owner,
      protocolFeeRecipient,
      transferManagerAddress,
      wethAddress,
    ]);

    // Allow Exchange as operator on transferManager
    transferManager.allowOperator(hypercertsExchange.address);

    // Update currencyStatus address(0) to true
    hypercertsExchange.updateCurrencyStatus("0x0000000000000000000000000000000000000000", true);

    // Update currencyStatus address(weth) to true
    hypercertsExchange.updateCurrencyStatus("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", true);

    // Deploy OrderValidator
    const orderValidator = await defender.deployContract(OrderValidator, [hypercertsExchange.address]);
    await orderValidator.deployed();

    // Deploy strategyCollectionOffer
    const strategyCollectionOfferInstance = await defender.deployContract(StrategyCollectionOffer);
    await strategyCollectionOfferInstance.deployed();

    // Add executeCollectionStrategyWithTakerAsk strategy to HypercertsExchange

    hypercertsExchange.addStrategy(
      _standardProtocolFeeBP,
      _minTotalFeeBp,
      _maxProtocolFeeBp,
      strategyCollectionOfferInstance.interface.getFunction("executeCollectionStrategyWithTakerAsk").selector,
      true,
      strategyCollectionOfferInstance.address,
    );

    hypercertsExchange.addStrategy(
      _standardProtocolFeeBP,
      _minTotalFeeBp,
      _maxProtocolFeeBp,
      strategyCollectionOfferInstance.interface.getFunction("executeCollectionStrategyWithTakerAskWithProof").selector,
      true,
      strategyCollectionOfferInstance.address,
    );

    // Add executeCollectionStrategyWithTakerAskWithProof strategy to HypercertsExchange

    // Done!

    // If the `deploymentFile` option is set then write the deployed address to
    // a json object on disk. This is intended to be deliberate with how we
    // output the contract address and other contract information.
    // if (output) {
    //   const txReceipt = await contract.provider.getTransactionReceipt(hypercertMinter.deployTransaction.hash);
    //   await writeFile(
    //     output,
    //     JSON.stringify({
    //       address: hypercertMinter.address,
    //       blockNumber: txReceipt.blockNumber,
    //     }),
    //     "utf-8",
    //   );
    // }

    // if (network.name !== "hardhat" && network.name !== "localhost") {
    //   try {
    //     const code = await hypercertMinter.instance?.provider.getCode(hypercertMinter.address);
    //     if (code === "0x") {
    //       console.log(`${hypercertMinter.name} contract deployment has not completed. waiting to verify...`);
    //       await hypercertMinter.instance?.deployed();
    //     }
    //     await run("verify:verify", {
    //       address: hypercertMinter.address,
    //     });
    //   } catch (error) {
    //     const errorMessage = (error as Error).message;

    //     if (errorMessage.includes("Reason: Already Verified")) {
    //       console.log("Reason: Already Verified");
    //     }
    //     console.error(errorMessage);
    //   }
    // }
  });
