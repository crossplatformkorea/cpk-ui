import React, {useCallback, useMemo, type ReactElement} from 'react';
import type {TextStyle, ViewStyle} from 'react-native';
import {Platform, Pressable, Text, View} from 'react-native';
import {css} from 'kstyled';

import type {
  CalendarChrome,
  CalendarDayModel,
  CalendarMarker,
  CalendarPalette,
} from './types';
import {isSameMarker} from './utils';

const CELL = css`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  border-radius: 10px;
`;

const PILL = css`
  align-items: center;
  justify-content: center;
`;

const DAY_TEXT = css`
  text-align: center;
  font-weight: 500;
`;

const DECORATIONS = css`
  position: absolute;
  bottom: 0;
  start: 0;
  end: 0;
  align-items: center;
  justify-content: flex-end;
`;

const DOT_ROW = css`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const BADGE_TEXT = css`
  text-align: center;
`;

export type CalendarDayProps = {
  day: CalendarDayModel;
  /** Precomputed by the grid builder. A cell never formats a date itself. */
  dayLabel: string;
  accessibilityLabel: string;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  /** Roving tab index: exactly one cell per page is tabbable. */
  isTabbable: boolean;
  /** Inert spacer for an out of month day when `showOutsideDays` is false. */
  isHidden: boolean;
  marker?: CalendarMarker;
  chrome: CalendarChrome;
};

function resolveTextColor(args: {
  palette: CalendarPalette;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  isOutside: boolean;
  weekday: number;
  markerTextColor?: string;
}): string {
  const {
    palette,
    isSelected,
    isDisabled,
    isToday,
    isOutside,
    weekday,
    markerTextColor,
  } = args;

  if (isSelected) {
    return palette.selectedText;
  }

  if (isDisabled) {
    return palette.disabledText;
  }

  if (isOutside) {
    return palette.outsideText;
  }

  if (markerTextColor) {
    return markerTextColor;
  }

  if (isToday) {
    return palette.todayText;
  }

  if (weekday === 0) {
    return palette.sundayText;
  }

  if (weekday === 6) {
    return palette.saturdayText;
  }

  return palette.dayText;
}

function CalendarDayContainer(props: CalendarDayProps): ReactElement {
  const {
    day,
    dayLabel,
    accessibilityLabel,
    isSelected,
    isToday,
    isDisabled,
    isTabbable,
    isHidden,
    marker,
    chrome,
  } = props;

  const {palette, metrics, geometry, styles} = chrome;

  const pillStyle = useMemo<ViewStyle | null>(() => {
    if (isSelected) {
      return {
        backgroundColor: marker?.selectedColor ?? palette.selectedBackground,
      };
    }

    if (isToday) {
      return {borderWidth: 1.5, borderColor: palette.todayRing};
    }

    return null;
  }, [isSelected, isToday, marker?.selectedColor, palette]);

  const textStyle = useMemo<TextStyle>(
    () => ({
      color: resolveTextColor({
        palette,
        isSelected,
        isDisabled,
        isToday,
        isOutside: day.isOutside,
        weekday: day.weekday,
        markerTextColor: marker?.textColor,
      }),
      opacity: isDisabled ? 0.55 : 1,
    }),
    [
      day.isOutside,
      day.weekday,
      isDisabled,
      isSelected,
      isToday,
      marker?.textColor,
      palette,
    ],
  );

  const handlePress = useCallback(() => {
    if (isDisabled) {
      chrome.onDisabledPress?.(day.key);

      return;
    }

    chrome.onPress(day.key);
  }, [chrome, day.key, isDisabled]);

  const handleLongPress = useCallback(() => {
    if (isDisabled) {
      return;
    }

    chrome.onLongPress?.(day.key);
  }, [chrome, day.key, isDisabled]);

  const cellStyle = useCallback(
    ({pressed}: {pressed: boolean}) =>
      pressed && !isDisabled
        ? [
            CELL,
            geometry.cell,
            {backgroundColor: palette.underlay},
            styles.dayCell,
            isSelected ? styles.selectedDayCell : null,
            isToday ? styles.todayDayCell : null,
          ]
        : [
            CELL,
            geometry.cell,
            styles.dayCell,
            isSelected ? styles.selectedDayCell : null,
            isToday ? styles.todayDayCell : null,
          ],
    [geometry.cell, isDisabled, isSelected, isToday, palette.underlay, styles],
  );

  if (isHidden) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[CELL, geometry.cell]}
        testID={`calendar-day-${day.key}-spacer`}
      />
    );
  }

  const dots =
    chrome.showDots && marker?.dots?.length
      ? marker.dots.slice(0, chrome.maxDots)
      : null;

  const badgeText =
    chrome.showBadges && marker?.badgeText ? marker.badgeText : null;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, selected: isSelected}}
      aria-disabled={isDisabled}
      aria-selected={isSelected}
      onLongPress={chrome.onLongPress ? handleLongPress : undefined}
      onPress={handlePress}
      style={cellStyle}
      tabIndex={isTabbable ? 0 : -1}
      testID={`calendar-day-${day.key}`}
    >
      {chrome.renderDay ? (
        chrome.renderDay({
          day,
          isSelected,
          isToday,
          isDisabled,
          marker,
          palette,
          cellSize: metrics.cellSize,
        })
      ) : (
        <>
          <View style={[PILL, geometry.pill, pillStyle]}>
            <Text
              adjustsFontSizeToFit={Platform.OS === 'ios'}
              maxFontSizeMultiplier={chrome.maxFontSizeMultiplier}
              minimumFontScale={0.8}
              numberOfLines={1}
              style={[
                DAY_TEXT,
                geometry.dayText,
                textStyle,
                styles.dayText,
                day.isOutside ? styles.outsideDayText : null,
                isDisabled ? styles.disabledDayText : null,
                isSelected ? styles.selectedDayText : null,
                isToday ? styles.todayDayText : null,
              ]}
            >
              {dayLabel}
            </Text>
          </View>

          {dots || badgeText ? (
            <View
              importantForAccessibility="no"
              pointerEvents="none"
              style={DECORATIONS}
            >
              {dots ? (
                <View style={[DOT_ROW, geometry.dotRow, styles.dotRow]}>
                  {dots.map((dot) => (
                    <View
                      key={dot.key}
                      style={[
                        geometry.dot,
                        {backgroundColor: dot.color ?? palette.dot},
                        styles.dot,
                      ]}
                    />
                  ))}
                </View>
              ) : null}
              {badgeText ? (
                <Text
                  maxFontSizeMultiplier={chrome.maxFontSizeMultiplier}
                  numberOfLines={1}
                  style={[
                    BADGE_TEXT,
                    geometry.badgeText,
                    {color: marker?.badgeColor ?? palette.badgeText},
                    styles.badgeText,
                  ]}
                >
                  {badgeText}
                </Text>
              ) : null}
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const areDaysEqual = (a: CalendarDayProps, b: CalendarDayProps): boolean =>
  a.day === b.day &&
  a.dayLabel === b.dayLabel &&
  a.isSelected === b.isSelected &&
  a.isToday === b.isToday &&
  a.isDisabled === b.isDisabled &&
  a.isTabbable === b.isTabbable &&
  a.isHidden === b.isHidden &&
  a.chrome === b.chrome &&
  a.accessibilityLabel === b.accessibilityLabel &&
  isSameMarker(a.marker, b.marker);

export const CalendarDay = React.memo(CalendarDayContainer, areDaysEqual);

export default CalendarDay;
