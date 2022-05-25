import { areIntervalsOverlapping, isWithinInterval } from "date-fns";

export interface PeriodInterface {
  getFrom(): Date;
  getTo(): Date;
  overlaps(period: PeriodInterface): boolean;
  isDateWithin(date: Date): boolean;
  contains(period: PeriodInterface): boolean;
}

export class Period implements PeriodInterface {
  private from: Date;
  private to: Date;
  private interval: Interval;
  constructor(from: Date, to: Date) {
    this.from = from;
    this.to = to;
    this.interval = { start: from, end: to };
  }

  getFrom(): Date {
    return this.from;
  }

  getTo(): Date {
    return this.to;
  }

  overlaps(period: PeriodInterface): boolean {
    return areIntervalsOverlapping(
      { start: period.getFrom(), end: period.getTo() },
      this.interval,
      { inclusive: true }
    );
  }

  isDateWithin(date: Date): boolean {
    return isWithinInterval(date, this.interval);
  }

  contains(period: PeriodInterface): boolean {
    return (
      isWithinInterval(period.getFrom(), this.interval) &&
      isWithinInterval(period.getTo(), this.interval)
    );
  }
}

export class InfinitePeriod implements PeriodInterface {
  private from: Date;
  private to: Date;
  private period: PeriodInterface;

  constructor(from: Date) {
    this.from = from;
    this.to = new Date(9999, 1, 1);
    this.period = new Period(from, this.to);
  }

  getFrom(): Date {
    return this.from;
  }

  getTo(): Date {
    return this.to;
  }

  overlaps(period: PeriodInterface): boolean {
    return this.period.overlaps(period);
  }

  contains(period: PeriodInterface): boolean {
    return this.period.contains(period);
  }

  isDateWithin(date: Date): boolean {
    return this.period.isDateWithin(date);
  }
}

export class OneDayPeriod implements PeriodInterface {
  private from: Date;
  private period: PeriodInterface;

  constructor(from: Date) {
    this.from = from;
    this.period = new Period(from, from);
  }

  getFrom(): Date {
    return this.from;
  }
  getTo(): Date {
    return this.from;
  }
  overlaps(period: PeriodInterface): boolean {
    return this.period.overlaps(period);
  }
  isDateWithin(date: Date): boolean {
    return this.period.isDateWithin(date);
  }
  contains(period: PeriodInterface): boolean {
    return this.period.contains(period);
  }
}
