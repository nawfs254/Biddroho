import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Calendar, Disc, Volume2, Ticket, Sparkles, ChevronRight, Music } from 'lucide-react';
import { RELEASES_DATA, EVENTS_DATA, BAND_MEMBERS, MEDIA_ITEMS, NEWS_POSTS } from '@/data/mockData';
import ReleaseCard from '@/components/ReleaseCard';
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const latestRelease = RELEASES_DATA[0];
  const upcomingEvents = EVENTS_DATA.filter((e) => e.status === 'upcoming').slice(0, 2);
  const featuredMedia = MEDIA_ITEMS.slice(0, 4);
  const latestNews = NEWS_POSTS.slice(0, 3);

  return (
    <div>
      {/* 1. CINEMATIC HERO SECTION (Full Viewport) */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#050506'
        }}
      >
        {/* Hero Background Image with Atmospheric Layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/assets/hero_live.jpg"
            alt="BIDDROHO Performing Live in Stadium"
            fill
            priority
            style={{
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'brightness(0.42) contrast(1.15)'
            }}
          />

          {/* Gradients to blend smoothly into page */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(5,5,6,0.7) 0%, rgba(5,5,6,0.2) 40%, rgba(5,5,6,0.95) 90%, #050506 100%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 30%, rgba(5,5,6,0.85) 90%)'
            }}
          />
        </div>

        {/* Ambient Crimson Glow Pulse */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Hero Content */}
        <div
          className="site-container"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            paddingTop: '2rem',
            paddingBottom: '3rem',
            maxWidth: '1000px'
          }}
        >
          {/* Official Emblem / Subtitle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.25rem',
              backgroundColor: 'rgba(5, 5, 6, 0.75)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 1.25rem'
            }}
          >
            <div style={{ position: 'relative', width: '22px', height: '22px' }}>
              <Image src="/assets/logo.png" alt="BIDDROHO Symbol" fill style={{ objectFit: 'contain' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.22em',
                color: 'var(--crimson-base)'
              }}
            >
              ESTABLISHED 2011 • BANGLADESH ROCK
            </span>
          </div>

          {/* Large BIDDROHO Typography */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(4rem, 14vw, 10.5rem)',
              lineHeight: 0.88,
              letterSpacing: '0.04em',
              color: '#ffffff',
              textShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.25)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}
          >
            BIDDROHO
          </h1>

          {/* Short Brand Statement */}
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#e4e4e7',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.5
            }}
          >
            Unapologetic energy. Heavy guitars. Raw rebellion. The official sonic assault.
          </p>

          {/* Call to Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <Link
              href="/music"
              className="btn-primary"
              style={{
                fontSize: '1.2rem',
                padding: '1rem 2.5rem'
              }}
            >
              <Play size={18} fill="#fff" /> LISTEN NOW
            </Link>

            <Link
              href="/events"
              className="btn-secondary"
              style={{
                fontSize: '1.2rem',
                padding: '1rem 2.5rem'
              }}
            >
              <Calendar size={18} /> UPCOMING SHOWS
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            fontFamily: 'var(--font-display)',
            zIndex: 2
          }}
        >
          <span>SCROLL DOWN</span>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--crimson-base)' }} />
        </div>
      </section>

      {/* 2. LATEST RELEASE SECTION */}
      <section className="section-py" style={{ backgroundColor: '#070709', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="editorial-badge">// NEW RELEASE</span>
              <h2 className="section-title">THE LATEST RECORD</h2>
            </div>
            <Link href="/music" className="btn-outline-red">
              VIEW DISCOGRAPHY <ChevronRight size={16} />
            </Link>
          </div>

          {/* Featured Release Highlight Grid */}
          <div
            className="dark-card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              padding: 'clamp(1.5rem, 4vw, 3.5rem)',
              border: '1px solid var(--border-subtle)',
              alignItems: 'center'
            }}
          >
            {/* Album Artwork with Vinyl Peek */}
            <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto', width: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.2)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Image
                  src={latestRelease.coverImage}
                  alt={latestRelease.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Album Details */}
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: 'var(--crimson-subtle)',
                    color: 'var(--crimson-base)',
                    border: '1px solid var(--border-red)',
                    padding: '0.2rem 0.65rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em'
                  }}
                >
                  FULL LENGTH ALBUM
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  RELEASED {latestRelease.releaseDate}
                </span>
              </div>

              <h3 className="font-display" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', color: '#fff', lineHeight: 1, marginBottom: '1rem' }}>
                {latestRelease.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {latestRelease.fullDescription}
              </p>

              {/* Top 3 Track previews */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                  FEATURED ANTHEMS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {latestRelease.tracks.slice(0, 3).map((track) => (
                    <div
                      key={track.number}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ color: '#fff' }}>
                        <strong style={{ color: 'var(--crimson-base)', marginRight: '8px' }}>0{track.number}</strong>
                        {track.title}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{track.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href={`/music/${latestRelease.slug}`} className="btn-primary">
                  STREAM & TRACKLIST <ArrowRight size={16} />
                </Link>
                {latestRelease.streamingLinks.spotify && (
                  <a
                    href={latestRelease.streamingLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    OPEN SPOTIFY
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EVENTS SHOWCASE */}
      <section className="section-py" style={{ backgroundColor: '#050506' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="editorial-badge">// ON THE ROAD</span>
              <h2 className="section-title">UPCOMING PERFORMANCES</h2>
            </div>
            <Link href="/events" className="btn-outline-red">
              VIEW ALL DATES <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BAND INTRODUCTION (REAL MEMBERS) */}
      <section className="section-py" style={{ backgroundColor: '#08080a', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
            <span className="editorial-badge" style={{ justifyContent: 'center' }}>
              // THE SIX-PIECE LINEUP
            </span>
            <h2 className="section-title">MEET BIDDROHO</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Forged in Dhaka in 2011, six musicians driven by a collective hunger for high-octane live power, uncompromised songwriting, and visceral rock communion.
            </p>
          </div>

          {/* Member Portraits Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {BAND_MEMBERS.map((member) => (
              <Link
                key={member.id}
                href="/band"
                className="dark-card-interactive"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', aspectRatio: '3/4', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.85) 100%)'
                    }}
                  />
                </div>
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#fff', lineHeight: 1 }}>
                    {member.name}
                  </h3>
                  <p style={{ color: 'var(--crimson-base)', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600, marginTop: '4px' }}>
                    {member.role.toUpperCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/band" className="btn-secondary">
              READ FULL BAND BIOGRAPHY <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED MEDIA SNAPSHOTS */}
      <section className="section-py" style={{ backgroundColor: '#050506' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="editorial-badge">// SIGHT & SOUND</span>
              <h2 className="section-title">FEATURED MEDIA</h2>
            </div>
            <Link href="/media" className="btn-outline-red">
              VISIT MEDIA VAULT <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {featuredMedia.map((media) => (
              <div
                key={media.id}
                className="dark-card-interactive"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/10', width: '100%', backgroundColor: '#000' }}>
                  <Image
                    src={media.thumbnailUrl}
                    alt={media.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {media.type === 'video' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.4)'
                      }}
                    >
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--crimson-base)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 20px var(--crimson-glow)'
                        }}
                      >
                        <Play size={20} color="#fff" style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--crimson-base)', letterSpacing: '0.15em', fontFamily: 'var(--font-display)' }}>
                    {media.category.toUpperCase()} • {media.date}
                  </span>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', color: '#fff', marginTop: '4px' }}>
                    {media.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS */}
      <section className="section-py" style={{ backgroundColor: '#070709', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="site-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="editorial-badge">// OFFICIAL DISPATCH</span>
              <h2 className="section-title">LATEST NEWS</h2>
            </div>
            <Link href="/news" className="btn-outline-red">
              ALL NEWS ARTICLES <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {latestNews.map((item) => (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className="dark-card-interactive"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', backgroundColor: '#000' }}>
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'rgba(5, 5, 6, 0.85)',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.75rem',
                      color: 'var(--crimson-base)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {item.category.toUpperCase()}
                  </div>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                    {item.date} • {item.readTime}
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1.65rem', color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {item.excerpt}
                  </p>
                  <span style={{ color: 'var(--crimson-base)', fontSize: '0.9rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', marginTop: 'auto' }}>
                    READ STORY ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CINEMATIC BOOKING CTA */}
      <section
        style={{
          position: 'relative',
          padding: '7rem 0',
          backgroundColor: '#050506',
          borderTop: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.25,
            zIndex: 0
          }}
        >
          <Image
            src="/assets/hero_live.jpg"
            alt="Concert background"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="site-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '850px' }}>
          <span className="editorial-badge" style={{ justifyContent: 'center' }}>
            // DIRECT ENGAGEMENT
          </span>
          <h2
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', marginBottom: '1.5rem' }}
          >
            BRING BIDDROHO TO YOUR STAGE
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: '650px',
              margin: '0 auto 2.5rem'
            }}
          >
            Available for national festivals, headline concerts, university galas, and corporate tours. Review technical specifications and initiate official booking.
          </p>

          <Link
            href="/book"
            className="btn-primary"
            style={{ fontSize: '1.35rem', padding: '1.15rem 3.5rem' }}
          >
            INITIATE BOOKING INQUIRY <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
