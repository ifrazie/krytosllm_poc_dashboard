/**
 * Performance utilities for measuring and optimizing React application performance
 */

import React from 'react';

// Performance measurement utilities
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  private static observers: PerformanceObserver[] = [];

  /**
   * Start measuring a performance metric
   */
  static startMeasurement(name: string): void {
    performance.mark(`${name}-start`);
  }

  /**
   * End measuring a performance metric and record the result
   */
  static endMeasurement(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure?.duration || 0;
    
    // Store measurement
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
    
    // Clean up marks and measures
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  /**
   * Get average measurement for a metric
   */
  static getAverageMeasurement(name: string): number {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) return 0;
    
    const sum = measurements.reduce((a, b) => a + b, 0);
    return sum / measurements.length;
  }

  /**
   * Get all measurements for a metric
   */
  static getMeasurements(name: string): number[] {
    return this.measurements.get(name) || [];
  }

  /**
   * Clear measurements for a metric
   */
  static clearMeasurements(name: string): void {
    this.measurements.delete(name);
  }

  /**
   * Clear all measurements
   */
  static clearAllMeasurements(): void {
    this.measurements.clear();
  }

  /**
   * Start observing performance entries
   */
  static startObserving(): void {
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation timing:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            totalTime: navEntry.loadEventEnd - navEntry.fetchStart
          });
        }
      });
    });

    try {
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (e) {
      console.warn('Navigation timing observation not supported');
    }

    // Observe paint timing
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.startTime}ms`);
      });
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    } catch (e) {
      console.warn('Paint timing observation not supported');
    }

    // Observe largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('Largest Contentful Paint:', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }

  /**
   * Stop observing performance entries
   */
  static stopObserving(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Get performance report
   */
  static getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};
    
    // Add custom measurements
    this.measurements.forEach((measurements, name) => {
      report[name] = {
        count: measurements.length,
        average: this.getAverageMeasurement(name),
        min: Math.min(...measurements),
        max: Math.max(...measurements),
        latest: measurements[measurements.length - 1]
      };
    });

    // Add browser performance metrics
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        report.navigation = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnect: navigation.connectEnd - navigation.connectStart,
          serverResponse: navigation.responseEnd - navigation.requestStart
        };
      }

      const paint = performance.getEntriesByType('paint');
      paint.forEach((entry) => {
        report[entry.name.replace('-', '_')] = entry.startTime;
      });
    }

    return report;
  }
}

// React-specific performance utilities
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  return React.memo((props: P) => {
    React.useEffect(() => {
      PerformanceMonitor.startMeasurement(`${componentName}-render`);
      return () => {
        PerformanceMonitor.endMeasurement(`${componentName}-render`);
      };
    });

    return React.createElement(Component, props);
  });
};

// Hook for measuring component render time
export const usePerformanceTracking = (componentName: string) => {
  React.useEffect(() => {
    PerformanceMonitor.startMeasurement(`${componentName}-mount`);
    return () => {
      PerformanceMonitor.endMeasurement(`${componentName}-mount`);
    };
  }, [componentName]);

  const trackRender = React.useCallback(() => {
    PerformanceMonitor.startMeasurement(`${componentName}-render`);
    // Use setTimeout to measure after render
    setTimeout(() => {
      PerformanceMonitor.endMeasurement(`${componentName}-render`);
    }, 0);
  }, [componentName]);

  return { trackRender };
};

// Bundle size analysis utilities
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => 
      resource.name.endsWith('.js') || resource.name.includes('chunk')
    );

    const bundleAnalysis = jsResources.map(resource => ({
      name: resource.name.split('/').pop() || resource.name,
      size: resource.transferSize || 0,
      loadTime: resource.responseEnd - resource.requestStart,
      cached: resource.transferSize === 0
    }));

    console.table(bundleAnalysis);
    return bundleAnalysis;
  }
  return [];
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

// Development-only performance logging
export const logPerformanceMetrics = () => {
  if (import.meta.env.MODE === 'development') {
    console.group('🚀 Performance Metrics');
    console.table(PerformanceMonitor.getPerformanceReport());
    
    const memoryUsage = trackMemoryUsage();
    if (memoryUsage) {
      console.log('💾 Memory Usage:', {
        used: `${(memoryUsage.used / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memoryUsage.total / 1024 / 1024).toFixed(2)} MB`,
        usage: `${memoryUsage.usagePercentage.toFixed(1)}%`
      });
    }
    
    analyzeBundleSize();
    console.groupEnd();
  }
};