import { TypedError } from "../errors";
import { logger } from "./logger";

const errorHandler = (err: Error) => {
  const errType = (err as TypedError).__type;
  switch (errType) {
    case "MalformedDataError":
      logger.error(`${err.message}`);
      break;
    case "FetchError":
      logger.error(`${err.message}`);
      break;
    default:
      logger.error(`${err.message}`);
  }
};

export { errorHandler };
