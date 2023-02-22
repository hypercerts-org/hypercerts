import { task } from "hardhat/config";

task("generate-address", "Generate an address").setAction(async ({}, { ethers }) => {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  const mnemonic = wallet.mnemonic;

  console.log("Generated address: ", address);
  console.log("----------------------------");
  console.log("DO NOT SHARE THE FOLLOWING");
  console.log("Mnemonic: ", mnemonic.phrase);
});

task("accounts", "Show me my accounts").setAction(async ({}, { ethers }) => {
  const accounts = await ethers.getSigners();
  accounts.forEach((account) => {
    const address = account.address;
    console.log("Address: ", address);
  });
});
