import { describe, it, beforeEach, afterAll, beforeAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";

import { ContractError, FetchError, MalformedDataError, UnsupportedChainError } from "../../src/types/errors";
import { handleSdkError } from "../../src/utils/errors";

import { getRawInputData, publicClient, walletClient, testClient } from "../helpers";

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";
import { HypercertClient, TransferRestrictions, formatHypercertData } from "src";
import { parseEther } from "viem";

chai.use(assertionsCount);

describe("SDK Error handler", () => {
  it("handles SDK errors", () => {
    expect(handleSdkError(new FetchError("testing FetchError", { url: "http://badexample.com" }))).to.be.undefined;
    expect(handleSdkError(new MalformedDataError("testing MalformedDataError", { data: { foo: "bar" } }))).to.be
      .undefined;
    expect(handleSdkError(new UnsupportedChainError("testing UnsupportedChainError", { chainID: 1337 }))).to.be
      .undefined;
  });
});

describe("Contract Error handler", () => {
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u" as CIDString;

  const storeBlobMock = sinon.stub(NFTStorage, "storeBlob").resolves(mockCorrectMetadataCid);

  const client = new HypercertClient({
    chain: { id: 5 },
    walletClient,
    publicClient,
    nftStorageToken: "test",
    web3StorageToken: "test",
  });

  const writeSpy = sinon.stub(walletClient, "writeContract");

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await testClient.setBalance({ address: walletClient.account!.address, value: parseEther("1") });
  });

  beforeEach(async () => {
    chai.Assertion.resetAssertsCheck();
    writeSpy.resetBehavior();
    writeSpy.resetHistory();

    storeBlobMock.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("mints a hypercerts", async () => {
    expect(client.readonly).to.be.false;

    const rawData = getRawInputData();
    const { data: formattedData } = formatHypercertData(rawData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaim(formattedData!, 0n, TransferRestrictions.AllowAll);
      expect.fail("Should have thrown an error");
    } catch (e) {
      console.log(e);
      expect(e).to.be.instanceOf(ContractError);
    }
  });
});
