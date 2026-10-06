import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Disc3, Play, Radio, Volume2, ArrowRight } from 'lucide-react';
import { getReleases } from '@/lib/dataService';
import ReleaseCard from '@/components/ReleaseCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Music & Discography',
  description: 'Explore the complete discography of BIDDROHO. Full albums, conceptual EPs, and singles spanning 15 years of heavy alternative rock.'
};

export default async function MusicPage() {
  const releases = await getReleases();
  const featuredRelease = releases.find((r) => r.featured) || releases[0];
  const albums = releases.filter((r) => r.type === 'album');
  const eps = releases.filter((r) => r.type === 'ep');
  const singles = releases.filter((r) => r.type === 'single');

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh' }}>
      {/* Editorial Header */}
      <section
        style={{
          padding: '5rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="ambient-glow-spot" style={{ top: '-150px', right: '-100px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// OFFICIAL DISCOGRAPHY (MONGODB)</span>
          <h1 className="section-title">THE SONIC REBELLION</h1>
          <p className="section-description">
            Explore the recorded catalog of BIDDROHO. From brutal heavy riffs and intricate guitar harmonies to expansive conceptual atmospheres, each release represents a milestone in contemporary Bengali rock.
          </p>
        </div>
      </section>

      {/* 1. FEATURED RELEASE HERO BANNER */}
      {featuredRelease && (
        <section className="section-py" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="site-container">
            <div style={{ marginBottom: '2rem' }}>
              <span className="editorial-badge">// SPOTLIGHT RELEASE</span>
              <h2 className="font-display" style={{ fontSize: '2.5rem', color: '#fff' }}>FEATURED RECORD</h2>
            </div>

            <div
              className="dark-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3.5rem',
                padding: 'clamp(2rem, 5vw, 4rem)',
                alignItems: 'center',
                border: '1px solid var(--border-red)'
              }}
            >
              {/* Cover */}
              <div style={{ position: 'relative', maxWidth: '420px', width: '100%', margin: '0 auto' }}>
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px var(--crimson-glow)'
                  }}
                >
                  <Image
                    src={featuredRelease.coverImage}
                    alt={featuredRelease.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              </div>

              {/* Info */}
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--crimson-base)',
                      color: '#fff',
                      padding: '0.2rem 0.75rem',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.15em'
                    }}
                  >
                    {featuredRelease.type.toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {featuredRelease.releaseDate} • {featuredRelease.tracks?.length || 0} Tracks
                  </span>
                </div>

                <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', lineHeight: 0.95, marginBottom: '1.25rem' }}>
                  {featuredRelease.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {featuredRelease.shortDescription}
                </p>

                {/* Streaming links */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  <Link href={`/music/${featuredRelease.slug}`} className="btn-primary">
                    EXPLORE ALBUM & LYRICS <ArrowRight size={16} />
                  </Link>
                  {featuredRelease.streamingLinks?.spotify?.trim() ? (
                    <a
                      href={featuredRelease.streamingLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      SPOTIFY
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-secondary"
                      title="Spotify link not available"
                      style={{
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        color: '#71717a',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      SPOTIFY
                    </button>
                  )}
                </div>

                {/* Track list teaser */}
                {featuredRelease.tracks && featuredRelease.tracks.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--crimson-base)', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                      TRACK PREVIEW:
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.9rem' }}>
                      <span>01. {featuredRelease.tracks[0].title}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{featuredRelease.tracks[0].duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ALBUMS */}
      {albums.length > 0 && (
        <section className="section-py" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="site-container">
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="editorial-badge">// FULL LENGTH LP</span>
              <h2 className="section-title">STUDIO ALBUMS</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {albums.map((album) => (
                <ReleaseCard key={album._id} release={album} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. EPS */}
      {eps.length > 0 && (
        <section className="section-py" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="site-container">
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="editorial-badge">// EXTENDED PLAYS</span>
              <h2 className="section-title">CONCEPTUAL EPS</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {eps.map((ep) => (
                <ReleaseCard key={ep._id} release={ep} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SINGLES */}
      {singles.length > 0 && (
        <section className="section-py">
          <div className="site-container">
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="editorial-badge">// STANDALONE CUTS</span>
              <h2 className="section-title">SINGLES & REMIXES</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {singles.map((single) => (
                <ReleaseCard key={single._id} release={single} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {releases.length === 0 && (
        <section className="section-py">
          <div className="site-container" style={{ textAlign: 'center', padding: '5rem 1.5rem', border: '1px dashed var(--border-subtle)', background: 'rgba(255, 255, 255, 0.01)' }}>
            <Disc3 size={40} style={{ color: 'var(--crimson-base)', margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Releases Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
              No data available
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
