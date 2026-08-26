import React, {type ReactElement, type ReactNode} from 'react';
import {Text, View} from 'react-native';
import {css} from 'kstyled';

import {Icon} from '../Icon/Icon';
import {IconButton} from '../IconButton/IconButton';
import type {
  CalendarHeaderContext,
  CalendarLabels,
  CalendarMetrics,
  CalendarPalette,
  CalendarStyles,
  CalendarViewMode,
} from './types';

const HEADER = css`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const TITLE = css`
  flex: 1;
  text-align: center;
  font-weight: 600;
`;

const NAV_BUTTON = css`
  background-color: transparent;
  border-color: transparent;
  padding: 4px;
`;

const SPACER = css`
  width: 40px;
`;

export type CalendarHeaderProps = {
  title: string;
  mode: CalendarViewMode;
  palette: CalendarPalette;
  metrics: CalendarMetrics;
  labels: Required<CalendarLabels>;
  styles: CalendarStyles;
  maxFontSizeMultiplier: number;
  showNavigationButtons: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  renderHeader?: (ctx: CalendarHeaderContext) => ReactNode;
  headerContext: CalendarHeaderContext;
};

function CalendarHeaderContainer({
  title,
  mode,
  palette,
  metrics,
  labels,
  styles,
  maxFontSizeMultiplier,
  showNavigationButtons,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  renderHeader,
  headerContext,
}: CalendarHeaderProps): ReactElement {
  if (renderHeader) {
    return <View testID="calendar-header">{renderHeader(headerContext)}</View>;
  }

  const iconSize = Math.round(metrics.headerFontSize * 1.1);
  const previousLabel =
    mode === 'week' ? labels.previousWeek : labels.previousMonth;
  const nextLabel = mode === 'week' ? labels.nextWeek : labels.nextMonth;

  return (
    <View
      style={[HEADER, {height: metrics.headerHeight}, styles.header]}
      testID="calendar-header"
    >
      {showNavigationButtons ? (
        <IconButton
          accessibilityLabel={previousLabel}
          disabled={!canGoPrevious}
          iconElement={
            <Icon color={palette.navIcon} name="CaretLeft" size={iconSize} />
          }
          onPress={onPrevious}
          size={iconSize}
          styles={{container: NAV_BUTTON, disabled: NAV_BUTTON}}
          testID="calendar-prev"
          type="text"
        />
      ) : (
        <View style={SPACER} />
      )}

      <Text
        accessibilityLiveRegion="polite"
        accessibilityRole="header"
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        numberOfLines={1}
        style={[
          TITLE,
          {color: palette.headerText, fontSize: metrics.headerFontSize},
          styles.headerTitle,
        ]}
        testID="calendar-header-title"
      >
        {title}
      </Text>

      {showNavigationButtons ? (
        <IconButton
          accessibilityLabel={nextLabel}
          disabled={!canGoNext}
          iconElement={
            <Icon color={palette.navIcon} name="CaretRight" size={iconSize} />
          }
          onPress={onNext}
          size={iconSize}
          styles={{container: NAV_BUTTON, disabled: NAV_BUTTON}}
          testID="calendar-next"
          type="text"
        />
      ) : (
        <View style={SPACER} />
      )}
    </View>
  );
}

export const CalendarHeader = React.memo(CalendarHeaderContainer);

export default CalendarHeader;
