import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {css} from 'kstyled';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import type {CalendarPagerProps} from './CalendarPage';

const CONTAINER = css`
  align-self: stretch;
  overflow: hidden;
`;

const CONTENT = css`
  flex-direction: row;
  align-items: flex-start;
`;

/** Time after the last scroll event at which the page is considered settled. */
const SETTLE_DELAY = 140;

/**
 * Web build. Gesture handler needs a `GestureHandlerRootView` that a plain web
 * consumer may not have mounted, so paging here is a scroll snap container that
 * commits on settle. The collapse still runs through the same shared values.
 */
function CalendarPagerWebContainer({
  slots,
  rowCount,
  rowHeight,
  collapse,
  activeRow,
  swipeEnabled,
  onCommit,
  testID,
}: CalendarPagerProps): ReactElement {
  const {width: windowWidth} = useWindowDimensions();
  const [pageWidth, setPageWidth] = useState(windowWidth);
  const scrollRef = useRef<ScrollView | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const centerIndex = slots.findIndex((slot) => slot.offset === 0);
  const restingOffset = Math.max(centerIndex, 0) * pageWidth;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;

    setPageWidth((current) =>
      nextWidth > 0 && Math.abs(nextWidth - current) >= 0.5
        ? nextWidth
        : current,
    );
  }, []);

  const recenter = useCallback(() => {
    scrollRef.current?.scrollTo({x: restingOffset, y: 0, animated: false});
  }, [restingOffset]);

  useEffect(() => {
    recenter();
  }, [recenter, slots]);

  useEffect(
    () => () => {
      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
      }
    },
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;

      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
      }

      settleTimer.current = setTimeout(() => {
        if (pageWidth <= 0) {
          return;
        }

        const index = Math.round(offsetX / pageWidth);
        const delta = index - Math.max(centerIndex, 0);

        recenter();

        if (delta !== 0) {
          onCommit(delta);
        }
      }, SETTLE_DELAY);
    },
    [centerIndex, onCommit, pageWidth, recenter],
  );

  const containerStyle = useAnimatedStyle(() => ({
    height: rowHeight * (rowCount - (rowCount - 1) * collapse.value),
  }));

  const pageStyle = useAnimatedStyle(() => ({
    transform: [{translateY: -activeRow.value * rowHeight * collapse.value}],
  }));

  const height = rowCount * rowHeight;

  return (
    <Animated.View style={[CONTAINER, containerStyle]} testID={testID}>
      <ScrollView
        contentContainerStyle={CONTENT}
        horizontal
        onLayout={handleLayout}
        onScroll={handleScroll}
        pagingEnabled
        ref={scrollRef}
        scrollEnabled={swipeEnabled}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {slots.map((slot) => (
          <View key={slot.key} style={{width: pageWidth, height}}>
            <Animated.View style={pageStyle}>{slot.node}</Animated.View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

export const CalendarPager = React.memo(CalendarPagerWebContainer);

export default CalendarPager;
