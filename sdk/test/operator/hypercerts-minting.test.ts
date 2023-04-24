import { expect } from "chai";
import { BigNumber, Contract, ethers } from "ethers";

import { HypercertMetadata, HypercertMinting, formatHypercertData } from "../../src/index.js";
import { TransferRestrictions } from "../../src/types/hypercerts.js";
import { MalformedDataError, MintingError } from "../../src/types/errors.js";

type TestDataType = Parameters<typeof formatHypercertData>[0];
const testData: Partial<TestDataType> = {
  name: "test name",
  description: "test description",
  image: "some test image",
  contributors: ["0x111", "0x22"],
  external_url: "https://example.com",
  impactScope: ["test impact scope"],
  impactTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
  impactTimeframeStart: Math.floor(new Date().getTime()) / 1000,
  workScope: ["test work scope"],
  workTimeframeStart: Math.floor(new Date().getTime()) / 1000,
  workTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
  properties: [{ trait_type: "test trait type", value: "aaa" }],
  rights: ["test right 1", "test right 2"],
  version: "0.0.1",
};

describe("Create Minting instance", () => {
  const userAddress = "0x23314160c752D6Bb544661DcE13d01C21c64331E";
  // TODO checks on throw are not catching
  it("checks correct config", () => {
    const minter = HypercertMinting({
      provider: undefined,
      chainConfig: {
        chainId: 5,
        contractAddress: "0x1",
        rpcUrl: "example.com",
      },
    });

    expect(minter.contract instanceof Contract).to.be.true;
    expect(minter.transferRestrictions).to.include(TransferRestrictions);
  });

  it("checks can mint", async () => {
    const { data: formattedData } = formatHypercertData(testData as TestDataType);
    const minter = HypercertMinting({
      chainConfig: {
        chainId: 5,
        contractAddress: "0x1",
        rpcUrl: "example.com",
      },
    });

    try {
      if (formattedData) {
        await minter.mintHypercert(userAddress, formattedData, BigNumber.from("10000"), TransferRestrictions.AllowAll);
      }
      expect.fail("Should throw MintingError");
    } catch (e) {
      const error = e as Error;
      expect(error.message).to.eq(
        'sending a transaction requires a signer (operation="sendTransaction", code=UNSUPPORTED_OPERATION, version=contracts/5.7.0)',
      );
    }

    try {
      await minter.mintHypercert(
        userAddress,
        {} as HypercertMetadata,
        BigNumber.from("10000"),
        TransferRestrictions.AllowAll,
      );
      expect.fail("Should throw MalformedDataError");
    } catch (e) {
      expect(e instanceof MalformedDataError).to.be.true;

      const error = e as MalformedDataError;
      expect(error.message).to.eq("Metadata validation failed");
    }
  });
});
