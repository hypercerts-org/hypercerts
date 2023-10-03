import { expect } from "chai";
import { MockContract, MockProvider, deployMockContract } from "ethereum-waffle";
import { ethers } from "ethers";
import sinon from "sinon";

import HypercertClient from "../../src/client.js";
import {
  HypercertMetadata,
  HypercertMinter,
  HypercertsStorage,
  formatHypercertData,
  HypercertMinterFactory,
} from "../../src/index.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { TransferRestrictions } from "../../src/types/hypercerts.js";
import { getRawInputData } from "../helpers.js";

const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

describe("mintClaim in HypercertClient", () => {
  const metaDataStub = sinon.stub(HypercertsStorage.prototype, "storeMetadata").resolves(mockCorrectMetadataCid);

  const setUp = async () => {
    const provider = new MockProvider();
    const [user, other, admin] = provider.getWallets();
    const stub = sinon.stub(provider, "on");

    const minter = await deployMockContract(user, new HypercertMinterFactory().interface.format());

    const client = new HypercertClient({
      chainId: 5,
      operator: user,
    });

    sinon.replaceGetter(client, "contract", () => minter as unknown as HypercertMinter);

    return {
      client,
      provider,
      users: { user, other, admin },
      minter,
      stub,
    };
  };

  let _client: HypercertClient;
  let _provider: MockProvider;
  let _users: { user: ethers.Wallet; other: ethers.Wallet; admin: ethers.Wallet };
  let _minter: MockContract;
  let _stub: sinon.SinonStub;

  beforeAll(async () => {
    const { client, provider, users, minter, stub } = await setUp();
    _client = client;
    _provider = provider;
    _users = users;
    _minter = minter;
    _stub = stub;
  });

  beforeEach(() => {
    _provider.clearCallHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("mints a hypercerts", async () => {
    expect(_client.readonly).to.be.false;

    const rawData = getRawInputData();
    const { data: formattedData } = formatHypercertData(rawData);

    await _minter.mock.mintClaim.returns();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await _client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll);

    sinon.assert.calledOnce(metaDataStub);
    expect(_provider.callHistory.length).to.equal(2);
  }, 10000);

  it("throws on malformed metadata", async () => {
    try {
      await _client.mintClaim({} as HypercertMetadata, 1000, TransferRestrictions.AllowAll);
      expect.fail("Should throw MalformedDataError");
    } catch (e) {
      expect(e).to.be.instanceOf(MalformedDataError);
      const error = e as MalformedDataError;
      expect(error.message).to.equal("Metadata validation failed");
    }
    expect(_provider.callHistory.length).to.equal(0);
  });

  it("mints a hypercerts with override params", async () => {
    const rawData = getRawInputData();

    await _minter.mock.mintClaim.returns();
    const { data: formattedData } = formatHypercertData(rawData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await _client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll, { gasPrice: "FALSE_VALUE" });
      expect.fail("Should throw Error");
    } catch (e) {
      expect((e as Error).message).to.match(/.*invalid BigNumber string.*/);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await _client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll, { gasPrice: "100" });

    expect(_provider.callHistory.length).to.equal(2);
  }, 10000);
});
