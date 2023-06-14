import chalk from "chalk";
import { logger } from "./logger.js";

// Expecting a value
export class NullOrUndefinedValueError extends Error {}

// Explicit assert fails
export class AssertionError extends Error {}

// Invalid inputs to a function
export class InvalidInputError extends Error {}

// Data is malformed
export class MalformedDataError extends Error {}

/**
 * Represents an error that doesn't need to be forwarded to Sentry.
 * These are usually errors that are the user's fault
 */
export class HandledError extends Error {}

/**
 * Catches HandledErrors and just exits
 * Forwards all other errors along.
 * @param p
 * @returns
 */
export const handleError = <T>(p: Promise<T>) => {
  return p.catch((e) => {
    if (e.message) {
      logger.error(chalk.bold(chalk.redBright("\nError: ")) + e.message);
    }
    if (e instanceof HandledError) {
      process.exit(1);
    } else {
      throw e;
    }
  });
};
