import { expect } from "chai";

import { HypercertClient, HypercertsStorage } from "../src/index.js";
import { SupportedChainNames } from "../src/config.js";

describe("HypercertClient", () => {
  it("should be able to create a new instance", () => {
    const storage = new HypercertsStorage({ nftStorageToken: "test", web3StorageToken: "test" });

    //TODO just use string
    const config = { chainName: "goerli" as SupportedChainNames };
    const client = new HypercertClient({ config, storage });
    expect(client).to.be.an.instanceOf(HypercertClient);
  });
});
