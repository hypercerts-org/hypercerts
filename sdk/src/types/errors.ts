/**
 * An enumeration of error types that can be thrown by the Hypercert SDK.
 */
enum ErrorType {
  ClientError = "ClientError",
  FetchError = "FetchError",
  InvalidOrMissingError = "InvalidOrMissingError",
  MalformedDataError = "MalformedDataError",
  MintingError = "MintingError",
  StorageError = "StorageError",
  UnsupportedChainError = "UnsupportedChainError",
  UnknownSchemaError = "UnknownSchemaError",
}

/**
 * An interface for errors that have a specific type.
 */
export interface TypedError extends Error {
  /**
   * The type of error.
   */
  __type: ErrorType;

  /**
   * Additional error payload.
   */
  payload?: { [key: string]: unknown };
}

/**
 * An error that is caused by a problem with the client.
 */
export class ClientError implements TypedError {
  /**
   * The type of error.
   */
  __type = ErrorType.ClientError;

  /**
   * The name of the error.
   */
  name = "ClientError";

  /**
   * The error message.
   */
  message: string;

  /**
   * Additional error payload.
   */
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the ClientError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Fails fetching a remote resource
 */
export class FetchError implements TypedError {
  __type = ErrorType.FetchError;
  name = "FetchError";
  message: string;
  payload?: { [key: string]: unknown };
  constructor(message: string, payload?: { [key: string]: unknown }) {
    this.message = message;
    this.payload = payload;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * The provided value was undefined or empty
 */
export class InvalidOrMissingError implements TypedError {
  __type = ErrorType.InvalidOrMissingError;
  name = "InvalidOrMissingError";
  message: string;
  payload: { keyName: string };
  constructor(message: string, keyName: string) {
    this.message = message;
    this.payload = { keyName };
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Minting transaction failed
 */
export class MintingError implements TypedError {
  __type = ErrorType.MintingError;
  name = "MintingError";
  message: string;
  payload?: { [key: string]: unknown };
  constructor(message: string, payload?: { [key: string]: unknown }) {
    this.message = message;
    this.payload = payload;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Fails storing to a remote resource
 */
export class StorageError implements TypedError {
  __type = ErrorType.StorageError;
  name = "StorageError";
  message: string;
  payload?: { [key: string]: unknown };
  constructor(message: string, payload?: { [key: string]: unknown }) {
    this.message = message;
    this.payload = payload;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * Schema could not be loaded
 */
export class UnknownSchemaError implements TypedError {
  __type = ErrorType.UnknownSchemaError;
  name = "UnknownSchemaError";
  message: string;
  payload?: { schemaName: string };
  constructor(message: string, payload?: { schemaName: string }) {
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
  payload?: { [key: string]: unknown };
  constructor(message: string, payload?: { [key: string]: unknown }) {
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

export type HypercertsSdkError =
  | FetchError
  | InvalidOrMissingError
  | MalformedDataError
  | MintingError
  | StorageError
  | UnsupportedChainError
  | UnknownSchemaError;
