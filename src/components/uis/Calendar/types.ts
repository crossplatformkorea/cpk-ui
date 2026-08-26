import type {ReactNode} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

/**
 * Canonical day key. ALWAYS `yyyy-MM-dd`, zero padded, in the DEVICE LOCAL calendar.
 * Keys sort lexicographically, so range checks are plain string compares.
 */
export type CalendarDateKey = string;

/** Canonical month key. ALWAYS `yyyy-MM`. */
export type CalendarMonthKey = string;

/**
 * The key identifying one pager page: a month key in `mode='month'`, a day key
 * (the first day of the week) in `mode='week'`.
 */
export type CalendarPageKey = CalendarMonthKey | CalendarDateKey;

/** 0 = Sunday … 6 = Saturday. Same numbering as `Date.prototype.getDay()`. */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalendarWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CalendarViewMode = 'month' | 'week';

export type CalendarSizeType = 'compact' | 'regular' | 'expanded' | number;

export type CalendarChangeSource =
  | 'press'
  | 'swipe'
  | 'button'
  | 'keyboard'
  | 'imperative';

/**
 * Structural shape of a Reanimated `SharedValue<number>` in `[0, 1]`.
 * Declared structurally so the public API is not pinned to a Reanimated version.
 */
export type CalendarCollapseProgress = {value: number};

export type CalendarDot = {
  /** Stable identity within the day. Used as the React key. */
  key: string;
  /** Defaults to `palette.dot`. */
  color?: string;
};

/**
 * Everything one day cell can be decorated with. Looked up O(1) by `CalendarDateKey`.
 * Marker objects SHOULD be referentially stable across renders so the cell memo bails.
 */
export type CalendarMarker = {
  dots?: readonly CalendarDot[];
  /** Overrides the selected pill background for this day only. */
  selectedColor?: string;
  /** Overrides the day number color when the day is NOT selected. */
  textColor?: string;
  /** Tiny caption under the number. Hidden when the font scale exceeds 1.3. */
  badgeText?: string;
  badgeColor?: string;
  disabled?: boolean;
  /** Appended to the cell accessibility label, e.g. "3 entries, minus 42,000 won". */
  accessibilityHint?: string;
};

export type CalendarMarkerMap = Readonly<
  Record<CalendarDateKey, CalendarMarker>
>;

export type CalendarDayModel = {
  key: CalendarDateKey;
  /** Local noon of that calendar day. Noon anchoring keeps DST off the day boundary. */
  date: Date;
  dayOfMonth: number;
  /** 0 = Sunday, independent of `weekStart`. */
  weekday: CalendarWeekday;
  /** True when the cell belongs to the previous or next month (month mode only). */
  isOutside: boolean;
  /** 0 based row index inside the page grid. */
  weekIndex: number;
  /** Week number, only computed when `showWeekNumbers` is true, else 0. */
  weekNumber: number;
};

export type CalendarDayState = {
  day: CalendarDayModel;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  marker?: CalendarMarker;
};

/** The resolved, frozen colour set threaded to every cell as one prop. */
export type CalendarPalette = Readonly<{
  background: string;
  headerText: string;
  navIcon: string;
  weekdayLabel: string;
  weekNumberLabel: string;
  dayText: string;
  sundayText: string;
  saturdayText: string;
  outsideText: string;
  disabledText: string;
  todayText: string;
  todayRing: string;
  selectedBackground: string;
  selectedText: string;
  underlay: string;
  border: string;
  dot: string;
  badgeText: string;
}>;

/** Caller facing overrides. Every key defaults to a cpk-ui theme token. */
export type CalendarColors = Partial<CalendarPalette>;

