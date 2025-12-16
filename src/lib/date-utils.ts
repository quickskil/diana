/**
 * Lightweight date utilities to avoid external dependencies while keeping the
 * formatting and comparison features used throughout the app.
 */

type TimeParts = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function setTimeParts(date: Date, values: TimeParts): Date {
  const result = new Date(date);
  if (values.hours !== undefined) result.setHours(values.hours);
  if (values.minutes !== undefined) result.setMinutes(values.minutes);
  if (values.seconds !== undefined) result.setSeconds(values.seconds);
  if (values.milliseconds !== undefined) result.setMilliseconds(values.milliseconds);
  return result;
}

export function parseISO(value: string): Date {
  return new Date(value);
}

export function isBefore(date: Date, comparison: Date): boolean {
  return date.getTime() < comparison.getTime();
}

export function subHours(date: Date, amount: number): Date {
  return new Date(date.getTime() - amount * 60 * 60 * 1000);
}

export function format(dateInput: Date | string, pattern: string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  switch (pattern) {
    case 'PPpp':
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    case 'p':
    case 'h:mm a':
      return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
    case 'yyyy-MM-dd':
      return date.toISOString().slice(0, 10);
    case 'EEEE, MMMM d':
      return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    default:
      return date.toISOString();
  }
}
