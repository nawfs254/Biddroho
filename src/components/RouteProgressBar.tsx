'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavigationBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timers
  const clearAllTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  const startLoading = () => {
    clearAllTimers();
    setLoading(true);
    setProgress(18);

    const t1 = setTimeout(() => setProgress(45), 180);
    const t2 = setTimeout(() => setProgress(72), 450);
    const t3 = setTimeout(() => setProgress(88), 900);
    // Safety auto-finish after 9s in case navigation aborted
    const t4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 250);
    }, 9000);

    timerRef.current = [t1, t2, t3, t4];
  };

  const finishLoading = () => {
    clearAllTimers();
    setProgress(100);
    const t = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);
    timerRef.current = [t];
  };

  // When pathname or searchParams change, finish loading!
  useEffect(() => {
    if (loading) {
      finishLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept any internal link click
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Ignore modified clicks (cmd, ctrl, shift, alt) or non-left clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, hash only, tel, mailto, target="_blank", or download
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return;
      }

      // Check URL
      try {
        const nextUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // If different origin, it's external
        if (nextUrl.origin !== currentUrl.origin) return;

        // If same pathname and search params (just hash or identical), skip
        if (
          nextUrl.pathname === currentUrl.pathname &&
          nextUrl.search === currentUrl.search
        ) {
          return;
        }

        // It's a real navigation to another page!
        startLoading();
      } catch {
        // invalid URL, ignore
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      clearAllTimers();
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* Top Crimson Laser Progress Bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 999999,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #b91c1c 0%, #e50914 50%, #ff4d4d 100%)',
            boxShadow: '0 0 10px rgba(229, 9, 20, 0.9), 0 0 20px rgba(229, 9, 20, 0.6)',
            transition: progress === 100 ? 'width 0.2s ease-out' : 'width 0.35s ease',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>

      {/* Floating Rock Loading Pill Badge (Top Right) */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '20px',
          zIndex: 999999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(8, 8, 11, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(229, 9, 20, 0.45)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(229, 9, 20, 0.25)',
          padding: '6px 14px',
          borderRadius: '9999px',
          animation: 'fadeInPill 0.2s ease-out',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInPill {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spinMiniDisk {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulseMiniEq {
            0%, 100% { height: 3px; }
            50% { height: 11px; }
          }
        ` }} />

        {/* Mini spinning vinyl disk */}
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#18181b',
            border: '1px solid #e50914',
            animation: 'spinMiniDisk 1.2s linear infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#e50914',
            }}
          />
        </div>

        {/* Mini equalizer bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '11px' }}>
          <div style={{ width: '2px', backgroundColor: '#e50914', animation: 'pulseMiniEq 0.5s ease-in-out infinite' }} />
          <div style={{ width: '2px', backgroundColor: '#ff4d4d', animation: 'pulseMiniEq 0.7s ease-in-out infinite 0.15s' }} />
          <div style={{ width: '2px', backgroundColor: '#e50914', animation: 'pulseMiniEq 0.6s ease-in-out infinite 0.3s' }} />
        </div>

        <span
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          LOADING...
        </span>
      </div>
    </>
  );
}

export default function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <NavigationBarInner />
    </Suspense>
  );
}
