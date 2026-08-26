import React, {type ReactElement} from 'react';
import {Text, View} from 'react-native';
import {css} from 'kstyled';

import {CalendarDay} from './CalendarDay';
import type {
  CalendarChrome,
  CalendarDateKey,
  CalendarDisabledResolver,
  CalendarMarkerMap,
} from './types';
import type {CalendarGridRow} from './utils';
import {rowHasKey} from './utils';

const ROW = css`
  flex-direction: row;
  align-items: stretch;
`;

const WEEK_NUMBER = css`
  align-items: center;
  justify-content: center;
`;

const WEEK_NUMBER_TEXT = css`
  text-align: center;
`;

export type CalendarWeekRowProps = {
  row: CalendarGridRow;
  markers: CalendarMarkerMap;
  chrome: CalendarChrome;
  selectedKey: CalendarDateKey | null;
  todayKey: CalendarDateKey;
  tabbableKey: CalendarDateKey | null;
  isDisabled: CalendarDisabledResolver;
  /** Bumped whenever min/max/disabledDates/predicate identity changes. */
  disabledVersion: number;
  showOutsideDays: boolean;
  showWeekNumbers: boolean;
};

function CalendarWeekRowContainer({
  row,
  markers,
  chrome,
  selectedKey,
  todayKey,
  tabbableKey,
  isDisabled,
  showOutsideDays,
  showWeekNumbers,
}: CalendarWeekRowProps): ReactElement {
  const {labels, geometry, palette} = chrome;
  const cells: ReactElement[] = [];

  for (let index = 0; index < row.days.length; index++) {
    const day = row.days[index];
    const marker = markers[day.key];
    const isToday = day.key === todayKey;
    const isSelected = day.key === selectedKey;
    const disabled = isDisabled(day, marker);

    let accessibilityLabel = row.a11yLabels[index];

    if (isToday) {
      accessibilityLabel = `${accessibilityLabel}, ${labels.today}`;
    }

    if (marker?.accessibilityHint) {
      accessibilityLabel = `${accessibilityLabel}, ${marker.accessibilityHint}`;
    }

    cells.push(
      <CalendarDay
        accessibilityLabel={accessibilityLabel}
        chrome={chrome}
        day={day}
        dayLabel={row.dayLabels[index]}
        isDisabled={disabled}
        isHidden={day.isOutside && !showOutsideDays}
        isSelected={isSelected}
        isTabbable={day.key === tabbableKey}
        isToday={isToday}
        key={day.key}
        marker={marker}
      />,
    );
  }

  return (
    <View
      accessibilityRole="none"
      style={[ROW, geometry.row, chrome.styles.weekRow]}
      testID={`calendar-week-${row.days[0].key}`}
    >
      {showWeekNumbers ? (
        <View
          accessibilityLabel={`${labels.weekNumber} ${row.weekNumber}`}
          style={[WEEK_NUMBER, geometry.weekNumber]}
        >
          <Text
            maxFontSizeMultiplier={chrome.maxFontSizeMultiplier}
            numberOfLines={1}
            style={[
              WEEK_NUMBER_TEXT,
              geometry.weekNumberText,
              {color: palette.weekNumberLabel},
            ]}
          >
            {row.weekNumber}
          </Text>
        </View>
      ) : null}
      {cells}
    </View>
  );
}

/**
 * `prev`/`next` are compared for presence in this row first. A selection moving
 * inside one row re-renders that row only, moving across a boundary re-renders two.
 */
const hasSameKeyPresence = (
  row: CalendarGridRow,
  prev: CalendarDateKey | null,
  next: CalendarDateKey | null,
): boolean => {
  const inPrev = rowHasKey(row.days, prev);
  const inNext = rowHasKey(row.days, next);

  if (inPrev !== inNext) {
    return false;
  }

  return !inNext || prev === next;
};

const areRowsEqual = (
  a: CalendarWeekRowProps,
  b: CalendarWeekRowProps,
): boolean =>
  a.row === b.row &&
  a.chrome === b.chrome &&
  a.markers === b.markers &&
  a.disabledVersion === b.disabledVersion &&
  a.showOutsideDays === b.showOutsideDays &&
  a.showWeekNumbers === b.showWeekNumbers &&
  hasSameKeyPresence(a.row, a.selectedKey, b.selectedKey) &&
  hasSameKeyPresence(a.row, a.todayKey, b.todayKey) &&
  hasSameKeyPresence(a.row, a.tabbableKey, b.tabbableKey);

export const CalendarWeekRow = React.memo(
  CalendarWeekRowContainer,
  areRowsEqual,
);

export default CalendarWeekRow;
