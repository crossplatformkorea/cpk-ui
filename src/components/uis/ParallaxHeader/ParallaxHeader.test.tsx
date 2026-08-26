import React, {type ReactElement} from 'react';
import {View} from 'react-native';
import {render} from '@testing-library/react-native';

import {ThemeProvider} from '../../../providers/ThemeProvider';
import {ParallaxHeader, useParallaxHeader} from './ParallaxHeader';

function Example({
  expandedHeight = 180,
  collapsedHeight = 56,
}: {
  expandedHeight?: number;
  collapsedHeight?: number;
}): ReactElement {
  const {scrollOffset} = useParallaxHeader();
  return (
    <ThemeProvider>
      <ParallaxHeader
        collapsedContent={<View testID="compact-title" />}
        collapsedHeight={collapsedHeight}
        expandedContent={<View testID="large-title" />}
        expandedHeight={expandedHeight}
        scrollOffset={scrollOffset}
      >
        <View testID="persistent-navigation" />
      </ParallaxHeader>
    </ThemeProvider>
  );
}

describe('ParallaxHeader', () => {
  it('keeps presentation and interactive navigation in separate layers', () => {
    const screen = render(<Example />);

    expect(screen.getByTestId('large-title')).toBeTruthy();
    expect(screen.getByTestId('compact-title')).toBeTruthy();
    expect(screen.getByTestId('persistent-navigation')).toBeTruthy();
    expect(screen.getByTestId('parallax-header')).toHaveStyle({height: 180});
    expect(screen.getByTestId('parallax-header-navigation')).toHaveStyle({
      height: 56,
    });
  });

  it('never resolves the expanded surface below the compact height', () => {
    const screen = render(<Example collapsedHeight={64} expandedHeight={40} />);

    expect(screen.getByTestId('parallax-header')).toHaveStyle({height: 64});
    expect(screen.getByTestId('parallax-header-surface')).toHaveStyle({
      height: 64,
    });
  });
});
