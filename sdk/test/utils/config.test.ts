import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import {
  ConfigurationError,
  Environment,
  HypercertClientConfig,
  InvalidOrMissingError,
  UnsupportedChainError,
} from "../../src/types";
import { getReadOnlyConfig, getWritableConfig } from "../../src/utils/config";
import { reloadEnv } from "../../test/setup-env";
import { deployments } from "../../src";
import { ethers } from "ethers";
import { MockProvider } from "ethereum-waffle";

chai.use(chaiSubset);

const defaultOverrides: Partial<HypercertClientConfig> = {
  environment: 5,
  chainId: 5,
  chainName: "testnet",
  graphUrl: "https://api.example.com",
  contractAddress: "0x1234567890123456789012345678901234567890",
  unsafeForceOverrideConfig: true,
};

describe("Config: environment", () => {
  it("should throw an error when the environment is not supported", () => {
    const falseEnvironment = "DEGEN_COUNTRY" as Environment;
    try {
      getReadOnlyConfig({ environment: falseEnvironment });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e instanceof UnsupportedChainError).to.be.true;
      const error = e as UnsupportedChainError;
      expect(error.message).to.eq(`No default config for environment=${falseEnvironment} found in SDK`);
    }
  });

  it("should return the environment according to the chainId provided", () => {
    const environment = 5 as Environment;
    const config = getReadOnlyConfig({ environment });
    const expectedDeployment = deployments[5];
    expect(config).to.deep.include(expectedDeployment);
  });
});

describe("Config: contractAddress", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the contract address specified by overrides", () => {
    const config = getReadOnlyConfig(defaultOverrides);
    expect(config.contractAddress).to.equal(defaultOverrides.contractAddress);
  });

  it("should throw an error when the contract address specified by overrides is invalid", () => {
    try {
      getReadOnlyConfig({ ...defaultOverrides, contractAddress: "invalid-address" });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      expect((e as Error).message).to.eq("Provided contract address in overrides is not an address");
    }
  });
});

describe("Config: graphUrl", () => {
  afterEach(() => {
    reloadEnv();
  });

  it("should return the default graphUrl for the environment when no overrides are specified", () => {
    const result = getReadOnlyConfig({ environment: 5 });
    expect(result.graphUrl).to.equal(deployments[5].graphUrl);
  });

  it("should return the config specified by overrides", () => {
    const result = getReadOnlyConfig(defaultOverrides);
    expect(result.graphUrl).to.equal(defaultOverrides.graphUrl);
  });

  it("should throw an error when the graph URL specified by overrides is invalid", () => {
    try {
      getReadOnlyConfig({ ...defaultOverrides, graphUrl: "incorrect-url" });
      expect.fail("Should have failed on Graph URL");
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      expect((e as Error).message).to.equal("Provided graph URL in overrides is not a valid URL");
    }
  });

  it("should throw an error when the graph URL specified by overrides is missing", () => {
    try {
      getReadOnlyConfig({ ...defaultOverrides, graphUrl: undefined });
      expect.fail("Should have failed on Graph URL");
    } catch (e) {
      expect(e instanceof InvalidOrMissingError).to.be.true;
      expect((e as Error).message).to.equal(
        "attempted to override with chainId=5, but requires chainId, chainName, graphUrl, and contractAddress to be set",
      );
    }
  });
});

describe("Config: nftStorageToken & web3storageToken", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });
  it("should not return an nftStorageToken when no overrides are specified", () => {
    const result = getReadOnlyConfig({ environment: 5 });
    expect(result.nftStorageToken).to.be.undefined;
    expect(result.web3StorageToken).to.be.undefined;
  });

  it("should return the nftStorageToken specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      ...defaultOverrides,
      nftStorageToken: "NFTSTOR",
      web3StorageToken: "WEB3STOR",
    };
    const result = getReadOnlyConfig(overrides);
    expect(result).to.deep.include({
      nftStorageToken: overrides.nftStorageToken,
      web3StorageToken: overrides.web3StorageToken,
    });
  });
});

describe("Config: getOperator", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });
  it("should not return a provider when no overrides or environment variables are specified", async () => {
    try {
      await getWritableConfig(defaultOverrides);
    } catch (e) {
      expect(e instanceof ConfigurationError).to.be.true;
      expect((e as Error).message).to.eq("An operator must be provided to sign and submit transactions");
    }
  });

  it("should return the operator specified by client config", async () => {
    const chainIdStub = sinon.stub(ethers.Signer.prototype, "getChainId").resolves(5);
    const provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });

    const signer = ethers.Wallet.createRandom().connect(provider);

    const overrides: Partial<HypercertClientConfig> = {
      ...defaultOverrides,
      operator: signer,
    };

    const result = await getWritableConfig(overrides);
    expect(result.operator).to.not.be.undefined;
  });

  it("should throw an error when the operator specified by overrides is invalid", async () => {
    const overrides: Partial<HypercertClientConfig> = {
      ...defaultOverrides,
      operator: "invalid" as unknown as ethers.Signer,
    };

    try {
      await getWritableConfig(overrides);
      expect.fail("Should have failed on incorrect operator");
    } catch (e) {
      expect(e instanceof ConfigurationError).to.be.true;
      expect((e as Error).message).to.eq("An operator must be provided to sign and submit transactions");
    }
  });
});
