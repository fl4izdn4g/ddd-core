import { PeriodInterface } from "../../../utils/period";

export interface Access {
  can(period: PeriodInterface): boolean;
}

export class TimeAccess implements Access {
  constructor(private period: PeriodInterface) {
  }

  can(period: PeriodInterface): boolean {
    return this.period.contains(period);
  }
}

export class Break implements Access {
  constructor(private period: PeriodInterface) {
  }

  can(period: PeriodInterface): boolean {
    return !this.period.contains(period);
  }
}

