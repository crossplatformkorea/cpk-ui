import * as React from 'react';
import {type ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import * as packageRoot from '../../../index';
import {Calendar} from './Calendar';
import type {
  CalendarDayState,
  CalendarMarkerMap,
  CalendarPalette,
  CalendarRef,
} from './types';
import {clearCalendarGridCache} from './utils';

/** Injected so nothing in the suite depends on the wall clock. */
const TODAY = new Date(2026, 7, 24, 12);

const renderedDays: string[] = [];

/** Stable identity, so it never invalidates `chrome` between rerenders. */
const spyRenderDay = (
  ctx: CalendarDayState & {palette: CalendarPalette; cellSize: number},
): ReactElement => {
  renderedDays.push(ctx.day.key);

  return <View testID={`spy-${ctx.day.key}`} />;
};

const MARKERS: CalendarMarkerMap = Object.freeze({
  '2026-08-24': Object.freeze({
    dots: Object.freeze([{key: 'expense', color: '#F84444'}]),
    badgeText: '-42,000',
    accessibilityHint: '3 entries',
  }),
});

const noop = (): void => undefined;

type JsonNode = {
  props?: Record<string, unknown>;
  children?: JsonNode[] | null;
};

const findNode = (
  node: JsonNode | JsonNode[] | null,
  predicate: (candidate: JsonNode) => boolean,
): JsonNode | null => {
  if (!node) {
    return null;
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findNode(child, predicate);

      if (hit) {
        return hit;
      }
    }

    return null;
  }

  if (predicate(node)) {
    return node;
  }

  return findNode(node.children ?? null, predicate);
};

const countLeaves = (node: JsonNode | null): number => {
  if (!node) {
    return 0;
  }

  if (!node.children || node.children.length === 0) {
    return 1;
  }

  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
};

/** Concatenates every string leaf under a rendered node. */
const collectText = (node: unknown): string[] => {
  if (typeof node === 'string') {
    return [node];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectText);
  }

  if (!node || typeof node !== 'object') {
    return [];
  }

  return collectText((node as JsonNode).children);
};

/** The seven rendered weekday headings, in column order. */
const weekdayLabels = (tree: JsonNode | null): string[] =>
  Array.from({length: 7}, (_unused, index) =>
    collectText(
      findNode(
        tree,
        (node) => node.props?.testID === `calendar-weekday-${index}`,
      ),
    ).join(''),
  );

beforeEach(() => {
  renderedDays.length = 0;
  clearCalendarGridCache();
});

describe('[Calendar] render', () => {
  it('should render without crashing in light and dark', async () => {
    const light = render(createComponent(<Calendar today={TODAY} />, 'light'));

    expect(await waitFor(() => light.toJSON())).toBeTruthy();

    const dark = render(createComponent(<Calendar today={TODAY} />, 'dark'));

    expect(await waitFor(() => dark.toJSON())).toBeTruthy();
    expect(JSON.stringify(light.toJSON())).not.toEqual(
      JSON.stringify(dark.toJSON()),
    );
  });

  it('should build a 6 row grid anchored on the week start', () => {
    const testingLib: RenderAPI = render(
      createComponent(
        <Calendar month="2026-08" paging="none" today={TODAY} weekStart={0} />,
      ),
    );

    // 2026-08-01 is a Saturday, so a Sunday first grid starts on 2026-07-26.
    expect(testingLib.getByTestId('calendar-day-2026-07-26')).toBeTruthy();
    expect(testingLib.getByTestId('calendar-day-2026-09-05')).toBeTruthy();
    expect(testingLib.queryAllByTestId(/^calendar-day-/)).toHaveLength(42);
  });

  it('should shift the grid by one column for weekStart 1', () => {
    const testingLib = render(
      createComponent(
        <Calendar month="2026-08" paging="none" today={TODAY} weekStart={1} />,
      ),
    );

    expect(testingLib.getByTestId('calendar-day-2026-07-27')).toBeTruthy();
    expect(testingLib.queryByTestId('calendar-day-2026-07-26')).toBeNull();
  });

  it('should render exactly 7 cells in week mode', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          mode="week"
          month="2026-08-24"
          paging="none"
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    expect(testingLib.queryAllByTestId(/^calendar-day-/)).toHaveLength(7);
    expect(testingLib.getByTestId('calendar-day-2026-08-23')).toBeTruthy();
    expect(testingLib.getByTestId('calendar-day-2026-08-29')).toBeTruthy();
  });

  it('should render a marker only on its own day', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          markers={MARKERS}
          month="2026-08"
          paging="none"
          today={TODAY}
        />,
      ),
    );

    const marked = testingLib.getByTestId('calendar-day-2026-08-24');

    expect(marked.props.accessibilityLabel).toContain('3 entries');
    expect(
      testingLib.getByTestId('calendar-day-2026-08-25').props
        .accessibilityLabel,
    ).not.toContain('3 entries');
  });
});

