import type {
  CalendarDateKey,
  CalendarDayModel,
  CalendarFormatters,
  CalendarMarker,
  CalendarMetrics,
  CalendarMonthKey,
  CalendarPageKey,
  CalendarSizeType,
  CalendarViewMode,
  CalendarWeekday,
  WeekStart,
} from './types';

const MS_PER_DAY = 86_400_000;

export const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

/**
 * Every calendar `Date` in this component is anchored at LOCAL NOON.
 * Local midnight does not exist in zones whose DST transition happens at 00:00
 * (America/Santiago, America/Havana, …) and noon is more than 11 hours away from
 * every real world transition, so no shift can move a date to another calendar day.
 */
export const localNoon = (year: number, month0: number, day: number): Date =>
  new Date(year, month0, day, 12, 0, 0, 0);

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const toDayKey = (date: Date): CalendarDateKey =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const toMonthKey = (date: Date): CalendarMonthKey =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

export const isMonthKey = (key: string): boolean => key.length === 7;

/** Field wise construction. Never `new Date('2026-08-24')`, which ECMA-262 parses as UTC. */
export const fromDayKey = (key: CalendarDateKey): Date =>
  localNoon(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10));

export const fromMonthKey = (key: CalendarMonthKey): Date =>
  localNoon(+key.slice(0, 4), +key.slice(5, 7) - 1, 1);

/** Field arithmetic, so month, year and DST boundaries normalize correctly. */
export const addDays = (date: Date, amount: number): Date =>
  localNoon(date.getFullYear(), date.getMonth(), date.getDate() + amount);

export const daysInMonth = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const startOfMonth = (date: Date): Date =>
  localNoon(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number): Date => {
  const target = localNoon(date.getFullYear(), date.getMonth() + amount, 1);

  return localNoon(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), daysInMonth(target)),
  );
};

export const startOfWeek = (date: Date, weekStart: WeekStart): Date =>
  addDays(date, -((((date.getDay() - weekStart) % 7) + 7) % 7));

/** The year is compared. Comparing only month and date highlights the same day of any year. */
export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Safe because both dates are local noon: a DST shift of one hour is 0.042 days,
 * which `Math.round` can never turn into a different day count.
 */
export const diffInCalendarDays = (a: Date, b: Date): number =>
  Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);

export const weeksInMonth = (date: Date, weekStart: WeekStart): number => {
  const first = startOfMonth(date);
  const offset = diffInCalendarDays(first, startOfWeek(first, weekStart));

  return Math.ceil((offset + daysInMonth(date)) / 7);
};

const getWeekYear = (
  date: Date,
  weekStart: WeekStart,
  firstWeekContainsDate: number,
): number => {
  const year = date.getFullYear();
  const startOfNextYear = startOfWeek(
    localNoon(year + 1, 0, firstWeekContainsDate),
    weekStart,
  );
  const startOfThisYear = startOfWeek(
    localNoon(year, 0, firstWeekContainsDate),
    weekStart,
  );
  const time = date.getTime();

  if (time >= startOfNextYear.getTime()) {
    return year + 1;
  }

  if (time >= startOfThisYear.getTime()) {
    return year;
  }

  return year - 1;
};

/**
 * ISO 8601 numbering when `weekStart` is Monday, otherwise the
 * "the week containing Jan 1 is week 1" convention that US/KR/JP calendars show.
 */
export const getWeekNumber = (date: Date, weekStart: WeekStart): number => {
  const firstWeekContainsDate = weekStart === 1 ? 4 : 1;
  const weekYear = getWeekYear(date, weekStart, firstWeekContainsDate);
  const startOfWeekYear = startOfWeek(
    localNoon(weekYear, 0, firstWeekContainsDate),
    weekStart,
  );

  return (
    Math.round(
      diffInCalendarDays(startOfWeek(date, weekStart), startOfWeekYear) / 7,
    ) + 1
  );
};

