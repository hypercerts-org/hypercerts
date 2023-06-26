import { HypercertMinterABI } from "@hypercerts-org/contracts";
import { MockProvider, deployMockContract } from "ethereum-waffle";
import { BigNumber, Wallet, providers } from "ethers";
import sinon from "sinon";

import HypercertClient from "../../src/client.js";
import { ClientError } from "../../src/types/errors.js";

const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

describe("burn fraction tokens in HypercertClient", () => {
  let stub: sinon.SinonStub;
  let provider: MockProvider;
  let user: Wallet;
  let other: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider();
    [user, other] = provider.getWallets();

    stub = sinon.stub(provider, "on");
  });
  beforeEach(() => {
    provider.clearCallHistory();
  });

  afterAll(() => {
    stub.restore();
  });

  it("allows for a hypercert fraction to be burned", async () => {
    const userAddress = await user.getAddress();
    const mockMinter = await deployMockContract(user, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["burnFraction(address,uint256)"].withArgs(userAddress, fractionId).returns();

    const signer = user.connect(provider);

    const client = new HypercertClient({
      chainId: 5,
      operator: user,
      contractAddress: mockMinter.address,
    });

    expect(client.readonly).toBe(false);

    await client.burnClaimFraction(fractionId);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(5);
  });

  it("throws on burning fraction not owned by signer", async () => {
    const otherUser = await other.getAddress();
    const mockMinter = await deployMockContract(user, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

    const signer = user.connect(provider);

    const client = new HypercertClient({
      chainId: 5,
      operator: user,
      contractAddress: mockMinter.address,
    });

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
    expect(provider.callHistory.length).toBe(3);
    expect.assertions(4);
  });

  it("allows for a hypercert fraction to be burned with override params", async () => {
    const userAddress = await user.getAddress();
    const mockMinter = await deployMockContract(user, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["burnFraction(address,uint256)"].withArgs(userAddress, fractionId).returns();

    const signer = user.connect(provider);

    const client = new HypercertClient({
      chainId: 5,
      operator: user,
      contractAddress: mockMinter.address,
    });

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.burnClaimFraction(fractionId, { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    await client.burnClaimFraction(fractionId, { gasLimit: "12300000" });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(6);
  });
});
