import { describe, it, expect } from "vitest";

import { HypercertIndexer } from "../src/indexer";
import { DEPLOYMENTS } from "../src/constants";

describe("HypercertsIndexer", () => {
  it("should only initialize with test environments", async () => {
    const environments = HypercertIndexer.getDeploymentsForEnvironment("test");
    expect(environments.every(([_, deployment]) => deployment.isTestnet)).toBe(true);
  });

  it("should only initialize with production environments", async () => {
    const environments = HypercertIndexer.getDeploymentsForEnvironment("production");
    expect(environments.every(([_, deployment]) => !deployment.isTestnet)).toBe(true);
  });

  it("should only initialize with all environments", async () => {
    const environments = HypercertIndexer.getDeploymentsForEnvironment("all");
    expect(environments.length).toEqual(Object.keys(DEPLOYMENTS).length);
  });
});
