// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

import {
  HypercertMinterAbi,
  HypercertExchangeAbi,
  OrderValidatorV2AAbi,
  StrategyManagerAbi,
  TransferManagerAbi,
  StrategyHypercertFractionOfferAbi,
  CreatorFeeManagerWithRoyaltiesAbi,
  ExecutionManagerAbi,
} from "@hypercerts-org/contracts";

import { HypercertClient } from "./client";
import * as CONSTANTS from "./constants";

/**
 * Protocol
 */
export {
  HypercertMinterAbi,
  HypercertExchangeAbi,
  OrderValidatorV2AAbi,
  StrategyManagerAbi,
  TransferManagerAbi,
  StrategyHypercertFractionOfferAbi,
  CreatorFeeManagerWithRoyaltiesAbi,
  ExecutionManagerAbi,
};

export { CONSTANTS };

/**
 * Client
 */
export { HypercertClient };

/**
 * Types
 */
export * from "./types";

/**
 * Validators
 */
export * from "./validator";

/**
 * Utils
 */
export * from "./utils";
