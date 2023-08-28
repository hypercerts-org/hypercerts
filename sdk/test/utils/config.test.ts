import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import { ethers } from "ethers";
import sinon from "sinon";

import { DEFAULT_CHAIN_ID } from "../../src/constants.js";
import {
  ConfigurationError,
  HypercertClientConfig,
  InvalidOrMissingError,
  UnsupportedChainError,
} from "../../src/types/index.js";
import { getConfig } from "../../src/utils/config.js";
import { reloadEnv } from "../../test/setup-env.js";

chai.use(chaiSubset);

describe("Config: chainId and chainName", () => {
  it("should throw an error when the chainId is not supported", () => {
    try {
      getConfig({ chainId: 1337 });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e instanceof UnsupportedChainError).to.be.true;
      const error = e as UnsupportedChainError;
      expect(error.message).to.eq("chainId=1337 is not yet supported");
    }
  });
});

describe("Config: contractAddress", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return the contract address specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = { contractAddress: "0x1234567890123456789012345678901234567890" };
    const config = getConfig(overrides);
    expect(config.contractAddress).to.equal(overrides.contractAddress);
  });

  it("should return the contract address specified by the CONTRACT_ADDRESS environment variable", () => {
    const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
    sinon.stub(process, "env").value({ CONTRACT_ADDRESS });

    const config = getConfig({});
    expect(config.contractAddress).to.equal(CONTRACT_ADDRESS);
    delete process.env.CONTRACT_ADDRESS;
  });

  it("should throw an error when the contract address specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = { contractAddress: "invalid-address" };
    expect(() => getConfig(overrides)).to.throw(InvalidOrMissingError, "Invalid contract address");
  });
});

describe("Config: graphUrl", () => {
  afterEach(() => {
    reloadEnv();
  });

  it("should return the default graphUrl when no overrides are specified", () => {
    const result = getConfig({});
    expect(result.graphUrl).to.equal("https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet");
  });

  it("should return the config specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chainName: "testnet",
      graphUrl: "https://api.example.com",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };
    const result = getConfig(overrides);
    expect(result.graphUrl).to.equal(overrides.graphUrl);
  });

  it("should throw an error when the graph URL specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chainName: "testnet",
      graphUrl: "incorrect-url",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };

    expect(() => getConfig(overrides)).to.throw(ConfigurationError, "Invalid graph URL");
  });

  it("should throw an error when the graph URL specified by overrides is missing", () => {
    const overrides: Partial<HypercertClientConfig> = {
      chainName: "testnet",
      contractAddress: "0x1234567890123456789012345678901234567890",
      unsafeForceOverrideConfig: true,
    };
    expect(() => getConfig(overrides)).to.throw(
      UnsupportedChainError,
      "attempted to override with chainId=5, but requires chainName, graphUrl, and contractAddress to be set",
    );
  });
});

describe("Config: nftStorageToken", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });
  it("should return an empty object when no overrides or environment variables are specified", () => {
    sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: "NFTSTOR" });

    const result = getConfig({});
    expect(result).to.deep.include({
      nftStorageToken: "NFTSTOR",
    });
  });

  it("should return the nftStorageToken specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      nftStorageToken: "NFTSTOR",
    };
    const result = getConfig(overrides);
    expect(result).to.deep.include({
      nftStorageToken: overrides.nftStorageToken,
    });
  });

  it("should return the nftStorageToken specified by the NFT_STORAGE_TOKEN environment variable", () => {
    sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: "NFTSTOR" });
    const result = getConfig({});
    expect(result).to.deep.include({
      nftStorageToken: "NFTSTOR",
    });
  });

  it("should return the nftStorageToken specified by the NEXT_PUBLIC_NFT_STORAGE_TOKEN environment variable", () => {
    sinon.stub(process, "env").value({ NEXT_PUBLIC_NFT_STORAGE_TOKEN: "NFTSTOR" });

    const result = getConfig({});
    expect(result).to.deep.include({
      nftStorageToken: "NFTSTOR",
    });
  });

  it("should not throw an error when the nftStorageToken specified by overrides is invalid", () => {
    sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: null });

    const overrides: Partial<HypercertClientConfig> = {};
    expect(() => getConfig(overrides)).to.not.throw();
  });
});

describe("Config: getOperator", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });
  it("should return a default provider when no overrides or environment variables are specified", () => {
    const result = getConfig({});
    //TODO: hacky solution to compare providers
    expect(JSON.stringify(result.operator)).to.equal(JSON.stringify(ethers.getDefaultProvider(DEFAULT_CHAIN_ID)));
  });

  it("should return the operator specified by overrides", () => {
    const provider = ethers.getDefaultProvider(DEFAULT_CHAIN_ID);
    const wallet = new ethers.Wallet("0x0123456789012345678901234567890123456789012345678901234567890123", provider);
    const overrides: Partial<HypercertClientConfig> = {
      operator: wallet,
    };
    const result = getConfig(overrides);
    expect(result.operator).to.equal(overrides.operator);
  });

  it("should return the operator specified by the PRIVATE_KEY environment variable", () => {
    const PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
    sinon.stub(process, "env").value({ PRIVATE_KEY });

    const result = getConfig({});
    const provider = ethers.getDefaultProvider(DEFAULT_CHAIN_ID);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    expect(JSON.stringify(result.operator)).to.equal(JSON.stringify(wallet));
  });

  it("should throw an error when the operator specified by overrides is invalid", () => {
    const overrides: Partial<HypercertClientConfig> = {
      operator: "invalid" as unknown as ethers.Signer,
    };
    expect(() => getConfig(overrides)).to.throw(InvalidOrMissingError, "Invalid operator.");
  });
});

describe("Config: web3StorageToken", () => {
  afterEach(() => {
    sinon.restore();

    reloadEnv();
  });

  it("should return an empty object when no overrides or environment variables are specified", () => {
    const WEB3_STORAGE_TOKEN = "WEB3";
    sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN });
    const result = getConfig({});
    expect(result).to.deep.include({
      web3StorageToken: WEB3_STORAGE_TOKEN,
    });
  });

  it("should return the web3StorageToken specified by overrides", () => {
    const overrides: Partial<HypercertClientConfig> = {
      web3StorageToken: "WEB3STOR",
    };
    const result = getConfig(overrides);
    expect(result).to.deep.include({
      web3StorageToken: overrides.web3StorageToken,
    });
  });

  it("should return the web3StorageToken specified by the WEB3_STORAGE_TOKEN environment variable", () => {
    const WEB3_STORAGE_TOKEN = "WEB3";
    sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN });
    const result = getConfig({});
    expect(result).to.deep.include({
      web3StorageToken: WEB3_STORAGE_TOKEN,
    });
  });

  it("should return the web3StorageToken specified by the NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable", () => {
    const NEXT_PUBLIC_WEB3_STORAGE_TOKEN = "WEB3";
    sinon.stub(process, "env").value({ NEXT_PUBLIC_WEB3_STORAGE_TOKEN });

    const result = getConfig({});
    expect(result).to.deep.include({
      web3StorageToken: NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
    });
  });

  it("should not throw an error when the web3StorageToken specified by overrides is invalid", () => {
    sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN: null });
    const overrides: Partial<HypercertClientConfig> = {};
    expect(() => getConfig(overrides)).to.not.throw();
  });
});
