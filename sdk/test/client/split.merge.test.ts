import { MockProvider, deployMockContract } from "ethereum-waffle";
import { BigNumber, Wallet } from "ethers";
import sinon from "sinon";

import HypercertClient from "../../src/client";
import { ClientError } from "../../src/types/errors";

import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { deployments } from "../../src";

describe("splitClaimUnits in HypercertClient", () => {
  let stub: sinon.SinonStub;
  let provider: MockProvider;
  let user: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });
    user = provider.getWallets()[0];

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

  it("allows for a hypercert fractions to be splitted over value", async () => {
    const { userAddress, minter, client } = await setUp();
    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await minter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    expect(client.readonly).toBe(false);

    const tx = await client.splitFractionUnits(fractionId, [100, 200]);
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(6);
  }, 10000);

  it("allows for a hypercert fractions to be splitted over value with override params", async () => {
    const { userAddress, minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await minter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.splitFractionUnits(fractionId, [100, 200], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    const tx = await client.splitFractionUnits(fractionId, [100, 200], { gasLimit: "12300000" });
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(8);
  }, 10000);

  it("throws on splitting with incorrect new total value", async () => {
    const { userAddress, minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(42);

    expect(client.readonly).toBe(false);

    try {
      await client.splitFractionUnits(fractionId, [100, 200]);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Sum of fractions is not equal to the total units");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    // Owner
    // UnitsOf
    expect(provider.callHistory.length).toBe(4);
    expect.assertions(4);
  });

  it("throws on splitting fractions not owned by signer", async () => {
    const { minter, client } = await setUp();

    const otherUser = await provider.getWallets()[1].getAddress();
    await minter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

    expect(client.readonly).toBe(false);

    try {
      await client.splitFractionUnits(fractionId, [100, 200]);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Claim is not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    // Owner
    expect(provider.callHistory.length).toBe(2);
    expect.assertions(4);
  });
});

describe("mergeClaimUnits in HypercertClient", () => {
  let stub: sinon.SinonStub;
  let provider: MockProvider;
  let user: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });

    user = provider.getWallets()[0];
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

  it("allows for hypercert fractions to merge value", async () => {
    const { userAddress, minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await minter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    expect(client.readonly).toBe(false);

    const tx = await client.mergeClaimFractions([fractionId, fractionId.add(1)]);
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(6);
  }, 10000);

  it("allows for hypercert fractions to merge value with override params", async () => {
    const { userAddress, minter, client } = await setUp();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await minter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mergeClaimFractions([fractionId, fractionId.add(1)], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    const tx = await client.mergeClaimFractions([fractionId, fractionId.add(1)], { gasLimit: "12300000" });
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(8);
  }, 10000);

  it("throws on splitting fractions not owned by signer", async () => {
    const { userAddress, minter, client } = await setUp();
    const otherUser = await provider.getWallets()[1].getAddress();

    await minter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await minter.mock.ownerOf.withArgs(fractionId.add(1)).returns(otherUser);

    expect(client.readonly).toBe(false);

    try {
      const tx = await client.mergeClaimFractions([fractionId, fractionId.add(1)]);
      expect((await tx.wait()).status).toBe(1);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("One or more claims are not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(4);
  });
});
