import '@testing-library/jest-native/extend-expect';

import React from 'react';
import {render} from '@testing-library/react-native';

import {createComponent} from '../../../../test/testUtils';
import {DonutChart} from './DonutChart';

const data = [
  {key: 'housing', label: 'Housing', value: 65, color: '#20C997'},
  {key: 'food', label: 'Food', value: 25, color: '#FF6B81'},
  {key: 'travel', label: 'Travel', value: 10, color: '#6EA8FE'},
];

describe('[DonutChart]', () => {
  it('renders accessible data segments without a Skia dependency', () => {
    const screen = render(
      createComponent(
        <DonutChart accessibilityLabel="Spending by category" data={data} />,
      ),
    );

    expect(screen.getByTestId('donut-chart')).toHaveProp(
      'accessibilityLabel',
      'Spending by category',
    );
    expect(screen.getByTestId('donut-chart-segment-housing')).toBeTruthy();
    expect(screen.getByTestId('donut-chart-segment-food')).toBeTruthy();
    expect(screen.getByTestId('donut-chart-segment-travel')).toBeTruthy();
    expect(screen.getByTestId('donut-chart-track')).toBeTruthy();
  });

  it('uses one complete ring for a single category', () => {
    const screen = render(
      createComponent(
        <DonutChart accessibilityLabel="Only housing" data={[data[0]!]} />,
      ),
    );

    expect(screen.queryByTestId('donut-chart-segment-housing')).toBeNull();
    expect(screen.getByTestId('donut-chart')).toBeTruthy();
  });

  it('ignores non-positive and non-finite values', () => {
    const screen = render(
      createComponent(
        <DonutChart
          accessibilityLabel="No data"
          data={[
            {key: 'zero', label: 'Zero', value: 0, color: '#000000'},
            {
              key: 'invalid',
              label: 'Invalid',
              value: Number.POSITIVE_INFINITY,
              color: '#FFFFFF',
            },
          ]}
          emptyColor="#E5E7EB"
        />,
      ),
    );

    expect(screen.queryByTestId('donut-chart-segment-zero')).toBeNull();
    expect(screen.queryByTestId('donut-chart-segment-invalid')).toBeNull();
    expect(screen.getByTestId('donut-chart-track')).toBeTruthy();
  });

  it('keeps a centered overlay inside the chart frame', () => {
    const screen = render(
      createComponent(
        <DonutChart accessibilityLabel="Summary" data={data} size={180}>
          <></>
        </DonutChart>,
      ),
    );

    expect(screen.getByTestId('donut-chart')).toHaveStyle({
      height: 180,
      width: 180,
    });
  });
});
