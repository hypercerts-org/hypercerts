import { task } from "hardhat/config";

/**
 * Used to upgrade a contract directly via local keys
 */
task("upgrade-minter", "Upgrade implementation contract of Minter and verify")
  .addParam("proxy", "Provider proxy address")
  .setAction(async ({ proxy }, { ethers, upgrades, run }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");

    // Validate (redundant?)
    console.log("Validating upgrade..");
    await upgrades.validateUpgrade(proxy, HypercertMinter).then(() => console.log("Valid upgrade. Deploying.."));

    // Upgrade
    const hypercertMinterUpgrade = await upgrades.upgradeProxy(proxy, HypercertMinter, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });
    await hypercertMinterUpgrade.deployed();
    console.log(`HypercertMinter at proxy address ${hypercertMinterUpgrade.address} was upgraded`);

    try {
      const code = await hypercertMinterUpgrade.instance?.provider.getCode(hypercertMinterUpgrade.address);
      if (code === "0x") {
        console.log(`${hypercertMinterUpgrade.name} contract upgrade has not completed. waiting to verify...`);
        await hypercertMinterUpgrade.instance?.deployed();
      }
      await run("verify:verify", {
        address: hypercertMinterUpgrade.address,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;

      if (errorMessage.includes("Reason: Already Verified")) {
        console.log("Reason: Already Verified");
      }
      console.error(errorMessage);
    }
  });

/**
 * Used to upgrade a contract directly via local keys
 */
task("upgrade-trader", "Upgrade implementation contract of Trader and verify")
  .addParam("proxy", "Provider proxy address")
  .setAction(async ({ proxy }, { ethers, upgrades, run }) => {
    const HypercertTrader = await ethers.getContractFactory("HypercertTrader");

    // Validate (redundant?)
    console.log("Validating upgrade..");
    await upgrades.validateUpgrade(proxy, HypercertTrader).then(() => console.log("Valid upgrade. Deploying.."));

    // Upgrade
    const hypercertTraderUpgrade = await upgrades.upgradeProxy(proxy, HypercertTrader, {
      kind: "uups",
      unsafeAllow: ["constructor"],
    });
    await hypercertTraderUpgrade.deployed();
    console.log(`HypercertTrader at proxy address ${hypercertTraderUpgrade.address} was upgraded`);

    try {
      const code = await hypercertTraderUpgrade.instance?.provider.getCode(hypercertTraderUpgrade.address);
      if (code === "0x") {
        console.log(`${hypercertTraderUpgrade.name} contract upgrade has not completed. waiting to verify...`);
        await hypercertTraderUpgrade.instance?.deployed();
      }
      await run("verify:verify", {
        address: hypercertTraderUpgrade.address,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Reason: Already Verified")) {
        console.log("Reason: Already Verified");
      }
      console.error(errorMessage);
    }
  });

/**
 * Used to propose a multi-sig upgrade via OpenZeppelin Defender for HypercertMinter
 */
task("propose-upgrade-minter", "Propose an upgrade to OpenZeppelin Defender")
  .addParam("proxy", "Proxy contract address")
  .addParam("multisig", "Owner multisig address")
  .addOptionalParam("description", "Description of upgrade")
  .setAction(async ({ proxy, multisig, description = "Upgrade Minter contract" }, { ethers, defender }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    console.log(`Proposing upgrade to multisig ${multisig} to address ${proxy}`);
    const proposal = await defender.proposeUpgrade(proxy, HypercertMinter, {
      description,
      multisig,
      multisigType: "Gnosis Safe",
      title: "Upgrade Minter contract",
    });
    console.log("Upgrade proposal created at: ", proposal.url);
  });

/**
 * Used to propose a multi-sig upgrade via OpenZeppelin Defender for HypercertTrader
 */
task("propose-upgrade-trader", "Propose an upgrade to OpenZeppelin Defender")
  .addParam("proxy", "Proxy contract address")
  .addParam("multisig", "Owner multisig address")
  .addOptionalParam("description", "Description of upgrade")
  .setAction(async ({ proxy, multisig, description = "Upgrade Trader contract" }, { ethers, defender }) => {
    const HypercertTrader = await ethers.getContractFactory("HypercertTrader");
    console.log(`Proposing upgrade to multisig ${multisig} as address ${proxy}`);
    const proposal = await defender.proposeUpgrade(proxy, HypercertTrader, {
      description,
      multisig,
      multisigType: "Gnosis Safe",
      title: "Upgrade Trader contract",
    });
    console.log("Upgrade proposal created at: ", proposal.url);
  });
