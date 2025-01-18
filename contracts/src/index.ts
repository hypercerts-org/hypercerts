import DEPLOYMENTS from "./deployments/index.js";

import HypercertMinterAbi from "../abi/src/protocol/HypercertMinter.sol/HypercertMinter.json";
import HypercertExchangeAbi from "../abi/src/marketplace/LooksRareProtocol.sol/LooksRareProtocol.json";
import OrderValidatorV2AAbi from "../abi/src/marketplace/helpers/OrderValidatorV2A.sol/OrderValidatorV2A.json";
import StrategyManagerAbi from "../abi/src/marketplace/StrategyManager.sol/StrategyManager.json";
import TransferManagerAbi from "../abi/src/marketplace/TransferManager.sol/TransferManager.json";
import StrategyHypercertFractionOfferAbi from "../abi/src/marketplace/executionStrategies/StrategyHypercertFractionOffer.sol/StrategyHypercertFractionOffer.json";
import CreatorFeeManagerWithRoyaltiesAbi from "../abi/src/marketplace/CreatorFeeManagerWithRoyalties.sol/CreatorFeeManagerWithRoyalties.json";
import StrategyHypercertCollectionOfferAbi from "../abi/src/marketplace/executionStrategies/StrategyHypercertCollectionOffer.sol/StrategyHypercertCollectionOffer.json";
import StrategyHypercertDutchAuctionAbi from "../abi/src/marketplace/executionStrategies/StrategyHypercertDutchAuction.sol/StrategyHypercertDutchAuction.json";
import ExecutionManagerAbi from "../abi/src/marketplace/ExecutionManager.sol/ExecutionManager.json";

import {
  ExecutionManager,
  HypercertMinter,
  IHypercertToken,
  LooksRareProtocol as HypercertExchange,
  ILooksRareProtocol as IHypercertExchange,
  CreatorFeeManagerWithRoyalties,
  OrderValidatorV2A,
  TransferManager,
  StrategyCollectionOffer,
  StrategyDutchAuction,
  StrategyItemIdsRange,
  StrategyHypercertFractionOffer,
  StrategyHypercertCollectionOffer,
  StrategyHypercertDutchAuction,
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
};

export type DeploymentMarketplace = {
  TransferManager: `0x${string}`;
  HypercertExchange: `0x${string}`;
  OrderValidatorV2A: `0x${string}`;
  RoyaltyFeeRegistry: `0x${string}`;
  // StrategyCollectionOffer: `0x${string}`;
  // StrategyDutchAuction: `0x${string}`;
  // StrategyItemIdsRange: `0x${string}`;
  // StrategyHypercertCollectionOffer: `0x${string}`;
  // StrategyHypercertDutchAuction: `0x${string}`;
  StrategyHypercertFractionOffer: `0x${string}`;
};

export type Deployment = DeploymentProtocol & Partial<DeploymentMarketplace>;
export type DeployedChains = keyof typeof DEPLOYMENTS.protocol;

// Deployments
const deployments = {
  10: {
    ...DEPLOYMENTS.protocol["10"],
    ...DEPLOYMENTS.marketplace["10"],
  },
  42220: {
    ...DEPLOYMENTS.protocol[42220],
    ...DEPLOYMENTS.marketplace["42220"],
  },
  11155111: {
    ...DEPLOYMENTS.protocol["11155111"],
    ...DEPLOYMENTS.marketplace["11155111"],
  },
  84532: {
    ...DEPLOYMENTS.protocol["84532"],
    ...DEPLOYMENTS.marketplace["84532"],
  },
  8453: {
    ...DEPLOYMENTS.protocol["8453"],
  },
  42161: {
    ...DEPLOYMENTS.protocol["42161"],
    ...DEPLOYMENTS.marketplace["42161"],
  },
  421614: {
    ...DEPLOYMENTS.protocol["421614"],
    ...DEPLOYMENTS.marketplace["421614"],
  },
  314159: {
    ...DEPLOYMENTS.protocol["314159"],
  },
} as Record<DeployedChains, Deployment>;

const asDeployedChain = (chainId: string | number) => {
  if (chainId in deployments) return chainId as DeployedChains;
  throw new Error(`Chain ${chainId} not deployed`);
};

export { deployments, asDeployedChain };

// Abis
export {
  CreatorFeeManagerWithRoyaltiesAbi,
  ExecutionManagerAbi,
  HypercertMinterAbi,
  HypercertExchangeAbi,
  OrderValidatorV2AAbi,
  TransferManagerAbi,
  StrategyManagerAbi,
  StrategyHypercertFractionOfferAbi,
  StrategyHypercertCollectionOfferAbi,
  StrategyHypercertDutchAuctionAbi,
};

// Interfaces
export type {
  CreatorFeeManagerWithRoyalties,
  ExecutionManager,
  IHypercertExchange,
  IHypercertToken,
  HypercertExchange,
  HypercertMinter,
  OrderValidatorV2A,
  TransferManager,
  StrategyCollectionOffer,
  StrategyDutchAuction,
  StrategyItemIdsRange,
  StrategyHypercertFractionOffer,
  StrategyHypercertCollectionOffer,
  StrategyHypercertDutchAuction,
};
