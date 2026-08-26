import type {CalendarFormatters} from './types';

/**
 * All localized text comes from `Intl.DateTimeFormat`, which Hermes ships on both
 * platforms. Constructing a formatter is the expensive part (~100us), formatting on a
 * cached instance is ~1us, so every instance is created once per (locale, shape).
 */
type Shape =
  | 'monthTitle'
  | 'weekdayNarrow'
  | 'dayNumber'
  | 'dayFull'
  | 'rangeDay';

const OPTIONS: Readonly<Record<Shape, Intl.DateTimeFormatOptions>> = {
  monthTitle: {year: 'numeric', month: 'long'},
  weekdayNarrow: {weekday: 'narrow'},
  dayNumber: {day: 'numeric'},
  dayFull: {dateStyle: 'full'},
  rangeDay: {month: 'short', day: 'numeric', year: 'numeric'},
};

const hasIntl =
  typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';

const formatCache = new Map<string, Intl.DateTimeFormat | null>();

export function getFormat(
  locale: string,
  shape: Shape,
): Intl.DateTimeFormat | null {
  if (!hasIntl) {
    return null;
  }

  const cacheKey = `${locale}|${shape}`;

  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey) ?? null;
  }

  let format: Intl.DateTimeFormat | null = null;

  try {
    format = new Intl.DateTimeFormat(locale, OPTIONS[shape]);
  } catch {
    try {
      format = new Intl.DateTimeFormat(undefined, OPTIONS[shape]);
    } catch {
      // Exotic runtime without a usable ICU. The English fallbacks below take over.
      format = null;
    }
  }

  formatCache.set(cacheKey, format);

  return format;
}

/** The device locale, or `en-US` when the runtime has no `Intl`. */
export function resolveLocale(): string {
  if (!hasIntl) {
    return 'en-US';
  }

  try {
    return new Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';
  } catch {
    return 'en-US';
  }
}

const FALLBACK_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const FALLBACK_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const FALLBACK_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const FALLBACK_WEEKDAY_NARROW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type RangeCapableFormat = Intl.DateTimeFormat & {
  formatRange?: (start: Date, end: Date) => string;
};

const monthTitle = (date: Date, locale: string): string => {
  const format = getFormat(locale, 'monthTitle');

  return format
    ? format.format(date)
    : `${FALLBACK_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const rangeDay = (date: Date, locale: string): string => {
  const format = getFormat(locale, 'rangeDay');

  return format
    ? format.format(date)
    : `${FALLBACK_MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const weekTitle = (start: Date, end: Date, locale: string): string => {
  const format = getFormat(locale, 'rangeDay') as RangeCapableFormat | null;

  if (format && typeof format.formatRange === 'function') {
    try {
      return format.formatRange(start, end);
    } catch {
      // Older ICU without formatRange. Fall through to the manual join.
    }
  }

  return `${rangeDay(start, locale)} – ${rangeDay(end, locale)}`;
};

const weekdayLabel = (date: Date, locale: string): string => {
  const format = getFormat(locale, 'weekdayNarrow');

  return format ? format.format(date) : FALLBACK_WEEKDAY_NARROW[date.getDay()];
};

const dayNumber = (date: Date, locale: string): string => {
  const format = getFormat(locale, 'dayNumber');

  return format ? format.format(date) : String(date.getDate());
};

const dayAccessibilityLabel = (date: Date, locale: string): string => {
  const format = getFormat(locale, 'dayFull');

  return format
    ? format.format(date)
    : `${FALLBACK_WEEKDAYS[date.getDay()]}, ${FALLBACK_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const DEFAULT_FORMATTERS: CalendarFormatters = Object.freeze({
  monthTitle,
  weekTitle,
  weekdayLabel,
  dayNumber,
  dayAccessibilityLabel,
});

let formattersSeq = 0;
const formattersIds = new WeakMap<object, string>();

/**
 * A stable id per formatters object, so the grid LRU key changes when a caller
 * swaps in different formatters but not when it re-renders with the same ones.
 */
export function getFormattersId(formatters: CalendarFormatters): string {
  if (formatters === DEFAULT_FORMATTERS) {
    return 'default';
  }

  let id = formattersIds.get(formatters);

  if (!id) {
    formattersSeq += 1;
    id = `f${formattersSeq}`;
    formattersIds.set(formatters, id);
  }

  return id;
}
