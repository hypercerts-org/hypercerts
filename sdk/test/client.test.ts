import { expect } from "chai";

import { HypercertClient } from "../src/index.js";
import HypercertsStorage from "../src/storage.js";

describe("HypercertClient", () => {
  it("should be able to create a new instance", () => {
    const storage = new HypercertsStorage({ nftStorageToken: "test", web3StorageToken: "test" });

    const config = { chainName: "goerli" as const };
    const client = new HypercertClient({ config, storage });
    expect(client).to.be.an.instanceOf(HypercertClient);
  });
});
