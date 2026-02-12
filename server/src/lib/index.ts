import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  Day,
  startOfMonth,
  subYears,
  endOfMonth,
  min,
} from 'date-fns';

export class WeekDateService {
  private weekStartsOn: Day = 1;

  getLastWeek(): { start: Date; end: Date } {
    const now = new Date();

    const startCurrentWeek = startOfWeek(now, {
      weekStartsOn: this.weekStartsOn,
    });

    const startLastWeek = subWeeks(startCurrentWeek, 1);

    const endLastWeek = endOfWeek(startLastWeek, {
      weekStartsOn: this.weekStartsOn,
    });

    return {
      start: startLastWeek,
      end: endLastWeek,
    };
  }

  getCurrentMonth(): { start: Date; end: Date } {
    const now = new Date();
    const start = startOfMonth(now);
    const end = now;

    return { start, end };
  }

  getLastYearSameMonth(): { start: Date; end: Date } {
    const now = new Date();
    const sameDayLastYear = subYears(now, 1);

    const start = startOfMonth(sameDayLastYear);
    const endOfMonthLastYear = endOfMonth(sameDayLastYear);

    const end = min([sameDayLastYear, endOfMonthLastYear]);

    return { start, end };
  }
}
