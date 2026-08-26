import React, {type ReactElement, type ReactNode} from 'react';
import {View} from 'react-native';
import {css} from 'kstyled';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import {CalendarWeekRow} from './CalendarWeekRow';
import type {
  CalendarChrome,
  CalendarCollapseProgress,
  CalendarDateKey,
  CalendarDisabledResolver,
  CalendarMarkerMap,
} from './types';
import type {CalendarGrid} from './utils';

const GRID = css`
  align-self: stretch;
`;

const COLLAPSE_FADE_END = 0.6;

type CollapsingRowProps = {
  weekIndex: number;
  collapse: CalendarCollapseProgress;
  activeRow: CalendarCollapseProgress;
  children: ReactNode;
};

/**
 * The week view is the month grid, clipped. Only this opacity and the frame
 * transform move while the calendar collapses, so the transition costs zero
 * React renders and zero remounts.
 */
function CollapsingRow({
  weekIndex,
  collapse,
  activeRow,
  children,
}: CollapsingRowProps): ReactElement {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = collapse.value;

    if (progress <= 0 || weekIndex === activeRow.value) {
      return {opacity: 1};
    }

    const faded = progress / COLLAPSE_FADE_END;

    return {opacity: 1 - (faded > 1 ? 1 : faded)};
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export type CalendarPageProps = {
  grid: CalendarGrid;
  markers: CalendarMarkerMap;
  chrome: CalendarChrome;
  selectedKey: CalendarDateKey | null;
  todayKey: CalendarDateKey;
  tabbableKey: CalendarDateKey | null;
  isDisabled: CalendarDisabledResolver;
  disabledVersion: number;
  showOutsideDays: boolean;
  showWeekNumbers: boolean;
  collapse: CalendarCollapseProgress;
  activeRow: CalendarCollapseProgress;
  /** Disables the collapse wrappers entirely when the page can never collapse. */
  collapsible: boolean;
  testID?: string;
};

function CalendarPageContainer({
  grid,
  markers,
  chrome,
  selectedKey,
  todayKey,
  tabbableKey,
  isDisabled,
  disabledVersion,
  showOutsideDays,
  showWeekNumbers,
  collapse,
  activeRow,
  collapsible,
  testID,
}: CalendarPageProps): ReactElement {
  return (
    <View style={GRID} testID={testID}>
      {grid.rows.map((row) => {
        const weekRow = (
          <CalendarWeekRow
            chrome={chrome}
            disabledVersion={disabledVersion}
            isDisabled={isDisabled}
            markers={markers}
            row={row}
            selectedKey={selectedKey}
            showOutsideDays={showOutsideDays}
            showWeekNumbers={showWeekNumbers}
            tabbableKey={tabbableKey}
            todayKey={todayKey}
          />
        );

        return collapsible ? (
          <CollapsingRow
            activeRow={activeRow}
            collapse={collapse}
            key={row.days[0].key}
            weekIndex={row.weekIndex}
          >
            {weekRow}
          </CollapsingRow>
        ) : (
          <View key={row.days[0].key}>{weekRow}</View>
        );
      })}
    </View>
  );
}

export const CalendarPage = React.memo(CalendarPageContainer);

/** One mounted pager slot. `offset` is -1 (previous), 0 (current) or 1 (next). */
export type CalendarPagerSlot = {
  key: string;
  offset: number;
  node: ReactNode;
};

/**
 * Shared by `CalendarPager.tsx` (gesture driven) and `CalendarPager.web.tsx`
 * (scroll snap). Declared here so neither implementation has to import the other.
 */
export type CalendarPagerProps = {
  slots: readonly CalendarPagerSlot[];
  rowCount: number;
  rowHeight: number;
  collapse: CalendarCollapseProgress;
  activeRow: CalendarCollapseProgress;
  swipeEnabled: boolean;
  reduceMotion: boolean;
  /** `delta` is +1 for the next page, -1 for the previous one. */
  onCommit: (delta: number) => void;
  testID?: string;
};

export default CalendarPage;