describe('[Calendar] selection', () => {
  it('should not call onChange on mount and should call it once on press', () => {
    const onChange = jest.fn();

    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-08"
          onChange={onChange}
          paging="none"
          today={TODAY}
        />,
      ),
    );

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-24'));

    expect(onChange).toHaveBeenCalledTimes(1);

    const [date, key, source] = onChange.mock.calls[0];

    expect(key).toBe('2026-08-24');
    expect(source).toBe('press');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(24);
  });

  it('should compare the year when highlighting the selection', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          month="2025-08"
          paging="none"
          today={TODAY}
          value="2026-08-24"
        />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-day-2025-08-24').props.accessibilityState
        .selected,
    ).toBe(false);
  });

  it('should mark the selected day for assistive tech', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-08"
          paging="none"
          today={TODAY}
          value="2026-08-24"
        />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-day-2026-08-24').props.accessibilityState
        .selected,
    ).toBe(true);
  });
});

describe('[Calendar] memoization', () => {
  const baseProps = {
    month: '2026-08',
    paging: 'none' as const,
    today: TODAY,
    weekStart: 0 as const,
    markers: MARKERS,
    renderDay: spyRenderDay,
    onChange: noop,
  };

  it('should re-render exactly two day cells when the selection moves inside a row', () => {
    const testingLib = render(
      createComponent(<Calendar {...baseProps} value="2026-08-10" />),
    );

    expect(renderedDays).toHaveLength(42);
    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(<Calendar {...baseProps} value="2026-08-11" />),
    );

    expect(renderedDays.sort()).toEqual(['2026-08-10', '2026-08-11']);
  });

  it('should re-render exactly two day cells when the selection crosses a row', () => {
    const testingLib = render(
      createComponent(<Calendar {...baseProps} value="2026-08-08" />),
    );

    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(<Calendar {...baseProps} value="2026-08-09" />),
    );

    expect(renderedDays.sort()).toEqual(['2026-08-08', '2026-08-09']);
  });

  it('should re-render zero day cells when the parent re-renders with identical props', () => {
    const testingLib = render(
      createComponent(<Calendar {...baseProps} value="2026-08-10" />),
    );

    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(<Calendar {...baseProps} value="2026-08-10" />),
    );

    expect(renderedDays).toEqual([]);
  });

  it('should re-render zero day cells for a rebuilt but structurally equal marker map', () => {
    const testingLib = render(
      createComponent(<Calendar {...baseProps} value="2026-08-10" />),
    );

    renderedDays.length = 0;

    const rebuilt: CalendarMarkerMap = Object.freeze({
      '2026-08-24': {
        dots: MARKERS['2026-08-24'].dots,
        badgeText: '-42,000',
        accessibilityHint: '3 entries',
      },
    });

    testingLib.rerender(
      createComponent(
        <Calendar {...baseProps} markers={rebuilt} value="2026-08-10" />,
      ),
    );

    expect(renderedDays).toEqual([]);
  });
  it('should re-render exactly two day cells when an uncontrolled press moves the selection', () => {
    const testingLib = render(
      createComponent(<Calendar {...baseProps} defaultValue="2026-08-10" />),
    );

    expect(renderedDays).toHaveLength(42);
    renderedDays.length = 0;

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-11'));

    expect(renderedDays.sort()).toEqual(['2026-08-10', '2026-08-11']);
  });

  it('should re-render zero day cells when only the callback identities change', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          {...baseProps}
          onChange={() => undefined}
          onMonthChange={() => undefined}
          value="2026-08-10"
        />,
      ),
    );

    renderedDays.length = 0;

    // Fresh arrows on every render is the common host mistake; latest-value
    // refs must absorb it instead of invalidating the frozen chrome object.
    testingLib.rerender(
      createComponent(
        <Calendar
          {...baseProps}
          onChange={() => undefined}
          onMonthChange={() => undefined}
          value="2026-08-10"
        />,
      ),
    );

    expect(renderedDays).toEqual([]);
  });

  /**
   * REGRESSION (adversarial review). `colors` was value-compared through
   * `isSamePalette`; `labels`, `styles` and `formatters` were not, so the
   * inline object literal every real call site writes rebuilt `chrome` and
   * re-rendered all 42 cells on every parent render.
   */
  it('should re-render zero day cells for a rebuilt but equal labels object', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          {...baseProps}
          labels={{today: 'Today'}}
          value="2026-08-10"
        />,
      ),
    );

    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(
        <Calendar
          {...baseProps}
          labels={{today: 'Today'}}
          value="2026-08-10"
        />,
      ),
    );

    expect(renderedDays).toEqual([]);
  });

  it('should re-render zero day cells for a rebuilt but equal styles object', () => {
    const dayText = {fontWeight: '600'} as const;
    const testingLib = render(
      createComponent(
        <Calendar {...baseProps} styles={{dayText}} value="2026-08-10" />,
      ),
    );

    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(
        <Calendar {...baseProps} styles={{dayText}} value="2026-08-10" />,
      ),
    );

    expect(renderedDays).toEqual([]);
  });

  it('should re-render zero day cells for a rebuilt but equal formatters object', () => {
    const dayNumber = (date: Date): string => String(date.getDate());
    const testingLib = render(
      createComponent(
        <Calendar {...baseProps} formatters={{dayNumber}} value="2026-08-10" />,
      ),
    );

    renderedDays.length = 0;

    // A fresh `formatters` identity also used to change `formattersId`, which
    // is part of the module level grid LRU key: every render rebuilt the grid
    // and ran 84 `Intl.DateTimeFormat#format` calls.
    testingLib.rerender(
      createComponent(
        <Calendar {...baseProps} formatters={{dayNumber}} value="2026-08-10" />,
      ),
    );

    expect(renderedDays).toEqual([]);
  });

  it('should still react when a label actually changes', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          {...baseProps}
          labels={{today: 'Today'}}
          value="2026-08-10"
        />,
      ),
    );

    renderedDays.length = 0;

    testingLib.rerender(
      createComponent(
        <Calendar {...baseProps} labels={{today: '오늘'}} value="2026-08-10" />,
      ),
    );

    expect(renderedDays).toHaveLength(42);
  });
});

