import { task } from "hardhat/config";

task("deploy", "Deploy contracts and verify").setAction(async ({}, { ethers, upgrades }) => {
  const HypercertMinter = await ethers.getContractFactory("HypercertMinter");
  const hypercertMinter = await upgrades.deployProxy(HypercertMinter, {
    kind: "uups",
    unsafeAllow: ["constructor"],
  });
  await hypercertMinter.deployed();
  console.log(`HypercertMinter is deployed to proxy address: ${hypercertMinter.address}`);

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
