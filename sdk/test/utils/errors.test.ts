import { describe, it, beforeEach, afterAll, beforeAll, vi } from "vitest";
import chai from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";

import { ContractError, FetchError, MalformedDataError, UnsupportedChainError } from "../../src/types/errors";
import { handleSdkError } from "../../src/utils/errors";

import { getRawInputData, publicClient, walletClient, testClient } from "../helpers";

import { HypercertClient, HypercertMinterAbi, TransferRestrictions, formatHypercertData } from "src";
import { parseEther, encodeErrorResult } from "viem";

chai.use(assertionsCount);

const expect = chai.expect;

const mocks = vi.hoisted(() => {
  return {
    storeAllowList: vi.fn(),
    storeMetadata: vi.fn(),
  };
});

vi.mock("../../src/__generated__/api", () => {
  return {
    storeAllowList: mocks.storeAllowList,
    storeMetadata: mocks.storeMetadata,
  };
});

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

  const client = new HypercertClient({
    environment: "test",
    walletClient,
    publicClient,
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
    vi.resetAllMocks();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("handles throw on mintClaim", async () => {
    expect(client.readOnly).to.be.false;

    const rawData = getRawInputData();
    const { data: formattedData } = formatHypercertData(rawData);
    readSpy.resolves(walletClient.account!.address);

    const value = encodeErrorResult({
      abi: HypercertMinterAbi,
      errorName: "NotAllowed",
    });
    writeSpy.resolves(value);

    mocks.storeMetadata.mockResolvedValue({ data: { cid: mockCorrectMetadataCid } });

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
