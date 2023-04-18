import { expect } from "chai";

import { FetchError, MalformedDataError, UnsupportedChainError } from "../../src/errors.js";
import { errorHandler } from "../../src/utils/errors.js";

describe("Error handler test", () => {
  it("checking error handler", () => {
    expect(errorHandler(new FetchError("testing Fetch error"))).to.be.undefined;
    expect(errorHandler(new MalformedDataError("testing MalformedData error"))).to.be.undefined;
    expect(errorHandler(new UnsupportedChainError("testing Unsupported error"))).to.be.undefined;
    // expect(errorHandler("ANY" as Error)).to.throw();
  });
});
