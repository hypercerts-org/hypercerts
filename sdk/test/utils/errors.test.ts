import { describe, it, beforeEach, afterAll, beforeAll } from "vitest";
import chai from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";

import { ContractError, FetchError, MalformedDataError, UnsupportedChainError } from "../../src/types/errors";
import { handleSdkError } from "../../src/utils/errors";

import { getRawInputData, publicClient, walletClient, testClient } from "../helpers";

import { HypercertClient, HypercertMinterAbi, HypercertsStorage, TransferRestrictions, formatHypercertData } from "src";
import { parseEther, encodeErrorResult } from "viem";

chai.use(assertionsCount);

const expect = chai.expect;

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
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

  const storeMetadataStub = sinon.stub(HypercertsStorage.prototype, "storeMetadata");

  const client = new HypercertClient({
    chain: { id: 11155111 },
    walletClient,
    publicClient,
    nftStorageToken: "test",
  });

  const readSpy = sinon.stub(publicClient, "readContract");
  const writeSpy = sinon.stub(walletClient, "writeContract");

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await testClient.setBalance({ address: walletClient.account!.address, value: parseEther("1") });
  });

  beforeEach(async () => {
    chai.Assertion.resetAssertsCheck();
    writeSpy.resetBehavior();
    writeSpy.resetHistory();

    storeMetadataStub.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("handles throw on mintClaim", async () => {
    expect(client.readonly).to.be.false;

    const rawData = getRawInputData();
    const { data: formattedData } = formatHypercertData(rawData);
    readSpy.resolves(walletClient.account!.address);

    const value = encodeErrorResult({
      abi: HypercertMinterAbi,
      errorName: "NotAllowed",
    });
    writeSpy.resolves(value);

    storeMetadataStub.resolves(mockCorrectMetadataCid);

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaim(formattedData!, 0n, TransferRestrictions.DisallowAll);
    } catch (e) {
      expect(e).to.be.instanceOf(ContractError);
      const err = e as ContractError;
      expect(err.message).to.equal("Contract returned NotAllowed");
    }
  });
});
