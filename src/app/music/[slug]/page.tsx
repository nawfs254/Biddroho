import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, ArrowLeft, Disc3, ExternalLink, Music, Clock } from 'lucide-react';
import { getReleaseBySlug, getReleases } from '@/lib/dataService';
import { Release } from '@/data/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const releases = await getReleases();
  return releases.map((release) => ({
    slug: release.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return { title: 'Release Not Found' };

  return {
    title: `${release.title} (${release.year})`,
    description: release.shortDescription,
    openGraph: {
      title: `${release.title} | BIDDROHO Official`,
      description: release.shortDescription,
      images: [
        {
          url: release.coverImage,
          width: 800,
          height: 800,
          alt: release.title,
        },
      ],
    },
  };
}

export default async function SingleReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  const allReleases = await getReleases();
  const otherReleases = allReleases.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Back button breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1.25rem 0' }}>
        <div className="site-container">
          <Link
            href="/music"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-display)'
            }}
          >
            <ArrowLeft size={16} /> BACK TO DISCOGRAPHY
          </Link>
        </div>
      </div>

      {/* Release Hero Section */}
      <section style={{ padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="ambient-glow-spot" style={{ top: '0', left: '10%' }} />

        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'start'
            }}
          >
            {/* Left: Album Cover Art */}
            <div>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  maxWidth: '500px',
                  margin: '0 auto',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px var(--crimson-glow)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Image
                  src={release.coverImage}
                  alt={release.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Streaming Links Panel */}
              <div
                className="dark-card"
                style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  maxWidth: '500px',
                  margin: '2rem auto 0'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.15em',
                    color: 'var(--crimson-base)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}
                >
                  // STREAM NOW ON OFFICIAL PLATFORMS
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {release.streamingLinks?.spotify?.trim() ? (
                    <a
                      href={release.streamingLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-red"
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      SPOTIFY <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-outline-red"
                      title="Spotify link not available"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.6rem 1rem',
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#71717a',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      SPOTIFY <ExternalLink size={14} style={{ opacity: 0.4 }} />
                    </button>
                  )}

                  {release.streamingLinks?.appleMusic?.trim() ? (
                    <a
                      href={release.streamingLinks.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-red"
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      APPLE MUSIC <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-outline-red"
                      title="Apple Music link not available"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.6rem 1rem',
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#71717a',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      APPLE MUSIC <ExternalLink size={14} style={{ opacity: 0.4 }} />
                    </button>
                  )}

                  {release.streamingLinks?.youtubeMusic?.trim() ? (
                    <a
                      href={release.streamingLinks.youtubeMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-red"
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      YT MUSIC <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-outline-red"
                      title="YouTube Music link not available"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.6rem 1rem',
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#71717a',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      YT MUSIC <ExternalLink size={14} style={{ opacity: 0.4 }} />
                    </button>
                  )}

                  {release.streamingLinks?.soundcloud?.trim() ? (
                    <a
                      href={release.streamingLinks.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-red"
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      SOUNDCLOUD <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-outline-red"
                      title="SoundCloud link not available"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.6rem 1rem',
                        opacity: 0.35,
                        cursor: 'not-allowed',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#71717a',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      SOUNDCLOUD <ExternalLink size={14} style={{ opacity: 0.4 }} />
                    </button>
                  )}

                  {release.streamingLinks?.tidal?.trim() && (
                    <a
                      href={release.streamingLinks.tidal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-red"
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      TIDAL <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Album Overview & Tracklist */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
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
                  {release.type.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {release.releaseDate} • {release.year}
                </span>
              </div>

              <h1 className="font-display" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', color: '#fff', lineHeight: 0.95, marginBottom: '1.5rem' }}>
                {release.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                {release.fullDescription}
              </p>

              {/* Tracklist Table */}
              {release.tracks && release.tracks.length > 0 && (
                <div style={{ marginBottom: '3.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '0.75rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <span className="font-display" style={{ fontSize: '1.25rem', letterSpacing: '0.1em', color: '#fff' }}>
                      TRACKLIST ({release.tracks.length} TRACKS)
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DURATION</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {release.tracks.map((track) => (
                      <div
                        key={track.number}
                        className="dark-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <span
                            className="font-display"
                            style={{
                              fontSize: '1.2rem',
                              color: 'var(--crimson-base)',
                              minWidth: '24px'
                            }}
                          >
                            {track.number < 10 ? `0${track.number}` : track.number}
                          </span>
                          <div>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', display: 'block' }}>
                              {track.title}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BIDDROHO</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            {track.duration}
                          </span>
                          <button
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              padding: '0.4rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={`Play ${track.title}`}
                          >
                            <Play size={14} fill="#fff" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Album Credits Block */}
              {release.credits && (
                <div
                  className="dark-card"
                  style={{
                    padding: '2rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <h3 className="font-display" style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                    PRODUCTION & RELEASE CREDITS
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
                        Produced By
                      </span>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{release.credits.producedBy}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
                        Mixing & Mastering
                      </span>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{release.credits.mixedMasteredBy}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
                        Recorded At
                      </span>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{release.credits.recordedAt}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
                        Artwork
                      </span>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{release.credits.artworkBy}</span>
                    </div>
                  </div>

                  {release.credits.lineup && release.credits.lineup.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                        Official Band Lineup
                      </span>
                      <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', padding: 0, margin: 0 }}>
                        {release.credits.lineup.map((person: any, i: number) => {
                          const name = typeof person === 'string' ? person : person?.name;
                          const role = typeof person === 'object' ? person?.role : '';
                          if (!name) return null;
                          return (
                            <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <span style={{ color: 'var(--crimson-base)', fontWeight: 'bold' }}>•</span>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{name}</span>
                              {role && (
                                <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
                                  — {role}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Releases */}
      {otherReleases.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
          <div className="site-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 className="font-display" style={{ fontSize: '2rem', color: '#fff' }}>OTHER RELEASES</h3>
              <Link href="/music" className="btn-outline-red">
                VIEW ALL
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {otherReleases.map((other) => (
                <div key={other._id}>
                  <Link href={`/music/${other.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                      <Image src={other.coverImage} alt={other.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <h4 className="font-display" style={{ fontSize: '1.4rem', color: '#fff' }}>{other.title}</h4>
                    <p style={{ color: 'var(--crimson-base)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>{other.type.toUpperCase()} • {other.year}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
