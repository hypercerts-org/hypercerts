import { getGithubOrgFromUrl } from "../src/utils/parsing.js";

describe("parsing", () => {
  it("parses github git+https urls", () => {
    const url = "git+https://github.com/hypercerts-org/hypercerts.git";
    const org = getGithubOrgFromUrl(url);
    expect(org).toEqual("hypercerts-org");
  });

  it("parses github ssh urls", () => {
    const url = "ssh://github.com/hypercerts-org/hypercerts.git";
    const org = getGithubOrgFromUrl(url);
    expect(org).toEqual("hypercerts-org");
  });

  it("parses multi-part github ssh urls", () => {
    const url = "ssh://github.com/hypercerts-org/hypercerts/sdk";
    const org = getGithubOrgFromUrl(url);
    expect(org).toEqual("hypercerts-org");
  });

  it("doesn't parses gitlab ssh urls", () => {
    const url = "ssh://gitlab.com/hypercerts-org/hypercerts.git";
    const org = getGithubOrgFromUrl(url);
    expect(org).toEqual(null);
  });

  it("doesn't parses malformed urls", () => {
    const url = "hypercerts-org/hypercerts.git";
    const org = getGithubOrgFromUrl(url);
    expect(org).toEqual(null);
  });
});
