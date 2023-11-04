import sinon from "sinon";

import HypercertClient from "../../src/client";

import { publicClient, walletClient } from "../helpers";
import { ContractFunctionExecutionError, isHex, toHex } from "viem";

describe("splitClaimUnits in HypercertClient", () => {
  const wallet = walletClient;
  const userAddress = wallet.account?.address;

  let readSpy = sinon.stub(publicClient, "readContract");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const client = new HypercertClient({
    id: 5,
    walletClient,
    publicClient,
  });

  const fractionId = 9868188640707215440437863615521278132232n;

  beforeEach(async () => {
    readSpy.resetBehavior();
    readSpy.resetHistory();

    writeSpy.resetBehavior();
    writeSpy.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("allows for a hypercert fractions to be splitted over value", async () => {
    readSpy = readSpy.onFirstCall().resolves(userAddress).onSecondCall().resolves(300n);
    writeSpy = writeSpy.resolves(toHex(420));

    expect(client.readonly).toBe(false);

    const hash = await client.splitFractionUnits(fractionId, [100n, 200n]);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(isHex(hash)).toBeTruthy();
    expect(readSpy.callCount).toBe(2);
    expect(writeSpy.callCount).toBe(1);
    expect.assertions(4);
  });

  it("allows for a hypercert fractions to be splitted over value with override params", async () => {
    readSpy = readSpy
      .onFirstCall()
      .resolves(userAddress)
      .onSecondCall()
      .resolves(300n)
      .onThirdCall()
      .resolves(userAddress)
      .onCall(3)
      .resolves(300n);

    writeSpy = writeSpy.resolves(toHex(420));

    expect(client.readonly).toBe(false);

    try {
      await client.splitFractionUnits(fractionId, [100n, 200n], { gasLimit: "FALSE_VALUE" as unknown as bigint });
    } catch (e) {
      expect(e instanceof ContractFunctionExecutionError).toBeTruthy();
    }

    const hash = await client.splitFractionUnits(fractionId, [100n, 200n], { gasLimit: 12300000n });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(isHex(hash)).toBeTruthy();
    expect(readSpy.callCount).toBe(4);
    expect(writeSpy.callCount).toBe(1);
    expect.assertions(5);
  });

  //   it("throws on splitting with incorrect new total value", async () => {
  //     const mockMinter = await deployMockContract(wallet, HypercertMinterAbi);
  //     await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
  //     await mockMinter.mock["unitsOf(uint256)"].withArgs(fractionId).returns(42);

  //     const client = new HypercertClient({
  //       chainId: 5,
  //       operator: walletClient,
  //       contractAddress: mockMinter.address,
  //     });
  //     expect(client.readonly).toBe(false);

  //     try {
  //       await client.splitClaimUnits(fractionId, [100n, 200n]);
  //     } catch (e) {
  //       expect(e instanceof ClientError).toBeTruthy();

  //       const error = e as ClientError;
  //       expect(error.message).toBe("Sum of fractions is not equal to the total units");
  //     }

  //     //TODO determine underlying calls and mock those out. Some are provider simulation calls
  //     // Owner
  //     // UnitsOf
  //     expect(provider.callHistory.length).toBe(5);
  //     expect.assertions(4);
  //   });

  //   it("throws on splitting fractions not owned by signer", async () => {
  //     const otherUser = await provider.getWallets()[1].getAddress();
  //     const mockMinter = await deployMockContract(wallet, HypercertMinterAbi);
  //     await mockMinter.mock.ownerOf.withArgs(fractionId).returns(otherUser);

  //     const client = new HypercertClient({
  //       chainId: 5,
  //       operator: walletClient,
  //       contractAddress: mockMinter.address,
  //     });
  //     expect(client.readonly).toBe(false);

  //     try {
  //       await client.splitClaimUnits(fractionId, [100n, 200n]);
  //     } catch (e) {
  //       expect(e instanceof ClientError).toBeTruthy();

  //       const error = e as ClientError;
  //       expect(error.message).toBe("Claim is not owned by the signer");
  //     }

  //     //TODO determine underlying calls and mock those out. Some are provider simulation calls
  //     // Owner
  //     expect(provider.callHistory.length).toBe(3);
  //     expect.assertions(4);
  //   });
});

// describe("mergeClaimUnits in HypercertClient", () => {
//   const provider = testClient;
//   const wallet = walletClient;
//   const fractionId = 9868188640707215440437863615521278132232n;
//   const userAddress = wallet.account.address;

//   it("allows for hypercert fractions to merge value", async () => {
//     const mockMinter = await deployMockContract(wallet, HypercertMinterAbi);
//     await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
//     await mockMinter.mock.ownerOf.withArgs(fractionId + 1n).returns(userAddress);
//     await mockMinter.mock["mergeFractions(address,uint256[])"]
//       .withArgs(userAddress, [fractionId, fractionId + 1n])
//       .returns();

//     const client = new HypercertClient({
//       chainId: 5,
//       operator: walletClient,
//       contractAddress: mockMinter.address,
//     });
//     expect(client.readonly).toBe(false);

//     await client.mergeClaimUnits([fractionId, fractionId + 1n]);

//     //TODO determine underlying calls and mock those out. Some are provider simulation calls
//     expect(provider.callHistory.length).toBe(7);
//   }, 10000);

//   it("allows for hypercert fractions to merge value with override params", async () => {
//     const mockMinter = await deployMockContract(wallet, HypercertMinterAbi);
//     await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
//     await mockMinter.mock.ownerOf.withArgs(fractionId + 1n).returns(userAddress);
//     await mockMinter.mock["mergeFractions(address,uint256[])"]
//       .withArgs(userAddress, [fractionId, fractionId + 1n])
//       .returns();

//     const client = new HypercertClient({
//       chainId: 5,
//       operator: walletClient,
//       contractAddress: mockMinter.address,
//     });
//     expect(client.readonly).toBe(false);

//     try {
//       await client.mergeClaimUnits([fractionId, fractionId + 1n], { gasLimit: "FALSE_VALUE" as unknown as bigint });
//     } catch (e) {
//       expect((e as Error).message).toMatch(/invalid BigNumber string/);
//     }

//     await client.mergeClaimUnits([fractionId, fractionId + 1n], { gasLimit: 12300000n });

//     //TODO determine underlying calls and mock those out. Some are provider simulation calls
//     expect(provider.callHistory.length).toBe(9);
//   }, 10000);

//   it("throws on splitting fractions not owned by signer", async () => {
//     const otherUser = await provider.getWallets()[1].getAddress();

//     const mockMinter = await deployMockContract(wallet, HypercertMinterAbi);
//     await mockMinter.mock.ownerOf.withArgs(fractionId).returns(userAddress);
//     await mockMinter.mock.ownerOf.withArgs(fractionId + 1n).returns(otherUser);

//     const client = new HypercertClient({
//       chainId: 5,
//       operator: walletClient,
//       contractAddress: mockMinter.address,
//     });
//     expect(client.readonly).toBe(false);

//     try {
//       await client.mergeClaimUnits([fractionId, fractionId + 1n]);
//     } catch (e) {
//       expect(e instanceof ClientError).toBeTruthy();

//       const error = e as ClientError;
//       expect(error.message).toBe("One or more claims are not owned by the signer");
//     }

//     //TODO determine underlying calls and mock those out. Some are provider simulation calls
//     expect(provider.callHistory.length).toBe(5);
//   });
// });
