import { describe, it, afterEach } from "vitest";

import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import { ConfigurationError, HypercertClientConfig, InvalidOrMissingError } from "../../src/types";
import { getConfig } from "../../src/utils/config";
import { reloadEnv } from "../../test/setup-env";
import { walletClient, publicClient } from "../helpers";

chai.use(chaiSubset);

describe("Config: contractAddress", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the contract address specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      contractAddress: "0x1234567890123456789012345678901234567890",
    };
    const config = getConfig(overrides);
    expect(config.contractAddress).to.equal(overrides.contractAddress);
  });

  it("should throw an error when the contract address specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = { chain: { id: 11155111 }, contractAddress: "invalid-address" };
    try {
      getConfig(overrides);
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      const error = e as InvalidOrMissingError;
      expect(error.message).to.eq("Invalid contract address.");
    }
  });
});

describe("Config: graphUrl", () => {
  afterEach(() => {
    reloadEnv();
  });

  it("should return the default graphUrl when no overrides are specified", () => {
    const result = getConfig({ chain: { id: 11155111 } });
    expect(result.graphUrl).to.equal("https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-sepolia");
  });

  it("should return the config specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      graphUrl: "https://api.example.com",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };
    const result = getConfig(overrides);
    expect(result.graphUrl).to.equal(overrides.graphUrl);
  });

  it("should throw an error when the graph URL specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      graphUrl: "incorrect-url",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };

    try {
      getConfig(overrides);
    } catch (e) {
      expect(e instanceof ConfigurationError).to.be.true;
      const error = e as ConfigurationError;
      expect(error.message).to.eq("Invalid graph URL");
    }
  });

  it("should throw an error when the graph URL specified by overrides is missing", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };

    try {
      getConfig(overrides);
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      const error = e as InvalidOrMissingError;
      expect(error.message).to.eq(
        "attempted to override with chainId=11155111, but requires chainName, graphUrl, and contractAddress to be set",
      );
    }
  });
});

describe("Config: getPublicClient", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the operator specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      publicClient,
    };
    const result = getConfig(overrides);
    expect(result.publicClient).to.equal(overrides.publicClient);
  });
});

describe("Config: getWalletClient", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the operator specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 11155111 },
      walletClient,
    };
    const result = getConfig(overrides);
    expect(result.walletClient).to.equal(overrides.walletClient);
  });
});