describe('[Calendar] constraints', () => {
  it('should block a disabled day and report it instead of selecting', () => {
    const onChange = jest.fn();
    const onDisabledDayPress = jest.fn();

    const testingLib = render(
      createComponent(
        <Calendar
          minDate="2026-08-10"
          month="2026-08"
          onChange={onChange}
          onDisabledDayPress={onDisabledDayPress}
          paging="none"
          today={TODAY}
        />,
      ),
    );

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-05'));

    expect(onChange).not.toHaveBeenCalled();
    expect(onDisabledDayPress).toHaveBeenCalledTimes(1);
    expect(onDisabledDayPress.mock.calls[0][1]).toBe('2026-08-05');

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-11'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should honour disabledDates and marker.disabled', () => {
    const onChange = jest.fn();
    const markers: CalendarMarkerMap = Object.freeze({
      '2026-08-20': Object.freeze({disabled: true}),
    });

    const testingLib = render(
      createComponent(
        <Calendar
          disabledDates={['2026-08-19']}
          markers={markers}
          month="2026-08"
          onChange={onChange}
          paging="none"
          today={TODAY}
        />,
      ),
    );

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-19'));
    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-20'));

    expect(onChange).not.toHaveBeenCalled();
    expect(
      testingLib.getByTestId('calendar-day-2026-08-20').props.accessibilityState
        .disabled,
    ).toBe(true);
  });
});

describe('[Calendar] navigation', () => {
  it('should page with the header buttons and report the source', () => {
    const onMonthChange = jest.fn();

    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-08"
          onMonthChange={onMonthChange}
          today={TODAY}
        />,
      ),
    );

    fireEvent.press(testingLib.getByTestId('calendar-next'));

    expect(onMonthChange).toHaveBeenCalledTimes(1);
    expect(onMonthChange.mock.calls[0][1]).toBe('2026-09');
    expect(onMonthChange.mock.calls[0][2]).toBe('button');

    fireEvent.press(testingLib.getByTestId('calendar-prev'));

    expect(onMonthChange.mock.calls[1][1]).toBe('2026-07');
  });

  it('should disable navigation at the min and max boundaries', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          maxDate="2026-08-31"
          minDate="2026-08-01"
          month="2026-08"
          today={TODAY}
        />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-prev').props.accessibilityState.disabled,
    ).toBe(true);
    expect(
      testingLib.getByTestId('calendar-next').props.accessibilityState.disabled,
    ).toBe(true);
  });
});

