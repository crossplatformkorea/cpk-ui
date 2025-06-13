import React, {useCallback, useEffect, useRef, useState} from 'react';

/**
 * Performance testing utilities for cpk-ui components
 */

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
}

/**
 * Hook to track component render performance
 * Useful for development and testing component optimizations
 */
export function usePerformanceTest(componentName: string = 'Unknown'): PerformanceMetrics {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRenderStart = useRef(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: 0,
  });

  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - lastRenderStart.current;
    
    renderCount.current += 1;
    renderTimes.current.push(renderTime);
    
    // Keep only last 100 render times to avoid memory issues
    if (renderTimes.current.length > 100) {
      renderTimes.current = renderTimes.current.slice(-100);
    }
    
    const averageRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length;
    const maxRenderTime = Math.max(...renderTimes.current);
    const minRenderTime = Math.min(...renderTimes.current);
    
    setMetrics({
      renderCount: renderCount.current,
      lastRenderTime: renderTime,
      averageRenderTime,
      maxRenderTime,
      minRenderTime,
    });
    
    // Log performance if it's slow (over 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }
    
    lastRenderStart.current = performance.now();
  });

  return metrics;
}

/**
 * Hook to measure style calculation performance
 */
export function useStylePerformanceTest() {
  const measureStyleCalculation = useCallback((
    styleFn: () => any,
    styleName: string = 'Style'
  ) => {
    const start = performance.now();
    const result = styleFn();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 1) {
      console.warn(`[Style Performance] ${styleName} calculation took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }, []);

  return measureStyleCalculation;
}

/**
 * Hook to detect unnecessary re-renders
 */
export function useRenderTracker(props: Record<string, any>, componentName: string = 'Component') {
  const prevProps = useRef<Record<string, any> | undefined>(undefined);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    if (prevProps.current) {
      const changedProps: string[] = [];
      
      Object.keys(props).forEach(key => {
        if (prevProps.current![key] !== props[key]) {
          changedProps.push(key);
        }
      });
      
      if (changedProps.length === 0) {
        console.warn(`[Render Tracker] ${componentName} re-rendered without prop changes (render #${renderCount.current})`);
      } else if (changedProps.length > 0) {
        console.log(`[Render Tracker] ${componentName} re-rendered due to: ${changedProps.join(', ')}`);
      }
    }
    
    prevProps.current = props;
  });

  return renderCount.current;
}

/**
 * Hook to measure memory usage (approximation)
 */
export function useMemoryTracker(componentName: string = 'Component') {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  useEffect(() => {
    // Only available in some browsers and development
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      setMemoryUsage(usedJSHeapSize);
      
      if (usedJSHeapSize > 50) { // Warn if over 50MB
        console.warn(`[Memory] ${componentName} - High memory usage: ${usedJSHeapSize.toFixed(2)}MB`);
      }
    }
  });

  return memoryUsage;
}

/**
 * Component wrapper for performance testing
 */
export function withPerformanceTest<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const PerformanceTestWrapper = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const metrics = usePerformanceTest(name);
    const renderCount = useRenderTracker(props as Record<string, any>, name);
    const memoryUsage = useMemoryTracker(name);

    // Log metrics every 10 renders
    useEffect(() => {
      if (renderCount % 10 === 0 && renderCount > 0) {
        console.log(`[Performance Summary] ${name}:`, {
          renders: renderCount,
          avgRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
          maxRenderTime: `${metrics.maxRenderTime.toFixed(2)}ms`,
          memoryUsage: `${memoryUsage.toFixed(2)}MB`,
        });
      }
    }, [renderCount, metrics, memoryUsage, name]);

    return React.createElement(Component, props);
  };

  PerformanceTestWrapper.displayName = `withPerformanceTest(${componentName || Component.displayName || Component.name})`;
  
  return PerformanceTestWrapper;
}
