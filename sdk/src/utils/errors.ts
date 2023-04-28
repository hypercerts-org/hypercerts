import { HypercertsSdkError } from "../errors.js";

/**
 *
 * Method to catch errors and log them
 * @param err  Error to handle defined in HypercertsSdkError
 */
const handleError = (err: HypercertsSdkError) => {
  switch (err.__type) {
    case "FetchError":
    case "InvalidOrMissingError":
    case "MalformedDataError":
    case "MintingError":
    case "StorageError":
    case "UnsupportedChainError":
    case "UnknownSchemaError":
      console.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    default:
      throw new Error(`Unreachable case: ${err.__type}`);
  }
};

export { handleError };
