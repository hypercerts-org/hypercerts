import {
  ClientError,
  FetchError,
  HypercertsSdkError,
  InvalidOrMissingError,
  MalformedDataError,
  MintingError,
  StorageError,
  UnknownSchemaError,
  UnsupportedChainError,
} from "../types/errors";

/**
 *
 * Method to catch errors and log them
 * @param err  Error to handle defined in HypercertsSdkError
 */
const handleError = (err: HypercertsSdkError) => {
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

export { handleError };
