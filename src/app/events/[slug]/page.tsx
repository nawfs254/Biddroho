import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft, Users, ShieldAlert, Disc3, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { getEventBySlug, getEvents } from '@/lib/dataService';
import { EventItem } from '@/data/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} — ${event.city} Live`,
    description: event.description,
    openGraph: {
      title: `${event.title} | BIDDROHO Live`,
      description: event.description,
      images: [{ url: event.posterImage, width: 800, height: 1100, alt: event.title }],
    },
  };
}

export default async function SingleEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isPast = event.status === 'past' || (event.status !== 'upcoming' && Boolean(event.date) && new Date(event.date) < today);
  const isSoldOut = event.ticketStatus === 'sold_out';
  const isNotLiveYet = event.ticketStatus === 'not_live_yet' || event.ticketStatus === 'not_live';

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1.25rem 0' }}>
        <div className="site-container">
          <Link
            href="/events"
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
            <ArrowLeft size={16} /> BACK TO CONCERTS & TOURS
          </Link>
        </div>
      </div>

      {/* Main Details Section */}
      <section style={{ padding: '4rem 0', position: 'relative' }}>
        <div className="ambient-glow-spot" style={{ top: '10%', right: '5%' }} />

        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'start'
            }}
          >
            {/* Left: Concert Poster */}
            <div>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  maxWidth: '450px',
                  margin: '0 auto',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px var(--crimson-glow)'
                }}
              >
                <Image
                  src={event.posterImage}
                  alt={event.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Quick Ticket Box */}
              {!isPast && (
                <div
                  className="dark-card"
                  style={{
                    maxWidth: '450px',
                    margin: '2rem auto 0',
                    padding: '1.75rem',
                    border: '1px solid var(--border-red)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    ADMISSION TIER:
                  </div>
                  <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                    {event.ticketPrice || 'BDT 800 - BDT 2,500'}
                  </div>

                  {!isSoldOut && !isNotLiveYet && event.ticketUrl ? (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem' }}
                    >
                      <Ticket size={18} /> PURCHASE OFFICIAL PASSES
                    </a>
                  ) : isNotLiveYet ? (
                    <div style={{
                      color: '#fbbf24',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      letterSpacing: '0.08em',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '4px'
                    }}>
                      TICKETING NOT LIVE YET
                    </div>
                  ) : isSoldOut ? (
                    <div style={{ color: 'var(--crimson-base)', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                      ALL TICKETS SOLD OUT
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                      TICKETING DETAILS ANNOUNCED SOON
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Event Information */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span
                  style={{
                    backgroundColor: isPast ? 'rgba(255, 255, 255, 0.1)' : 'var(--crimson-base)',
                    color: '#fff',
                    padding: '0.25rem 0.85rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.15em'
                  }}
                >
                  {isPast ? 'CONCLUDED EVENT' : 'OFFICIAL LIVE SHOW (MONGODB)'}
                </span>
                {event.tourName && (
                  <span style={{ color: 'var(--crimson-base)', fontSize: '0.85rem', fontWeight: 600 }}>
                    // {event.tourName}
                  </span>
                )}
              </div>

              <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', lineHeight: 1, marginBottom: '1.5rem' }}>
                {event.title}
              </h1>

              {/* Key Specs Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.25rem',
                  backgroundColor: '#0a0a0d',
                  border: '1px solid var(--border-subtle)',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson-base)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <Calendar size={14} /> Date
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    {event.formattedDate}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson-base)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <Clock size={14} /> Showtime
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    {event.time}
                  </div>
                  {event.doorsOpen && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {event.doorsOpen.toLowerCase().startsWith('doors open') ? event.doorsOpen : `Doors Open: ${event.doorsOpen}`}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson-base)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <MapPin size={14} /> Venue & City
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    {event.venue}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {event.city}, {event.country}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson-base)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    <ShieldAlert size={14} /> Policy
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    {event.ageRestriction || '16+ / All Ages'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>
                  CONCERT BRIEF
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                  {event.description}
                </p>
              </div>

              {/* Lineup / Supporting Acts */}
              {event.supportingActs && event.supportingActs.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 className="font-display" style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>
                    ON STAGE BILLING
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--crimson-base)', color: '#fff', padding: '0.3rem 0.85rem', fontWeight: 700, fontSize: '0.85rem' }}>
                      BIDDROHO (Headliner)
                    </span>
                    {event.supportingActs.map((act, i) => (
                      <span key={i} style={{ background: '#141418', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.3rem 0.85rem', fontSize: '0.85rem' }}>
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Event Setlist */}
              {event.setlist && (
                <div
                  className="dark-card"
                  style={{
                    padding: '2rem',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '2.5rem'
                  }}
                >
                  <h3 className="font-display" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Disc3 size={20} color="var(--crimson-base)" /> PERFORMANCE SETLIST
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {event.setlist.map((song, i) => (
                      <div key={i} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', padding: '0.4rem 0' }}>
                        <span style={{ color: 'var(--crimson-base)', marginRight: '8px', fontFamily: 'var(--font-display)' }}>
                          {i + 1 < 10 ? `0${i + 1}` : i + 1}.
                        </span>
                        {song}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Captures */}
      {event.galleryImages && event.galleryImages.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
          <div className="site-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <ImageIcon size={22} color="var(--crimson-base)" />
              <h2 className="font-display" style={{ fontSize: '2.2rem', color: '#fff' }}>
                CONCERT GALLERY CAPTURES
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {event.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="dark-card-interactive"
                  style={{ position: 'relative', aspectRatio: '16/10', width: '100%', overflow: 'hidden' }}
                >
                  <Image src={imgUrl} alt={`${event.title} photo ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
