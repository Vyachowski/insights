import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  Day,
  startOfMonth,
  subYears,
  endOfMonth,
  min,
  addWeeks,
  differenceInCalendarWeeks,
  startOfYear,
} from 'date-fns';

export class DateService {
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

  getYearlyCompletedWeeks(): {
    currentYear: { start: Date; end: Date }[];
    previousYear: { start: Date; end: Date }[];
  } {
    const now = new Date();

    const currentYearNumber = now.getFullYear();
    const previousYearNumber = currentYearNumber - 1;

    const startOfCurrentYear = startOfYear(new Date(currentYearNumber, 0, 1));
    const startOfPreviousYear = startOfYear(new Date(previousYearNumber, 0, 1));

    const startOfCurrentWeek = startOfWeek(now, {
      weekStartsOn: this.weekStartsOn,
    });

    const startOfLastFullWeek = subWeeks(startOfCurrentWeek, 1);

    const completedWeeks =
      differenceInCalendarWeeks(startOfLastFullWeek, startOfCurrentYear, {
        weekStartsOn: this.weekStartsOn,
      }) + 1;

    const currentYearWeeks: { start: Date; end: Date }[] = [];
    const previousYearWeeks: { start: Date; end: Date }[] = [];

    for (let i = 0; i < completedWeeks; i++) {
      const currentStart = addWeeks(startOfCurrentYear, i);
      const previousStart = addWeeks(startOfPreviousYear, i);

      currentYearWeeks.push({
        start: currentStart,
        end: endOfWeek(currentStart, { weekStartsOn: this.weekStartsOn }),
      });

      previousYearWeeks.push({
        start: previousStart,
        end: endOfWeek(previousStart, { weekStartsOn: this.weekStartsOn }),
      });
    }

    return {
      currentYear: currentYearWeeks,
      previousYear: previousYearWeeks,
    };
  }

  getComparablePeriods() {
    const now = new Date();

    const currentStart = startOfYear(now);
    const currentEnd = now;

    const previousStart = subYears(currentStart, 1);
    const previousEnd = subYears(currentEnd, 1);

    return {
      currentYear: { start: currentStart, end: currentEnd },
      previousYear: { start: previousStart, end: previousEnd },
    };
  }
}
