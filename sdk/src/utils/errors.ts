import { TypedError } from "../errors.js";
import { logger } from "./logger.js";

const errorHandler = (err: Error) => {
  const errType = (err as TypedError).__type;
  switch (errType) {
    case "UnsupportedChainError":
    case "MalformedDataError":
    case "FetchError":
      logger.error(`${err.message}`);
      break;
    default:
      // TODO unreachable case Error
      logger.error(`${err.message}`);
  }
};

export { errorHandler };
