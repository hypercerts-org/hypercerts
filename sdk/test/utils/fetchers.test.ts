import { describe, it, afterEach } from "vitest";

import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import sinon from "sinon";

import { getFromIPFS } from "../../src/utils/fetchers";
import axios from "axios";

chai.use(chaiSubset);

describe("Fetchers", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("IPFS: should return data from IPFS", async () => {
    const validResponse = { data: "TEST_PASSED" };
    const axiosStub = sinon.stub(axios, "get").resolves(Promise.resolve(validResponse));

    const res = await getFromIPFS("test");
    expect(res).to.equal(validResponse.data);
    expect(axiosStub.calledThrice).to.be.true;
  });

  it("IPFS: should try multiple endpoint and resolves when a valid response is returned from any", async () => {
    const validResponse = { data: "TEST_PASSED" };
    const axiosStub = sinon
      .stub(axios, "get")
      .onFirstCall()
      .rejects()
      .onSecondCall()
      .resolves(Promise.resolve(validResponse))
      .onThirdCall()
      .rejects();

    const res = await getFromIPFS("test");
    expect(res).to.equal(validResponse.data);
    expect(axiosStub.calledThrice).to.be.true;
  });
});
