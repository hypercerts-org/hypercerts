import { describe, it, afterAll } from "vitest";

import { expect } from "chai";

import { reloadEnv } from "./setup-env";
import { getStorage } from "../src/storage";

describe("HypercertsStorage", () => {
  afterAll(() => {
    reloadEnv();
  });

  it("should be able to create a new instance based on environment", () => {
    const testStorage = getStorage({ environment: "test" });

    expect(testStorage).to.contain.keys("storeMetadata", "storeAllowlist");

    const productionStorage = getStorage({ environment: "production" });

    expect(productionStorage).to.contain.keys("storeMetadata", "storeAllowlist");
  });
});
