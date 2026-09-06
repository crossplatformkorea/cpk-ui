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

interface WebScrollNode {
  scrollLeft: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

function isWebScrollNode(node: unknown): node is WebScrollNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    'scrollLeft' in node &&
    typeof node.scrollLeft === 'number' &&
    'addEventListener' in node &&
    typeof node.addEventListener === 'function' &&
    'removeEventListener' in node &&
    typeof node.removeEventListener === 'function'
  );
}

function Pager({reducedMotion = false}: {reducedMotion?: boolean}) {
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<React.ComponentRef<typeof Animated.ScrollView>>(null);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node: unknown = scrollRef.current?.getScrollableNode();
    if (!isWebScrollNode(node)) return;
    // Unlike inactivity, scrollend waits for both scrolling and the user's
    // gesture to finish. A paused finger must not commit a new page.
    const onScrollEnd = (): void => {
      setCurrentIndex(Math.max(0, Math.min(2, Math.round(node.scrollLeft / 280))));
    };
    node.addEventListener('scrollend', onScrollEnd);
    return () => node.removeEventListener('scrollend', onScrollEnd);
  }, []);
  const onScroll = useAnimatedScrollHandler((event) => {
    progress.set(event.contentOffset.x / 280);
  });
  // React state is owned by scrollend; only continuous progress changes here.
  const onWebScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const position = event.nativeEvent.contentOffset.x / 280;
    progress.set(position);
  };
  return (
    <View style={{gap: 24, padding: 24}}>
      <Animated.ScrollView
        ref={scrollRef}
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
