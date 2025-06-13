import {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

export interface AnimationConfig {
  duration?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
}

/**
 * Hook for optimized fade animations
 */
export function useFadeAnimation(
  isVisible: boolean,
  config: AnimationConfig = {},
): Animated.Value {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: config.duration ?? 200,
      easing: config.easing ?? Easing.ease,
      useNativeDriver: config.useNativeDriver ?? true,
    }).start();
  }, [isVisible, fadeAnim, config.duration, config.easing, config.useNativeDriver]);

  return fadeAnim;
}

/**
 * Hook for optimized slide animations
 */
export function useSlideAnimation(
  isVisible: boolean,
  config: AnimationConfig & {direction?: 'up' | 'down' | 'left' | 'right'} = {},
): Animated.Value {
  const slideAnim = useRef(new Animated.Value(isVisible ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : 1,
      duration: config.duration ?? 200,
      easing: config.easing ?? Easing.ease,
      useNativeDriver: config.useNativeDriver ?? true,
    }).start();
  }, [isVisible, slideAnim, config.duration, config.easing, config.useNativeDriver]);

  return slideAnim;
}

/**
 * Hook for optimized rotation animations
 */
export function useRotateAnimation(
  isActive: boolean,
  config: AnimationConfig & {rotationDegrees?: number} = {},
): Animated.Value {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isActive ? 1 : 0,
      duration: config.duration ?? 200,
      easing: config.easing ?? Easing.ease,
      useNativeDriver: config.useNativeDriver ?? true,
    }).start();
  }, [isActive, rotateAnim, config.duration, config.easing, config.useNativeDriver]);

  return rotateAnim;
}