/** CLDR `weekData/firstDay`, reduced to the regions that do not start on Monday. */
const SUNDAY_FIRST = new Set([
  'AR',
  'BO',
  'BR',
  'CA',
  'CL',
  'CN',
  'CO',
  'DO',
  'EC',
  'GT',
  'HK',
  'HN',
  'ID',
  'IL',
  'IN',
  'JM',
  'JP',
  'KE',
  'KR',
  'MO',
  'MX',
  'NI',
  'PA',
  'PE',
  'PH',
  'PR',
  'PY',
  'SG',
  'TH',
  'TW',
  'US',
  'UY',
  'VE',
  'ZA',
  'ZW',
]);

const SATURDAY_FIRST = new Set([
  'AE',
  'AF',
  'BH',
  'DJ',
  'DZ',
  'EG',
  'IQ',
  'IR',
  'JO',
  'KW',
  'LY',
  'OM',
  'QA',
  'SA',
  'SD',
  'SY',
  'YE',
]);

/** Fallback for runtimes without `Intl.Locale`, covering the languages cpk-ui ships stories for. */
const LANGUAGE_REGION: Readonly<Record<string, string>> = {
  ar: 'SA',
  de: 'DE',
  en: 'US',
  es: 'ES',
  fr: 'FR',
  he: 'IL',
  id: 'ID',
  ja: 'JP',
  ko: 'KR',
  pt: 'BR',
  th: 'TH',
  vi: 'VN',
  zh: 'CN',
};

type MaximizableLocale = {maximize: () => {region?: string}};

export const regionOf = (locale: string): string => {
  const normalized = locale.replace(/_/g, '-');
  const parts = normalized.split('-');

  for (let i = 1; i < parts.length; i++) {
    if (/^[A-Za-z]{2}$/.test(parts[i])) {
      return parts[i].toUpperCase();
    }
  }

  const intl = Intl as unknown as {
    Locale?: new (tag: string) => MaximizableLocale;
  };

  if (typeof intl.Locale === 'function') {
    try {
      const region = new intl.Locale(normalized).maximize().region;

      if (region) {
        return region.toUpperCase();
      }
    } catch {
      // Exotic or malformed tag, fall through to the language table.
    }
  }

  return LANGUAGE_REGION[parts[0].toLowerCase()] ?? '';
};

export const resolveWeekStart = (locale: string): WeekStart => {
  const region = regionOf(locale);

  if (SATURDAY_FIRST.has(region)) {
    return 6;
  }

  if (SUNDAY_FIRST.has(region)) {
    return 0;
  }

  return 1;
};

/** Accepts a `Date` or an already canonical key and always answers with a day key. */
export const toDateKeyInput = (
  value: Date | CalendarDateKey,
): CalendarDateKey => (typeof value === 'string' ? value : toDayKey(value));

/**
 * Resolves a page anchor to the first rendered day of that page.
 * Month pages anchor on the first of the month, week pages on the week start.
 */
export const pageFirstDate = (
  pageKey: CalendarPageKey,
  mode: CalendarViewMode,
  weekStart: WeekStart,
): Date => {
  if (mode === 'week') {
    const date = isMonthKey(pageKey)
      ? fromMonthKey(pageKey)
      : fromDayKey(pageKey);

    return startOfWeek(date, weekStart);
  }

  return isMonthKey(pageKey)
    ? fromMonthKey(pageKey)
    : startOfMonth(fromDayKey(pageKey));
};

/** The last day that logically belongs to a page, ignoring the out of month padding. */
export const pageLastDate = (
  pageKey: CalendarPageKey,
  mode: CalendarViewMode,
  weekStart: WeekStart,
  monthsToShow: number,
): Date => {
  const first = pageFirstDate(pageKey, mode, weekStart);

  return mode === 'week'
    ? addDays(first, 6)
    : addDays(addMonths(first, monthsToShow), -1);
};

export const toPageKey = (
  date: Date,
  mode: CalendarViewMode,
  weekStart: WeekStart,
): CalendarPageKey =>
  mode === 'week' ? toDayKey(startOfWeek(date, weekStart)) : toMonthKey(date);

