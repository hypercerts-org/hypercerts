import { HypercertsSdkError, UnreachableCaseError } from "../errors.js";
import { logger } from "./logger.js";

const handleError = (err: HypercertsSdkError) => {
  switch (err.__type) {
    case "UnsupportedChainError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "MalformedDataError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    case "FetchError":
      logger.error(err.message, { label: err.__type, metadata: err.payload });
      break;
    default:
      // TODO unreachable case Error not casting as never
      logger.error(`${err.message}`);
      throw new Error(err.message);
  }
};

export { handleError };
