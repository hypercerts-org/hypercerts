import { jest } from "@jest/globals";
import { MockProvider } from "ethereum-waffle";

import HypercertClient from "../../src/client.js";
import { HypercertMetadata, formatHypercertData } from "../../src/index.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { TransferRestrictions } from "../../src/types/hypercerts.js";
import { TestDataType, getRawInputData } from "../helpers.js";

describe("mintClaim in HypercertClient", () => {
  it("mints a hypercerts", async () => {
    const provider = new MockProvider();

    const [wallet] = provider.getWallets();
    const signer = wallet.connect(provider);

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer },
    });

    expect(client.readonly).toBe(false);

    const rawData = getRawInputData() as TestDataType;
    const { data: formattedData } = formatHypercertData(rawData);

    const spy = jest.spyOn(provider, "sendTransaction");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await client.mintClaim(formattedData!, 1000, TransferRestrictions.AllowAll);

    expect(spy).toBeCalledTimes(1);
  });

  it("throws on malformed metadata", async () => {
    const provider = new MockProvider();
    const [wallet] = provider.getWallets();

    const client = new HypercertClient({
      config: { chainId: 5, signer: wallet },
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
});
