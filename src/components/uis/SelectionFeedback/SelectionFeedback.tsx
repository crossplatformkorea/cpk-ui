import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from 'react';
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

/** Ink must fit its stable target even at the top of the confirmation spring. */
export const SELECTION_FEEDBACK_PEAK_SCALE = 1.12;

export interface SelectionFeedbackProps extends ViewProps {
  /** Committed selection identity. Initial rendering never animates. */
  selection?: string | number;
  /** Pop starts a little smaller before rising; pulse confirms an existing mark. */
  variant?: 'pulse' | 'pop';
  /** For a group, only the newly selected item's contents should pulse. */
  active?: boolean;
  reducedMotion?: boolean;
}

export interface SelectionFeedbackHandle {
  /** Play after a user action has committed; never call during render. */
  play: () => void;
}

/** Brief confirmation for a changed selection, inside a stable touch target. */
export const SelectionFeedback = forwardRef<
  SelectionFeedbackHandle,
  SelectionFeedbackProps
>(function SelectionFeedback(
  {
    selection,
    active = true,
    variant = 'pulse',
    reducedMotion,
    style,
    children,
    ...props
  }: SelectionFeedbackProps,
  ref,
): ReactElement {
  const previous = useRef(selection);
  const scale = useSharedValue(1);
  const systemReducedMotion = useReducedMotion();
  const reduce = reducedMotion ?? systemReducedMotion;
  const play = useCallback(() => {
    cancelAnimation(scale);
    if (!active || reduce) {
      scale.set(1);
      return;
    }
    if (variant === 'pop') scale.set(0.9);
    const preference =
      reducedMotion === undefined ? ReduceMotion.System : ReduceMotion.Never;
    scale.set(
      withSequence(
        preference,
        withTiming(SELECTION_FEEDBACK_PEAK_SCALE, {
          duration: 100,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
          reduceMotion: preference,
        }),
        withSpring(1, {
          duration: 300,
          dampingRatio: 0.8,
          reduceMotion: preference,
        }),
      ),
    );
  }, [active, reduce, reducedMotion, scale, variant]);
  useImperativeHandle(ref, () => ({play}), [play]);
  useEffect(() => {
    const changed = !Object.is(previous.current, selection);
    previous.current = selection;
    if (changed && selection !== undefined) play();
    else if (!active || reduce) {
      cancelAnimation(scale);
      scale.set(1);
    }
    return () => cancelAnimation(scale);
  }, [active, play, reduce, scale, selection]);
  const motionStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.get()}],
  }));
  return (
    <Animated.View {...props} style={[style, motionStyle]}>
      {children}
    </Animated.View>
  );
});
