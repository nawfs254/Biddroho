import React from 'react';
import { Metadata } from 'next';
import { getMedia } from '@/lib/dataService';
import MediaClientView from '@/components/MediaClientView';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Media & Visual Vault',
  description: 'Concert photography, official music videos, and behind-the-scenes documentation of BIDDROHO.'
};

export default async function MediaPage() {
  const mediaItems = await getMedia();

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
        <div className="ambient-glow-spot" style={{ top: '-120px', right: '-80px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// VISUAL VAULT (MONGODB)</span>
          <h1 className="section-title">MEDIA & ARCHIVES</h1>
          <p className="section-description">
            Live concert documentation, high-definition portraits, backstage chronicles, and official videography capturing the unfiltered essence of BIDDROHO.
          </p>

          <MediaClientView initialMedia={mediaItems} />
        </div>
      </section>
    </div>
  );
}