describe('[Calendar] localization and accessibility', () => {
  it('should title the header with the locale month format', () => {
    const testingLib = render(
      createComponent(
        <Calendar locale="ko" month="2026-08" paging="none" today={TODAY} />,
      ),
    );

    expect(testingLib.getByTestId('calendar-header-title').props.children).toBe(
      '2026년 8월',
    );
  });

  it('should append the today label to the today cell', () => {
    const testingLib = render(
      createComponent(
        <Calendar locale="en-US" month="2026-08" paging="none" today={TODAY} />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-day-2026-08-24').props
        .accessibilityLabel,
    ).toBe('Monday, August 24, 2026, Today');
  });

  it('should accept a host-resolved calendar key for today', () => {
    const screen = render(
      createComponent(
        <Calendar
          locale="en-US"
          month="2026-08"
          paging="none"
          today="2026-08-24"
        />,
      ),
    );

    expect(
      screen.getByLabelText(/Monday, August 24, 2026.*Today/),
    ).toBeTruthy();
  });

  it('should not emit any physical left or right edge style', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          markers={MARKERS}
          month="2026-08"
          paging="none"
          showWeekNumbers
          today={TODAY}
        />,
      ),
    );

    const offenders: string[] = [];
    let inspectedStyles = 0;

    const walk = (node: unknown): void => {
      if (!node || typeof node !== 'object') {
        return;
      }

      const element = node as {
        props?: Record<string, unknown>;
        children?: unknown[];
      };

      if (element.props && 'style' in element.props) {
        const flattened = StyleSheet.flatten(element.props.style as never) as
          | Record<string, unknown>
          | undefined;

        if (flattened) {
          inspectedStyles += 1;

          for (const key of [
            'left',
            'right',
            'marginLeft',
            'marginRight',
            'paddingLeft',
            'paddingRight',
            'borderLeftWidth',
            'borderRightWidth',
          ]) {
            if (flattened[key] !== undefined) {
              offenders.push(key);
            }
          }
        }
      }

      element.children?.forEach(walk);
    };

    walk(testingLib.toJSON());

    // Guards the walk itself: an empty traversal would pass vacuously.
    expect(inspectedStyles).toBeGreaterThan(40);
    expect(offenders).toEqual([]);
  });
});

