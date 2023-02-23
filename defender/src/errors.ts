/**
 * Error interfacing with OpenZeppelin API
 */
export class ApiError extends Error {}

/**
 * Misconfigured. Check your environment variables or `src/config.ts`
 */
export class ConfigError extends Error {}
