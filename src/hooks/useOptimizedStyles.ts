import {useMemo} from 'react';
import type {StyleProp, ViewStyle, TextStyle} from 'react-native';

/**
 * Hook to optimize style objects and prevent unnecessary re-renders
 */
export function useOptimizedStyles<T extends Record<string, StyleProp<ViewStyle | TextStyle>>>(
  styleFactory: () => T,
  dependencies: React.DependencyList,
): T {
  return useMemo(styleFactory, dependencies);
}

/**
 * Hook to memoize style arrays
 */
export function useStyleArray<T extends StyleProp<ViewStyle | TextStyle>>(
  styles: T[],
  dependencies: React.DependencyList,
): T[] {
  return useMemo(() => styles, dependencies);
}
