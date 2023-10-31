import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import { ethers } from "ethers";
import sinon from "sinon";

import {
  ConfigurationError,
  Environment,
  HypercertClientConfig,
  InvalidOrMissingError,
  SupportedChainIds,
  UnsupportedChainError,
} from "../../src/types";
import { getReadOnlyConfig, getWritableConfig } from "../../src/utils/config";
import { reloadEnv } from "../../test/setup-env";
import { deployments } from "../../src";

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

// describe("Config: nftStorageToken", () => {
//   afterEach(() => {
//     sinon.restore();

//     reloadEnv();
//   });
//   it("should return an empty object when no overrides or environment variables are specified", () => {
//     sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: "NFTSTOR" });

//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       nftStorageToken: "NFTSTOR",
//     });
//   });

//   it("should return the nftStorageToken specified by overrides", () => {
//     const overrides: Partial<HypercertClientConfig> = {
//       nftStorageToken: "NFTSTOR",
//     };
//     const result = getReadOnlyConfig(overrides);
//     expect(result).to.deep.include({
//       nftStorageToken: overrides.nftStorageToken,
//     });
//   });

//   it("should return the nftStorageToken specified by the NFT_STORAGE_TOKEN environment variable", () => {
//     sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: "NFTSTOR" });
//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       nftStorageToken: "NFTSTOR",
//     });
//   });

//   it("should return the nftStorageToken specified by the NEXT_PUBLIC_NFT_STORAGE_TOKEN environment variable", () => {
//     sinon.stub(process, "env").value({ NEXT_PUBLIC_NFT_STORAGE_TOKEN: "NFTSTOR" });

//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       nftStorageToken: "NFTSTOR",
//     });
//   });

//   it("should not throw an error when the nftStorageToken specified by overrides is invalid", () => {
//     sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: null });

//     const overrides: Partial<HypercertClientConfig> = {};
//     expect(() => getReadOnlyConfig(overrides)).to.not.throw();
//   });
// });

// describe("Config: getOperator", () => {
//   afterEach(() => {
//     sinon.restore();

//     reloadEnv();
//   });
//   it("should not return a provider when no overrides or environment variables are specified", () => {
//     try {
//       const result = getWritableConfig({});
//     } catch (e) {
//       expect(e instanceof InvalidOrMissingError).to.be.true;
//       expect((e as Error).message).to.eq("Invalid operator.");
//     }
//   });

//   it("should return the operator specified by client config", async () => {
//     const overrides: Partial<HypercertClientConfig> = {
//       environment: 5,
//       operator: ethers.getDefaultProvider(5),
//     };

//     const result = await getWritableConfig(overrides);
//     expect(result.operator).to.equal(overrides.operator);
//   });

//   it("should return the operator specified by the PRIVATE_KEY environment variable", () => {
//     const PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
//     sinon.stub(process, "env").value({ PRIVATE_KEY });

//     const result = getReadOnlyConfig({});
//     const provider = ethers.getDefaultProvider(5);
//     const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//     expect(JSON.stringify(result.operator)).to.equal(JSON.stringify(wallet));
//   });

//   it("should throw an error when the operator specified by overrides is invalid", () => {
//     const overrides: Partial<HypercertClientConfig> = {
//       operator: "invalid" as unknown as ethers.Signer,
//     };
//     expect(() => getReadOnlyConfig(overrides)).to.throw(InvalidOrMissingError, "Invalid operator.");
//   });
// });

// describe("Config: web3StorageToken", () => {
//   afterEach(() => {
//     sinon.restore();

//     reloadEnv();
//   });

//   it("should return an empty object when no overrides or environment variables are specified", () => {
//     const WEB3_STORAGE_TOKEN = "WEB3";
//     sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN });
//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       web3StorageToken: WEB3_STORAGE_TOKEN,
//     });
//   });

//   it("should return the web3StorageToken specified by overrides", () => {
//     const overrides: Partial<HypercertClientConfig> = {
//       web3StorageToken: "WEB3STOR",
//     };
//     const result = getReadOnlyConfig(overrides);
//     expect(result).to.deep.include({
//       web3StorageToken: overrides.web3StorageToken,
//     });
//   });

//   it("should return the web3StorageToken specified by the WEB3_STORAGE_TOKEN environment variable", () => {
//     const WEB3_STORAGE_TOKEN = "WEB3";
//     sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN });
//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       web3StorageToken: WEB3_STORAGE_TOKEN,
//     });
//   });

//   it("should return the web3StorageToken specified by the NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable", () => {
//     const NEXT_PUBLIC_WEB3_STORAGE_TOKEN = "WEB3";
//     sinon.stub(process, "env").value({ NEXT_PUBLIC_WEB3_STORAGE_TOKEN });

//     const result = getReadOnlyConfig({});
//     expect(result).to.deep.include({
//       web3StorageToken: NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
//     });
//   });

//   it("should not throw an error when the web3StorageToken specified by overrides is invalid", () => {
//     sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN: null });
//     const overrides: Partial<HypercertClientConfig> = {};
//     expect(() => getReadOnlyConfig(overrides)).to.not.throw();
//   });
// });
