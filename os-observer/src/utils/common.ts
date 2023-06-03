import _ from "lodash";
import { AssertionError, NullOrUndefinedValueError } from "./error.js";

/**
 * Asserts that a condition is true.
 * @param cond
 * @param msg
 */
export function assert<T>(cond: T, msg: string): asserts cond {
  if (!cond) {
    // eslint-disable-next-line no-debugger
    debugger;
    throw new AssertionError(msg || "Assertion failed");
  }
}

/**
 * Asserts that a branch is never taken.
 * Useful for exhaustiveness checking.
 * @param _x
 */
export function assertNever(_x: never): never {
  throw new Error("unexpected branch taken");
}

/**
 * Asserts that a value is not null or undefined.
 * @param x
 * @param msg
 * @returns
 */
export function ensure<T>(x: T | null | undefined, msg: string): T {
  if (x === null || x === undefined) {
    // eslint-disable-next-line no-debugger
    debugger;
    throw new NullOrUndefinedValueError(
      `Value must not be undefined or null${msg ? `- ${msg}` : ""}`,
    );
  } else {
    return x;
  }
}

/**
 * Asserts that a value is a string.
 * @param x
 * @returns
 */
export function ensureString(x: any) {
  if (_.isString(x)) {
    return x;
  } else {
    throw new Error(`Expected string, but got ${typeof x}`);
  }
}

/**
 * Asserts that a value is a number
 * @param x
 * @returns
 */
export function ensureNumber(x: any) {
  if (_.isNumber(x)) {
    return x;
  } else {
    throw new Error(`Expected number, but got ${typeof x}`);
  }
}

/**
 * Asserts that a value is an array.
 * @param x
 * @returns
 */
export function ensureArray<T>(x: T | T[] | undefined): T[] {
  if (x == null) {
    return [];
  } else if (Array.isArray(x)) {
    return x;
  } else {
    return [x];
  }
}

/**
 * Return an object type that can be used for comparisons
 * @param record
 * @returns
 */
export const normalizeToObject = <PointerType>(record?: any) =>
  safeCast(_.toPlainObject(record) as Partial<PointerType>);

/**
 * Explicitly mark that a cast is safe.
 * e.g. `safeCast(x as string[])`.
 */
export function safeCast<T>(x: T): T {
  return x;
}

/**
 * Mark that a cast is tech debt that needs to be cleaned up.
 */
export function hackyCast<T = any>(x: any): T {
  return x;
}

/**
 * Marks that a cast should be checked at runtime.
 * Usually this is at some system boundary, e.g. a message received over the network.
 */
export function uncheckedCast<T>(x: any): T {
  return x;
}
