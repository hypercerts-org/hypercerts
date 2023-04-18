/**
 * Fails fetching a remote resource
 */
export class FetchError extends Error {}

/**
 * Data doesn't conform to expectations
 */
export class MalformedDataError extends Error {}

/**
 * This blockchain is not yet supported
 * Please file an issue
 */
export class UnsupportedChain extends Error {}

// Exhaustive switch helper
export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}