describe('[Calendar] modes, layout and escape hatches', () => {
  it('should step seven days per page in week mode', () => {
    const onMonthChange = jest.fn();

    const testingLib = render(
      createComponent(
        <Calendar
          mode="week"
          month="2026-08-24"
          onMonthChange={onMonthChange}
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    fireEvent.press(testingLib.getByTestId('calendar-next'));

    expect(onMonthChange.mock.calls[0][1]).toBe('2026-08-30');

    fireEvent.press(testingLib.getByTestId('calendar-prev'));

    expect(onMonthChange.mock.calls[1][1]).toBe('2026-08-16');
  });

  it('should manage its own selection and page when uncontrolled', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          defaultMonth="2026-08"
          defaultValue="2026-08-02"
          paging="none"
          today={TODAY}
        />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-day-2026-08-02').props.accessibilityState
        .selected,
    ).toBe(true);

    fireEvent.press(testingLib.getByTestId('calendar-day-2026-08-17'));

    expect(
      testingLib.getByTestId('calendar-day-2026-08-17').props.accessibilityState
        .selected,
    ).toBe(true);
    expect(
      testingLib.getByTestId('calendar-day-2026-08-02').props.accessibilityState
        .selected,
    ).toBe(false);
  });

  it('should render out of month days as inert spacers when hidden', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-08"
          paging="none"
          showOutsideDays={false}
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    // Spacers are hidden from assistive tech, so they need the explicit option.
    expect(
      testingLib.getByTestId('calendar-day-2026-07-26-spacer', {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
    expect(testingLib.queryByTestId('calendar-day-2026-07-26')).toBeNull();
    expect(testingLib.getByTestId('calendar-day-2026-08-01')).toBeTruthy();
  });

  it('should render week numbers with the ISO rule for a Monday week start', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-01"
          paging="none"
          showWeekNumbers
          today={TODAY}
          weekStart={1}
        />,
      ),
    );

    // 2026-01-01 is a Thursday, so its ISO week is week 1 of 2026.
    expect(testingLib.getByTestId('calendar-week-2025-12-29')).toBeTruthy();
  });

  it('should render two month grids side by side when asked', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-07"
          monthsToShow={2}
          paging="none"
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    expect(testingLib.getByTestId('calendar-page-2026-07')).toBeTruthy();
    expect(testingLib.getByTestId('calendar-page-2026-08')).toBeTruthy();
  });

  it('should use the caller header and weekday renderers', () => {
    const renderHeader = jest.fn(() => <View testID="custom-header" />);
    const renderWeekdayLabel = jest.fn(() => <View testID="custom-weekday" />);

    const testingLib = render(
      createComponent(
        <Calendar
          month="2026-08"
          paging="none"
          renderHeader={renderHeader}
          renderWeekdayLabel={renderWeekdayLabel}
          today={TODAY}
        />,
      ),
    );

    expect(testingLib.getByTestId('custom-header')).toBeTruthy();
    // The weekday row is hidden from assistive tech on native.
    expect(
      testingLib.queryAllByTestId('custom-weekday', {
        includeHiddenElements: true,
      }),
    ).toHaveLength(7);
    expect(renderHeader.mock.calls[0][0]).toEqual(
      expect.objectContaining({mode: 'month', title: 'August 2026'}),
    );
  });

  it('should expose an imperative paging API', () => {
    const onMonthChange = jest.fn();
    const ref = React.createRef<CalendarRef>();

    render(
      createComponent(
        <Calendar
          month="2026-08"
          onMonthChange={onMonthChange}
          paging="none"
          ref={ref}
          today={TODAY}
        />,
      ),
    );

    ref.current?.next();
    ref.current?.goToMonth('2027-02');
    ref.current?.goToToday();

    expect(onMonthChange.mock.calls.map((call) => call[1])).toEqual([
      '2026-09',
      '2027-02',
      '2026-08',
    ]);
    expect(onMonthChange.mock.calls[0][2]).toBe('imperative');
  });

  it('should use the injected formatters instead of Intl', () => {
    const formatters = Object.freeze({
      monthTitle: (date: Date) => `M${date.getMonth() + 1}`,
      dayNumber: (date: Date) => `d${date.getDate()}`,
    });

    const testingLib = render(
      createComponent(
        <Calendar
          formatters={formatters}
          month="2026-08"
          paging="none"
          today={TODAY}
        />,
      ),
    );

    expect(testingLib.getByTestId('calendar-header-title').props.children).toBe(
      'M8',
    );
  });
});

