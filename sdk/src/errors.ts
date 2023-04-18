export interface TypedError extends Error {
  __type: string;
}

/**
 * Fails fetching a remote resource
 */
export class FetchError implements TypedError {
  __type = "FetchError";
  name = "FetchError";
  message: string;
  constructor(message: string) {
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "FetchError";
    Error.captureStackTrace(this);
  }
}

/**
 * Data doesn't conform to expectations
 */
export class MalformedDataError implements TypedError {
  __type = "MalformedDataError";
  name = "MalformedDataError";
  message: string;
  constructor(message: string) {
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * This blockchain is not yet supported
 * Please file an issue
 */
export class UnsupportedChainError implements TypedError {
  __type = "UnsupportedChain";
  name = "UnsupportedChain";
  message: string;
  constructor(chainID: string) {
    this.message = `Chain ${chainID} is not yet supported`;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// Exhaustive switch helper
export class UnreachableCaseError implements TypedError {
  __type: string = "UnreachableCaseError";
  name: string = "UnreachableCaseError";
  message: string;
  constructor(val: never) {
    this.message = `Unreachable case: ${val}`;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
