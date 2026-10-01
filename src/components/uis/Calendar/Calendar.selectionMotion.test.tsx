import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {useReducedMotion, withTiming} from 'react-native-reanimated';
import {createComponent} from '../../../../test/testUtils';
import {Calendar} from './Calendar';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useReducedMotion: jest.fn(() => false),
  cancelAnimation: jest.fn(),
  withTiming: jest.fn((value: number) => value),
  withSpring: jest.fn((value: number) => value),
}));
const today = new Date(2026, 7, 24, 12);
const pulseCount = (): number =>
  jest.mocked(withTiming).mock.calls.filter(([value]) => value === 1.12).length;

describe('Calendar deliberate selection motion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });
  it('animates changed presses once, including rapid cross-row choices', () => {
    const screen = render(
      createComponent(
        <Calendar
          selectionAnimation
          paging="none"
          today={today}
          defaultMonth="2026-08"
          defaultValue="2026-08-24"
        />,
      ),
    );
    expect(pulseCount()).toBe(0);
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-25'));
    expect(pulseCount()).toBe(1);
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-25'));
    expect(pulseCount()).toBe(1);
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-10'));
    expect(pulseCount()).toBe(2);
    expect(
      screen.getByTestId('calendar-day-2026-08-10').props.accessibilityState
        .selected,
    ).toBe(true);
  });
  it('keeps controlled programmatic selection and rejected presses still', () => {
    const make = (value: string): React.ReactElement =>
      createComponent(
        <Calendar
          selectionAnimation
          paging="none"
          today={today}
          month="2026-08"
          value={value}
        />,
      );
    const screen = render(make('2026-08-24'));
    screen.rerender(make('2026-08-25'));
    expect(pulseCount()).toBe(0);
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-10'));
    expect(pulseCount()).toBe(0);
    screen.rerender(make('2026-08-10'));
    expect(pulseCount()).toBe(0);
  });
  it('keeps default calendars and disabled dates still', () => {
    const screen = render(
      createComponent(
        <Calendar
          paging="none"
          today={today}
          defaultMonth="2026-08"
          disabledDates={['2026-08-10']}
        />,
      ),
    );
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-25'));
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-10'));
    expect(pulseCount()).toBe(0);
  });
  it('honours native reduced motion while retaining the selected date', () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    const screen = render(
      createComponent(
        <Calendar
          selectionAnimation
          paging="none"
          today={today}
          defaultMonth="2026-08"
        />,
      ),
    );
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-25'));
    expect(pulseCount()).toBe(0);
    expect(
      screen.getByTestId('calendar-day-2026-08-25').props.accessibilityState
        .selected,
    ).toBe(true);
  });
  it('does not replay feedback after month navigation or a data refresh', () => {
    const make = (badgeText: string): React.ReactElement =>
      createComponent(
        <Calendar
          selectionAnimation
          today={today}
          defaultMonth="2026-08"
          markers={{'2026-08-25': {badgeText}}}
        />,
      );
    const screen = render(make('1 entry'));
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-25'));
    expect(pulseCount()).toBe(1);
    screen.rerender(make('2 entries'));
    fireEvent.press(screen.getByTestId('calendar-next'));
    fireEvent.press(screen.getByTestId('calendar-prev'));
    expect(pulseCount()).toBe(1);
  });
  it('ignores disabled presses even with selection motion enabled', () => {
    const screen = render(
      createComponent(
        <Calendar
          selectionAnimation
          today={today}
          defaultMonth="2026-08"
          disabledDates={['2026-08-10']}
        />,
      ),
    );
    fireEvent.press(screen.getByTestId('calendar-day-2026-08-10'));
    expect(pulseCount()).toBe(0);
    expect(
      screen.getByTestId('calendar-day-2026-08-10').props.accessibilityState
        .selected,
    ).toBe(false);
  });
  it('confirms keyboard selection without animating focus movement', () => {
    const screen = render(
      createComponent(
        <Calendar
          selectionAnimation
          testID="calendar"
          today={today}
          defaultMonth="2026-08"
          defaultValue="2026-08-24"
        />,
      ),
    );
    fireEvent(screen.getByTestId('calendar'), 'keyDown', {key: 'ArrowRight'});
    expect(pulseCount()).toBe(0);
    fireEvent(screen.getByTestId('calendar'), 'keyDown', {key: 'Enter'});
    expect(pulseCount()).toBe(1);
    expect(
      screen.getByTestId('calendar-day-2026-08-25').props.accessibilityState
        .selected,
    ).toBe(true);
  });
});
