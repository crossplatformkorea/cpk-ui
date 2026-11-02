import React, {type ReactElement, type ReactNode} from 'react';
import {fireEvent, render, within} from '@testing-library/react-native';
import {StyleSheet} from 'react-native';
import {createComponent} from '../../../../test/testUtils';
import {Calendar} from './Calendar';

const mockPlayed: ReactElement[] = [];

// Records which rendered copy of a date plays its feedback.
jest.mock('../SelectionFeedback/SelectionFeedback', () => {
  const {forwardRef, useImperativeHandle} =
    jest.requireActual<typeof import('react')>('react');
  return {
    SELECTION_FEEDBACK_PEAK_SCALE: 1.12,
    SelectionFeedback: forwardRef<{play: () => void}, {children: ReactNode}>(
      function SelectionFeedback({children}, ref) {
        useImperativeHandle(ref, () => ({
          play: () => mockPlayed.push(children as ReactElement),
        }));
        return children;
      },
    ),
  };
});

const OUTSIDE_OPACITY = 0.123;
const isOutsideCopy = (pill: ReactElement): boolean => {
  const text = (pill.props as {children: ReactElement}).children;
  return (
    StyleSheet.flatten((text.props as {style: unknown}).style as never)
      ?.opacity === OUTSIDE_OPACITY
  );
};

describe('Calendar two-up selection motion', () => {
  beforeEach(() => {
    mockPlayed.length = 0;
  });

  it.each(['2026-09', '2026-10'] as const)(
    'plays a boundary date on its in-month copy when pressed from %s',
    (pressedPage) => {
      const screen = render(
        createComponent(
          <Calendar
            defaultMonth="2026-10"
            monthsToShow={2}
            paging="none"
            selectionAnimation
            styles={{outsideDayText: {opacity: OUTSIDE_OPACITY}}}
            today={new Date(2026, 9, 15, 12)}
            weekStart={0}
          />,
        ),
      );
      const page = within(screen.getByTestId(`calendar-page-${pressedPage}`));

      fireEvent.press(page.getByTestId('calendar-day-2026-10-01'));

      expect(mockPlayed).toHaveLength(1);
      expect(isOutsideCopy(mockPlayed[0]!)).toBe(false);
    },
  );

  it('plays the outside copy when its own month is off screen', () => {
    const screen = render(
      createComponent(
        <Calendar
          defaultMonth="2026-10"
          monthsToShow={2}
          paging="none"
          selectionAnimation
          styles={{outsideDayText: {opacity: OUTSIDE_OPACITY}}}
          today={new Date(2026, 9, 15, 12)}
          weekStart={0}
        />,
      ),
    );

    fireEvent.press(screen.getByTestId('calendar-day-2026-11-01'));

    expect(mockPlayed).toHaveLength(1);
    expect(isOutsideCopy(mockPlayed[0]!)).toBe(true);
  });
});
