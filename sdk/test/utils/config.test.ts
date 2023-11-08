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
      chain: { id: 5 },
      contractAddress: "0x1234567890123456789012345678901234567890",
    };
    const config = getConfig(overrides);
    expect(config.contractAddress).to.equal(overrides.contractAddress);
  });

  it("should throw an error when the contract address specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = { chain: { id: 5 }, contractAddress: "invalid-address" };
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
    const result = getConfig({ chain: { id: 5 } });
    expect(result.graphUrl).to.equal("https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet");
  });

  it("should return the config specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 5 },
      graphUrl: "https://api.example.com",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };
    const result = getConfig(overrides);
    expect(result.graphUrl).to.equal(overrides.graphUrl);
  });

  it("should throw an error when the graph URL specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 5 },
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
      chain: { id: 5 },
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };

    try {
      getConfig(overrides);
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      const error = e as InvalidOrMissingError;
      expect(error.message).to.eq(
        "attempted to override with chainId=5, but requires chainName, graphUrl, and contractAddress to be set",
      );
    }
  });
});

describe("Config: nftStorageToken & web3storageToken", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });
  it("should return an empty object when no overrides or environment variables are specified", () => {
    const result = getConfig({ chain: { id: 5 } });
    expect(result.nftStorageToken).to.be.undefined;
  });

  it("should return the nftStorageToken specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 5 },
      nftStorageToken: "NFTSTOR",
      web3StorageToken: "WEB3STOR",
    };
    const result = getConfig(overrides);
    expect(result).to.deep.include({
      nftStorageToken: overrides.nftStorageToken,
      web3StorageToken: overrides.web3StorageToken,
    });
  });

  it("should return the nftStorageToken specified by the NFT_STORAGE_TOKEN environment variable", () => {
    const result = getConfig({ chain: { id: 5 }, nftStorageToken: "NFTSTOR" });
    expect(result.nftStorageToken).to.be.eq("NFTSTOR");
  });
  it("should not throw an error when the nftStorageToken specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = { chain: { id: 5 }, nftStorageToken: undefined };
    expect(() => getConfig(overrides)).to.not.throw();
  });
});

describe("Config: getPublicClient", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the operator specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 5 },
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
      chain: { id: 5 },
      walletClient,
    };
    const result = getConfig(overrides);
    expect(result.walletClient).to.equal(overrides.walletClient);
  });
});

describe("Config: web3StorageToken", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return an empty object when no overrides or environment variables are specified", () => {
    const result = getConfig({ chain: { id: 5 } });
    expect(result.web3StorageToken).to.be.undefined;
  });

  it("should return the web3StorageToken specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chain: { id: 5 },
      web3StorageToken: "WEB3STOR",
    };

    const result = getConfig(overrides);
    expect(result).to.deep.include({
      web3StorageToken: overrides.web3StorageToken,
    });
  });

  it("should not throw an error when the web3StorageToken specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = { chain: { id: 5 }, web3StorageToken: undefined };
    expect(() => getConfig(overrides)).to.not.throw();
  });
});
