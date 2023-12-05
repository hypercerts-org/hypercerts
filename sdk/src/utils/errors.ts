import {
  ClientError,
  ContractError,
  FetchError,
  HypercertsSdkError,
  InvalidOrMissingError,
  MalformedDataError,
  MintingError,
  StorageError,
  UnknownSchemaError,
  UnsupportedChainError,
} from "../types/errors";

import { BaseError, ContractFunctionRevertedError, Hex, decodeErrorResult } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

/**
 *
 * Method to catch errors and log them
 * @param err  Error to handle defined in HypercertsSdkError
 */
const handleSdkError = (err: HypercertsSdkError) => {
  switch (err.constructor) {
    case ClientError:
    case FetchError:
    case InvalidOrMissingError:
    case MalformedDataError:
    case MintingError:
    case StorageError:
    case UnsupportedChainError:
    case UnknownSchemaError:
      console.error(err.message, { label: err.constructor.toString(), metadata: err.payload });
      break;
    default:
      throw new Error(`Unreachable case: ${err.constructor.toString()} - ${err.message}`);
  }
};

const handleContractError = (data: Hex) => {
  try {
    const value = decodeErrorResult({
      abi: HypercertMinterAbi,
      data,
    });

    return new ContractError(value.errorName, {
      data,
      args: value.args,
    });
  } catch (err) {
    return new ContractError(undefined, {
      data,
    });
  }
};

const handleSimulatedContractError = (err: unknown) => {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName;

      return new ContractError(errorName, {
        data: revertError.signature ?? err,
        args: revertError.data?.args,
        error: revertError,
      });
    } else {
      return new ContractError(undefined, { data: err });
    }
  }

  return err;
};

export { handleSdkError, handleContractError, handleSimulatedContractError };
