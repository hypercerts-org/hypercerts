import HypercertMinterAbi from "../abi/HypercertMinter.json";
import AllowlistMinterAbi from "../abi/AllowlistMinter.json";
import CurrencyManagerAbi from "../abi/CurrencyManager.json";
import ExecutionManagerAbi from "../abi/ExecutionManager.json";
import LooksRareProtocolAbi from "../abi/LooksRareProtocol.json";
import NonceManagerAbi from "../abi/NonceManager.json";
import OrderValidatorV2AAbi from "../abi/OrderValidatorV2A.json";
import StrategyManagerAbi from "../abi/StrategyManager.json";
import TransferManagerAbi from "../abi/TransferManager.json";

import type { CurrencyManager } from "../types/src/marketplace/CurrencyManager";
import type { ExecutionManager } from "../types/src/marketplace/ExecutionManager";
import type { LooksRareProtocol } from "../types/src/marketplace/LooksRareProtocol";
import type { NonceManager } from "../types/src/marketplace/NonceManager";
import type { OrderValidatorV2A } from "../types/src/marketplace/helpers/OrderValidatorV2A";
import type { StrategyManager } from "../types/src/marketplace/StrategyManager";
import type { TransferManager } from "../types/src/marketplace/TransferManager";
import type { AllowlistMinter } from "../types/src/protocol/AllowlistMinter";
import type { HypercertMinter } from "../types/src/protocol/HypercertMinter";
import type { IAllowlist } from "../types/src/protocol/interfaces/IAllowlist";
import type { IHypercertToken } from "../types/src/protocol/interfaces/IHypercertToken";
import type { Errors } from "../types/src/protocol/libs/Errors";

import deployments from "./deployments.json";

/*
  in order to adjust the build folder:
    1) import any files here you want in the final build package.
    2) copy the file path of the import.
    3) add the path to the ts.config.build.json under the { include: [...] } configuration.
    4) bump package.json version to publish a new package to npm.
*/

// Deployments
export { deployments };

// Interfaces
export { IAllowlist, IHypercertToken };
export {
  HypercertMinterAbi,
  AllowlistMinterAbi,
  CurrencyManagerAbi,
  ExecutionManagerAbi,
  LooksRareProtocolAbi as HypercertExchangeAbi,
  NonceManagerAbi,
  OrderValidatorV2AAbi,
  StrategyManagerAbi,
  TransferManagerAbi,
};

// Contracts
export {
  HypercertMinter,
  AllowlistMinter,
  CurrencyManager,
  ExecutionManager,
  LooksRareProtocol as HypercertExchange,
  NonceManager,
  OrderValidatorV2A,
  StrategyManager,
  TransferManager,
};

// Libs
export { Errors };