export const normalizePageKey = (
  value: Date | CalendarPageKey,
  mode: CalendarViewMode,
  weekStart: WeekStart,
  monthsToShow: number,
): CalendarPageKey => {
  const date =
    typeof value === 'string'
      ? isMonthKey(value)
        ? fromMonthKey(value)
        : fromDayKey(value)
      : value;

  if (mode === 'week') {
    return toDayKey(startOfWeek(date, weekStart));
  }

  if (monthsToShow > 1) {
    const anchor = localNoon(
      date.getFullYear(),
      Math.floor(date.getMonth() / monthsToShow) * monthsToShow,
      1,
    );

    return toMonthKey(anchor);
  }

  return toMonthKey(date);
};

/** Steps a page anchor by `delta` pages: months in month mode, weeks in week mode. */
export const addPages = (
  pageKey: CalendarPageKey,
  delta: number,
  mode: CalendarViewMode,
  weekStart: WeekStart,
  monthsToShow: number,
): CalendarPageKey => {
  const first = pageFirstDate(pageKey, mode, weekStart);

  return mode === 'week'
    ? toDayKey(addDays(first, delta * 7))
    : toMonthKey(addMonths(first, delta * monthsToShow));
};

export function buildMonthGrid(
  month: Date,
  weekStart: WeekStart,
  fixedWeeks: boolean,
  showWeekNumbers: boolean,
): readonly CalendarDayModel[] {
  const gridStart = startOfWeek(startOfMonth(month), weekStart);
  const rowCount = fixedWeeks ? 6 : weeksInMonth(month, weekStart);
  const cellCount = rowCount * 7;
  const targetMonth = month.getMonth();
  const cells = new Array<CalendarDayModel>(cellCount);

  for (let i = 0; i < cellCount; i++) {
    const date = addDays(gridStart, i);

    cells[i] = {
      key: toDayKey(date),
      date,
      dayOfMonth: date.getDate(),
      weekday: date.getDay() as CalendarWeekday,
      isOutside: date.getMonth() !== targetMonth,
      weekIndex: (i / 7) | 0,
      weekNumber: showWeekNumbers ? getWeekNumber(date, weekStart) : 0,
    };
  }

  return Object.freeze(cells);
}

export function buildWeekGrid(
  anchor: Date,
  weekStart: WeekStart,
  showWeekNumbers: boolean,
): readonly CalendarDayModel[] {
  const gridStart = startOfWeek(anchor, weekStart);
  const cells = new Array<CalendarDayModel>(7);

  for (let i = 0; i < 7; i++) {
    const date = addDays(gridStart, i);

    cells[i] = {
      key: toDayKey(date),
      date,
      dayOfMonth: date.getDate(),
      weekday: date.getDay() as CalendarWeekday,
      isOutside: false,
      weekIndex: 0,
      weekNumber: showWeekNumbers ? getWeekNumber(date, weekStart) : 0,
    };
  }

  return Object.freeze(cells);
}

/**
 * One rendered week. Frozen and cached, so a row can be compared by identity alone
 * and the parallel label arrays never have to be re-sliced during a render.
 */
export type CalendarGridRow = Readonly<{
  weekIndex: number;
  weekNumber: number;
  days: readonly CalendarDayModel[];
  dayLabels: readonly string[];
  a11yLabels: readonly string[];
}>;

export type CalendarGrid = Readonly<{
  days: readonly CalendarDayModel[];
  rows: readonly CalendarGridRow[];
  rowCount: number;
  firstKey: CalendarDateKey;
  lastKey: CalendarDateKey;
}>;

export type CalendarGridRequest = {
  pageKey: CalendarPageKey;
  mode: CalendarViewMode;
  weekStart: WeekStart;
  fixedWeeks: boolean;
  showWeekNumbers: boolean;
  locale: string;
  formatters: CalendarFormatters;
  formattersId: string;
};

