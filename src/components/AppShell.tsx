'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AudioPlayerBar from './AudioPlayerBar';
import SmoothScroll from './SmoothScroll';
import RouteProgressBar from './RouteProgressBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <RouteProgressBar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
      </>
    );
  }

  return (
    <>
      <RouteProgressBar />
      <Navbar />
      <SmoothScroll>
        <main style={{ flex: '1 0 auto', paddingTop: '80px', paddingBottom: '70px' }}>
          {children}
        </main>
        <AudioPlayerBar />
        <Footer />
      </SmoothScroll>
    </>
  );
}