/** Resolved geometry. Every value is a pure function of `size` and the font scale. */
export type CalendarMetrics = Readonly<{
  cellSize: number;
  rowGap: number;
  rowHeight: number;
  weekdayRowHeight: number;
  headerHeight: number;
  /** Edge of the round day pill. */
  numberSize: number;
  dayFontSize: number;
  weekdayFontSize: number;
  headerFontSize: number;
  badgeFontSize: number;
  dotSize: number;
  dotRowHeight: number;
  /** Constant top inset of the day pill, so decorations never move the number. */
  pillOffset: number;
  weekNumberWidth: number;
}>;

export type CalendarFormatters = {
  /** Header title, e.g. "August 2026" or "2026년 8월". */
  monthTitle: (date: Date, locale: string) => string;
  /** Header title in week mode, e.g. "Aug 23 – 29, 2026". */
  weekTitle: (start: Date, end: Date, locale: string) => string;
  /** Weekday column header, e.g. "S" or "일". */
  weekdayLabel: (date: Date, locale: string) => string;
  /** Day number. Respects locale numbering systems. */
  dayNumber: (date: Date, locale: string) => string;
  /** Full accessibility label, e.g. "Monday, August 24, 2026". */
  dayAccessibilityLabel: (date: Date, locale: string) => string;
};

export type CalendarLabels = {
  previousMonth?: string;
  nextMonth?: string;
  previousWeek?: string;
  nextWeek?: string;
  /** Appended to the today cell accessibility label. */
  today?: string;
  selected?: string;
  weekNumber?: string;
  /** Announced by the header live region on page change. */
  pageAnnouncement?: (pageTitle: string) => string;
};

export type CalendarStyles = {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  headerTitle?: StyleProp<TextStyle>;
  weekdayRow?: StyleProp<ViewStyle>;
  weekdayLabel?: StyleProp<TextStyle>;
  weekRow?: StyleProp<ViewStyle>;
  dayCell?: StyleProp<ViewStyle>;
  dayText?: StyleProp<TextStyle>;
  selectedDayCell?: StyleProp<ViewStyle>;
  selectedDayText?: StyleProp<TextStyle>;
  todayDayCell?: StyleProp<ViewStyle>;
  todayDayText?: StyleProp<TextStyle>;
  outsideDayText?: StyleProp<TextStyle>;
  disabledDayText?: StyleProp<TextStyle>;
  dotRow?: StyleProp<ViewStyle>;
  dot?: StyleProp<ViewStyle>;
  badgeText?: StyleProp<TextStyle>;
};

export type CalendarRenderDay = (
  ctx: CalendarDayState & {palette: CalendarPalette; cellSize: number},
) => ReactNode;

/**
 * Everything invariant across all cells of a page.
 * Created once per (theme, size, callbacks) change and compared by identity.
 */
export type CalendarChrome = Readonly<{
  palette: CalendarPalette;
  metrics: CalendarMetrics;
  /** Pre built geometry style objects. Stable while `metrics` is stable. */
  geometry: Readonly<{
    row: ViewStyle;
    cell: ViewStyle;
    pill: ViewStyle;
    dayText: TextStyle;
    badgeText: TextStyle;
    dot: ViewStyle;
    dotRow: ViewStyle;
    weekNumber: ViewStyle;
    weekNumberText: TextStyle;
  }>;
  showDots: boolean;
  maxDots: number;
  showBadges: boolean;
  maxFontSizeMultiplier: number;
  fontScale: number;
  labels: Required<CalendarLabels>;
  styles: CalendarStyles;
  renderDay?: CalendarRenderDay;
  onPress: (key: CalendarDateKey) => void;
  onLongPress?: (key: CalendarDateKey) => void;
  onDisabledPress?: (key: CalendarDateKey) => void;
}>;

/** Resolves whether a day is blocked. Identity changes are tracked by `disabledVersion`. */
export type CalendarDisabledResolver = (
  day: CalendarDayModel,
  marker?: CalendarMarker,
) => boolean;

export type CalendarHeaderContext = {
  title: string;
  date: Date;
  mode: CalendarViewMode;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
};

