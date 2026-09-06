import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {Typography} from '../Typography/Typography';
import {PageIndicator} from './PageIndicator';

const meta = {
  title: 'Feedback/PageIndicator',
  component: PageIndicator,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'Connect a continuous UI-thread page position, not an index updated after scrolling. Swipe, reverse mid-drag and test reduced motion.',
      },
    },
  },
} satisfies Meta<typeof PageIndicator>;
export default meta;
type Story = StoryObj<typeof Pager>;

function Pager({reducedMotion = false}: {reducedMotion?: boolean}) {
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const webSettleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(webSettleTimer.current), []);
  const onScroll = useAnimatedScrollHandler((event) => {
    progress.set(event.contentOffset.x / 280);
  });
  // RN Web emits scroll, but not the native momentum-end callback. Debounce
  // only the settled JS page; the visible indicator still follows every event.
  const onWebScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const position = event.nativeEvent.contentOffset.x / 280;
    progress.set(position);
    clearTimeout(webSettleTimer.current);
    webSettleTimer.current = setTimeout(() => {
      setCurrentIndex(Math.max(0, Math.min(2, Math.round(position))));
    }, 120);
  };
  return (
    <View style={{gap: 24, padding: 24}}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        onScroll={Platform.OS === 'web' ? onWebScroll : onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={{width: 280, height: 120}}
        onMomentumScrollEnd={(event) =>
          setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / 280))
        }
      >
        {['First page', 'Second page', 'Last page'].map((label) => (
          <View
            key={label}
            style={{width: 280, justifyContent: 'center', alignItems: 'center'}}
          >
            <Typography.Heading4>{label}</Typography.Heading4>
          </View>
        ))}
      </Animated.ScrollView>
      <PageIndicator
        count={3}
        currentIndex={currentIndex}
        progress={progress}
        reducedMotion={reducedMotion}
      />
    </View>
  );
}

export const Continuous: Story = {render: () => <Pager />};
export const ReducedMotion: Story = {render: () => <Pager reducedMotion />};
