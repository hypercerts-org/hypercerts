import { expect } from "chai";

import { errorHandler } from "../../src/utils/errors.js";

describe("Error handler test", () => {
  it("checking error handler", () => {
    expect(errorHandler("test", "METADATA_PARSING")).to.be.undefined;
    expect(errorHandler("test", "METADATA_STORAGE")).to.be.undefined;
    expect(errorHandler("test", "ANY" as any)).to.throw();
  });
});
