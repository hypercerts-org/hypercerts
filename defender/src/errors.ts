/**
 * Error interfacing with OpenZeppelin API
 */
export class ApiError extends Error {}

/**
 * Misconfigured. Check your environment variables or `src/config.ts`
 */
export class ConfigError extends Error {}

/**
 * This is a pathway that hasn't been implemented yet
 */
export class NotImplementedError extends Error {}

/**
 * This is a pathway that hasn't been implemented yet
 */
export class MissingDataError extends Error {}
