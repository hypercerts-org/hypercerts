import { task } from "hardhat/config";

/**
 * Used to upgrade a contract directly via local keys
 */
task("upgrade", "Upgrade implementation contract and verify")
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
 * Used to propose a multi-sig upgrade via OpenZeppelin Defender
 */
task("propose-upgrade", "Propose an upgrade to OpenZeppelin Defender")
  .addParam("proxy", "Proxy contract address")
  .addParam("multisig", "Owner multisig address")
  .setAction(async ({ proxy, multisig }, { ethers, defender }) => {
    const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
    console.log("Proposing upgrade..");
    const proposal = await defender.proposeUpgrade(proxy, HypercertMinter, {
      multisig,
    });
    console.log("Upgrade proposal created at: ", proposal.url);
  });
