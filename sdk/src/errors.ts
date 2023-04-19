enum ErrorType {
  FetchError = "FetchError",
  MalformedDataError = "MalformedDataError",
  UnsupportedChainError = "UnsupportedChainError",
}

export interface TypedError extends Error {
  __type: ErrorType;
  payload?: { [key: string]: any };
}

/**
 * Fails fetching a remote resource
 */
export class FetchError implements TypedError {
  __type = ErrorType.FetchError;
  name = "FetchError";
  message: string;
  payload?: any;
  constructor(message: string, payload?: any) {
    this.message = message;
    this.payload = payload;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Data doesn't conform to expectations
 */
export class MalformedDataError implements TypedError {
  __type = ErrorType.MalformedDataError;
  name = "MalformedDataError";
  message: string;
  payload?: { [key: string]: any } | undefined;
  constructor(message: string, payload?: { [key: string]: any } | undefined) {
    this.message = message;
    this.payload = payload;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * This blockchain is not yet supported
 * Please file an issue
 */
export class UnsupportedChainError implements TypedError {
  __type = ErrorType.UnsupportedChainError;
  name = "UnsupportedChain";
  message: string;
  payload: { chainID: string | number };
  constructor(message: string, chainID: string | number) {
    this.message = message;
    this.payload = { chainID };
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Undefined error case
 * Please file an issue
 */
export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

export type HypercertsSdkError = FetchError | MalformedDataError | UnsupportedChainError;
