import '@testing-library/jest-native/extend-expect';

import React from 'react';
import {StyleSheet} from 'react-native';
import {Circle} from 'react-native-svg';
import {fireEvent, render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {LineChart} from './LineChart';

const data = [
  {key: 'jan', label: 'Jan', value: 10},
  {key: 'feb', label: 'Feb', value: 20},
  {key: 'mar', label: 'Mar', value: 15},
];

describe('[LineChart]', () => {
  it('renders an accessible responsive chart', () => {
    const screen = render(
      createComponent(
        <LineChart accessibilityLabel="Monthly trend" data={data} />,
      ),
    );

    const chart = screen.getByTestId('line-chart');
    expect(chart).toHaveProp('accessibilityLabel', 'Monthly trend');
    expect(chart).toHaveProp('accessible', true);
    expect(chart).toHaveProp('role', 'img');
    expect(screen.queryByTestId('line-chart-point-0')).toBeNull();
  });

  it('summarises the series when no label is given', () => {
    const screen = render(
      createComponent(
        <LineChart data={data} formatValue={(value) => `$${value}`} />,
      ),
    );

    expect(screen.getByTestId('line-chart')).toHaveProp(
      'accessibilityLabel',
      'Jan: $10, Feb: $20, Mar: $15',
    );
  });

  it('groups point buttons instead of nesting them in an image', () => {
    const screen = render(
      createComponent(
        <LineChart
          accessibilityLabel="Monthly trend"
          data={data}
          onSelect={jest.fn()}
        />,
      ),
    );

    const chart = screen.getByTestId('line-chart');
    expect(chart).toHaveProp('role', 'group');
    expect(chart).toHaveProp('accessible', false);
    expect(screen.getByTestId('line-chart-point-0')).toHaveProp(
      'accessibilityRole',
      'button',
    );
  });

  it('gives each point the touch area nearest to it', () => {
    const screen = render(
      createComponent(<LineChart data={data} onSelect={jest.fn()} />),
    );
    const slot = (index: number): {left?: unknown; width?: unknown} =>
      StyleSheet.flatten(
        screen.getByTestId(`line-chart-point-${index}`).props.style,
      );

    // Default 320pt frame: points at 20, 160 and 300.
    expect(slot(0)).toMatchObject({left: 0, width: 90});
    expect(slot(1)).toMatchObject({left: 90, width: 140});
    expect(slot(2)).toMatchObject({left: 230, width: 90});
  });

  it('draws an all-zero series on the baseline', () => {
    const zero = [
      {key: 'jan', label: 'Jan', value: 0},
      {key: 'feb', label: 'Feb', value: 0},
    ];
    const screen = render(createComponent(<LineChart data={zero} />));
    const [first] = screen.UNSAFE_getAllByType(Circle);

    // Regular 220pt frame with a 30pt bottom inset.
    expect(first?.props.cy).toBe(190);
  });

  it('selects a point through its full-width target', () => {
    const onSelect = jest.fn();
    const screen = render(
      createComponent(<LineChart data={data} onSelect={onSelect} />),
    );

    fireEvent.press(screen.getByTestId('line-chart-point-1'));
    expect(onSelect).toHaveBeenCalledWith(data[1], 1);
  });

  it('exposes the selected point to assistive technology', () => {
    const screen = render(
      createComponent(
        <LineChart data={data} onSelect={jest.fn()} selectedKey="feb" />,
      ),
    );

    expect(
      screen.getByTestId('line-chart-point-1').props.accessibilityState,
    ).toEqual({selected: true});
  });

  it('renders an empty state without point targets', () => {
    const screen = render(
      createComponent(<LineChart data={[]} emptyLabel="Nothing yet" />),
    );

    expect(screen.queryByTestId('line-chart-point-0')).toBeNull();
    expect(screen.getByTestId('line-chart-empty')).toBeTruthy();
  });

  it('centres a single value and keeps it selectable', () => {
    const single = [{key: 'jan', label: 'Jan', value: 10}];
    const onSelect = jest.fn();
    const screen = render(
      createComponent(<LineChart data={single} onSelect={onSelect} />),
    );

    fireEvent.press(screen.getByTestId('line-chart-point-0'));
    expect(onSelect).toHaveBeenCalledWith(single[0], 0);
  });

  it('keeps dense and non-finite input inside one responsive chart', () => {
    const dense = Array.from({length: 24}, (_, index) => ({
      key: String(index),
      label: String(index + 1),
      value: index === 12 ? Number.POSITIVE_INFINITY : index * 100,
    }));
    const screen = render(
      createComponent(
        <LineChart data={dense} onSelect={jest.fn()} variant="compact" />,
      ),
    );

    expect(screen.getByTestId('line-chart')).toHaveStyle({height: 160});
    expect(screen.getByTestId('line-chart-point-23')).toBeTruthy();
  });
});
