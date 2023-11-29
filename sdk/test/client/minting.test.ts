import { describe, it, beforeEach, afterAll, beforeAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";
import { ContractFunctionExecutionError, encodeFunctionResult, isHex, parseEther } from "viem";

import { HypercertClient } from "../../src/client";
import { HypercertMetadata, formatHypercertData } from "../../src";
import { MalformedDataError } from "../../src/types/errors";
import { TransferRestrictions } from "../../src/types/hypercerts";
import { getRawInputData, publicClient, walletClient, testClient } from "../helpers";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";

chai.use(assertionsCount);

describe("mintClaim in HypercertClient", () => {
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u" as CIDString;

  const storeBlobMock = sinon.stub(NFTStorage, "storeBlob").resolves(mockCorrectMetadataCid);

  const client = new HypercertClient({
    chain: { id: 5 },
    walletClient,
    publicClient,
    nftStorageToken: "test",
    web3StorageToken: "test",
  });

  const readSpy = sinon.stub(publicClient, "readContract");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const mintClaimResult = encodeFunctionResult({
    abi: HypercertMinterAbi,
    functionName: "mintClaim",
    result: [],
  });

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

    writeSpy = writeSpy.resolves(mintClaimResult);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll);

    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.equal(0);
    expect(writeSpy.callCount).to.equal(1);
    expect(storeBlobMock.callCount).to.equal(1);
  });

  it("throws on malformed metadata", async () => {
    try {
      await client.mintClaim({} as HypercertMetadata, 1000n, TransferRestrictions.AllowAll);
      expect.fail("Should throw MalformedDataError");
    } catch (e) {
      expect(e).to.be.instanceOf(MalformedDataError);
      const error = e as MalformedDataError;
      expect(error.message).to.equal("Metadata validation failed");
    }
    expect(writeSpy.callCount).to.equal(0);
  });

  it("mints a hypercerts with override params", async () => {
    const rawData = getRawInputData();

    const { data: formattedData } = formatHypercertData(rawData);

    writeSpy = writeSpy.resolves(mintClaimResult);

    let hash;

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll, {
        gasPrice: "FALSE_VALUE" as unknown as bigint,
      });
      expect.fail("Should throw Error");
    } catch (e) {
      expect(e).to.be.instanceOf(ContractFunctionExecutionError);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll, { gasPrice: 100n });

    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.equal(0);
    expect(writeSpy.callCount).to.equal(1);
    expect(storeBlobMock.callCount).to.equal(2);
  });
});
