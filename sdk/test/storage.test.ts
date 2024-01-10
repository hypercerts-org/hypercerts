import { describe, it, afterAll } from "vitest";

import { expect } from "chai";

import { HypercertsStorage } from "../src/storage";
import { reloadEnv } from "./setup-env";

describe("HypercertsStorage", () => {
  afterAll(() => {
    reloadEnv();
  });

  it("should be able to create a new instance without valid storage keys", () => {
    const storage = new HypercertsStorage();

    expect(storage).to.be.an.instanceOf(HypercertsStorage);
  });

  it("should be able to create a new instance with valid storage keys", () => {
    const storage = new HypercertsStorage();

    expect(storage).to.be.an.instanceOf(HypercertsStorage);
  });
});
