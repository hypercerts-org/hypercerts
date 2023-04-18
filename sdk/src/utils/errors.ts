import { UnreachableCaseError } from "../errors";
import { logger } from "./logger";

type MetadataErrors = "METADATA_PARSING" | "METADATA_STORAGE";

const errorHandler = (method: string, result: MetadataErrors) => {
  const errValue = result;
  switch (errValue) {
    case "METADATA_PARSING":
      logger.error(`${method} failed with ${errValue}`);
      break;
    case "METADATA_STORAGE":
      logger.error(`${method} failed with ${errValue}`);
      break;
    default:
      logger.error(`${method} failed with ${errValue}`);
      throw new UnreachableCaseError(errValue);
  }
};

export { errorHandler };
