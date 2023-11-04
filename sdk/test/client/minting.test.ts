import { expect } from "chai";
import sinon from "sinon";
import { encodeFunctionResult, isHex, parseAbi } from "viem";

import HypercertClient from "../../src/client";
import { HypercertMetadata, formatHypercertData } from "../../src";
import { MalformedDataError } from "../../src/types/errors";
import { TransferRestrictions } from "../../src/types/hypercerts";
import { getRawInputData, publicClient, walletClient } from "../helpers";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";

describe("mintClaim in HypercertClient", () => {
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u" as CIDString;

  const storeBlobMock = sinon.stub(NFTStorage, "storeBlob").resolves(mockCorrectMetadataCid);

  const client = new HypercertClient({
    id: 5,
    walletClient,
    publicClient,
  });

  const readSpy = sinon.stub(publicClient, "request");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const mintClaimResult = encodeFunctionResult({
    abi: parseAbi(HypercertMinterAbi),
    functionName: "mintClaim",
    result: [],
  });

  beforeEach(async () => {
    readSpy.resetBehavior();
    readSpy.resetHistory();

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
      expect((e as Error).message).to.match(/.Cannot convert FALSE_VALUE to a BigInt/);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hash = await client.mintClaim(formattedData!, 1000n, TransferRestrictions.AllowAll, { gasPrice: 100n });

    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.equal(0);
    expect(writeSpy.callCount).to.equal(1);
    expect(storeBlobMock.callCount).to.equal(2);
  });
});
