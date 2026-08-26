import React, {useCallback, useMemo, type ReactElement} from 'react';
import type {LayoutChangeEvent, ViewStyle} from 'react-native';
import {I18nManager, useWindowDimensions} from 'react-native';
import {css} from 'kstyled';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type {CalendarPagerProps, CalendarPagerSlot} from './CalendarPage';
import type {CalendarCollapseProgress} from './types';

const CONTAINER = css`
  align-self: stretch;
  overflow: hidden;
`;

const PAGE = css`
  position: absolute;
  top: 0;
  start: 0;
  end: 0;
`;

const SPRING = {
  damping: 22,
  stiffness: 220,
  mass: 0.7,
  overshootClamping: true,
};
const INSTANT = {duration: 0};

/** Fraction of the page width, plus projected velocity, that commits a page turn. */
const COMMIT_RATIO = 0.28;
const VELOCITY_PROJECTION = 0.15;

type PagerPageProps = {
  slot: CalendarPagerSlot;
  direction: number;
  pageWidth: CalendarCollapseProgress;
  pagerX: CalendarCollapseProgress;
  collapse: CalendarCollapseProgress;
  activeRow: CalendarCollapseProgress;
  rowHeight: number;
  height: number;
};

function PagerPage({
  slot,
  direction,
  pageWidth,
  pagerX,
  collapse,
  activeRow,
  rowHeight,
  height,
}: PagerPageProps): ReactElement {
  const {offset} = slot;

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const transform: NonNullable<ViewStyle['transform']> = [
      {translateX: offset * pageWidth.value * direction + pagerX.value},
      {translateY: -activeRow.value * rowHeight * collapse.value},
    ];

    return {transform};
  });

  return (
    <Animated.View
      pointerEvents={offset === 0 ? 'auto' : 'none'}
      style={[PAGE, {height}, animatedStyle]}
    >
      {slot.node}
    </Animated.View>
  );
}

/**
 * Three pages are mounted and moved by one shared value. There is no `scrollTo`
 * and no re-centering pass: the spring resets `pagerX` to 0 in the same frame the
 * page model shifts, so a swipe never causes a visible jump.
 */
function CalendarPagerContainer({
  slots,
  rowCount,
  rowHeight,
  collapse,
  activeRow,
  swipeEnabled,
  reduceMotion,
  onCommit,
  testID,
}: CalendarPagerProps): ReactElement {
  const {width: windowWidth} = useWindowDimensions();
  const direction = I18nManager.isRTL ? -1 : 1;

  const pageWidth = useSharedValue(windowWidth);
  const pagerX = useSharedValue(0);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;

      if (nextWidth > 0 && Math.abs(nextWidth - pageWidth.value) >= 0.5) {
        // Shared value write only. A rotation or split view resize re-renders no cell.
        pageWidth.value = nextWidth;
      }
    },
    [pageWidth],
  );

  const containerStyle = useAnimatedStyle(() => ({
    height: rowHeight * (rowCount - (rowCount - 1) * collapse.value),
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeEnabled)
        .activeOffsetX([-12, 12])
        .failOffsetY([-8, 8])
        .onUpdate((event) => {
          'worklet';

          if (collapse.value > 0.02 && collapse.value < 0.98) {
            return;
          }

          pagerX.value = event.translationX;
        })
        .onEnd((event) => {
          'worklet';

          const width = pageWidth.value;

          if (width <= 0 || (collapse.value > 0.02 && collapse.value < 0.98)) {
            pagerX.value = 0;

            return;
          }

          const projected =
            direction *
            (event.translationX + event.velocityX * VELOCITY_PROJECTION);
          const threshold = width * COMMIT_RATIO;
          const delta =
            projected < -threshold ? 1 : projected > threshold ? -1 : 0;

          if (delta === 0) {
            pagerX.value = reduceMotion
              ? withTiming(0, INSTANT)
              : withSpring(0, SPRING);

            return;
          }

          const target = -delta * width * direction;
          const settle = (finished?: boolean): void => {
            'worklet';

            if (!finished) {
              return;
            }

            pagerX.value = 0;
            runOnJS(onCommit)(delta);
          };

          pagerX.value = reduceMotion
            ? withTiming(target, INSTANT, settle)
            : withSpring(target, SPRING, settle);
        }),
    [
      collapse,
      direction,
      onCommit,
      pageWidth,
      pagerX,
      reduceMotion,
      swipeEnabled,
    ],
  );

  const height = rowCount * rowHeight;

  const pages = slots.map((slot) => (
    <PagerPage
      activeRow={activeRow}
      collapse={collapse}
      direction={direction}
      height={height}
      key={slot.key}
      pageWidth={pageWidth}
      pagerX={pagerX}
      rowHeight={rowHeight}
      slot={slot}
    />
  ));

  if (!swipeEnabled) {
    return (
      <Animated.View
        onLayout={handleLayout}
        style={[CONTAINER, containerStyle]}
        testID={testID}
      >
        {pages}
      </Animated.View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        onLayout={handleLayout}
        style={[CONTAINER, containerStyle]}
        testID={testID}
      >
        {pages}
      </Animated.View>
    </GestureDetector>
  );
}

export const CalendarPager = React.memo(CalendarPagerContainer);

export default CalendarPager;
