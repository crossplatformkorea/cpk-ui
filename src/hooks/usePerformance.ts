import {useEffect, useRef} from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowRenders: number;
}

const SLOW_RENDER_THRESHOLD = 16; // 16ms for 60fps

/**
 * Hook to monitor component render performance
 * Only active in development mode
 */
export function usePerformanceMonitor(
  componentName: string,
  enabled: boolean = __DEV__,
): PerformanceMetrics | null {
  const metricsRef = useRef<PerformanceMetrics>({
    componentName,
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0,
  });

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    const metrics = metricsRef.current;
    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.averageRenderTime =
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) /
      metrics.renderCount;

    if (renderTime > SLOW_RENDER_THRESHOLD) {
      metrics.slowRenders++;
      console.warn(
        `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
      );
    }
  });

  if (enabled) {
    startTimeRef.current = performance.now();
  }

  return enabled ? metricsRef.current : null;
}

/**
 * Hook to track unnecessary re-renders
 */
export function useRenderTracker(
  componentName: string,
  props: Record<string, any>,
  enabled: boolean = __DEV__,
): void {
  const prevPropsRef = useRef<Record<string, any> | undefined>(undefined);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    renderCountRef.current++;

    if (prevPropsRef.current) {
      const changedProps = Object.keys(props).filter(
        (key) => props[key] !== prevPropsRef.current![key],
      );

      if (changedProps.length === 0) {
        console.warn(
          `Unnecessary re-render in ${componentName} (render #${renderCountRef.current})`,
        );
      } else if (renderCountRef.current > 10) {
        console.info(
          `${componentName} re-rendered due to: ${changedProps.join(', ')}`,
        );
      }
    }

    prevPropsRef.current = {...props};
  });
}
