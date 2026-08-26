import React, {type ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import type {SharedValue} from 'react-native-reanimated';
import type {Meta, StoryObj} from '@storybook/react';

import {withThemeProvider} from '../../../../.storybook/decorators';
import {StoryText} from '../../../../.storybook/story-ui';
import {useTheme} from '../../../providers/ThemeProvider';
import {ParallaxHeader, useParallaxHeader} from './ParallaxHeader';

const STORY_OFFSET: SharedValue<number> = {
  value: 0,
  get: () => 0,
  set: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
  modify: () => undefined,
};

function ParallaxExample({
  collapsedHeight,
  expandedHeight,
}: {
  collapsedHeight: number;
  expandedHeight: number;
}): ReactElement {
  const {theme} = useTheme();
  const {onScroll, scrollOffset} = useParallaxHeader();
  return (
    <View style={[styles.frame, {backgroundColor: theme.bg.paper}]}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: expandedHeight, paddingBottom: 32}}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {Array.from({length: 16}, (_, index) => (
          <View
            key={index}
            style={[styles.row, {borderColor: theme.bg.disabled}]}
          >
            <StoryText>Scrollable row {index + 1}</StoryText>
          </View>
        ))}
      </Animated.ScrollView>
      <ParallaxHeader
        backgroundColor={theme.button.primary.bg}
        collapsedContent={
          <View style={styles.compactTitle}>
            <StoryText>Shared ledger</StoryText>
          </View>
        }
        collapsedHeight={collapsedHeight}
        expandedContent={
          <View style={styles.largeTitle}>
            <StoryText>Shared ledger</StoryText>
            <StoryText>August activity</StoryText>
          </View>
        }
        expandedHeight={expandedHeight}
        scrollOffset={scrollOffset}
      >
        <View style={styles.navigation}>
          <StoryText>Menu</StoryText>
          <StoryText>Add</StoryText>
        </View>
      </ParallaxHeader>
    </View>
  );
}

const meta = {
  title: 'Display/ParallaxHeader',
  component: ParallaxHeader,
  args: {
    collapsedHeight: 56,
    expandedHeight: 176,
    scrollOffset: STORY_OFFSET,
  },
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component:
          'A list-agnostic, sticky header driven by a Reanimated shared scroll offset. It keeps a fixed layout height and performs the collapse with UI-thread transforms and opacity, so ScrollView, FlatList and FlashList consumers can share the same component on native and web.',
      },
    },
  },
} satisfies Meta<typeof ParallaxHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  render: () => <ParallaxExample collapsedHeight={56} expandedHeight={176} />,
};

export const CompactRange: Story = {
  render: () => <ParallaxExample collapsedHeight={52} expandedHeight={132} />,
};

const styles = StyleSheet.create({
  compactTitle: {alignItems: 'center', justifyContent: 'center', flex: 1},
  frame: {height: 560, overflow: 'hidden', position: 'relative', width: '100%'},
  largeTitle: {gap: 8, justifyContent: 'flex-end', padding: 20},
  navigation: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 64,
    padding: 16,
  },
});
