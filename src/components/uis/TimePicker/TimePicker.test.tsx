import * as React from 'react';
import {useState} from 'react';
import {TextInput} from 'react-native';
import {act, fireEvent, render, screen} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {TimePicker, type TimePickerProps} from './TimePicker';
import {readTimeField, resolveTimeFormat} from './timeFormat';

const EVENING = new Date(2026, 10, 2, 21, 5, 30, 400);

function Controlled({
  initial = EVENING,
  onChange,
  ...props
}: Omit<TimePickerProps, 'value'> & {initial?: Date}): React.JSX.Element {
  const [value, setValue] = useState(initial);

  return (
    <TimePicker
      {...props}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      value={value}
    />
  );
}

function segmentOrder(): string[] {
  const json = JSON.stringify(screen.toJSON());
  const ids = ['time-picker-am', 'time-picker-hour', 'time-picker-minute'];

  return ids
    .filter((id) => json.includes(`"${id}"`))
    .sort((a, b) => json.indexOf(`"${a}"`) - json.indexOf(`"${b}"`));
}

describe('[TimePicker] locale format', () => {
  it('reads the hour cycle, separator, order and day periods per locale', () => {
    expect(resolveTimeFormat('en-US')).toEqual({
      hourCycle: 'h12',
      separator: ':',
      order: ['hour', 'minute', 'dayPeriod'],
      dayPeriods: ['AM', 'PM'],
      padHour: false,
    });
    expect(resolveTimeFormat('ko')).toMatchObject({
      hourCycle: 'h12',
      order: ['dayPeriod', 'hour', 'minute'],
      dayPeriods: ['오전', '오후'],
    });
    expect(resolveTimeFormat('id')).toMatchObject({
      hourCycle: 'h23',
      separator: '.',
      order: ['hour', 'minute'],
      padHour: true,
    });
    expect(resolveTimeFormat('ja')).toMatchObject({
      hourCycle: 'h23',
      separator: ':',
    });
  });

  it('lets an explicit hour cycle override the locale', () => {
    expect(resolveTimeFormat('en-US', 'h23')).toMatchObject({
      hourCycle: 'h23',
      order: ['hour', 'minute'],
    });
    expect(resolveTimeFormat('ja', 'h12')).toMatchObject({
      hourCycle: 'h12',
      dayPeriods: ['午前', '午後'],
    });
  });

  it('falls back to a 24-hour colon format without formatToParts', () => {
    const original = Intl.DateTimeFormat.prototype.formatToParts;

    try {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatToParts', {
        configurable: true,
        value: undefined,
      });
      expect(resolveTimeFormat('fr-CA')).toEqual({
        hourCycle: 'h23',
        separator: ':',
        order: ['hour', 'minute'],
        dayPeriods: ['AM', 'PM'],
        padHour: true,
      });
    } finally {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatToParts', {
        configurable: true,
        value: original,
      });
    }
  });
});

describe('[TimePicker] field input', () => {
  it.each([
    ['1', 'hour', 'h12', {draft: '1', value: 1, complete: false}],
    ['2', 'hour', 'h12', {draft: '2', value: 2, complete: true}],
    ['0', 'hour', 'h12', {draft: '0', value: null, complete: false}],
    ['12', 'hour', 'h12', {draft: '12', value: 12, complete: true}],
    ['2', 'hour', 'h23', {draft: '2', value: 2, complete: false}],
    ['3', 'hour', 'h23', {draft: '3', value: 3, complete: true}],
    ['00', 'hour', 'h23', {draft: '00', value: 0, complete: true}],
    ['5', 'minute', 'h23', {draft: '5', value: 5, complete: false}],
    ['7', 'minute', 'h12', {draft: '7', value: 7, complete: true}],
    ['５９', 'minute', 'h23', {draft: '59', value: 59, complete: true}],
    ['', 'minute', 'h23', {draft: '', value: null, complete: false}],
  ] as const)('reads %p as a %s in %s', (text, field, cycle, expected) => {
    expect(readTimeField(text, field, cycle)).toEqual(expected);
  });

  it.each([
    ['13', 'hour', 'h12'],
    ['00', 'hour', 'h12'],
    ['24', 'hour', 'h23'],
    ['60', 'minute', 'h12'],
  ] as const)('rejects %p as a %s in %s', (text, field, cycle) => {
    expect(readTimeField(text, field, cycle)).toBeNull();
  });
});

