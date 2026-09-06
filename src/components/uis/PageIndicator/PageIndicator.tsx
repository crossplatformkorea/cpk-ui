import React, {useMemo, type ReactElement} from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from 'react-native-reanimated';

import {useTheme} from '../../../providers/ThemeProvider';

type DotStyle = Pick<
  ViewStyle,
  'backgroundColor' | 'borderColor' | 'borderWidth'
>;

export interface PageIndicatorProps {
  /** Zero-based, continuous pager position. Drive it from a UI scroll worklet. */
  progress: SharedValue<number>;
  count: number;
  /** Settled page, used for accessibility and reduced-motion positioning. */
  currentIndex: number;
  accessibilityLabel?: string;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
  styles?: {activeDot?: DotStyle; inactiveDot?: DotStyle};
  testID?: string;
}

export function pageIndicatorOffset(progress: number, count: number): number {
  'worklet';
  const bounded = Number.isFinite(progress) ? progress : 0;
  return Math.max(0, Math.min(Math.max(0, count - 1), bounded)) * 28;
}

/** One pill follows the pager itself, with no second timing animation. */
export function PageIndicator({
  progress,
  count,
  currentIndex,
  accessibilityLabel,
  reducedMotion,
  style,
  styles,
  testID = 'page-indicator',
}: PageIndicatorProps): ReactElement | null {
  const {theme} = useTheme();
  const systemReducedMotion = useReducedMotion();
  const reduce = reducedMotion ?? systemReducedMotion;
  const pageCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const selected = pageIndicatorOffset(currentIndex, pageCount) / 28;
  const slots = useMemo(
    () => Array.from({length: pageCount}, (_, i) => i),
    [pageCount],
  );
  const inactiveStyle = useMemo(
    () => [
      layout.dot,
      {backgroundColor: theme.bg.basic, borderColor: theme.role.border},
      styles?.inactiveDot,
    ],
    [theme.bg.basic, theme.role.border, styles?.inactiveDot],
  );
  const activeStyle = useMemo(
    () => [
      layout.active,
      {backgroundColor: theme.role.primary},
      styles?.activeDot,
    ],
    [theme.role.primary, styles?.activeDot],
  );
  const motionStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: pageIndicatorOffset(
          reduce ? selected : progress.get(),
          pageCount,
        ),
      },
    ],
  }));
  if (pageCount === 0) return null;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{min: 1, max: pageCount, now: selected + 1}}
      aria-label={accessibilityLabel}
      aria-valuemin={1}
      aria-valuemax={pageCount}
      aria-valuenow={selected + 1}
      pointerEvents="none"
      style={style}
      testID={testID}
    >
      <View style={layout.track}>
        {slots.map((slot) => (
          <View key={slot} style={layout.slot}>
            <View style={inactiveStyle} />
          </View>
        ))}
        <Animated.View
          style={[activeStyle, motionStyle]}
          testID={`${testID}-active`}
        />
      </View>
    </View>
  );
}

const layout = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  slot: {alignItems: 'center', height: 8, width: 20},
  dot: {borderRadius: 4, borderWidth: 1, height: 8, width: 8},
  active: {
    borderRadius: 4,
    height: 8,
    width: 20,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
