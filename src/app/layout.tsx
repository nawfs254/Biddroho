import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayerBar from '@/components/AudioPlayerBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddroho.com'),
  title: {
    default: 'BIDDROHO | Official Digital Home of the Heavy Rock Band',
    template: '%s | BIDDROHO Official'
  },
  description: 'The official digital sanctuary of BIDDROHO. Heavy guitars, raw rebellion, and anthemic Bengali rock forged since 2011. Stream discography, tour dates, media, band biography and booking.',
  keywords: [
    'BIDDROHO',
    'Biddroho Band',
    'Bangladeshi Rock Band',
    'Heavy Rock',
    'Bengali Rock',
    'Bangla Metal',
    'Rock Music Dhaka',
    'Chhinno Prohor',
    'Srijon',
    'Mahir',
    'Alvi',
    'Aurko',
    'Arnob',
    'Ridoy'
  ],
  authors: [{ name: 'BIDDROHO' }],
  creator: 'BIDDROHO',
  publisher: 'BIDDROHO Music',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://biddroho.com',
    siteName: 'BIDDROHO Official',
    title: 'BIDDROHO | Official Digital Home',
    description: 'Unapologetic energy. Heavy guitars. Raw rebellion. The official digital home of BIDDROHO.',
    images: [
      {
        url: '/assets/hero_live.jpg',
        width: 1200,
        height: 630,
        alt: 'BIDDROHO Live in Concert'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIDDROHO | Official Band Website',
    description: 'Official digital home of heavy rock band BIDDROHO.',
    images: ['/assets/hero_live.jpg']
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: '/assets/logo.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' }
    ],
    shortcut: '/assets/logo.png',
    apple: '/assets/logo.png'
  }
};

import AppShell from '@/components/AppShell';
import UnavailablePage from '@/components/UnavailablePage';
import { isDatabaseConnected } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConnected = await isDatabaseConnected();

  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {isConnected ? (
          <AppShell>{children}</AppShell>
        ) : (
          <UnavailablePage />
        )}
      </body>
    </html>
  );
}
