import { startOfWeek, endOfWeek, subWeeks, Day } from 'date-fns';

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
}
