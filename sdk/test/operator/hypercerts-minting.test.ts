import { expect } from "chai";
import { BigNumber, Contract } from "ethers";

import { HypercertMetadata, HypercertMinting, formatHypercertData } from "../../src/index.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { TransferRestrictions } from "../../src/types/hypercerts.js";
import { TestDataType, getRawInputData } from "../helpers.js";

const testData = getRawInputData();

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
