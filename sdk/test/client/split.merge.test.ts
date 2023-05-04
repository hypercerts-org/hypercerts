import { MockProvider, deployMockContract } from "ethereum-waffle";

import HypercertClient from "../../src/client.js";
import { HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";
import { BigNumber } from "ethers";

const provider = new MockProvider();
const wallet = provider.getWallets()[0];
const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

describe("splitClaimUnits in HypercertClient", () => {
  beforeEach(() => {
    provider.clearCallHistory();
  });

  it("allows for a hypercert fractions to be splitted over value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await mockMinter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    const signer = wallet.connect(provider);

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer, contractAddress: mockMinter.address },
    });

    expect(client.readonly).toBe(false);

    await client.splitClaimUnits(fractionId, [100, 200]);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(7);
  }, 10000);

  it("throws on splitting with incorrect new total value", async () => {});

  it("throws on splitting fractions not owned by signer", async () => {});
});
