import { expect } from "chai";

import { formatHypercertData } from "../src/index.js";
import { INDEFINITE_DATE_STRING, formatDate, formatUnixTime } from "../src/utils/formatter.js";

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
  it("checks correct metadata", () => {
    const { valid, errors } = formatHypercertData(testData as TestDataType);
    expect(valid).to.be.true;
    expect(Object.keys(errors).length).to.eq(0);
  });

  it("returns null on incorrect data", () => {
    const { name, ...rest } = testData;
    const { valid, errors, data } = formatHypercertData(rest as TestDataType);
    expect(valid).to.be.false;
    expect(Object.keys(errors).length).to.eq(1);
    expect(data).to.be.null;
  });

  it("handles undefined properties", () => {
    const { valid, errors, data } = formatHypercertData(testDataUndefinedProperties as TestDataType);
    expect(valid).to.be.true;
    expect(Object.keys(errors).length).to.eq(0);
    expect(Object.keys(data!).find((key) => key === "properties")).to.be.undefined;
  });

  it("handles undefined external_url", () => {
    const { valid, errors, data } = formatHypercertData(testDataUndefinedExternalURL as TestDataType);
    expect(valid).to.be.true;
    expect(Object.keys(errors).length).to.eq(0);
    expect(Object.keys(data!).find((key) => key === "external_url")).to.be.undefined;
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
