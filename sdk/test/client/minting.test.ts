import { jest } from "@jest/globals";
import { MockProvider } from "ethereum-waffle";
import { Wallet } from "ethers";
import sinon from "sinon";

import HypercertClient from "../../src/client.js";
import { HypercertMetadata, formatHypercertData } from "../../src/index.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { TransferRestrictions } from "../../src/types/hypercerts.js";
import { TestDataType, getRawInputData } from "../helpers.js";

describe("mintClaim in HypercertClient", () => {
  let stub: sinon.SinonStub;
  let provider: MockProvider;
  let wallet: Wallet;

  beforeAll(() => {
    provider = new MockProvider();
    wallet = provider.getWallets()[0];

    stub = sinon.stub(provider, "on");
  });
  beforeEach(() => {
    provider.clearCallHistory();
    jest.clearAllMocks();
  });

  afterAll(() => {
    stub.restore();
    jest.resetAllMocks();
  });

  it("mints a hypercerts", async () => {
    const signer = wallet.connect(provider);

    const client = new HypercertClient({
      chainId: 5,
      operator: signer,
    });

    expect(client.readonly).toBe(false);

    const rawData = getRawInputData() as TestDataType;
    const { data: formattedData } = formatHypercertData(rawData);

    const spy = jest.spyOn(provider, "sendTransaction");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll);

    expect(spy).toBeCalledTimes(1);
  }, 10000);

  it("throws on malformed metadata", async () => {
    const client = new HypercertClient({
      chainId: 5,
      operator: wallet.connect(provider),
    });

    expect(client.readonly).toBe(false);

    const spy = jest.spyOn(provider, "sendTransaction");

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaim({} as HypercertMetadata, 1000, TransferRestrictions.AllowAll);
    } catch (e) {
      expect(e).toBeInstanceOf(MalformedDataError);
      expect((e as MalformedDataError).message).toBe("Metadata validation failed");
    }
    expect(spy).toBeCalledTimes(0);
    expect.assertions(4);
  });

  it("mints a hypercerts with override params", async () => {
    const signer = wallet.connect(provider);

    const client = new HypercertClient({
      chainId: 5,
      operator: signer,
    });

    expect(client.readonly).toBe(false);

    const rawData = getRawInputData() as TestDataType;
    const { data: formattedData } = formatHypercertData(rawData);

    const spy = jest.spyOn(provider, "sendTransaction");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll, { gasPrice: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    await client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll, { gasPrice: "100" });

    expect(spy).toBeCalledTimes(1);
  }, 10000);
});
