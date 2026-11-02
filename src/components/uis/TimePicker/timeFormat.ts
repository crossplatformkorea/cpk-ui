/** `h12`: 1–12 with a day period (AM/PM). `h23`: 0–23. */
export type TimePickerHourCycle = 'h12' | 'h23';

export type TimePickerField = 'hour' | 'minute';

export type TimePickerSegment = TimePickerField | 'dayPeriod';

/** How one locale writes a time of day, read once from `Intl.DateTimeFormat`. */
export type TimePickerFormat = Readonly<{
  hourCycle: TimePickerHourCycle;
  /** The literal between hour and minute, e.g. `:` in English, `.` in Indonesian. */
  separator: string;
  /** The order the locale writes the segments, e.g. `오전 9:05` vs `9:05 AM`. */
  order: readonly TimePickerSegment[];
  /** `[AM, PM]` in the locale's own words. Read only when `hourCycle` is `h12`. */
  dayPeriods: readonly [string, string];
  /** Whether the locale writes 9 o'clock as `09`. Minutes are always two digits. */
  padHour: boolean;
}>;

type Part = {type: string; value: string};

/** 9:05 and 21:05: a single digit hour and a day period on each side of noon. */
const MORNING = new Date(2000, 0, 1, 9, 5);
const EVENING = new Date(2000, 0, 1, 21, 5);

const FALLBACK_DAY_PERIODS: readonly [string, string] = ['AM', 'PM'];

const hasIntl =
  typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';

function createFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat | null {
  if (!hasIntl) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    try {
      return new Intl.DateTimeFormat(undefined, options);
    } catch {
      return null;
    }
  }
}

function partsOf(
  format: Intl.DateTimeFormat | null,
  date: Date,
): Part[] | null {
  if (!format || typeof format.formatToParts !== 'function') {
    return null;
  }

  try {
    return format.formatToParts(date);
  } catch {
    return null;
  }
}

function isSegment(type: string): type is TimePickerSegment {
  return type === 'hour' || type === 'minute' || type === 'dayPeriod';
}

function fallbackFormat(
  hourCycle: TimePickerHourCycle = 'h23',
): TimePickerFormat {
  return Object.freeze({
    hourCycle,
    separator: ':',
    order:
      hourCycle === 'h12'
        ? (['hour', 'minute', 'dayPeriod'] as const)
        : (['hour', 'minute'] as const),
    dayPeriods: FALLBACK_DAY_PERIODS,
    padHour: hourCycle === 'h23',
  });
}

function readDayPeriods(locale: string): readonly [string, string] {
  const format = createFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const morning = partsOf(format, MORNING)?.find(
    (part) => part.type === 'dayPeriod',
  )?.value;
  const evening = partsOf(format, EVENING)?.find(
    (part) => part.type === 'dayPeriod',
  )?.value;

  return morning && evening && morning !== evening
    ? [morning, evening]
    : FALLBACK_DAY_PERIODS;
}

const formatCache = new Map<string, TimePickerFormat>();

function hasClock(parts: Part[]): boolean {
  return (
    parts.some((part) => part.type === 'hour') &&
    parts.some((part) => part.type === 'minute')
  );
}

function readFormat(
  locale: string,
  hourCycle: TimePickerHourCycle | undefined,
  evening: Part[],
  morning: Part[],
): TimePickerFormat {
  const cycle: TimePickerHourCycle =
    hourCycle ??
    (evening.some((part) => part.type === 'dayPeriod') ? 'h12' : 'h23');
  const types = evening.map((part) => part.type).filter(isSegment);
  const order = types.filter(
    (type, index) =>
      types.indexOf(type) === index &&
      (type !== 'dayPeriod' || cycle === 'h12'),
  );

  if (cycle === 'h12' && !order.includes('dayPeriod')) {
    order.push('dayPeriod');
  }

  const hourIndex = evening.findIndex((part) => part.type === 'hour');
  const minuteIndex = evening.findIndex((part) => part.type === 'minute');
  const separator =
    minuteIndex > hourIndex
      ? evening
          .slice(hourIndex + 1, minuteIndex)
          .map((part) => part.value)
          .join('')
          .trim()
      : '';

  return Object.freeze({
    hourCycle: cycle,
    separator: separator || ':',
    order,
    dayPeriods: cycle === 'h12' ? readDayPeriods(locale) : FALLBACK_DAY_PERIODS,
    padHour:
      (morning.find((part) => part.type === 'hour')?.value.length ?? 1) > 1,
  });
}

