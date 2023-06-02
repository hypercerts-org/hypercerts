import _ from "lodash";
import dayjs from "dayjs";
import { hasDuplicates, hasMissingDays } from "../../src/events/npm.js";

const makeData = (dateStrings: string[]) =>
  dateStrings.map((dateString) => ({
    downloads: _.random(0, 1000),
    day: dateString,
  }));

describe("npm tests", () => {
  it("hasDuplicates - works", () => {
    const result = hasDuplicates(
      makeData(["2021-01-01", "2021-01-01", "2021-01-03"]),
    );
    expect(result).toEqual(true);
  });

  it("hasDuplicates - no false positives", () => {
    const result = hasDuplicates(
      makeData(["2021-01-01", "2021-01-02", "2021-01-03"]),
    );
    expect(result).toEqual(false);
  });

  it("hasMissingDays - works", () => {
    let result = hasMissingDays(
      makeData(["2021-01-01", "2021-01-02", "2021-01-03"]),
      dayjs("2021-01-01"),
      dayjs("2021-01-03"),
    );
    expect(result).toEqual(false);
    result = hasMissingDays(
      makeData(["2021-01-01", "2021-01-03"]),
      dayjs("2021-01-01"),
      dayjs("2021-01-03"),
    );
    expect(result).toEqual(true);
  });

  it("hasMissingDays - start must not be after end date", () => {
    expect(() => {
      hasMissingDays(
        makeData(["2021-01-01", "2021-01-02", "2021-01-03"]),
        dayjs("2021-01-04"),
        dayjs("2021-01-03"),
      );
    }).toThrow();
  });

  it("hasMissingDays - treats dates inclusively", () => {
    let result = hasMissingDays(
      makeData(["2021-01-01", "2021-01-02", "2021-01-03"]),
      dayjs("2021-01-01"),
      dayjs("2021-01-04"),
    );
    expect(result).toEqual(true);
    result = hasMissingDays(
      makeData(["2021-01-01", "2021-01-02", "2021-01-03"]),
      dayjs("2020-12-31"),
      dayjs("2021-01-03"),
    );
    expect(result).toEqual(true);
  });

  it("hasMissingDays - works across months and years", () => {
    const result = hasMissingDays(
      makeData(["2021-12-31", "2022-01-01", "2022-01-02"]),
      dayjs("2021-12-31"),
      dayjs("2022-01-02"),
    );
    expect(result).toEqual(false);
  });
});
