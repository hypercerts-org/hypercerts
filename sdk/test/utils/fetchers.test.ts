import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import fetchers from "../../src/utils/fetchers";
import axios from "axios";

chai.use(chaiSubset);

describe("Fetchers", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("IPFS: should return data from IPFS", async () => {
    const validResponse = { data: "TEST_PASSED" };
    const axiosStub = sinon.stub(axios, "get").resolves(Promise.resolve(validResponse));

    const res = await fetchers.getFromIPFS("test");
    expect(res).to.equal(validResponse.data);
    expect(axiosStub.calledOnce).to.be.true;
  });

  it("IPFS: should try another endpoint after the first fails", async () => {
    const validResponse = { data: "TEST_PASSED" };
    const axiosStub = sinon
      .stub(axios, "get")
      .onFirstCall()
      .rejects()
      .onSecondCall()
      .resolves(Promise.resolve(validResponse));

    const res = await fetchers.getFromIPFS("test");
    expect(res).to.equal(validResponse.data);
    expect(axiosStub.calledTwice).to.be.true;
  });
});
