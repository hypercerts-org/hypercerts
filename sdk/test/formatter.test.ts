import { expect } from "chai";
import { formatUnixTime, formatDate, INDEFINITE_DATE_STRING } from "../src/formatter.js";
import { formatHypercertData } from "../src/index.js";

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