const GRID_CACHE_LIMIT = 24;
const gridCache = new Map<string, CalendarGrid>();

/**
 * Module level LRU. Re-visiting a page (swiping back and forth) is a `Map.get`,
 * so `Intl.DateTimeFormat#format` runs at most once per (page, locale) pair.
 */
export function getCalendarGrid(request: CalendarGridRequest): CalendarGrid {
  const {
    pageKey,
    mode,
    weekStart,
    fixedWeeks,
    showWeekNumbers,
    locale,
    formatters,
    formattersId,
  } = request;

  const cacheKey = `${pageKey}|${mode}|${weekStart}|${fixedWeeks ? 1 : 0}|${
    showWeekNumbers ? 1 : 0
  }|${locale}|${formattersId}`;

  const cached = gridCache.get(cacheKey);

  if (cached) {
    gridCache.delete(cacheKey);
    gridCache.set(cacheKey, cached);

    return cached;
  }

  const first = pageFirstDate(pageKey, mode, weekStart);
  const days =
    mode === 'week'
      ? buildWeekGrid(first, weekStart, showWeekNumbers)
      : buildMonthGrid(first, weekStart, fixedWeeks, showWeekNumbers);

  const dayLabels = new Array<string>(days.length);
  const a11yLabels = new Array<string>(days.length);

  for (let i = 0; i < days.length; i++) {
    dayLabels[i] = formatters.dayNumber(days[i].date, locale);
    a11yLabels[i] = formatters.dayAccessibilityLabel(days[i].date, locale);
  }

  const rowCount = days.length / 7;
  const rows = new Array<CalendarGridRow>(rowCount);

  for (let row = 0; row < rowCount; row++) {
    const from = row * 7;

    rows[row] = Object.freeze({
      weekIndex: row,
      weekNumber: days[from].weekNumber,
      days: Object.freeze(days.slice(from, from + 7)),
      dayLabels: Object.freeze(dayLabels.slice(from, from + 7)),
      a11yLabels: Object.freeze(a11yLabels.slice(from, from + 7)),
    });
  }

  const grid: CalendarGrid = Object.freeze({
    days,
    rows: Object.freeze(rows),
    rowCount,
    firstKey: days[0].key,
    lastKey: days[days.length - 1].key,
  });

  gridCache.set(cacheKey, grid);

  if (gridCache.size > GRID_CACHE_LIMIT) {
    const oldest = gridCache.keys().next().value;

    if (oldest !== undefined) {
      gridCache.delete(oldest);
    }
  }

  return grid;
}

/** Test seam. Keeps the LRU from leaking state between test files. */
export const clearCalendarGridCache = (): void => {
  gridCache.clear();
};

/**
 * True when the row's 7 keys contain `key`.
 * Keys are sorted and consecutive, so this is two string compares, never a scan.
 */
export const rowHasKey = (
  days: readonly CalendarDayModel[],
  key: string | null,
): boolean =>
  key !== null &&
  days.length > 0 &&
  key >= days[0].key &&
  key <= days[days.length - 1].key;

/** Identity first, then a shallow value compare so a rebuilt but equal marker still bails. */
export function isSameMarker(a?: CalendarMarker, b?: CalendarMarker): boolean {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return (
    a.dots === b.dots &&
    a.badgeText === b.badgeText &&
    a.badgeColor === b.badgeColor &&
    a.selectedColor === b.selectedColor &&
    a.textColor === b.textColor &&
    a.disabled === b.disabled &&
    a.accessibilityHint === b.accessibilityHint
  );
}

type Rgb = {r: number; g: number; b: number};

const HEX_SHORT = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
const HEX_LONG = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
const RGB_FN = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i;

export function parseColor(color: string): Rgb | null {
  const value = color.trim();
  const short = HEX_SHORT.exec(value);

  if (short) {
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    };
  }

  const long = HEX_LONG.exec(value);

  if (long) {
    return {
      r: parseInt(long[1], 16),
      g: parseInt(long[2], 16),
      b: parseInt(long[3], 16),
    };
  }

  const fn = RGB_FN.exec(value);

  if (fn) {
    return {r: +fn[1], g: +fn[2], b: +fn[3]};
  }

  return null;
}