describe('[Calendar] large font degradation', () => {
  // jest-expo reports fontScale 2.0, which is above both graceful degradation
  // thresholds: badges are hidden above 1.3 and dots clamp to one above 1.5.
  it('should hide the badge and clamp to a single dot', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          markers={MARKERS}
          month="2026-08"
          paging="none"
          today={TODAY}
        />,
      ),
    );

    expect(
      testingLib.queryByText('-42,000', {includeHiddenElements: true}),
    ).toBeNull();

    const cell = findNode(
      testingLib.toJSON() as JsonNode | null,
      (node) => node.props?.testID === 'calendar-day-2026-08-24',
    );
    const decorations = findNode(
      cell,
      (node) => node.props?.importantForAccessibility === 'no',
    );

    expect(cell).not.toBeNull();
    expect(countLeaves(decorations)).toBe(1);
  });
});

describe('[Calendar] locale and week start correctness', () => {
  it('should render locale weekday headings in column order', () => {
    const korean = render(
      createComponent(
        <Calendar
          locale="ko"
          month="2026-08"
          paging="none"
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    expect(weekdayLabels(korean.toJSON() as JsonNode | null)).toEqual([
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ]);

    const english = render(
      createComponent(
        <Calendar
          locale="en-US"
          month="2026-08"
          paging="none"
          today={TODAY}
          weekStart={0}
        />,
      ),
    );

    expect(weekdayLabels(english.toJSON() as JsonNode | null)).toEqual([
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S',
    ]);
  });

  it('should rotate the weekday headings with the week start', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          locale="en-US"
          month="2026-08"
          paging="none"
          today={TODAY}
          weekStart={1}
        />,
      ),
    );

    expect(weekdayLabels(testingLib.toJSON() as JsonNode | null)).toEqual([
      'M',
      'T',
      'W',
      'T',
      'F',
      'S',
      'S',
    ]);
  });

  it('should anchor the grid on a Saturday week start', () => {
    const testingLib = render(
      createComponent(
        <Calendar month="2026-08" paging="none" today={TODAY} weekStart={6} />,
      ),
    );

    // 2026-08-01 is itself a Saturday, so the grid needs no leading padding.
    const cells = testingLib.queryAllByTestId(/^calendar-day-/);

    expect(cells).toHaveLength(42);
    expect(cells[0].props.testID).toBe('calendar-day-2026-08-01');
    expect(cells[cells.length - 1].props.testID).toBe(
      'calendar-day-2026-09-11',
    );
  });

  it('should order the spoken date by the locale and use the supplied today label', () => {
    const testingLib = render(
      createComponent(
        <Calendar
          labels={{today: '오늘'}}
          locale="ko"
          month="2026-08"
          paging="none"
          today={TODAY}
        />,
      ),
    );

    expect(
      testingLib.getByTestId('calendar-day-2026-08-24').props
        .accessibilityLabel,
    ).toBe('2026년 8월 24일 월요일, 오늘');
    expect(
      testingLib.getByTestId('calendar-day-2026-08-25').props
        .accessibilityLabel,
    ).toBe('2026년 8월 25일 화요일');
  });
});

describe('[Calendar] package surface', () => {
  it('should be exported from the package root', () => {
    // Guards the single line in src/index.tsx that both coverage gates read.
    expect(packageRoot.Calendar).toBe(Calendar);
  });
});
