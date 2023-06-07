import { expect } from "chai";

import HypercertsIndexer from "../src/indexer.js";

describe("HypercertsIndexer", () => {
  it("should be able to create a new instance without valid graphName", () => {
    const indexer = new HypercertsIndexer({});

    expect(indexer).to.be.an.instanceOf(HypercertsIndexer);
  });

  it("should be able to create a new instance with valid graphName", () => {
    const indexer = new HypercertsIndexer({ graphName: "hypercerts-testnet" });

    expect(indexer).to.be.an.instanceOf(HypercertsIndexer);
  });
});
