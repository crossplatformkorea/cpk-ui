import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react';
import type {ViewProps, ViewStyle} from 'react-native';
import {
  AccessibilityInfo,
  I18nManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {css} from 'kstyled';
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import {useTheme} from '../../../providers/ThemeProvider';
import {CalendarHeader} from './CalendarHeader';
import {CalendarPage, type CalendarPagerSlot} from './CalendarPage';
import {CalendarPager} from './CalendarPager';
import {CalendarWeekdayRow} from './CalendarWeekdayRow';
import {DEFAULT_FORMATTERS, getFormattersId, resolveLocale} from './intl';
import {isSamePalette, resolveCalendarPalette} from './palette';
import type {
  CalendarChrome,
  CalendarDateKey,
  CalendarFormatters,
  CalendarLabels,
  CalendarMarkerMap,
  CalendarMetrics,
  CalendarPageKey,
  CalendarPalette,
  CalendarProps,
  CalendarRef,
  CalendarStyles,
  CalendarViewMode,
  CalendarChangeSource,
} from './types';
import {
  resolveKeyboardAction,
  useControllable,
  useDisabledState,
  useReduceMotion,
  useShallowStable,
  useToday,
} from './useCalendarState';
import {
  addDays,
  addPages,
  getCalendarGrid,
  localNoon,
  normalizePageKey,
  pageFirstDate,
  pageLastDate,
  resolveMetrics,
  resolveWeekStart,
  startOfWeek,
  toDateKeyInput,
  toDayKey,
} from './utils';

const CONTAINER = css`
  align-self: center;
  width: 100%;
`;

const TWO_UP_ROW = css`
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
`;

const COLUMN = css`
  flex: 1;
`;

const EMPTY_MARKERS: CalendarMarkerMap = Object.freeze({});
const EMPTY_STYLES: CalendarStyles = Object.freeze({});

const DEFAULT_LABELS: Required<CalendarLabels> = Object.freeze({
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousWeek: 'Previous week',
  nextWeek: 'Next week',
  today: 'Today',
  selected: 'Selected',
  weekNumber: 'Week',
  pageAnnouncement: (pageTitle: string) => pageTitle,
});

/** A Sunday, used only to derive weekday header labels. Never rendered. */
const WEEKDAY_LABEL_ANCHOR = localNoon(2024, 0, 7);

const COLLAPSE_DURATION = 220;
const BADGE_FONT_SCALE_LIMIT = 1.3;
const SINGLE_DOT_FONT_SCALE_LIMIT = 1.5;

type KeyboardEventLike = {
  key: string;
  shiftKey?: boolean;
  preventDefault?: () => void;
};

/**
 * `onKeyDown` is forwarded by react-native-web and simply never fires on native,
 * so one handler covers both platforms without a `.web.tsx` split.
 */
const KeyboardView = View as unknown as ComponentType<
  ViewProps & {onKeyDown?: (event: KeyboardEventLike) => void}
>;

function buildGeometry(metrics: CalendarMetrics): CalendarChrome['geometry'] {
  return Object.freeze({
    row: {height: metrics.rowHeight},
    cell: {height: metrics.rowHeight, paddingTop: metrics.pillOffset},
    pill: {
      width: metrics.numberSize,
      height: metrics.numberSize,
      borderRadius: metrics.numberSize / 2,
    },
    dayText: {fontSize: metrics.dayFontSize},
    badgeText: {fontSize: metrics.badgeFontSize},
    dot: {
      width: metrics.dotSize,
      height: metrics.dotSize,
      borderRadius: metrics.dotSize / 2,
    },
    dotRow: {height: metrics.dotRowHeight},
    weekNumber: {width: metrics.weekNumberWidth},
    weekNumberText: {fontSize: metrics.weekdayFontSize},
  });
}

function CalendarContainer(
  props: CalendarProps,
  ref: React.Ref<CalendarRef>,
): ReactElement {
  const {
    value,
    defaultValue,
    onChange,
    month,
    defaultMonth,
    onMonthChange,
    mode: modeProp,
    defaultMode,
    onModeChange,
    collapseProgress,
    locale: localeProp,
    weekStart: weekStartProp,
    today: todayProp,
    fixedWeeks = true,
    markers = EMPTY_MARKERS,
    showDots = true,
    maxDotsPerDay = 3,
    showWeekNumbers = false,
    showOutsideDays = true,
    minDate,
    maxDate,
    disabledDates,
    isDateDisabled,
    showHeader = true,
    showNavigationButtons = true,
    showWeekdayRow = true,
    paging = 'swipe',
    monthsToShow = 1,
    size,
    maxFontSizeMultiplier = 1.6,
    colors,
    styles: stylesProp = EMPTY_STYLES,
    style,
    formatters: formattersProp,
    renderHeader,
    renderWeekdayLabel,
    renderDay,
    onDayLongPress,
    onDisabledDayPress,
    labels: labelsPropInput,
    accessibilityLabel,
    testID = 'calendar',
  } = props;

  const {theme, media} = useTheme();
  const {fontScale} = useWindowDimensions();
  const reduceMotion = useReduceMotion();

  const locale = useMemo(() => localeProp ?? resolveLocale(), [localeProp]);
  const weekStart = useMemo(
    () => weekStartProp ?? resolveWeekStart(locale),
    [locale, weekStartProp],
  );

  const todayNoon = useToday(todayProp);
  const todayKey = useMemo(() => toDayKey(todayNoon), [todayNoon]);

  // Value comparison, not identity, for the three props callers almost always
  // write as inline object literals. Without it `chrome` is rebuilt on every
  // parent render and all 42 day cells re-render — the exact regression the
  // memo test suite pins for `colors` but never checked for these.
  const labelsProp = useShallowStable(labelsPropInput);
  const styles = useShallowStable(stylesProp);
  const formattersInput = useShallowStable(formattersProp);

  const formatters = useMemo<CalendarFormatters>(
    () =>
      formattersInput
        ? Object.freeze({...DEFAULT_FORMATTERS, ...formattersInput})
        : DEFAULT_FORMATTERS,
    [formattersInput],
  );
  const formattersId = getFormattersId(formatters);

  const [mode, setModeState] = useControllable<CalendarViewMode>(
    modeProp,
    defaultMode ?? 'month',
  );

  // ── selection ───────────────────────────────────────────────────────────────
  const isValueControlled = value !== undefined;
  const [selectedKeyState, setSelectedKeyState] =
    useState<CalendarDateKey | null>(() =>
      defaultValue == null ? null : toDateKeyInput(defaultValue),
    );

  const selectedKey = isValueControlled
    ? value === null
      ? null
      : toDateKeyInput(value)
    : selectedKeyState;

  // ── paging ──────────────────────────────────────────────────────────────────
  const isMonthControlled = month !== undefined;
  const [pageKeyState, setPageKeyState] = useState<CalendarPageKey>(() =>
    normalizePageKey(
      defaultMonth ?? selectedKeyState ?? todayNoon,
      defaultMode ?? 'month',
      weekStartProp ?? resolveWeekStart(localeProp ?? resolveLocale()),
      monthsToShow,
    ),
  );

  const pageInput =
    month === undefined
      ? pageKeyState
      : typeof month === 'string'
        ? month
        : toDayKey(month);

  const pageKey = useMemo(
    () => normalizePageKey(pageInput, mode, weekStart, monthsToShow),
    [mode, monthsToShow, pageInput, weekStart],
  );

  const [focusedKey, setFocusedKey] = useState<CalendarDateKey | null>(null);

  // ── grids ───────────────────────────────────────────────────────────────────
  const gridFor = useCallback(
    (key: CalendarPageKey) =>
      getCalendarGrid({
        pageKey: key,
        mode,
        weekStart,
        fixedWeeks,
        showWeekNumbers,
        locale,
        formatters,
        formattersId,
      }),
    [
      fixedWeeks,
      formatters,
      formattersId,
      locale,
      mode,
      showWeekNumbers,
      weekStart,
    ],
  );

  const previousPageKey = useMemo(
    () => addPages(pageKey, -1, mode, weekStart, monthsToShow),
    [mode, monthsToShow, pageKey, weekStart],
  );
  const nextPageKey = useMemo(
    () => addPages(pageKey, 1, mode, weekStart, monthsToShow),
    [mode, monthsToShow, pageKey, weekStart],
  );

  const currentGrid = useMemo(() => gridFor(pageKey), [gridFor, pageKey]);

  // ── theming and geometry ────────────────────────────────────────────────────
  // Value comparison, not identity: `theme` and an inline `colors` object are both
  // rebuilt on every parent render, and a new palette would re-render every cell.
  const paletteRef = useRef<CalendarPalette | null>(null);
  const palette = useMemo(() => {
    const next = resolveCalendarPalette(theme, colors);
    const previous = paletteRef.current;

    if (previous && isSamePalette(previous, next)) {
      return previous;
    }

    paletteRef.current = next;

    return next;
  }, [colors, theme]);

  const resolvedSize =
    size ?? (media.isDesktop || media.isTablet ? 'expanded' : 'regular');

  const metrics = useMemo(
    () => resolveMetrics(resolvedSize, fontScale, maxFontSizeMultiplier),
    [fontScale, maxFontSizeMultiplier, resolvedSize],
  );

  const geometry = useMemo(() => buildGeometry(metrics), [metrics]);

  const labels = useMemo<Required<CalendarLabels>>(
    () =>
      labelsProp
        ? Object.freeze({...DEFAULT_LABELS, ...labelsProp})
        : DEFAULT_LABELS,
    [labelsProp],
  );

  // ── constraints ─────────────────────────────────────────────────────────────
  const {
    resolver: isDisabled,
    version: disabledVersion,
    minKey,
    maxKey,
  } = useDisabledState({minDate, maxDate, disabledDates, isDateDisabled});

  // ── latest-value refs, so no handler identity depends on a changing callback ─
  const callbacksRef = useRef({
    onChange,
    onMonthChange,
    onModeChange,
    onDayLongPress,
    onDisabledDayPress,
  });

  const stateRef = useRef({
    pageKey,
    mode,
    weekStart,
    monthsToShow,
    isMonthControlled,
    isValueControlled,
    isModeControlled: modeProp !== undefined,
  });

  useEffect(() => {
    callbacksRef.current = {
      onChange,
      onMonthChange,
      onModeChange,
      onDayLongPress,
      onDisabledDayPress,
    };
  }, [
    onChange,
    onDayLongPress,
    onDisabledDayPress,
    onModeChange,
    onMonthChange,
  ]);

  useEffect(() => {
    stateRef.current = {
      pageKey,
      mode,
      weekStart,
      monthsToShow,
      isMonthControlled,
      isValueControlled,
      isModeControlled: modeProp !== undefined,
    };
  }, [
    isMonthControlled,
    isValueControlled,
    mode,
    modeProp,
    monthsToShow,
    pageKey,
    weekStart,
  ]);

  const goToPage = useCallback(
    (nextKey: CalendarPageKey, source: CalendarChangeSource) => {
      const current = stateRef.current;

      if (!current.isMonthControlled) {
        setPageKeyState(nextKey);
      }

      const first = pageFirstDate(nextKey, current.mode, current.weekStart);

      callbacksRef.current.onMonthChange?.(
        new Date(first.getFullYear(), first.getMonth(), first.getDate()),
        nextKey,
        source,
      );
    },
    [],
  );

  const stepPage = useCallback(
    (delta: number, source: CalendarChangeSource) => {
      const current = stateRef.current;

      goToPage(
        addPages(
          current.pageKey,
          delta,
          current.mode,
          current.weekStart,
          current.monthsToShow,
        ),
        source,
      );
    },
    [goToPage],
  );

  const handleSwipeCommit = useCallback(
    (delta: number) => stepPage(delta, 'swipe'),
    [stepPage],
  );

  const focusKey = useCallback(
    (key: CalendarDateKey, source: CalendarChangeSource) => {
      setFocusedKey(key);

      const current = stateRef.current;
      const targetPage = normalizePageKey(
        key,
        current.mode,
        current.weekStart,
        current.monthsToShow,
      );

      if (targetPage !== current.pageKey) {
        goToPage(targetPage, source);
      }
    },
    [goToPage],
  );

  const selectKey = useCallback(
    (key: CalendarDateKey, source: CalendarChangeSource) => {
      const current = stateRef.current;

      if (!current.isValueControlled) {
        setSelectedKeyState(key);
      }

      setFocusedKey(key);

      const date = new Date(
        +key.slice(0, 4),
        +key.slice(5, 7) - 1,
        +key.slice(8, 10),
      );

      callbacksRef.current.onChange?.(date, key, source);
    },
    [],
  );

  // ── stable cell callbacks. No inline arrow ever reaches a day cell ───────────
  const handleDayPress = useCallback(
    (key: CalendarDateKey) => selectKey(key, 'press'),
    [selectKey],
  );

  const handleDayLongPress = useCallback((key: CalendarDateKey) => {
    callbacksRef.current.onDayLongPress?.(
      new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)),
      key,
    );
  }, []);

  const handleDisabledDayPress = useCallback((key: CalendarDateKey) => {
    callbacksRef.current.onDisabledDayPress?.(
      new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)),
      key,
    );
  }, []);

  const chrome = useMemo<CalendarChrome>(
    () =>
      Object.freeze({
        palette,
        metrics,
        geometry,
        showDots,
        maxDots:
          fontScale > SINGLE_DOT_FONT_SCALE_LIMIT
            ? 1
            : Math.max(maxDotsPerDay, 0),
        showBadges: fontScale <= BADGE_FONT_SCALE_LIMIT,
        maxFontSizeMultiplier,
        fontScale,
        labels,
        styles,
        renderDay,
        onPress: handleDayPress,
        onLongPress: onDayLongPress ? handleDayLongPress : undefined,
        onDisabledPress: onDisabledDayPress
          ? handleDisabledDayPress
          : undefined,
      }),
    [
      fontScale,
      geometry,
      handleDayLongPress,
      handleDayPress,
      handleDisabledDayPress,
      labels,
      maxDotsPerDay,
      maxFontSizeMultiplier,
      metrics,
      onDayLongPress,
      onDisabledDayPress,
      palette,
      renderDay,
      showDots,
      styles,
    ],
  );

  // ── collapse ────────────────────────────────────────────────────────────────
  const internalCollapse = useSharedValue(mode === 'week' ? 1 : 0);
  const collapse = collapseProgress ?? internalCollapse;
  const activeRow = useSharedValue(0);

  const anchorKey =
    selectedKey &&
    selectedKey >= currentGrid.firstKey &&
    selectedKey <= currentGrid.lastKey
      ? selectedKey
      : todayKey >= currentGrid.firstKey && todayKey <= currentGrid.lastKey
        ? todayKey
        : currentGrid.firstKey;

  const activeRowIndex = useMemo(() => {
    for (let i = 0; i < currentGrid.days.length; i++) {
      if (currentGrid.days[i].key === anchorKey) {
        return (i / 7) | 0;
      }
    }

    return 0;
  }, [anchorKey, currentGrid]);

  useEffect(() => {
    activeRow.value = mode === 'week' ? 0 : activeRowIndex;
  }, [activeRow, activeRowIndex, mode]);

  useEffect(() => {
    if (collapseProgress) {
      return;
    }

    internalCollapse.value = withTiming(mode === 'week' ? 1 : 0, {
      duration: reduceMotion ? 0 : COLLAPSE_DURATION,
    });
  }, [collapseProgress, internalCollapse, mode, reduceMotion]);

  const commitMode = useCallback(
    (nextMode: CalendarViewMode) => {
      if (stateRef.current.mode === nextMode) {
        return;
      }

      setModeState(nextMode);
      callbacksRef.current.onModeChange?.(nextMode);
    },
    [setModeState],
  );

  useAnimatedReaction(
    () => collapse.value,
    (progress, previous) => {
      if (previous === null) {
        return;
      }

      if (progress >= 0.999 && previous < 0.999) {
        runOnJS(commitMode)('week');
      } else if (progress <= 0.001 && previous > 0.001) {
        runOnJS(commitMode)('month');
      }
    },
    [collapse, commitMode],
  );

  // ── derived chrome values ───────────────────────────────────────────────────
  const weekdayLabels = useMemo(() => {
    const anchor = startOfWeek(WEEKDAY_LABEL_ANCHOR, weekStart);

    return Object.freeze(
      Array.from({length: 7}, (_, index) =>
        formatters.weekdayLabel(addDays(anchor, index), locale),
      ),
    );
  }, [formatters, locale, weekStart]);

  const headerDate = useMemo(
    () => pageFirstDate(pageKey, mode, weekStart),
    [mode, pageKey, weekStart],
  );

  const title = useMemo(() => {
    if (mode === 'week') {
      return formatters.weekTitle(headerDate, addDays(headerDate, 6), locale);
    }

    if (monthsToShow > 1) {
      const secondMonth = pageFirstDate(nextPageKey, mode, weekStart);

      return `${formatters.monthTitle(headerDate, locale)} – ${formatters.monthTitle(
        addDays(secondMonth, -1),
        locale,
      )}`;
    }

    return formatters.monthTitle(headerDate, locale);
  }, [
    formatters,
    headerDate,
    locale,
    mode,
    monthsToShow,
    nextPageKey,
    weekStart,
  ]);

  // Compared against each neighbouring page's own month/week range, not against the
  // padded grid, so a min date on the 1st really does disable the previous button.
  const canGoPrevious =
    minKey === null ||
    toDayKey(pageLastDate(previousPageKey, mode, weekStart, monthsToShow)) >=
      minKey;
  const canGoNext =
    maxKey === null ||
    toDayKey(pageFirstDate(nextPageKey, mode, weekStart)) <= maxKey;

  const goPrevious = useCallback(() => stepPage(-1, 'button'), [stepPage]);
  const goNext = useCallback(() => stepPage(1, 'button'), [stepPage]);

  const headerContext = useMemo(
    () => ({
      title,
      date: headerDate,
      mode,
      canGoPrevious,
      canGoNext,
      goPrevious,
      goNext,
    }),
    [canGoNext, canGoPrevious, goNext, goPrevious, headerDate, mode, title],
  );

  const announcedTitle = useRef<string | null>(null);

  useEffect(() => {
    if (announcedTitle.current === null) {
      announcedTitle.current = title;

      return;
    }

    if (announcedTitle.current === title) {
      return;
    }

    announcedTitle.current = title;
    AccessibilityInfo.announceForAccessibility(labels.pageAnnouncement(title));
  }, [labels, title]);

  // ── roving focus target ─────────────────────────────────────────────────────
  const tabbableKey = useMemo<CalendarDateKey>(() => {
    const inPage = (key: CalendarDateKey): boolean =>
      key >= currentGrid.firstKey && key <= currentGrid.lastKey;

    if (focusedKey !== null && inPage(focusedKey)) {
      return focusedKey;
    }

    if (selectedKey !== null && inPage(selectedKey)) {
      return selectedKey;
    }

    if (inPage(todayKey)) {
      return todayKey;
    }

    for (const day of currentGrid.days) {
      if (!day.isOutside) {
        return day.key;
      }
    }

    return currentGrid.firstKey;
  }, [currentGrid, focusedKey, selectedKey, todayKey]);

  const handleKeyDown = useCallback(
    (event: KeyboardEventLike) => {
      const action = resolveKeyboardAction({
        key: event.key,
        shiftKey: event.shiftKey === true,
        focusedKey: tabbableKey,
        weekStart: stateRef.current.weekStart,
        isRTL: I18nManager.isRTL,
        mode: stateRef.current.mode,
      });

      if (!action) {
        return;
      }

      event.preventDefault?.();

      if (action.type === 'select') {
        selectKey(tabbableKey, 'keyboard');

        return;
      }

      focusKey(action.key, 'keyboard');
    },
    [focusKey, selectKey, tabbableKey],
  );

  // ── imperative API ──────────────────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      goToMonth: (target) => {
        const current = stateRef.current;

        goToPage(
          normalizePageKey(
            target,
            current.mode,
            current.weekStart,
            current.monthsToShow,
          ),
          'imperative',
        );
      },
      goToToday: () => {
        const current = stateRef.current;

        goToPage(
          normalizePageKey(
            todayKey,
            current.mode,
            current.weekStart,
            current.monthsToShow,
          ),
          'imperative',
        );
      },
      next: () => stepPage(1, 'imperative'),
      previous: () => stepPage(-1, 'imperative'),
      setMode: (nextMode) => commitMode(nextMode),
      focusDay: (key) => focusKey(key, 'imperative'),
    }),
    [commitMode, focusKey, goToPage, stepPage, todayKey],
  );

  // ── page rendering ──────────────────────────────────────────────────────────
  const rowCount = mode === 'week' ? 1 : currentGrid.rowCount;
  const collapsible = mode === 'week' || (monthsToShow === 1 && rowCount > 1);

  const renderGrid = useCallback(
    (gridPageKey: CalendarPageKey, gridTestID: string): ReactNode => {
      const grid = gridFor(gridPageKey);

      return (
        <CalendarPage
          activeRow={activeRow}
          chrome={chrome}
          collapse={collapse}
          collapsible={collapsible}
          disabledVersion={disabledVersion}
          grid={grid}
          isDisabled={isDisabled}
          markers={markers}
          selectedKey={selectedKey}
          showOutsideDays={showOutsideDays}
          showWeekNumbers={showWeekNumbers}
          tabbableKey={tabbableKey}
          testID={gridTestID}
          todayKey={todayKey}
        />
      );
    },
    [
      activeRow,
      chrome,
      collapse,
      collapsible,
      disabledVersion,
      gridFor,
      isDisabled,
      markers,
      selectedKey,
      showOutsideDays,
      showWeekNumbers,
      tabbableKey,
      todayKey,
    ],
  );

  const renderSlot = useCallback(
    (slotPageKey: CalendarPageKey): ReactNode => {
      if (monthsToShow === 1) {
        return renderGrid(slotPageKey, `calendar-page-${slotPageKey}`);
      }

      const monthKeys: CalendarPageKey[] = [slotPageKey];

      for (let index = 1; index < monthsToShow; index++) {
        monthKeys.push(addPages(slotPageKey, index, mode, weekStart, 1));
      }

      return (
        <View style={TWO_UP_ROW}>
          {monthKeys.map((monthKey) => (
            <View key={monthKey} style={COLUMN}>
              {renderGrid(monthKey, `calendar-page-${monthKey}`)}
            </View>
          ))}
        </View>
      );
    },
    [mode, monthsToShow, renderGrid, weekStart],
  );

  const slots = useMemo<readonly CalendarPagerSlot[]>(() => {
    if (paging === 'none') {
      return [{key: pageKey, offset: 0, node: renderSlot(pageKey)}];
    }

    return [
      {key: previousPageKey, offset: -1, node: renderSlot(previousPageKey)},
      {key: pageKey, offset: 0, node: renderSlot(pageKey)},
      {key: nextPageKey, offset: 1, node: renderSlot(nextPageKey)},
    ];
  }, [nextPageKey, pageKey, paging, previousPageKey, renderSlot]);

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: palette.background,
      maxWidth: metrics.cellSize * 7 * 1.6 * monthsToShow,
    }),
    [metrics.cellSize, monthsToShow, palette.background],
  );

  const weekdayRow = showWeekdayRow ? (
    <View style={monthsToShow > 1 ? TWO_UP_ROW : undefined}>
      {Array.from({length: monthsToShow}, (_, index) => (
        <View key={`weekday-row-${index}`} style={COLUMN}>
          <CalendarWeekdayRow
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            metrics={metrics}
            palette={palette}
            renderWeekdayLabel={renderWeekdayLabel}
            showWeekNumbers={showWeekNumbers}
            styles={styles}
            weekStart={weekStart}
            weekdayLabels={weekdayLabels}
          />
        </View>
      ))}
    </View>
  ) : null;

  return (
    <KeyboardView
      accessibilityLabel={accessibilityLabel ?? title}
      onKeyDown={handleKeyDown}
      style={[CONTAINER, containerStyle, styles.container, style]}
      testID={testID}
    >
      {showHeader ? (
        <CalendarHeader
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          headerContext={headerContext}
          labels={labels}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          metrics={metrics}
          mode={mode}
          onNext={goNext}
          onPrevious={goPrevious}
          palette={palette}
          renderHeader={renderHeader}
          showNavigationButtons={showNavigationButtons}
          styles={styles}
          title={title}
        />
      ) : null}

      {weekdayRow}

      <CalendarPager
        activeRow={activeRow}
        collapse={collapse}
        onCommit={handleSwipeCommit}
        reduceMotion={reduceMotion}
        rowCount={rowCount}
        rowHeight={metrics.rowHeight}
        slots={slots}
        swipeEnabled={paging === 'swipe'}
        testID="calendar-pager"
      />
    </KeyboardView>
  );
}

export const Calendar = React.memo(forwardRef(CalendarContainer));

export default Calendar;

export * from './types';
