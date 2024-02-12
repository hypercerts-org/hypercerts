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

    console.log(`HypercertMinter at proxy address ${proxy} was upgraded`);

    try {
      const code = await hypercertMinterUpgrade.instance?.provider.getCode(proxy);
      if (code === "0x") {
        console.log(`${hypercertMinterUpgrade.name} contract upgrade has not completed. waiting to verify...`);
        await hypercertMinterUpgrade.instance?.deployed();
      }
      await run("verify:verify", {
        address: proxy,
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
