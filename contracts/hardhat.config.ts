import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@primitivefi/hardhat-dodoc";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import "hardhat-abi-exporter";
import "hardhat-preprocessor";
import { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";

import "./tasks";

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const etherscanApiKey: string | undefined = process.env.ETHERSCAN_API_KEY;
if (!etherscanApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  goerli: 5,
  sepolia: 11155111,
  hardhat: 31337,
  mainnet: 1,
};

function getChainConfig(chain: keyof typeof chainIds) {
  const jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;

  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  dodoc: {
    runOnCompile: true,
    include: ["src"],
    freshOutput: true,
    // More options...
  },
  etherscan: {
    apiKey: {
      goerli: etherscanApiKey,
      sepolia: etherscanApiKey,
    },
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    goerli: getChainConfig("goerli"),
    sepolia: getChainConfig("sepolia"),
    mainnet: getChainConfig("mainnet"),
  },
  paths: {
    cache: "./cache_hardhat", // Use a different cache for Hardhat than Foundry
    sources: "./src",
    tests: "./test",
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  typechain: {
    outDir: "./typechain",
  },
};

export default config;
