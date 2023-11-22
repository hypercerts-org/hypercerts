import DEPLOYMENTS from "./deployments";

import HypercertMinterAbi from "../abi/src/protocol/HypercertMinter.sol/HypercertMinter.json";
import HypercertExchangeAbi from "../abi/src/marketplace/LooksRareProtocol.sol/LooksRareProtocol.json";
import OrderValidatorV2AAbi from "../abi/src/marketplace/helpers/OrderValidatorV2A.sol/OrderValidatorV2A.json";
import StrategyManagerAbi from "../abi/src/marketplace/StrategyManager.sol/StrategyManager.json";
import TransferManagerAbi from "../abi/src/marketplace/TransferManager.sol/TransferManager.json";

import {
  HypercertMinter,
  IHypercertToken,
  LooksRareProtocol as HypercertExchange,
  ILooksRareProtocol as IHypercertExchange,
} from "types";

/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/

export type DeploymentProtocol = {
  HypercertMinterUUPS: `0x${string}`;
  HypercertMinterImplementation: `0x${string}`;
  TransferManager?: `0x${string}`;
  HypercertExchange?: `0x${string}`;
};

export type DeploymentMarketplace = {
  HypercertsExchange: `0x${string}`;
  TransferManager: `0x${string}`;
  OrderValidatorV2A: `0x${string}`;
};

export type Deployment = DeploymentProtocol & Partial<DeploymentMarketplace>;
export type DeployedChains = keyof typeof DEPLOYMENTS.protocol;

// Deployments
const deployments = {
  5: {
    ...DEPLOYMENTS.protocol["5"],
    HypercertsExchange: DEPLOYMENTS.marketplace[5]["hypercerts-exchange"].address,
    TransferManager: DEPLOYMENTS.marketplace[5]["transfer-manager"].address,
    OrderValidatorV2A: DEPLOYMENTS.marketplace[5]["order-validator"].address,
  },
  10: {
    ...DEPLOYMENTS.protocol["10"],
  },
  42220: {
    ...DEPLOYMENTS.protocol[42220],
  },
  11155111: {
    ...DEPLOYMENTS.protocol["11155111"],
    HypercertsExchange: DEPLOYMENTS.marketplace[11155111]["hypercerts-exchange"].address,
    TransferManager: DEPLOYMENTS.marketplace[11155111]["transfer-manager"].address,
    OrderValidatorV2A: DEPLOYMENTS.marketplace[11155111]["order-validator"].address,
  },
} as Record<DeployedChains, Deployment>;

const asDeployedChain = (chainId: string | number) => {
  if (chainId in deployments) return chainId as DeployedChains;
  throw new Error(`Chain ${chainId} not deployed`);
};

export { deployments, asDeployedChain };

// Abis
export { HypercertMinterAbi, HypercertExchangeAbi, OrderValidatorV2AAbi, StrategyManagerAbi, TransferManagerAbi };

// Interfaces
export type { IHypercertExchange, IHypercertToken, HypercertExchange, HypercertMinter };
