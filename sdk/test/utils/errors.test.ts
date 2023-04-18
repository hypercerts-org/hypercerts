import { expect } from "chai";

import { FetchError, MalformedDataError, UnsupportedChainError } from "../../src/errors.js";
import { errorHandler } from "../../src/utils/errors.js";

describe("Error handler test", () => {
  it("checking error handler", () => {
    expect(errorHandler(new FetchError("testing Fetch error"))).to.be.undefined;
    expect(errorHandler(new MalformedDataError("testing MalformedData error"))).to.be.undefined;
    expect(errorHandler(new UnsupportedChainError("0x1337"))).to.be.undefined;
    expect(errorHandler(new Error("something"))).to.be.undefined;
  });
});
