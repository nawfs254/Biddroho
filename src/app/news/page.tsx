import React from 'react';
import { Metadata } from 'next';
import { getNews } from '@/lib/dataService';
import NewsClientView from '@/components/NewsClientView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Official News & Press',
  description: 'Latest official announcements, studio recording logs, and tour dispatches directly from BIDDROHO.'
};

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Header */}
      <section
        style={{
          padding: '5rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="ambient-glow-spot" style={{ top: '-100px', right: '-50px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// OFFICIAL DISPATCH (MONGODB)</span>
          <h1 className="section-title">BAND NEWS & PRESS</h1>
          <p className="section-description">
            Official communiqués, studio diaries, tour announcements, and press coverage from the BIDDROHO camp.
          </p>

          <NewsClientView initialNews={newsItems} />
        </div>
      </section>
    </div>
  );
}
