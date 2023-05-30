import { MockProvider, deployMockContract } from "ethereum-waffle";

import HypercertClient from "../../src/client.js";
import { HypercertMinterABI } from "@hypercerts-org/contracts";
import { BigNumber } from "ethers";
import { ClientError } from "../../src/types/errors.js";

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

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    await client.splitClaimUnits(fractionId, [100, 200]);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(7);
  }, 10000);

  it("allows for a hypercert fractions to be splitted over value with override params", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(300);
    await mockMinter.mock["splitFraction(address,uint256,uint256[])"]
      .withArgs(userAddress, fractionId, [100, 200])
      .returns();

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.splitClaimUnits(fractionId, [100, 200], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    await client.splitClaimUnits(fractionId, [100, 200], { gasLimit: "12300000" });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(9);
  }, 10000);

  it("throws on splitting with incorrect new total value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(42);

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    try {
      await client.splitClaimUnits(fractionId, [100, 200]);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Sum of fractions is not equal to the total units");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    // Owner
    // UnitsOf
    expect(provider.callHistory.length).toBe(5);
    expect.assertions(4);
  });

  it("throws on splitting fractions not owned by signer", async () => {
    const otherUser = await provider.getWallets()[1].getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    try {
      await client.splitClaimUnits(fractionId, [100, 200]);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Claim is not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    // Owner
    expect(provider.callHistory.length).toBe(3);
    expect.assertions(4);
  });
});

describe("mergeClaimUnits in HypercertClient", () => {
  beforeEach(() => {
    provider.clearCallHistory();
  });

  it("allows for hypercert fractions to merge value", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await mockMinter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    await client.mergeClaimUnits([fractionId, fractionId.add(1)]);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(7);
  }, 10000);

  it("allows for hypercert fractions to merge value with override params", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(userAddress);
    await mockMinter.mock["mergeFractions(address,uint256[])"]
      .withArgs(userAddress, [fractionId, fractionId.add(1)])
      .returns();

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mergeClaimUnits([fractionId, fractionId.add(1)], { gasLimit: "FALSE_VALUE" });
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid BigNumber string/);
    }

    await client.mergeClaimUnits([fractionId, fractionId.add(1)], { gasLimit: "12300000" });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(9);
  }, 10000);

  it("throws on splitting fractions not owned by signer", async () => {
    const userAddress = await wallet.getAddress();
    const otherUser = await provider.getWallets()[1].getAddress();

    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);
    await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
    await mockMinter.mock.ownerOf.withArgs(fractionId.add(1)).returns(otherUser);

    const signer = wallet.connect(provider);

    const client = new HypercertClient({ chainId: 5, provider, signer, contractAddress: mockMinter.address });

    expect(client.readonly).toBe(false);

    try {
      await client.mergeClaimUnits([fractionId, fractionId.add(1)]);
    } catch (e) {
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("One or more claims are not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(5);
  });
});
