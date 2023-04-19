import { HypercertsSdkError } from "../errors.js";
import { logger } from "./logger.js";

/**
 *
 * Method to handle errors and log them
 * @param err  Error to handle defined in HypercertsSdkError
 */
const handleError = (err: HypercertsSdkError) => {
  switch (err.__type) {
    case "FetchError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "InvalidOrMissingError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "MalformedDataError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "MintingError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "StorageError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "UnsupportedChainError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "UnknownSchemaError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    default:
      throw new Error(`Unreachable case: ${err.__type}`);
  }
};

export { handleError };
