import React, {type ReactElement, type ReactNode} from 'react';
import {Platform, Text, View} from 'react-native';
import {css} from 'kstyled';

import type {
  CalendarMetrics,
  CalendarPalette,
  CalendarStyles,
  CalendarWeekday,
  WeekStart,
} from './types';

const ROW = css`
  flex-direction: row;
  align-items: center;
`;

const LABEL_CELL = css`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LABEL_TEXT = css`
  text-align: center;
  font-weight: 500;
`;

const WEEK_NUMBER_SPACER = css`
  align-items: center;
  justify-content: center;
`;

export type CalendarWeekdayRowProps = {
  /** Seven precomputed labels, already rotated to start at `weekStart`. */
  weekdayLabels: readonly string[];
  weekStart: WeekStart;
  palette: CalendarPalette;
  metrics: CalendarMetrics;
  styles: CalendarStyles;
  maxFontSizeMultiplier: number;
  showWeekNumbers: boolean;
  renderWeekdayLabel?: (ctx: {
    weekday: CalendarWeekday;
    label: string;
  }) => ReactNode;
};

/**
 * Hidden from assistive tech: every day cell already announces its weekday, so
 * reading "S M T W T F S" before the grid is pure noise. Web keeps the semantics.
 */
function CalendarWeekdayRowContainer({
  weekdayLabels,
  weekStart,
  palette,
  metrics,
  styles,
  maxFontSizeMultiplier,
  showWeekNumbers,
  renderWeekdayLabel,
}: CalendarWeekdayRowProps): ReactElement {
  const isWeb = Platform.OS === 'web';

  return (
    <View
      accessibilityElementsHidden={!isWeb}
      importantForAccessibility={isWeb ? 'auto' : 'no-hide-descendants'}
      role={isWeb ? 'row' : undefined}
      style={[ROW, {height: metrics.weekdayRowHeight}, styles.weekdayRow]}
      testID="calendar-weekday-row"
    >
      {showWeekNumbers ? (
        <View style={[WEEK_NUMBER_SPACER, {width: metrics.weekNumberWidth}]} />
      ) : null}

      {weekdayLabels.map((label, index) => {
        const weekday = (((weekStart + index) % 7) + 7) % 7;

        return (
          <View
            key={`calendar-weekday-${index}`}
            role={isWeb ? 'columnheader' : undefined}
            style={LABEL_CELL}
            testID={`calendar-weekday-${index}`}
          >
            {renderWeekdayLabel ? (
              renderWeekdayLabel({weekday: weekday as CalendarWeekday, label})
            ) : (
              <Text
                maxFontSizeMultiplier={maxFontSizeMultiplier}
                numberOfLines={1}
                style={[
                  LABEL_TEXT,
                  {
                    color:
                      weekday === 0
                        ? palette.sundayText
                        : weekday === 6
                          ? palette.saturdayText
                          : palette.weekdayLabel,
                    fontSize: metrics.weekdayFontSize,
                  },
                  styles.weekdayLabel,
                ]}
              >
                {label}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export const CalendarWeekdayRow = React.memo(CalendarWeekdayRowContainer);

export default CalendarWeekdayRow;
