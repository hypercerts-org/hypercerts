import { jest } from "@jest/globals";
import { MockProvider, deployMockContract } from "ethereum-waffle";

import HypercertClient from "../../src/client.js";
import { getAllowlist } from "../helpers.js";

import { MintingError } from "../../src/types/errors.js";
import { ClaimProof } from "../../src/types/hypercerts.js";
import { HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";

describe("Claim from allowlist in HypercertClient", () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const signer = wallet.connect(provider);

  beforeEach(() => {
    provider.clearCallHistory();
    jest.clearAllMocks();
  });

  it("allows for minting with the correct proof", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer, contractAddress: mockMinter.address },
    });

    expect(client.readonly).toBe(false);

    const { merkleTree } = getAllowlist({ address: userAddress });

    const proof = merkleTree.getProof(0);
    const root = merkleTree.root;

    await mockMinter.mock["mintClaimFromAllowlist(address,bytes32[],uint256,uint256)"]
      .withArgs(userAddress, proof, 1, 100)
      .returns();

    await client.mintClaimFractionFromAllowlist(1, 100, proof, root);
    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(3);
  }, 30000);

  it("throws on minting with incorrect proof", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer, contractAddress: mockMinter.address },
    });

    expect(client.readonly).toBe(false);

    const { merkleTree } = getAllowlist({ address: userAddress });

    const proof = merkleTree.getProof(1);
    const root = merkleTree.root;

    await mockMinter.mock["mintClaimFromAllowlist(address,bytes32[],uint256,uint256)"]
      .withArgs(userAddress, proof, 1, 100)
      .returns();

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaimFractionFromAllowlist(1, 100, proof, root);
    } catch (e) {
      expect(e).toBeInstanceOf(MintingError);
      expect((e as MintingError).message).toBe("Merkle proof verification failed");
    }
    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(provider.callHistory.length).toBe(2);
    expect.assertions(4);
  }, 30000);

  it("allows for batch minting with the correct proofs", async () => {
    const userAddress = await wallet.getAddress();
    const mockMinter = await deployMockContract(wallet, HypercertMinterABI);

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer, contractAddress: mockMinter.address },
    });

    expect(client.readonly).toBe(false);

    const addressArray = new Array(3).fill(userAddress);

    const allowLists = addressArray.map((address) => {
      return getAllowlist({ address });
    });

    const claimProofs = allowLists.map((allowlist) => {
      const proof = allowlist.merkleTree.getProof(0);
      const root = allowlist.merkleTree.root;

      return {
        claimId: 1,
        units: 100,
        proof,
        root,
      } as ClaimProof;
    });

    await mockMinter.mock["batchMintClaimsFromAllowlists(address,bytes32[][],uint256[],uint256[])"].returns();

    await client.batchMintClaimFractionFromAllowlist(claimProofs);

    expect(provider.callHistory.length).toBe(3);

    expect.assertions(2);
  }, 30000);

  it("allows throws on batch minting with incorrect correct proofs", async () => {
    const address = await wallet.getAddress();

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer },
    });

    expect(client.readonly).toBe(false);

    const addressArray = new Array(3).fill(address);

    const allowLists = addressArray.map((address) => {
      return getAllowlist({ address });
    });

    const spy = jest.spyOn(provider, "sendTransaction");
    const claimProofs = allowLists.map((allowlist) => {
      const proof = allowlist.merkleTree.getProof(1);
      const root = allowlist.merkleTree.root;

      return {
        claimId: 1,
        units: 100,
        proof,
        root,
      } as ClaimProof;
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.batchMintClaimFractionFromAllowlist(claimProofs);
    } catch (e) {
      expect(e).toBeInstanceOf(MintingError);
      expect((e as MintingError).message).toBe("Merkle proof verification failed");
    }
    expect(spy).toBeCalledTimes(0);
    expect.assertions(4);
  }, 30000);
});
