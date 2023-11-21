import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import { faker } from "@faker-js/faker";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fetchers from "../../src/utils/fetchers";
import allowlistUtils from "../../src/utils/allowlist";

chai.use(chaiSubset);

const createAllowlist = async () => {
  const allowlist = new Array(10).fill(0).map((_x) => ({
    address: faker.finance.ethereumAddress() as `0x${string}`,
    units: 1n,
  }));

  // create allowlist
  const tuples = allowlist.map((p) => [p.address, p.units.toString()]);
  const tree = StandardMerkleTree.of(tuples, ["address", "uint256"]);

  return { allowlist, tree };
};

describe("Fetchers", () => {
  const ipfsFetcherMock = sinon.stub(fetchers, "getFromIPFS");

  afterEach(() => {
    sinon.restore();
  });

  it("Proof: should return valid proof and root", async () => {
    const { allowlist, tree } = await createAllowlist();

    const stub = ipfsFetcherMock.resolves(Promise.resolve(JSON.stringify(tree.dump())));

    const res = await allowlistUtils.getProofsFromAllowlist("test", allowlist[0].address);

    expect(res).to.containSubset({
      proof: tree.getProof(0),
      root: tree.root,
    });

    expect(res?.proof).to.deep.equal(tree.getProof(0));
    expect(res?.root).to.deep.equal(tree.root);
    expect(stub.calledOnce).to.be.true;
  });
});
