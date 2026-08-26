import React, {
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  AccessibilityInfo,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type ScrollHandlerProcessed,
  type SharedValue,
} from 'react-native-reanimated';

import {useTheme} from '../../../providers/ThemeProvider';

export type ParallaxHeaderStyles = {
  container?: StyleProp<ViewStyle>;
  surface?: StyleProp<ViewStyle>;
  expandedContent?: StyleProp<ViewStyle>;
  collapsedContent?: StyleProp<ViewStyle>;
  navigation?: StyleProp<ViewStyle>;
};

export type ParallaxHeaderProps = {
  /** Scroll offset from an Animated ScrollView, FlatList, or FlashList. */
  scrollOffset: SharedValue<number>;
  /** Full header height at scroll position zero. */
  expandedHeight: number;
  /** Sticky header height after the collapse distance is consumed. */
  collapsedHeight: number;
  /** Defaults to the active cpk-ui basic surface token. */
  backgroundColor?: string;
  /** Presentation shown below the persistent navigation while expanded. */
  expandedContent?: ReactNode;
  /** Presentation cross-faded into the compact header. */
  collapsedContent?: ReactNode;
  /** Interactive controls that stay mounted and fixed at the top. */
  children?: ReactNode;
  styles?: ParallaxHeaderStyles;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export type ParallaxHeaderController = {
  scrollOffset: SharedValue<number>;
  onScroll: ScrollHandlerProcessed;
};

/**
 * Creates one UI-thread scroll source shared by the header and any animated
 * ScrollView-compatible list. The handler never schedules a React render.
 */
export function useParallaxHeader(): ParallaxHeaderController {
  const scrollOffset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.set(Math.max(event.contentOffset.y, 0));
  });

  return {onScroll, scrollOffset};
}

function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    const update = (next: boolean): void => {
      if (mounted) setReduced(next);
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(update)
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      update,
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}

/**
 * A list-agnostic collapsing header. Its layout height is fixed; scroll only
 * drives compositor-friendly transforms and opacity on the UI thread.
 */
export function ParallaxHeader({
  scrollOffset,
  expandedHeight,
  collapsedHeight,
  backgroundColor,
  expandedContent,
  collapsedContent,
  children,
  styles,
  style,
  testID = 'parallax-header',
}: ParallaxHeaderProps): ReactElement {
  const {theme} = useTheme();
  const reduceMotion = useReducedMotionPreference();
  const compactHeight = Math.max(collapsedHeight, 0);
  const fullHeight = Math.max(expandedHeight, compactHeight);
  const collapseDistance = fullHeight - compactHeight;
  const progress = useDerivedValue(() => {
    if (collapseDistance === 0) return 1;
    return Math.min(Math.max(scrollOffset.get() / collapseDistance, 0), 1);
  });

  const surfaceStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -Math.min(
          Math.max(scrollOffset.get(), 0),
          collapseDistance,
        ),
      },
    ],
  }));
  const expandedStyle = useAnimatedStyle(() => {
    const value = progress.get();
    return {
      opacity: reduceMotion
        ? value < 1
          ? 1
          : 0
        : interpolate(value, [0, 0.72, 1], [1, 0, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: reduceMotion
            ? 0
            : interpolate(value, [0, 1], [0, -12], Extrapolation.CLAMP),
        },
      ],
    };
  });
  const collapsedStyle = useAnimatedStyle(() => {
    const value = progress.get();
    return {
      opacity: reduceMotion
        ? value >= 1
          ? 1
          : 0
        : interpolate(value, [0, 0.68, 1], [0, 0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <View
      pointerEvents="box-none"
      style={[
        componentStyles.container,
        {height: fullHeight},
        styles?.container,
        style,
      ]}
      testID={testID}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          componentStyles.surface,
          {
            backgroundColor: backgroundColor ?? theme.bg.basic,
            height: fullHeight,
          },
          styles?.surface,
          surfaceStyle,
        ]}
        testID={`${testID}-surface`}
      >
        <Animated.View
          style={[
            componentStyles.expandedContent,
            {paddingTop: compactHeight},
            styles?.expandedContent,
            expandedStyle,
          ]}
          testID={`${testID}-expanded`}
        >
          {expandedContent}
        </Animated.View>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          componentStyles.collapsedContent,
          {height: compactHeight},
          styles?.collapsedContent,
          collapsedStyle,
        ]}
        testID={`${testID}-collapsed`}
      >
        {collapsedContent}
      </Animated.View>
      <View
        pointerEvents="box-none"
        style={[
          componentStyles.navigation,
          {height: compactHeight},
          styles?.navigation,
        ]}
        testID={`${testID}-navigation`}
      >
        {children}
      </View>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  collapsedContent: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  expandedContent: {flex: 1},
  navigation: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  surface: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
