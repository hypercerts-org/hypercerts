import { BigNumber, ethers } from "ethers";

import { HypercertMetadata, HypercertMinting, formatHypercertData } from "../../src/index.js";

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

    expect(minter.contract).toBeInstanceOf(ethers.Contract);
    expect(minter.transferRestrictions).toEqual({
      AllowAll: 0,
      DisallowAll: 1,
      FromCreatorOnly: 2,
    });
  });

  it("checks can mint", async () => {
    const { valid, errors, data } = formatHypercertData(testData as TestDataType);
    const minter = HypercertMinting({
      chainConfig: {
        chainId: 5,
        contractAddress: "0x1",
        rpcUrl: "example.com",
      },
    });

    try {
      await minter.mintHypercert(userAddress, data as HypercertMetadata, BigNumber.from("10000"), BigNumber.from("0"));
    } catch (e: any) {
      expect(e.message).toEqual(
        'sending a transaction requires a signer (operation="sendTransaction", code=UNSUPPORTED_OPERATION, version=contracts/5.7.0)',
      );
    }
  });
});
