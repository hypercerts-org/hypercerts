import { expect } from "chai";

import { formatHypercertData } from "../../src/index.js";
import { INDEFINITE_DATE_STRING, formatDate, formatUnixTime } from "../../src/utils/formatter.js";

type TestDataType = Parameters<typeof formatHypercertData>[0];
const testData: Partial<TestDataType> = {
  name: "test name",
  description: "test description",
  image: "some test image",
  contributors: ["0x111", "0x22"],
  external_url: "https://example.com",
  impactScope: ["test impact scope"],
  impactTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
  impactTimeframeStart: Math.floor(new Date().getTime()) / 1000,
  workScope: ["test work scope"],
  workTimeframeStart: Math.floor(new Date().getTime()) / 1000,
  workTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
  properties: [{ trait_type: "test trait type", value: "aaa" }],
  rights: ["test right 1", "test right 2"],
  version: "0.0.1",
};

describe("Format Hypercert Data test", () => {
  it("checks correct metadata and returns result", () => {
    const formattedValidData = formatHypercertData(testData as TestDataType);
    expect(formattedValidData.isOk).to.be.true;
    expect(formattedValidData.isErr).to.be.false;

    const validData = formattedValidData.unwrapOr({});
    const validKeys = Object.keys(validData);

    expect(validKeys).to.include.members([
      "name",
      "description",
      "external_url",
      "image",
      "version",
      "properties",
      "hypercert",
    ]);

    const invalidData = testData;
    delete invalidData.name;
    const formattedInvalidData = formatHypercertData(invalidData as TestDataType);
    expect(formattedInvalidData.isOk).to.be.false;
    expect(formattedInvalidData.isErr).to.be.true;

    if (formattedInvalidData.isErr) {
      expect(formattedInvalidData.error.message).to.equal("Could not format data");
    }
  });
});

describe("Format dates", () => {
  it("formats Date", () => {
    // It's the next day
    expect(formatDate(new Date("July 20, 69 20:17:40 GMT+00:00"))).to.equal("1969-07-20");
  });

  it("formats UNIX time", () => {
    expect(formatUnixTime(-14182940)).to.equal("1969-07-20");
    expect(formatUnixTime(1677194695)).to.equal("2023-02-23");
  });

  it("formats indefinite time", () => {
    expect(formatUnixTime(0)).to.equal(INDEFINITE_DATE_STRING);
  });
});
