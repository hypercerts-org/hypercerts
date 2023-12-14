import { describe, it } from "vitest";

import { expect } from "chai";

import { HypercertIndexer } from "../src/indexer";

describe("HypercertsIndexer", () => {
  it("should be able to create a new instance without valid graphName", () => {
    const indexer = new HypercertIndexer({ graphUrl: "https://api.thegraph.com/subgraphs/name/hypercerts-testnet" });

    expect(indexer).to.be.an.instanceOf(HypercertIndexer);
  });

  it("should be able to create a new instance with valid graphName and url", () => {
    const indexer = new HypercertIndexer({
      graphName: "hypercerts-testnet",
      graphUrl: "https://api.thegraph.com/subgraphs/name/hypercerts-testnet",
    });

    expect(indexer).to.be.an.instanceOf(HypercertIndexer);
  });
});