/**
 * Hour cycle, separator, segment order and day period words for `locale`.
 * An explicit `hourCycle` overrides the locale's preference but keeps its words.
 */
export function resolveTimeFormat(
  locale: string,
  hourCycle?: TimePickerHourCycle,
): TimePickerFormat {
  const cacheKey = `${locale}|${hourCycle ?? ''}`;
  const cached = formatCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const cycle12 = hourCycle === undefined ? {} : {hour12: hourCycle === 'h12'};
  // The short time style is how the locale writes a time (`09:05` in German);
  // `hour: 'numeric'` drops that padding, so it is only the fallback shape.
  const candidates: Intl.DateTimeFormatOptions[] = [
    {timeStyle: 'short', ...cycle12},
    {hour: 'numeric', minute: '2-digit', ...cycle12},
  ];
  let resolved = fallbackFormat(hourCycle);

  for (const options of candidates) {
    const format = createFormat(locale, options);
    const evening = partsOf(format, EVENING);
    const morning = partsOf(format, MORNING);

    if (evening && morning && hasClock(evening) && hasClock(morning)) {
      resolved = readFormat(locale, hourCycle, evening, morning);
      break;
    }
  }

  formatCache.set(cacheKey, resolved);

  return resolved;
}

/** The hour as a h12 or h23 field shows it. */
export function displayHour(
  hours: number,
  hourCycle: TimePickerHourCycle,
): number {
  if (hourCycle === 'h23') {
    return hours;
  }

  return hours % 12 === 0 ? 12 : hours % 12;
}

/** A typed hour back to 0–23. */
export function toHours24(
  hour: number,
  hourCycle: TimePickerHourCycle,
  isAfternoon: boolean,
): number {
  if (hourCycle === 'h23') {
    return hour;
  }

  return (hour % 12) + (isAfternoon ? 12 : 0);
}

export function padTwo(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export type TimeFieldEntry = Readonly<{
  /** What the field shows while it has focus. */
  draft: string;
  /** The typed number, or `null` while it cannot be one yet (`0` in a h12 hour). */
  value: number | null;
  /** No further digit can follow, so focus may move on. */
  complete: boolean;
}>;

const FULL_WIDTH_ZERO = 0xff10;

/** Full-width digits come from CJK input methods; they type the same numbers. */
function asciiDigits(text: string): string {
  let digits = '';

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (char >= '0' && char <= '9') {
      digits += char;
    } else if (code >= FULL_WIDTH_ZERO && code <= FULL_WIDTH_ZERO + 9) {
      digits += String(code - FULL_WIDTH_ZERO);
    }
  }

  return digits;
}

/**
 * Reads one keystroke's worth of field text. Returns `null` when the text can
 * never become a valid value (`25` hours, `60` minutes), so the field keeps
 * its previous draft.
 */
export function readTimeField(
  text: string,
  field: TimePickerField,
  hourCycle: TimePickerHourCycle,
): TimeFieldEntry | null {
  const digits = asciiDigits(text).slice(0, 2);

  if (digits === '') {
    return {draft: '', value: null, complete: false};
  }

  const value = Number(digits);
  const min = field === 'hour' && hourCycle === 'h12' ? 1 : 0;
  const max = field === 'minute' ? 59 : hourCycle === 'h12' ? 12 : 23;

  if (digits.length === 1) {
    return {
      draft: digits,
      value: value >= min ? value : null,
      complete: value * 10 > max,
    };
  }

  if (value < min || value > max) {
    return null;
  }

  return {draft: digits, value, complete: true};
}
