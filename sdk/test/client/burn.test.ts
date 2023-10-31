import { MockProvider, deployMockContract } from "ethereum-waffle";
import { BigNumber, Wallet } from "ethers";
import sinon from "sinon";

import HypercertClient from "../../src/client";
import { ClientError } from "../../src/types/errors";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { deployments } from "../../src";

describe("burn fraction tokens in HypercertClient", () => {
  let stub: sinon.SinonStub;
  let provider: MockProvider;
  let user: Wallet;
  let other: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });
    [user, other] = provider.getWallets();

    stub = sinon.stub(provider, "on");
  });
  beforeEach(() => {
    provider.clearCallHistory();
  });

  afterAll(() => {
    stub.restore();
  });

  const setUp = async () => {
    const userAddress = await user.getAddress();
    const mockMinter = await deployMockContract(user, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });

    const client = await new HypercertClient({
      environment: (await provider.getNetwork()).chainId,
      nftStorageToken: process.env.NFT_STORAGE_TOKEN,
      web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
    }).connect(user);

    return { userAddress, user, minter: mockMinter, client };
  };

  it("allows for a hypercert fraction to be burned", async () => {
    const { userAddress, minter, client } = await setUp();
    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock["burnFraction(address,uint256)"].withArgs(userAddress, fractionId).returns();

    expect(client.readonly).toBe(false);

    const tx = await client.burnClaimFraction(fractionId);
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(4);
  });

  it("throws on burning fraction not owned by signer", async () => {
    const otherUser = await other.getAddress();
    const { minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

    expect(client.readonly).toBe(false);

    try {
      await client.burnClaimFraction(fractionId);
    } catch (e) {
      console.log(e);
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Claim is not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    // Owner
    expect(provider.callHistory.length).toBe(2);
    expect.assertions(4);
  });

  it("allows for a hypercert fraction to be burned with override params", async () => {
    const { userAddress, minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock["burnFraction(address,uint256)"].withArgs(userAddress, fractionId).returns();

    expect(client.readonly).toBe(false);

    try {
      await client.burnClaimFraction(fractionId, { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    const tx = await client.burnClaimFraction(fractionId, { gasLimit: "12300000" });
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(5);
  });
});
