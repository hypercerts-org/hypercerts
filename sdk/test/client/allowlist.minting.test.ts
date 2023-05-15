import { jest } from "@jest/globals";
import { MockProvider } from "ethereum-waffle";

import HypercertClient from "../../src/client.js";
import { getAllowlist } from "../helpers.js";

import { MintingError } from "../../src/types/errors.js";
import { ClaimProof } from "../../src/types/hypercerts.js";

const provider = new MockProvider();
const [wallet] = provider.getWallets();
const signer = wallet.connect(provider);

describe("Claim from allowlist in HypercertClient", () => {
  afterEach(() => {
    provider.clearCallHistory();
    jest.clearAllMocks();
  });

  it("allows for minting with the correct proof", async () => {
    const address = await wallet.getAddress();

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer },
    });

    expect(client.readonly).toBe(false);

    const { merkleTree } = getAllowlist({ address });

    const spy = jest.spyOn(provider, "sendTransaction");
    const proof = merkleTree.getProof(0);
    const root = merkleTree.root;

    await client.mintClaimFractionFromAllowlist(1, 100, proof, root);
    expect(spy).toBeCalledTimes(1);
  }, 30000);

  it("throws on minting with incorrect proof", async () => {
    const address = await wallet.getAddress();

    const client = new HypercertClient({
      config: { chainId: 5, provider, signer },
    });

    expect(client.readonly).toBe(false);

    const { merkleTree } = getAllowlist({ address });

    const spy = jest.spyOn(provider, "sendTransaction");

    const proof = merkleTree.getProof(1);
    const root = merkleTree.root;

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await client.mintClaimFractionFromAllowlist(1, 100, proof, root);
    } catch (e) {
      expect(e).toBeInstanceOf(MintingError);
      expect((e as MintingError).message).toBe("Merkle proof verification failed");
    }
    expect(spy).toBeCalledTimes(0);
    expect.assertions(4);
  }, 30000);

  it("allows for batch minting with the correct proofs", async () => {
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
      const proof = allowlist.merkleTree.getProof(0);
      const root = allowlist.merkleTree.root;

      return {
        claimId: 1,
        units: 100,
        proof,
        root,
      } as ClaimProof;
    });

    await client.batchMintClaimFractionFromAllowlist(claimProofs);
    expect(spy).toBeCalledTimes(1);
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
