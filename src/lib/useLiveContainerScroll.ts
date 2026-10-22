'use client';

import { useMotionValue, MotionValue } from 'framer-motion';
import { useEffect } from 'react';

interface ScrollOptions {
  startOffset?: number; // Pixels from top of viewport (e.g. 0 or 80 for sticky headers)
  mode?: 'sticky' | 'reveal';
}

/**
 * Ultra-robust, hardware-accurate scroll progress tracker for mobile & desktop.
 * Measures element viewport position directly via requestAnimationFrame and scroll listeners,
 * completely immune to mobile touch inertial throttling and varying window.scrollY implementations.
 */
export function useLiveContainerScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ScrollOptions = {}
): MotionValue<number> {
  const progress = useMotionValue(0);

  const startOff = options.startOffset ?? 0;
  const mode = options.mode ?? 'sticky';

  useEffect(() => {
    let lastProgress = -1;
    let rafId: number;

    const measure = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight || 800;

      let val = 0;
      if (mode === 'reveal') {
        // Starts revealing when element enters 88% of viewport
        // Finishes gradually as user scrolls comfortably through the section
        const startY = windowH * 0.88;
        const endY = -windowH * 0.08;
        const totalDistance = Math.max(startY - endY, 1);
        const currentDistance = startY - rect.top;
        val = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
      } else {
        // Sticky container mode:
        // Progress 0 when container top reaches startOff (e.g. 0 or 80px)
        // Progress 1 when container has scrolled through its entire scrollable length
        const total = el.offsetHeight - windowH + startOff;
        if (total > 0) {
          const current = -(rect.top - startOff);
          val = Math.min(Math.max(current / total, 0), 1);
        }
      }

      if (Math.abs(val - lastProgress) > 0.0005) {
        lastProgress = val;
        progress.set(val);
        console.log('[LIVE_SCROLL]', mode, 'val:', val.toFixed(3), 'rectTop:', Math.round(rect.top));
      }
    };

    // Continuous tick during touch gestures and momentum scrolling
    const tick = () => {
      measure();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener('scroll', measure, { passive: true });
    document.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('touchmove', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    // Lenis listener if available
    const lenis = typeof window !== 'undefined' ? (window as any).__lenis : null;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', measure);
    }

    // Initial calculations
    measure();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', measure);
      document.removeEventListener('scroll', measure);
      window.removeEventListener('touchmove', measure);
      window.removeEventListener('resize', measure);
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', measure);
      }
    };
  }, [containerRef, startOff, mode, progress]);

  return progress;
}

