import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {StyleSheet, View} from 'react-native';
import {createComponent} from '../../../../test/testUtils';
import {SelectionFeedback} from '../SelectionFeedback/SelectionFeedback';
import {Calendar} from './Calendar';
import type {CalendarRenderDay} from './types';

const today = new Date(2026, 7, 24, 12);

describe('Calendar measured columns', () => {
  it('keeps a large default circle round inside its column at peak scale', () => {
    const screen = render(
      createComponent(
        <Calendar
          paging="none"
          size={96}
          today={today}
          defaultMonth="2026-08"
          defaultValue="2026-08-24"
          selectionAnimation
        />,
      ),
    );
    const day = screen.getByTestId('calendar-day-2026-08-24');
    const rowBefore = StyleSheet.flatten(day.props.style).height;
    fireEvent(day, 'layout', {nativeEvent: {layout: {width: 40, height: 106}}});
    const mark = day.findByType(SelectionFeedback).props.children;
    const style = StyleSheet.flatten(mark.props.style);
    expect(style.width).toBe(style.height);
    expect(style.width * 1.12).toBeLessThanOrEqual(40);
    expect(style.borderRadius).toBe(style.width / 2);
    expect(StyleSheet.flatten(day.props.style).height).toBe(rowBefore);
  });

  it('gives custom ink the measured bound without shrinking the row metric', () => {
    const custom = jest.fn<
      ReturnType<CalendarRenderDay>,
      Parameters<CalendarRenderDay>
    >(() => <View />);
    const screen = render(
      createComponent(
        <Calendar
          paging="none"
          size={96}
          today={today}
          defaultMonth="2026-08"
          renderDay={custom}
        />,
      ),
    );
    const day = screen.getByTestId('calendar-day-2026-08-24');
    fireEvent(day, 'layout', {nativeEvent: {layout: {width: 40, height: 106}}});
    const context = custom.mock.calls
      .filter(([c]) => c.day.key === '2026-08-24')
      .at(-1)?.[0];
    expect(context?.cellSize).toBe(96);
    expect((context?.contentMaxSize ?? 100) * 1.12).toBeLessThanOrEqual(40);
    fireEvent(day, 'layout', {nativeEvent: {layout: {width: 40, height: 106}}});
    fireEvent(day, 'layout', {nativeEvent: {layout: {width: 0, height: 0}}});
    const retained = custom.mock.calls
      .filter(([c]) => c.day.key === '2026-08-24')
      .at(-1)?.[0];
    expect(retained?.contentMaxSize).toBe(context?.contentMaxSize);
  });
});
