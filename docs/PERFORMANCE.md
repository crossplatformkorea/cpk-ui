# CPK-UI Performance Optimization Guide

This guide outlines the performance optimizations implemented across the CPK-UI library to ensure optimal React Native performance.

## Table of Contents

1. [Overview](#overview)
2. [Performance Techniques Used](#performance-techniques-used)
3. [Optimized Components](#optimized-components)
4. [Best Practices](#best-practices)
5. [Performance Testing](#performance-testing)
6. [Bundle Size Considerations](#bundle-size-considerations)

## Overview

CPK-UI has been optimized for performance using React's built-in performance features including `React.memo`, `useCallback`, `useMemo`, and strategic memoization patterns. These optimizations prevent unnecessary re-renders and improve the overall user experience.

## Performance Techniques Used

### 1. React.memo

Components are wrapped with `React.memo` to prevent re-renders when props haven't changed:

```tsx
export default React.memo(Component);
```

### 2. useCallback

Event handlers and functions are memoized to maintain referential equality:

```tsx
const handlePress = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 3. useMemo

Expensive calculations and style objects are memoized:

```tsx
const computedStyles = useMemo(() => {
  return {
    // style calculations
  };
}, [dependencies]);
```

### 4. Strategic Dependency Arrays

Memoization hooks use carefully crafted dependency arrays to ensure optimal performance without sacrificing correctness.

## Optimized Components

### UI Components

#### Basic Components
- **Hr**: React.memo wrapper for styled component
- **Icon**: Module-level optimization for icon set creation
- **StatusBarBrightness**: Memoized status bar color calculation
- **LoadingIndicator**: Comprehensive memoization of content renderer, image processing, and styles
- **Typography**: Memoized text component creation and font family calculations

#### Interactive Components
- **Button**: Memoized press handlers, loading state, and style calculations
- **IconButton**: Memoized press handlers and haptic feedback
- **CustomPressable**: Memoized hit slop and style functions
- **Checkbox**: Memoized check state changes and animations
- **RadioButton**: Memoized selection state and press handlers
- **SwitchToggle**: Memoized toggle animations and state changes
- **Rating**: Memoized star interactions and rendering
- **Fab**: Comprehensive memoization of animation config, layout handlers, and item rendering

#### Form Components
- **EditText**: Extensive memoization of render functions, status calculations, and styles
- **Card**: Memoized shadow styles and variant calculations

#### Layout Components
- **Accordion**: Memoized accordion items rendering
- **AccordionItem**: Memoized expand/collapse animations

### Modal Components
- **Snackbar**: Memoized handlers, shadow styles, and content rendering
- **AlertDialog**: Comprehensive memoization of backdrop, content, and action handlers

## Best Practices

### 1. Memoization Guidelines

#### ✅ DO
```tsx
// Memoize expensive calculations
const complexStyle = useMemo(() => {
  return calculateComplexStyle(props);
}, [props.theme, props.variant]);

// Memoize event handlers with stable references
const handlePress = useCallback(() => {
  onPress?.(value);
}, [onPress, value]);

// Use React.memo for components that receive stable props
export default React.memo(Component);
```

#### ❌ DON'T
```tsx
// Don't memoize simple calculations
const simpleStyle = useMemo(() => ({ padding: 10 }), []); // Unnecessary

// Don't use empty dependency arrays unless intended
const handlePress = useCallback(() => {
  onPress?.(currentValue); // currentValue won't update!
}, []); // Missing dependency
```

### 2. Dependency Array Best Practices

- Include all values from component scope used inside the callback/memo
- Use primitive values when possible to avoid unnecessary re-computations
- Break down complex objects into primitive dependencies when feasible

### 3. Platform-Specific Optimizations

```tsx
// Memoize platform-specific styles separately
const shadowStyles = useMemo(() => 
  Platform.OS !== 'web' ? {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: theme.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } : {},
  [theme.shadow]
);
```

### 4. Animation Optimizations

```tsx
// Pre-calculate animation configurations
const animationConfig = useMemo(() => ({
  toValue: isExpanded ? 1 : 0,
  duration: 200,
  useNativeDriver: true,
}), [isExpanded]);
```

## Performance Testing

### Using the Performance Test Utility

CPK-UI includes a performance testing utility to measure component render performance:

```tsx
import { measureRenderPerformance } from '../utils/performanceTest';

// Test component render performance
const result = await measureRenderPerformance(() => (
  <Button text="Test" onPress={() => {}} />
), 1000);

console.log(`Average render time: ${result.averageTime}ms`);
```

### Testing Guidelines

1. **Render Performance**: Measure average render times for components
2. **Re-render Prevention**: Verify memoization prevents unnecessary re-renders
3. **Memory Usage**: Monitor memory consumption during component lifecycle
4. **Bundle Size**: Track component bundle size impact

### Example Performance Test

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { measureRenderPerformance } from '../utils/performanceTest';
import { Button } from './Button';

describe('Button Performance', () => {
  it('should render efficiently', async () => {
    const result = await measureRenderPerformance(() => (
      <Button text="Test Button" onPress={() => {}} />
    ), 100);

    expect(result.averageTime).toBeLessThan(10); // Should render in under 10ms
  });
});
```

## Bundle Size Considerations

### Tree Shaking

CPK-UI supports tree shaking to include only used components:

```tsx
// Import only what you need
import { Button } from 'cpk-ui/Button';
import { EditText } from 'cpk-ui/EditText';

// Avoid importing the entire library
import { Button, EditText } from 'cpk-ui'; // This includes everything
```

### Lazy Loading

For large applications, consider lazy loading heavy components:

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('cpk-ui/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Monitoring Performance

### Key Metrics to Track

1. **Component Render Time**: Average time for initial render
2. **Re-render Frequency**: How often components re-render unnecessarily
3. **Memory Usage**: Memory consumption patterns
4. **Bundle Size Impact**: Size contribution of each component

### Tools and Techniques

1. **React DevTools Profiler**: Analyze component render performance
2. **Metro Bundle Analyzer**: Track bundle size impact
3. **Flipper**: Monitor React Native performance metrics
4. **Performance Test Utility**: Automated performance testing

## Migration Guide

### Updating Existing Code

When updating to the optimized version of CPK-UI:

1. **No Breaking Changes**: All optimizations maintain API compatibility
2. **Automatic Performance**: Performance improvements are automatic
3. **Optional Testing**: Use performance testing utilities to verify improvements

### Custom Components

Apply similar optimization patterns to your custom components:

```tsx
import React, { memo, useCallback, useMemo } from 'react';

const CustomComponent = memo(({ data, onPress, theme }) => {
  const handlePress = useCallback(() => {
    onPress?.(data.id);
  }, [onPress, data.id]);

  const computedStyle = useMemo(() => ({
    backgroundColor: theme.background,
    padding: theme.spacing,
  }), [theme.background, theme.spacing]);

  return (
    <Pressable style={computedStyle} onPress={handlePress}>
      {/* Component content */}
    </Pressable>
  );
});

export default CustomComponent;
```

## Conclusion

The performance optimizations in CPK-UI provide significant improvements in render performance, memory usage, and user experience. By following the established patterns and best practices, developers can ensure their applications remain performant as they scale.

For questions or suggestions about performance optimizations, please refer to the contributing guidelines or open an issue in the repository.
