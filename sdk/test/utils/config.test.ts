import { describe, it, afterEach } from "vitest";

import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import { HypercertClientConfig } from "../../src/types";
import { getConfig } from "../../src/utils/config";
import { reloadEnv } from "../../test/setup-env";
import { walletClient, publicClient } from "../helpers";
import { DEFAULT_ENVIRONMENT } from "../../src/constants";

chai.use(chaiSubset);

describe("Config: graphUrl", () => {
  afterEach(() => {
    reloadEnv();
  });

  it("should return the default indexer environment when no overrides are specified", () => {
    const result = getConfig({ environment: DEFAULT_ENVIRONMENT });
    expect(result.environment).to.equal(DEFAULT_ENVIRONMENT);
  });

  it("should return the config specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      environment: "production",
    };
    const result = getConfig(overrides);
    expect(result.readOnly).to.be.true;
  });
});

describe("Config: getPublicClient", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the operator specified by overrides", () => {
    const config: Partial<HypercertClientConfig> = {
      environment: DEFAULT_ENVIRONMENT,
      publicClient,
    };
    const result = getConfig(config);
    expect(result.publicClient).to.equal(config.publicClient);
  });
});

describe("Config: getWalletClient", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the operator specified by overrides", () => {
    const config: Partial<HypercertClientConfig> = {
      environment: DEFAULT_ENVIRONMENT,
      walletClient,
    };
    const result = getConfig(config);
    expect(result.walletClient).to.equal(config.walletClient);
  });
});
