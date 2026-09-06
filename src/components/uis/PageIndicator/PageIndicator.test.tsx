import React from 'react';
import {render} from '@testing-library/react-native';
import {useReducedMotion, useSharedValue} from 'react-native-reanimated';

import {createComponent} from '../../../../test/testUtils';
import {PageIndicator, pageIndicatorOffset} from './PageIndicator';

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useReducedMotion: jest.fn(() => false),
}));

function Example({
  reducedMotion,
  count = 3,
}: {
  reducedMotion?: boolean;
  count?: number;
}) {
  const progress = useSharedValue(0.5);
  return (
    <PageIndicator
      count={count}
      currentIndex={0}
      progress={progress}
      reducedMotion={reducedMotion}
      testID="pages"
    />
  );
}

describe('PageIndicator', () => {
  afterEach(() => jest.mocked(useReducedMotion).mockReturnValue(false));
  it('tracks fractional progress, reversal and bounds without waiting for a new index', () => {
    expect(
      [0, 0.25, 0.5, 1, 0.25].map((value) => pageIndicatorOffset(value, 3)),
    ).toEqual([0, 7, 14, 28, 7]);
    expect(pageIndicatorOffset(-1, 3)).toBe(0);
    expect(pageIndicatorOffset(10, 3)).toBe(56);
    expect(pageIndicatorOffset(Number.NaN, 3)).toBe(0);
  });
  it.each(['light', 'dark'] as const)(
    'renders an accessible %s progress surface',
    (theme) => {
      const screen = render(createComponent(<Example />, theme));
      expect(screen.getByTestId('pages')).toHaveProp('accessibilityValue', {
        min: 1,
        max: 3,
        now: 1,
      });
      expect(screen.getByTestId('pages')).toHaveProp('aria-valuemin', 1);
      expect(screen.getByTestId('pages')).toHaveProp('aria-valuemax', 3);
      expect(screen.getByTestId('pages')).toHaveProp('aria-valuenow', 1);
      expect(screen.getByTestId('pages-active')).toHaveStyle({
        transform: [{translateX: 14}],
      });
    },
  );
  it('keeps the indicator at the committed page with reduced motion', () => {
    const screen = render(createComponent(<Example reducedMotion />));
    expect(screen.getByTestId('pages-active')).toHaveStyle({
      transform: [{translateX: 0}],
    });
  });
  it('respects the system reduced-motion preference by default', () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    const screen = render(createComponent(<Example />));
    expect(screen.getByTestId('pages-active')).toHaveStyle({
      transform: [{translateX: 0}],
    });
  });
  it('omits empty pagination', () => {
    const screen = render(createComponent(<Example count={0} />));
    expect(screen.queryByTestId('pages')).toBeNull();
  });
});
