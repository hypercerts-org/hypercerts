import { expect } from "chai";

import { FetchError, MalformedDataError, UnsupportedChainError } from "../../src/types/errors.js";
import { handleError } from "../../src/utils/errors.js";

describe("Error handler test", () => {
  it("checking error handler", () => {
    expect(handleError(new FetchError("testing FetchError", { url: "http://badexample.com" }))).to.be.undefined;
    expect(handleError(new MalformedDataError("testing MalformedDataError", { data: { foo: "bar" } }))).to.be.undefined;
    expect(handleError(new UnsupportedChainError("testing UnsupportedChainError", 1337))).to.be.undefined;
  });
});
