import { describe, it, expect } from "vitest";

import { HypercertIndexer } from "../src/indexer";
import { Client } from "@urql/core";

describe("HypercertsIndexer", () => {
  it("should only initialize with test environments", async () => {
    const client = new HypercertIndexer({ graphUrl: "https://example.com", environment: "test" }).getGraphClient();

    expect(client).toBeInstanceOf(Client);
  });

  it("should only initialize with production environments", async () => {
    const client = new HypercertIndexer({
      graphUrl: "https://example.com",
      environment: "production",
    }).getGraphClient();

    expect(client).toBeInstanceOf(Client);
  });
});
