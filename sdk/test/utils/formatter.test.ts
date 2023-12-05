import { describe, it } from "vitest";
import { expect } from "chai";

import { formatHypercertData } from "../../src";
import { INDEFINITE_DATE_STRING, formatDate, formatUnixTime } from "../../src/utils/formatter";

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

const testDataUndefinedProperties: Partial<TestDataType> = { ...testData, properties: undefined };

const testDataUndefinedExternalURL: Partial<TestDataType> = { ...testData, external_url: undefined };

describe("Format Hypercert Data test", () => {
  it("checks correct metadata and returns result", () => {
    const result = formatHypercertData(testData as TestDataType);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validKeys = Object.keys(result.data!);

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

    const invalidResult = formatHypercertData(invalidData as TestDataType);

    expect(invalidResult.valid).to.be.false;

    if (invalidResult.errors) {
      expect(Object.keys(invalidResult.errors)).to.be.length(1);
      expect(Object.keys(invalidResult.errors)[0]).to.eq("name");
    } else {
      expect.fail("Should return errors");
    }
  });

  it("handles undefined properties", () => {
    const formattedData = formatHypercertData(testDataUndefinedProperties as TestDataType);
    expect(Object.keys(formattedData).find((key) => key === "properties")).to.be.undefined;
  });

  it("handles undefined external_url", () => {
    const formattedData = formatHypercertData(testDataUndefinedExternalURL as TestDataType);
    expect(Object.keys(formattedData).find((key) => key === "external_url")).to.be.undefined;
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
