'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AudioPlayerBar from './AudioPlayerBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: '1 0 auto', paddingTop: '80px', paddingBottom: '70px' }}>
        {children}
      </main>
      <AudioPlayerBar />
      <Footer />
    </>
  );
}
