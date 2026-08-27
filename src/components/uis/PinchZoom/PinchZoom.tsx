import React, {
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
  type Ref,
} from 'react';
import {
  StyleSheet,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

export type PinchZoomProps = PropsWithChildren<{
  /**
   * Custom view style.
   * @warning Passing `transform` in style will disable pinch-zoom functionality.
   * Use a wrapper View for custom transforms instead.
   */
  style?: StyleProp<ViewStyle>;
  /** Callback fired when a settled zoom scale changes. */
  onScaleChanged?(value: number): void;
  /** Callback fired when a settled content position changes. */
  onTranslateChanged?(valueXY: {x: number; y: number}): void;
  /** Callback fired when a pinch or pan starts. */
  onInteractionStart?(): void;
  /** Callback fired when a pinch or pan settles. */
  onInteractionEnd?(): void;
  /** Callback fired after the release correction completes. */
  onRelease?(): void;
  /** Allow unrestricted overflow on a specific axis. */
  allowEmpty?: {x?: boolean; y?: boolean};
  /** Auto-snap content to the viewport bounds after release. @default true */
  fixOverflowAfterRelease?: boolean;
  /** Smallest allowed scale. @default 1 */
  minScale?: number;
  /** Largest allowed scale. @default 4 */
  maxScale?: number;
  /** Test ID for component testing. */
  testID?: string;
}>;

export interface PinchZoomRef {
  animatedValue: {
    scale: SharedValue<number>;
    translate: {x: SharedValue<number>; y: SharedValue<number>};
  };
  setValues(_: {scale?: number; translate?: {x: number; y: number}}): void;
}

const spring = {
  damping: 22,
  mass: 0.75,
  reduceMotion: ReduceMotion.System,
  stiffness: 240,
};

function clampValue(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function axisBoundary(scale: number, size: number): number {
  'worklet';
  return Math.max(0, ((scale - 1) * size) / 2);
}

function PinchZoomContainer(
  {
    style,
    children,
    onScaleChanged,
    onTranslateChanged,
    onInteractionStart,
    onInteractionEnd,
    onRelease,
    allowEmpty,
    fixOverflowAfterRelease = true,
    minScale = 1,
    maxScale = 4,
    testID = 'pinch-zoom-container',
  }: PinchZoomProps,
  ref: Ref<PinchZoomRef>,
): ReactElement {
  const lowerScale = Math.max(0.1, minScale);
  const upperScale = Math.max(lowerScale, maxScale);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const scale = useSharedValue(lowerScale);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startScale = useSharedValue(lowerScale);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  const notifySettled = useCallback(
    (nextScale: number, x: number, y: number): void => {
      onScaleChanged?.(nextScale);
      onTranslateChanged?.({x, y});
      onInteractionEnd?.();
      onRelease?.();
    },
    [onInteractionEnd, onRelease, onScaleChanged, onTranslateChanged],
  );

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          startScale.set(scale.get());
          startTranslateX.set(translateX.get());
          startTranslateY.set(translateY.get());
          if (onInteractionStart) runOnJS(onInteractionStart)();
        })
        .onUpdate((event) => {
          const previousScale = Math.max(startScale.get(), 0.1);
          const nextScale = clampValue(
            previousScale * event.scale,
            lowerScale,
            upperScale,
          );
          const ratio = nextScale / previousScale;
          const originX = event.focalX - width.get() / 2;
          const originY = event.focalY - height.get() / 2;
          const nextX =
            startTranslateX.get() +
            (1 - ratio) * (originX - startTranslateX.get());
          const nextY =
            startTranslateY.get() +
            (1 - ratio) * (originY - startTranslateY.get());
          const boundX = axisBoundary(nextScale, width.get());
          const boundY = axisBoundary(nextScale, height.get());

          scale.set(nextScale);
          translateX.set(
            allowEmpty?.x ? nextX : clampValue(nextX, -boundX, boundX),
          );
          translateY.set(
            allowEmpty?.y ? nextY : clampValue(nextY, -boundY, boundY),
          );
        })
        .onEnd(() => {
          const nextScale = scale.get();
          const shouldReset = nextScale <= lowerScale + 0.001;
          const settledScale = shouldReset ? lowerScale : nextScale;
          const boundX = axisBoundary(settledScale, width.get());
          const boundY = axisBoundary(settledScale, height.get());
          const settledX = shouldReset
            ? 0
            : allowEmpty?.x
              ? translateX.get()
              : clampValue(translateX.get(), -boundX, boundX);
          const settledY = shouldReset
            ? 0
            : allowEmpty?.y
              ? translateY.get()
              : clampValue(translateY.get(), -boundY, boundY);

          if (fixOverflowAfterRelease) {
            scale.set(withSpring(settledScale, spring));
            translateX.set(withSpring(settledX, spring));
            translateY.set(withSpring(settledY, spring));
          }
          runOnJS(notifySettled)(settledScale, settledX, settledY);
        }),
    [
      allowEmpty?.x,
      allowEmpty?.y,
      fixOverflowAfterRelease,
      height,
      lowerScale,
      notifySettled,
      onInteractionStart,
      scale,
      startScale,
      startTranslateX,
      startTranslateY,
      translateX,
      translateY,
      upperScale,
      width,
    ],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(1)
        .onStart(() => {
          startTranslateX.set(translateX.get());
          startTranslateY.set(translateY.get());
          if (scale.get() > lowerScale + 0.001 && onInteractionStart)
            runOnJS(onInteractionStart)();
        })
        .onUpdate((event) => {
          if (scale.get() <= lowerScale + 0.001) return;
          const boundX = axisBoundary(scale.get(), width.get());
          const boundY = axisBoundary(scale.get(), height.get());
          const nextX = startTranslateX.get() + event.translationX;
          const nextY = startTranslateY.get() + event.translationY;
          translateX.set(
            allowEmpty?.x ? nextX : clampValue(nextX, -boundX, boundX),
          );
          translateY.set(
            allowEmpty?.y ? nextY : clampValue(nextY, -boundY, boundY),
          );
        })
        .onEnd(() => {
          const nextScale = scale.get();
          const boundX = axisBoundary(nextScale, width.get());
          const boundY = axisBoundary(nextScale, height.get());
          const settledX = allowEmpty?.x
            ? translateX.get()
            : clampValue(translateX.get(), -boundX, boundX);
          const settledY = allowEmpty?.y
            ? translateY.get()
            : clampValue(translateY.get(), -boundY, boundY);

          if (fixOverflowAfterRelease) {
            translateX.set(withSpring(settledX, spring));
            translateY.set(withSpring(settledY, spring));
          }
          runOnJS(notifySettled)(nextScale, settledX, settledY);
        }),
    [
      allowEmpty?.x,
      allowEmpty?.y,
      fixOverflowAfterRelease,
      height,
      lowerScale,
      notifySettled,
      onInteractionStart,
      scale,
      startTranslateX,
      startTranslateY,
      translateX,
      translateY,
      width,
    ],
  );

  const gesture = useMemo(() => Gesture.Simultaneous(pinch, pan), [pan, pinch]);
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      {translateX: translateX.get()},
      {translateY: translateY.get()},
      {scale: scale.get()},
    ] as const,
  }));

  useImperativeHandle(
    ref,
    () => ({
      animatedValue: {scale, translate: {x: translateX, y: translateY}},
      setValues: (values) => {
        const nextScale = clampValue(
          values.scale ?? scale.get(),
          lowerScale,
          upperScale,
        );
        scale.set(nextScale);
        if (values.translate) {
          translateX.set(values.translate.x);
          translateY.set(values.translate.y);
        }
        onScaleChanged?.(nextScale);
        if (values.translate) onTranslateChanged?.(values.translate);
      },
    }),
    [
      lowerScale,
      onScaleChanged,
      onTranslateChanged,
      scale,
      translateX,
      translateY,
      upperScale,
    ],
  );

  const flattenedStyle = StyleSheet.flatten(style);
  if (__DEV__ && flattenedStyle?.transform) {
    console.warn(
      'PinchZoom: passing transform in style prop will disable pinch-zoom functionality. ' +
        'Use a wrapper View for custom transforms instead.',
    );
  }

  const onLayout = ({nativeEvent}: LayoutChangeEvent): void => {
    width.set(nativeEvent.layout.width);
    height.set(nativeEvent.layout.height);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        onLayout={onLayout}
        style={[style, flattenedStyle?.transform ? undefined : animatedStyle]}
        testID={testID}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const PinchZoomRoot = forwardRef<PinchZoomRef, PinchZoomProps>(
  PinchZoomContainer,
);

export {PinchZoomRoot as PinchZoom};
