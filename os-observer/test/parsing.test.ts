import { parseGithubUrl } from "../src/utils/parsing.js";

describe("parsing", () => {
  it("parses github git+https urls", () => {
    const url = "git+https://github.com/hypercerts-org/hypercerts.git";
    const result = parseGithubUrl(url);
    expect(result).not.toBeNull();
    expect(result?.owner).toEqual("hypercerts-org");
    expect(result?.name).toEqual("hypercerts");
  });

  it("parses github ssh urls", () => {
    const url = "ssh://github.com/hypercerts-org/hypercerts.git";
    const result = parseGithubUrl(url);
    expect(result).not.toBeNull();
    expect(result?.owner).toEqual("hypercerts-org");
    expect(result?.name).toEqual("hypercerts");
  });

  it("parses multi-part github ssh urls", () => {
    const url = "ssh://github.com/hypercerts-org/hypercerts/sdk";
    const result = parseGithubUrl(url);
    expect(result).not.toBeNull();
    expect(result?.owner).toEqual("hypercerts-org");
    expect(result?.name).toEqual("hypercerts");
  });

  it("doesn't parse gitlab ssh urls", () => {
    const url = "ssh://gitlab.com/hypercerts-org/hypercerts.git";
    const result = parseGithubUrl(url);
    expect(result).toBeNull();
  });

  it("doesn't parse malformed urls", () => {
    const url = "hypercerts-org/hypercerts.git";
    const result = parseGithubUrl(url);
    expect(result).toBeNull();
  });

  it("doesn't parse falsey values", () => {
    const result = parseGithubUrl(false);
    expect(result).toBeNull();
  });
});