describe('[TimePicker] render', () => {
  it('writes a Korean time with the day period first', () => {
    render(createComponent(<TimePicker locale="ko" value={EVENING} />));

    expect(segmentOrder()).toEqual([
      'time-picker-am',
      'time-picker-hour',
      'time-picker-minute',
    ]);
    expect(screen.getByTestId('time-picker-hour').props.value).toBe('9');
    expect(screen.getByTestId('time-picker-minute').props.value).toBe('05');
    expect(screen.getByLabelText('오후').props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(screen.getByLabelText('오전').props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
  });

  it('writes an English time with the day period last', () => {
    render(createComponent(<TimePicker locale="en-US" value={EVENING} />));

    expect(segmentOrder()).toEqual([
      'time-picker-hour',
      'time-picker-minute',
      'time-picker-am',
    ]);
    expect(screen.getByLabelText('PM')).toBeTruthy();
  });

  it('writes an Indonesian time on a 24-hour clock with a dot', () => {
    render(createComponent(<TimePicker locale="id" value={EVENING} />));

    expect(screen.queryByTestId('time-picker-am')).toBeNull();
    expect(screen.getByTestId('time-picker-hour').props.value).toBe('21');
    expect(screen.getByText('.')).toBeTruthy();
  });

  it('follows a locale change while mounted', () => {
    const view = render(
      createComponent(<TimePicker locale="en-US" value={EVENING} />),
    );

    view.rerender(createComponent(<TimePicker locale="ko" value={EVENING} />));

    expect(screen.queryByLabelText('PM')).toBeNull();
    expect(screen.getByLabelText('오후')).toBeTruthy();
  });

  // jest-expo reports fontScale 2.0, so the cap decides the width here.
  it('sizes both fields for two digits at the capped font scale', () => {
    render(
      createComponent(
        <TimePicker locale="id" maxFontSizeMultiplier={1.5} value={EVENING} />,
      ),
    );

    // 20pt digits at the 1.5 cap: ceil(20 * 1.5 * 1.3 + 18) = 57.
    expect(screen.getByTestId('time-picker-hour')).toHaveStyle({width: 57});
    expect(screen.getByTestId('time-picker-minute')).toHaveStyle({width: 57});
  });

  it('keeps a 52pt minimum field without text scaling', () => {
    render(
      createComponent(
        <TimePicker locale="id" maxFontSizeMultiplier={1} value={EVENING} />,
      ),
    );

    expect(screen.getByTestId('time-picker-hour')).toHaveStyle({width: 52});
  });

  it('names the fields with the caller labels', () => {
    render(
      createComponent(
        <TimePicker
          labels={{hour: '시', minute: '분', dayPeriod: '오전/오후'}}
          locale="ko"
          value={EVENING}
        />,
      ),
    );

    expect(screen.getByLabelText('시')).toBe(
      screen.getByTestId('time-picker-hour'),
    );
    expect(screen.getByLabelText('분')).toBe(
      screen.getByTestId('time-picker-minute'),
    );
    expect(screen.getByLabelText('오전/오후')).toBeTruthy();
  });
});

describe('[TimePicker] changes', () => {
  it('keeps the afternoon while typing a 12-hour hour', () => {
    const onChange = jest.fn();

    render(createComponent(<Controlled locale="en-US" onChange={onChange} />));

    const hour = screen.getByTestId('time-picker-hour');
    fireEvent(hour, 'focus');
    fireEvent.changeText(hour, '1');
    fireEvent.changeText(screen.getByTestId('time-picker-hour'), '11');

    expect(onChange.mock.calls.map(([date]) => date.getHours())).toEqual([
      13, 23,
    ]);
    expect(screen.getByTestId('time-picker-hour').props.value).toBe('11');
  });

  it('keeps the date, zeroes the seconds and passes a new Date', () => {
    const onChange = jest.fn();

    render(createComponent(<Controlled locale="id" onChange={onChange} />));

    const minute = screen.getByTestId('time-picker-minute');
    fireEvent(minute, 'focus');
    fireEvent.changeText(minute, '7');

    const next: Date = onChange.mock.calls[0][0];
    expect(next).not.toBe(EVENING);
    expect([
      next.getFullYear(),
      next.getMonth(),
      next.getDate(),
      next.getHours(),
      next.getMinutes(),
      next.getSeconds(),
      next.getMilliseconds(),
    ]).toEqual([2026, 10, 2, 21, 7, 0, 0]);
  });

  it('ignores a digit that cannot form a valid value', () => {
    const onChange = jest.fn();

    render(createComponent(<Controlled locale="id" onChange={onChange} />));

    const hour = screen.getByTestId('time-picker-hour');
    fireEvent(hour, 'focus');
    fireEvent.changeText(hour, '2');
    fireEvent.changeText(screen.getByTestId('time-picker-hour'), '25');

    expect(onChange.mock.calls.map(([date]) => date.getHours())).toEqual([2]);
    expect(screen.getByTestId('time-picker-hour').props.value).toBe('2');
  });

  it('shows the formatted value again after the field loses focus', () => {
    render(createComponent(<Controlled locale="id" />));

    const hour = screen.getByTestId('time-picker-hour');
    fireEvent(hour, 'focus');
    fireEvent.changeText(hour, '8');
    fireEvent(screen.getByTestId('time-picker-hour'), 'blur');

    expect(screen.getByTestId('time-picker-hour').props.value).toBe('08');
  });

  it('moves to the minutes once the hour is complete', () => {
    render(createComponent(<Controlled locale="id" />));

    // The test renderer shares one mocked `focus` across every TextInput.
    const focus = jest.spyOn(TextInput.prototype, 'focus');
    const hour = screen.getByTestId('time-picker-hour');
    fireEvent(hour, 'focus');
    act(() => {
      fireEvent.changeText(hour, '1');
    });
    expect(focus).not.toHaveBeenCalled();
    act(() => {
      fireEvent.changeText(screen.getByTestId('time-picker-hour'), '14');
    });
    expect(focus).toHaveBeenCalledTimes(1);
    focus.mockRestore();
  });

  it('switches the day period by twelve hours', () => {
    const onChange = jest.fn();

    render(createComponent(<Controlled locale="ko" onChange={onChange} />));

    fireEvent.press(screen.getByTestId('time-picker-am'));
    fireEvent.press(screen.getByTestId('time-picker-am'));
    fireEvent.press(screen.getByTestId('time-picker-pm'));

    expect(onChange.mock.calls.map(([date]) => date.getHours())).toEqual([
      9, 21,
    ]);
  });

  it('changes nothing while disabled', () => {
    const onChange = jest.fn();

    render(
      createComponent(
        <Controlled disabled locale="en-US" onChange={onChange} />,
      ),
    );

    expect(screen.getByTestId('time-picker-hour').props.editable).toBe(false);
    fireEvent.press(screen.getByTestId('time-picker-am'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