const srgbToLinear = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** WCAG relative luminance, or `null` when the colour cannot be parsed. */
export function relativeLuminance(color: string): number | null {
  const rgb = parseColor(color);

  if (!rgb) {
    return null;
  }

  return (
    0.2126 * srgbToLinear(rgb.r / 255) +
    0.7152 * srgbToLinear(rgb.g / 255) +
    0.0722 * srgbToLinear(rgb.b / 255)
  );
}

/**
 * Picks the readable label colour for a background.
 * The 0.45 threshold makes a saturated yellow resolve to the dark label.
 */
export function readableTextOn(
  background: string,
  light: string,
  dark: string,
): string {
  const luminance = relativeLuminance(background);

  if (luminance === null) {
    return light;
  }

  return luminance > 0.45 ? dark : light;
}

const SIZE_PRESETS: Readonly<
  Record<
    'compact' | 'regular' | 'expanded',
    {
      cellSize: number;
      rowGap: number;
      weekdayRowHeight: number;
      headerHeight: number;
    }
  >
> = {
  compact: {cellSize: 36, rowGap: 4, weekdayRowHeight: 24, headerHeight: 44},
  regular: {cellSize: 44, rowGap: 6, weekdayRowHeight: 28, headerHeight: 48},
  expanded: {cellSize: 56, rowGap: 8, weekdayRowHeight: 32, headerHeight: 56},
};

/**
 * There is no measure pass in the vertical axis: every value below is a pure
 * function of `size` and the device font scale, so the grid height is identical
 * for every month and a swipe causes zero layout thrash.
 */
export function resolveMetrics(
  size: CalendarSizeType,
  fontScale: number,
  maxFontSizeMultiplier: number,
): CalendarMetrics {
  const base =
    typeof size === 'number'
      ? {
          cellSize: size,
          rowGap: clamp(Math.round(size * 0.14), 4, 10),
          weekdayRowHeight: Math.round(size * 0.62),
          headerHeight: Math.round(size * 1.1),
        }
      : (SIZE_PRESETS[size] ?? SIZE_PRESETS.regular);

  // Guards a non finite font scale from an exotic runtime, and keeps a device
  // reporting a scale below 1 from shrinking the touch targets.
  const requested = Number.isFinite(fontScale) ? fontScale : 1;
  const cap = Number.isFinite(maxFontSizeMultiplier)
    ? maxFontSizeMultiplier
    : 1;
  const scale = clamp(Math.min(requested, cap), 1, 4);
  const cellSize = clamp(Math.round(base.cellSize * scale), 32, 96);
  const rowHeight = cellSize + base.rowGap;
  const numberSize = clamp(Math.round(cellSize * 0.68), 22, 72);
  const dotSize = clamp(Math.round(cellSize * 0.11), 4, 8);
  const dotRowHeight = dotSize + 1;

  return Object.freeze({
    cellSize,
    rowGap: base.rowGap,
    rowHeight,
    weekdayRowHeight: Math.round(base.weekdayRowHeight * scale),
    headerHeight: Math.round(base.headerHeight * scale),
    numberSize,
    dayFontSize: clamp(Math.round(cellSize * 0.34), 11, 24),
    weekdayFontSize: clamp(Math.round(cellSize * 0.26), 10, 18),
    headerFontSize: clamp(Math.round(cellSize * 0.4), 14, 26),
    badgeFontSize: clamp(Math.round(cellSize * 0.19), 8, 11),
    dotSize,
    dotRowHeight,
    pillOffset: Math.max(
      1,
      Math.round((rowHeight - numberSize - dotRowHeight) / 2),
    ),
    weekNumberWidth: clamp(Math.round(cellSize * 0.62), 20, 48),
  });
}
