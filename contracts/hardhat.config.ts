import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-defender";
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

function requireEnv(value: string | undefined, identifier: string) {
  /**
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  **/
  return value;
}

const dotenvConfigPath: string = process.env.DOTENV_PATH ?? fs.existsSync("./.env") ? "./.env" : "./.env.example";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic = requireEnv(process.env.MNEMONIC, "MNEMONIC");
const infuraApiKey = requireEnv(process.env.INFURA_API_KEY, "INFURA_API_KEY");
const alchemyOptimismUrl = requireEnv(process.env.ALCHEMY_OPTIMISM_URL, "ALCHEMY_OPTIMISM_URL");
const etherscanApiKey = requireEnv(process.env.ETHERSCAN_API_KEY, "ETHERSCAN_API_KEY");
const optimisticEtherscanApiKey = requireEnv(process.env.OPTIMISTIC_ETHERSCAN_API_KEY, "OPTIMISTIC_ETHERSCAN_API_KEY");
const ozApiKey = requireEnv(process.env.OPENZEPPELIN_API_KEY, "OPENZEPPELIN_API_KEY");
const ozSecretKey = requireEnv(process.env.OPENZEPPELIN_SECRET_KEY, "OPENZEPPELIN_SECRET_KEY");

/**
 * Maps a key to the chain ID
 * - Make sure the key matches the Infura subdomain
 */
const chainIds = {
  hardhat: 31337,
  // Ethereum: https://docs.infura.io/infura/networks/ethereum/how-to/choose-a-network
  goerli: 5,
  sepolia: 11155111,
  mainnet: 1,
  // Optimism: https://docs.infura.io/infura/networks/optimism/how-to/choose-a-network
  "optimism-mainnet": 10,
  "optimism-goerli": 420,
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
    path: "./src/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  defender: {
    apiKey: ozApiKey!,
    apiSecret: ozSecretKey!,
  },
  dodoc: {
    runOnCompile: true,
    include: ["src"],
    freshOutput: false,
    outputDir: "../docs/docs/developer/api/contracts",
  },
  etherscan: {
    apiKey: {
      goerli: etherscanApiKey!,
      sepolia: etherscanApiKey!,
      optimisticEthereum: optimisticEtherscanApiKey!,
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
    "optimism-goerli": getChainConfig("optimism-goerli"),
    "optimism-mainnet": {
      ...getChainConfig("optimism-mainnet"),
      url: alchemyOptimismUrl,
    },
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
    outDir: "./src/typechain",
    target: "ethers-v5",
  },
};

export default config;
