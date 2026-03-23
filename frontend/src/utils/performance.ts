import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay  
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  
  // Custom metrics
  componentMountTime?: number;
  renderCount: number;
  lastRenderTime?: number;
}

interface PerformanceReport {
  url: string;
  timestamp: number;
  metrics: PerformanceMetrics;
  userAgent: string;
  connection?: string;
}

/**
 * Hook for tracking component performance metrics
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number | undefined>(undefined);
  const metricsRef = useRef<PerformanceMetrics>({ renderCount: 0 });

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const mountDuration = unmountTime - (mountTime.current || unmountTime);
      
      console.log(`[Performance] ${componentName} mounted for ${mountDuration.toFixed(2)}ms`);
      
      // Log metrics to analytics if available
      if ((window as any).analytics) {
        (window as any).analytics.track('component_lifecycle', {
          component: componentName,
          mountDuration,
          renderCount: renderCount.current
        });
      }
    };
  }, [componentName]);

  // Track renders
  renderCount.current++;
  metricsRef.current.renderCount = renderCount.current;
  metricsRef.current.lastRenderTime = performance.now();

  return {
    getMetrics: () => ({ ...metricsRef.current }),
    renderCount: renderCount.current
  };
}

/**
 * Track Core Web Vitals
 */
export function trackWebVitals(callback?: (metrics: PerformanceMetrics) => void) {
  const metrics: PerformanceMetrics = { renderCount: 0 };

  // Largest Contentful Paint
  if ('web-vital' in window) {
    // @ts-ignore
    import('web-vitals').then(({ getLCP, getFID, getCLS, getFCP, getTTFB }) => {
      getLCP((entry: any) => {
        metrics.LCP = entry.value;
        console.log('[Web Vitals] LCP:', entry.value);
      });
      
      getFID((entry: any) => {
        metrics.FID = entry.value;
        console.log('[Web Vitals] FID:', entry.value);
      });
      
      getCLS((entry: any) => {
        metrics.CLS = entry.value;
        console.log('[Web Vitals] CLS:', entry.value);
      });
      
      getFCP((entry: any) => {
        metrics.FCP = entry.value;
        console.log('[Web Vitals] FCP:', entry.value);
      });
      
      getTTFB((entry: any) => {
        metrics.TTFB = entry.value;
        console.log('[Web Vitals] TTFB:', entry.value);
      });
    });
  }

  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (callback) callback(metrics);
      
      // Report to console for development
      console.log('[Performance Report]', {
        url: window.location.href,
        metrics,
        navigation: performance.getEntriesByType('navigation')[0]
      });
    }, 1000);
  });

  return metrics;
}

/**
 * Measure function execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms (async)`);
      }) as ReturnType<T>;
    }
    
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    
    return result;
  }) as T;
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracker() {
  const trackInteraction = useCallback((action: string, metadata?: Record<string, any>) => {
    const interaction = {
      action,
      timestamp: Date.now(),
      metadata,
      path: window.location.pathname
    };
    
    console.log('[Interaction]', interaction);
    
    // Send to analytics
    if ((window as any).analytics) {
      (window as any).analytics.track(action, metadata);
    }
  }, []);

  return { trackInteraction };
}

/**
 * Log performance marks and measures
 */
export function logPerformanceMark(markName: string) {
  performance.mark(markName);
  console.log(`[Performance Mark] ${markName}`);
}

export function logPerformanceMeasure(name: string, startMark: string, endMark: string) {
  performance.measure(name, startMark, endMark);
  const entries = performance.getEntriesByName(name);
  if (entries.length > 0) {
    console.log(`[Performance Measure] ${name}: ${entries[0].duration.toFixed(2)}ms`);
  }
}
