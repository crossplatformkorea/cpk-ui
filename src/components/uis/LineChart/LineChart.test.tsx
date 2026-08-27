import '@testing-library/jest-native/extend-expect';

import React from 'react';
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

    expect(screen.getByTestId('line-chart')).toHaveProp(
      'accessibilityLabel',
      'Monthly trend',
    );
    expect(screen.getByTestId('line-chart-point-0')).toBeTruthy();
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
      createComponent(<LineChart data={data} selectedKey="feb" />),
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
      createComponent(<LineChart data={dense} variant="compact" />),
    );

    expect(screen.getByTestId('line-chart')).toHaveStyle({height: 160});
    expect(screen.getByTestId('line-chart-point-23')).toBeTruthy();
  });
});