export type CalendarProps = {
  /** Controlled selection. `null` clears it. A `Date` is normalized to its local day key. */
  value?: Date | CalendarDateKey | null;
  /** Uncontrolled initial selection. Ignored when `value !== undefined`. */
  defaultValue?: Date | CalendarDateKey | null;
  /**
   * User interaction only, never fired on mount.
   * Prefer `key` for persistence, `date` is provided for interop and is local midnight.
   */
  onChange?: (
    date: Date,
    key: CalendarDateKey,
    source: CalendarChangeSource,
  ) => void;

  /** Controlled page anchor: `'yyyy-MM'`, `'yyyy-MM-dd'` or a `Date`. */
  month?: Date | CalendarPageKey;
  defaultMonth?: Date | CalendarPageKey;
  onMonthChange?: (
    firstDayOfPage: Date,
    key: CalendarPageKey,
    source: CalendarChangeSource,
  ) => void;

  mode?: CalendarViewMode;
  defaultMode?: CalendarViewMode;
  onModeChange?: (mode: CalendarViewMode) => void;
  /**
   * Optional shared value in `[0, 1]`: 0 = full month, 1 = single week.
   * When supplied the caller owns the collapse animation and the component only reads it.
   * When omitted the component animates internally on `mode` change.
   */
  collapseProgress?: CalendarCollapseProgress;

  /** BCP-47 tag. Defaults to the runtime locale. */
  locale?: string;
  /** Defaults to the CLDR first day of the resolved locale region. */
  weekStart?: WeekStart;
  /**
   * Injectable "now". A key is used verbatim, which lets hosts supply a day
   * resolved in a business timezone instead of the device timezone.
   * Defaults to an internal clock that re-arms at local midnight.
   */
  today?: Date | CalendarDateKey;
  /** Always render 6 rows so the height never changes between months. */
  fixedWeeks?: boolean;

  /** O(1) lookup by `yyyy-MM-dd`. MUST be memoized by the caller. */
  markers?: CalendarMarkerMap;
  showDots?: boolean;
  maxDotsPerDay?: number;
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;

  minDate?: Date | CalendarDateKey;
  maxDate?: Date | CalendarDateKey;
  /** Normalized to a `Set` once per identity change. */
  disabledDates?: ReadonlySet<CalendarDateKey> | readonly CalendarDateKey[];
  /** Escape hatch, called only for the mounted window. Must be pure and cheap. */
  isDateDisabled?: (date: Date, key: CalendarDateKey) => boolean;

  showHeader?: boolean;
  showNavigationButtons?: boolean;
  showWeekdayRow?: boolean;
  paging?: 'swipe' | 'none';
  monthsToShow?: 1 | 2;
  size?: CalendarSizeType;
  /** Multiplier cap applied to every text node. */
  maxFontSizeMultiplier?: number;

  colors?: CalendarColors;
  styles?: CalendarStyles;
  style?: StyleProp<ViewStyle>;
  formatters?: Partial<CalendarFormatters>;

  /** Must be referentially stable. */
  renderHeader?: (ctx: CalendarHeaderContext) => ReactNode;
  renderWeekdayLabel?: (ctx: {
    weekday: CalendarWeekday;
    label: string;
  }) => ReactNode;
  /** Full control of a cell. Receives everything precomputed, must not format dates itself. */
  renderDay?: CalendarRenderDay;

  onDayLongPress?: (date: Date, key: CalendarDateKey) => void;
  onDisabledDayPress?: (date: Date, key: CalendarDateKey) => void;

  labels?: CalendarLabels;
  accessibilityLabel?: string;
  testID?: string;
};

export type CalendarRef = {
  goToMonth: (month: Date | CalendarPageKey, animated?: boolean) => void;
  goToToday: (animated?: boolean) => void;
  next: (animated?: boolean) => void;
  previous: (animated?: boolean) => void;
  setMode: (mode: CalendarViewMode, animated?: boolean) => void;
  /** Move the roving focus to a specific day (screen reader / external keyboard). */
  focusDay: (key: CalendarDateKey) => void;
};
