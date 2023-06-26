/**
 * An interface for errors that have a specific type.
 */
export interface CustomError {
  /**
   * Additional error payload.
   */
  payload?: { [key: string]: unknown };
}

/**
 * An error that is caused by a problem with the client.
 */
export class ClientError extends Error implements CustomError {
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
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Fails fetching a remote resource
 */
export class FetchError extends Error implements CustomError {
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the FetchError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * The provided value was undefined or empty
 */
export class InvalidOrMissingError extends Error implements CustomError {
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the InvalidOrMissingError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Minting transaction failed
 */
export class MintingError extends Error implements CustomError {
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the MintingError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Fails storing to a remote resource
 */
export class StorageError extends Error implements CustomError {
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the StorageError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Schema could not be loaded
 */
export class UnknownSchemaError extends Error implements CustomError {
  payload?: { schemaName: string };

  /**
   * Creates a new instance of the UnknownSchemaError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { schemaName: string }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * Data doesn't conform to expectations
 */
export class MalformedDataError extends Error implements CustomError {
  payload?: { [key: string]: unknown };

  /**
   * Creates a new instance of the MalformedDataError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { [key: string]: unknown }) {
    super(message);
    this.message = message;
    this.payload = payload;
  }
}

/**
 * This blockchain is not yet supported
 * Please file an issue
 */
export class UnsupportedChainError extends Error implements CustomError {
  payload?: { chainID: string | number | undefined };

  /**
   * Creates a new instance of the UnsupportedChainError class.
   * @param message The error message.
   * @param payload Additional error payload.
   */
  constructor(message: string, payload?: { chainID: string | number | undefined }) {
    super(message);
    this.message = message;
    this.payload = payload;
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
