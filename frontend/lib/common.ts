import { NullOrUndefinedValueError, AssertionError } from "./errors";

/**
 * Assert that value should not be `null` or `undefined`
 *
 * @param x
 * @param msg
 * @returns
 */
export function ensure<T>(x: T | null | undefined, msg: string): T {
  if (x === null || x === undefined) {
    debugger; // eslint-disable-line
    throw new NullOrUndefinedValueError(
      `Value must not be undefined or null${msg ? `- ${msg}` : ""}`,
    );
  } else {
    return x;
  }
}

/**
 * Custom assertion so that we can trigger the debugger
 *
 * @param cond
 * @param msg
 */
export function assert<T>(cond: T, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    debugger; // eslint-disable-line
    throw new AssertionError(msg);
  }
}

/**
 * Used for exhaustive checking
 *
 * @param _x
 */
export function assertNever(_x: never): never {
  throw new AssertionError("Unexpected branch taken");
}

export function spawn(_promise: Promise<any>) {} // eslint-disable-line
