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
  let wallet: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });
    wallet = provider.getWallets()[0];

    stub = sinon.stub(provider, "on");
  });
  beforeEach(() => {
    provider.clearCallHistory();
  });

  afterAll(() => {
    stub.restore();
  });

  it("allows for a hypercert fractions to be splitted over value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await mockMinter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    const tx = await client.splitClaimUnits(fractionId, [100, 200]);
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(6);
  }, 10000);

  it("allows for a hypercert fractions to be splitted over value with override params", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await mockMinter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.splitClaimUnits(fractionId, [100, 200], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    const tx = await client.splitClaimUnits(fractionId, [100, 200], { gasLimit: "12300000" });
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(8);
  }, 10000);

  it("throws on splitting with incorrect new total value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(42);

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    try {
      const tx = await client.splitClaimUnits(fractionId, [100, 200]);
      expect((await tx.wait()).status).toBe(1);
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
    const otherUser = await provider.getWallets()[1].getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    try {
      const tx = await client.splitClaimUnits(fractionId, [100, 200]);
      expect((await tx.wait()).status).toBe(1);
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
  let wallet: Wallet;
  const fractionId = BigNumber.from("9868188640707215440437863615521278132232");

  beforeAll(() => {
    provider = new MockProvider({
      ganacheOptions: {
        chain: { chainId: 5 },
      },
    });

    wallet = provider.getWallets()[0];
    stub = sinon.stub(provider, "on");
  });

  beforeEach(() => {
    provider.clearCallHistory();
  });

  afterAll(() => {
    stub.restore();
  });

  it("allows for hypercert fractions to merge value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await mockMinter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    const tx = await client.mergeClaimUnits([fractionId, fractionId.add(1)]);
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(6);
  }, 10000);

  it("allows for hypercert fractions to merge value with override params", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await mockMinter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mergeClaimUnits([fractionId, fractionId.add(1)], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    const tx = await client.mergeClaimUnits([fractionId, fractionId.add(1)], { gasLimit: "12300000" });
    expect((await tx.wait()).status).toBe(1);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(8);
  }, 10000);

  it("throws on splitting fractions not owned by signer", async () => {
    const userAddress = await wallet.getAddress();
    const otherUser = await provider.getWallets()[1].getAddress();

    const mockMinter = await deployMockContract(wallet, HypercertMinterAbi, {
      address: deployments[5].contractAddress,
      override: true,
    });
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(otherUser);

    const signer = wallet.connect(provider);

    const client = await new HypercertClient({
      environment: 5,
    }).connect(signer);

    expect(client.readonly).toBe(false);

    try {
      const tx = await client.mergeClaimUnits([fractionId, fractionId.add(1)]);
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
