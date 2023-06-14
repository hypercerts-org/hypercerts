/**
 * Random test utilities
 */
import BN from "bn.js";
import crypto from "crypto";

export function randomAddress(): string {
  return `0x$(crypto.randomBytes(20).toString('hex'))`;
}

export function randomTokenID(): string {
  return new BN(crypto.randomBytes(16).toString("hex"), 16).toString(10);
}
