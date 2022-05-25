import { InfinitePeriod, Period } from "../../src/utils/period";
import { expect, should } from "chai";

describe("Period usage", () => {
  it("should return true when date is within", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Date(2022, 5, 20);

    const result = period.isDateWithin(toCheck);

    expect(result).to.be.true;
  });

  it("should return true when date equals start of period", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Date(2022, 5, 19);

    const result = period.isDateWithin(toCheck);

    expect(result).to.be.true;
  });

  it("should return true when date equals end period", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Date(2022, 5, 21);

    const result = period.isDateWithin(toCheck);

    expect(result).to.be.true;
  });

  it("should return false when date not within period", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Date(2022, 5, 23);

    const result = period.isDateWithin(toCheck);

    expect(result).to.be.false;
  });

  it("should return true when one period(one day) is inside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Period(new Date(2022, 5, 20), new Date(2022, 5, 20));

    const result = period.overlaps(toCheck);

    expect(result).to.be.true;
  });

  it("should return true when one period(few days) is inside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 25));
    const toCheck = new Period(new Date(2022, 5, 20), new Date(2022, 5, 23));

    const result = period.overlaps(toCheck);

    expect(result).to.be.true;
  });

  it("should return false when one period is outside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Period(new Date(2022, 5, 23), new Date(2022, 5, 30));

    const result = period.overlaps(toCheck);

    expect(result).to.be.false;
  });

  it("should return true when one period is partly inside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Period(new Date(2022, 5, 20), new Date(2022, 5, 29));

    const result = period.overlaps(toCheck);

    expect(result).to.be.true;
  });

  it("should fail when period is not entirely inside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 21));
    const toCheck = new Period(new Date(2022, 5, 20), new Date(2022, 5, 29));

    const result = period.contains(toCheck);

    expect(result).to.be.false;
  });

  it("should not fail when period is fully inside another", () => {
    const period = new Period(new Date(2022, 5, 19), new Date(2022, 5, 25));
    const toCheck = new Period(new Date(2022, 5, 20), new Date(2022, 5, 24));

    const result = period.contains(toCheck);

    expect(result).to.be.true;
  });

  it("should fail to create period when to date is older than from date", () => {
    const r = new Period(new Date(2022, 5, 19), new Date(2002, 5, 20));
  });
});
