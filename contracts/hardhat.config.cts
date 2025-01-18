import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-viem";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@starboardventures/hardhat-verify";

import "@primitivefi/hardhat-dodoc";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import "hardhat-abi-exporter";
import "hardhat-preprocessor";
import { resolve } from "path";

import "xdeployer";

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
const MNEMONIC = requireEnv(process.env.MNEMONIC, "MNEMONIC");
const MNEMONIC_CELO = requireEnv(process.env.MNEMONIC_CELO, "MNEMONIC_CELO");
const INFURA_API_KEY = requireEnv(process.env.INFURA_API_KEY, "INFURA_API_KEY");
const ALCHEMY_API_KEY = requireEnv(process.env.ALCHEMY_API_KEY, "ALCHEMY_API_KEY");

const ETHERSCAN_API_KEY = requireEnv(process.env.ETHERSCAN_API_KEY, "ETHERSCAN_API_KEY");
const OPTIMISTIC_ETHERSCAN_API_KEY = requireEnv(
  process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
  "OPTIMISTIC_ETHERSCAN_API_KEY",
);
const CELOSCAN_API_KEY = requireEnv(process.env.CELOSCAN_API_KEY, "CELOSCAN_API_KEY");
const BASESCAN_API_KEY = requireEnv(process.env.BASESCAN_API_KEY, "BASESCAN_API_KEY");
const ARBISCAN_API_KEY = requireEnv(process.env.ARBISCAN_API_KEY, "ARBISCAN_API_KEY");

/**
 * Maps a key to the chain ID
 * - Make sure the key matches the Infura subdomain
 */
const chainIds = {
  hardhat: 31337,
  sepolia: 11155111,
  "optimism-mainnet": 10,
  "celo-mainnet": 42220,
  "base-sepolia": 84532,
  "base-mainnet": 8453,
  "arb-sepolia": 421614,
  arbitrumOne: 42161,
  "filecoinCalibration": 314159,
};

function getChainConfig(chain: keyof typeof chainIds) {
  const jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + INFURA_API_KEY;
  let config: { [key: string]: string | number | { [key: string]: string | number } } = {
    accounts: {
      count: 10,
      mnemonic: MNEMONIC!,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };

  if (chain === "optimism-mainnet") {
    config = {
      ...config,
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    };
  }

  if (chain === "base-sepolia") {
    config = {
      ...config,
      url: `https://sepolia.base.org`,
      gasPrice: 1000000000,
    };
  }

  if (chain === "base-mainnet") {
    config = {
      ...config,
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      gasPrice: 1000000000,
    };
  }

  if (chain === "arb-sepolia") {
    config = {
      ...config,
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    };
  }

  if (chain === "arbitrumOne") {
    config = {
      ...config,
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    };
  }

  if (chain === "celo-mainnet") {
    config = {
      ...config,
      accounts: {
        count: 10,
        mnemonic: MNEMONIC_CELO,
        path: "m/44'/52752'/0'/0",
      },
    };
  }

  if (chain === "filecoinCalibration") {
    config = {
      ...config,
      url: `https://filecoin-calibration.chainup.net/rpc/v1`,
    };
  }

  return config;
}

const config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    only: [
      "CurrencyManager",
      "ExecutionManager",
      "HypercertMinter",
      "LooksRareProtocol",
      "OrderValidatorV2A",
      "StrategyManager",
      "TransferManager",
      "StrategyHypercertCollectionOffer",
      "StrategyHypercertDutchAuction",
      "StrategyHypercertFractionOffer",
      "CreatorFeeManagerWithRoyalties",
      "RoyaltyFeeRegistry",
      "ImmutableCreate2Factory",
    ],
    except: ["@openzeppelin"],
  },
  dodoc: {
    runOnCompile: false,
    include: ["src/marketplace", "src/protocol"],
    freshOutput: true,
    outputDir: "../docs/docs/developer/api/contracts",
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY!,
      optimisticEthereum: OPTIMISTIC_ETHERSCAN_API_KEY!,
      "celo-mainnet": CELOSCAN_API_KEY!,
      base: BASESCAN_API_KEY!,
      "base-sepolia": BASESCAN_API_KEY!,
      "arb-sepolia": ARBISCAN_API_KEY!,
      arbitrumOne: "DPB1JAY49URG4RJP76WQ11CMGPBF2FX3C5",
    },
    customChains: [
      {
        network: "celo-mainnet",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "arb-sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  },
  networks: {
    hardhat: {
      // Setting this is necessary for metamask to work with hardhat. Otherwise
      // metamask can't transfer when connected to hardhat's network.
      initialBaseFeePerGas: 0,
      accounts: {
        count: 10,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds.hardhat,
    },
    localhost: {
      accounts: {
        count: 10,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
    },
    "celo-mainnet": getChainConfig("celo-mainnet"),
    sepolia: getChainConfig("sepolia"),
    "optimism-mainnet": getChainConfig("optimism-mainnet"),
    "base-sepolia": getChainConfig("base-sepolia"),
    "base-mainnet": getChainConfig("base-mainnet"),
    "arb-sepolia": getChainConfig("arb-sepolia"),
    arbitrumOne: getChainConfig("arbitrumOne"),
    filecoinCalibration: getChainConfig("filecoinCalibration"),
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
          for (const [from, to] of getRemappings()) {
            if (line.includes(from)) {
              line = line.replace(from, to);
              break;
            }
          }
        }
        return line;
      },
    }),
  },
  solidity: {
    version: "0.8.17",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 5_000,
      },
    },
  },
  starboardConfig: {
    baseURL: "https://fvm-calibration-api.starboard.ventures",
    network: "Calibration", // if there's no baseURL, url will depend on the network.  Mainnet || Calibration
  },
  typechain: {
    outDir: "./types",
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
