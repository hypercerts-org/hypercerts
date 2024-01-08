import { describe, it, beforeEach, afterAll, beforeAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";
import { encodeFunctionResult, isHex, parseEther } from "viem";

import { HypercertClient } from "../../src/client";
import { HypercertMetadata, HypercertsStorage, formatHypercertData } from "../../src";
import { ContractError, MalformedDataError } from "../../src/types/errors";
import { TransferRestrictions } from "../../src/types/hypercerts";
import { getRawInputData, publicClient, walletClient, testClient } from "../helpers";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString } from "nft.storage";

chai.use(assertionsCount);

describe("mintClaim in HypercertClient", () => {
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u" as CIDString;

  const storeMetadataMock = sinon.stub(HypercertsStorage.prototype, "storeMetadata");

  const client = new HypercertClient({
    chain: { id: 11155111 },
    walletClient,
    publicClient,
    nftStorageToken: "test",
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

    storeMetadataMock.resetBehavior();
    storeMetadataMock.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("mints a hypercerts", async () => {
    expect(client.readonly).to.be.false;

    const rawData = getRawInputData();
    const { data: formattedData } = formatHypercertData(rawData);

    storeMetadataMock.resolves(mockCorrectMetadataCid);
    writeSpy = writeSpy.resolves(mintClaimResult);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll);

    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.equal(0);
    expect(writeSpy.callCount).to.equal(1);
    expect(storeMetadataMock.callCount).to.equal(1);
  });

  it("throws on malformed metadata", async () => {
    storeMetadataMock.callThrough();
    try {
      await client.mintClaim({} as HypercertMetadata, 1000n, TransferRestrictions.AllowAll);
      expect.fail("Should throw MalformedDataError");
    } catch (e) {
      console.log(e);
      expect(e).to.be.instanceOf(MalformedDataError);
      const error = e as MalformedDataError;
      expect(error.message).to.equal("Invalid metadata.");
    }
    expect(writeSpy.callCount).to.equal(0);
    expect(storeMetadataMock.callCount).to.equal(1);
  });

  it("mints a hypercerts with override params", async () => {
    const rawData = getRawInputData();

    const { data: formattedData } = formatHypercertData(rawData);

    storeMetadataMock.resolves(mockCorrectMetadataCid);
    writeSpy = writeSpy.resolves(mintClaimResult);

    let hash;

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll, {
        gasPrice: "FALSE_VALUE" as unknown as bigint,
      });
      expect.fail("Should throw Error");
    } catch (e) {
      expect(e).to.be.instanceOf(ContractError);
      const error = e as ContractError;
      expect(error.message).to.equal("Contract returned unparsable error. Inspect payload for returned data.");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll, { gasPrice: 100n });

    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.equal(0);
    expect(writeSpy.callCount).to.equal(1);
    expect(storeMetadataMock.callCount).to.equal(2);
  });
});
