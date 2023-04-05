/**
 * Explicitly signals that a code path that has not been implemented yet.
 */
export class NotImplementedError extends Error {
  constructor(msg = "Not implemented") {
    super(msg);
  }
}

/**
 * Used with assert statements (See common.ts)
 */
export class AssertionError extends Error {
  constructor(msg = "Assertion failed") {
    super(msg);
  }
}

/**
 * Something is `null` or `undefined` when we don't expect it
 */
export class NullOrUndefinedValueError extends Error {}

export class ParsingError extends Error {}

/**
 * Some value is out of an expected bound
 */
export class OutOfBoundsError extends Error {}

/**
 * Data is malformed
 */
export class InvalidDataError extends Error {}
