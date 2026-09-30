import React, {useEffect, useRef, type ReactElement} from 'react';
import type {ViewProps} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface SelectionFeedbackProps extends ViewProps {
  /** Committed selection identity. Initial rendering never animates. */
  selection: string | number;
  /** For a group, only the newly selected item's contents should pulse. */
  active?: boolean;
  reducedMotion?: boolean;
}

/** Brief confirmation for a changed selection, inside a stable touch target. */
export function SelectionFeedback({
  selection,
  active = true,
  reducedMotion,
  style,
  children,
  ...props
}: SelectionFeedbackProps): ReactElement {
  const previous = useRef(selection);
  const scale = useSharedValue(1);
  const systemReducedMotion = useReducedMotion();
  const reduce = reducedMotion ?? systemReducedMotion;
  useEffect(() => {
    const changed = !Object.is(previous.current, selection);
    previous.current = selection;
    cancelAnimation(scale);
    if (!active || reduce || !changed) {
      scale.set(1);
      return;
    }
    const preference =
      reducedMotion === undefined ? ReduceMotion.System : ReduceMotion.Never;
    scale.set(
      withSequence(
        preference,
        withTiming(1.08, {
          duration: 100,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
          reduceMotion: preference,
        }),
        withSpring(1, {
          duration: 350,
          dampingRatio: 0.8,
          reduceMotion: preference,
        }),
      ),
    );
    return () => cancelAnimation(scale);
  }, [active, reduce, reducedMotion, scale, selection]);
  const motionStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.get()}],
  }));
  return (
    <Animated.View {...props} style={[style, motionStyle]}>
      {children}
    </Animated.View>
  );
}
