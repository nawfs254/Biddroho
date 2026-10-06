import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, Clock, ArrowRight } from 'lucide-react';
import { EventItem } from '@/data/mockData';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  // Parse date
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  const isSoldOut = event.ticketStatus === 'sold_out';
  const isSellingFast = event.ticketStatus === 'selling_fast';
  const isPast = event.status === 'past';

  return (
    <div
      className="dark-card-interactive"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        alignItems: 'center',
        padding: '2rem',
        gap: '2rem',
        borderLeft: isSellingFast ? '4px solid var(--crimson-base)' : '1px solid var(--border-subtle)'
      }}
    >
      {/* Date Column */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '85px',
            height: '85px',
            backgroundColor: '#070709',
            border: '1px solid var(--border-subtle)',
            padding: '0.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.15em',
              color: 'var(--crimson-base)'
            }}
          >
            {month}
          </span>
          <span
            className="font-display"
            style={{
              fontSize: '2.5rem',
              lineHeight: 1,
              color: '#ffffff'
            }}
          >
            {day}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}
          >
            {year}
          </span>
        </div>

        {/* Title and Tour */}
        <div>
          {event.tourName && (
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                color: 'var(--crimson-base)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem',
                fontWeight: 600
              }}
            >
              // {event.tourName}
            </span>
          )}
          <Link href={`/events/${event.slug}`}>
            <h3
              className="font-display"
              style={{
                fontSize: '1.85rem',
                letterSpacing: '0.04em',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '0.5rem'
              }}
            >
              {event.title}
            </h3>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {event.time}
            </span>
            <span>•</span>
            <span>{event.ageRestriction}</span>
          </div>
        </div>
      </div>

      {/* Location Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
          <MapPin size={16} color="var(--crimson-base)" />
          <span>{event.venue}</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
          {event.city}, {event.country}
        </div>
        {event.supportingActs && event.supportingActs.length > 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
            With: {event.supportingActs.slice(0, 3).join(', ')}
          </div>
        )}
      </div>

      {/* Status & CTA Column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
        className="event-cta-group"
      >
        {/* Ticket Availability Tag */}
        <div>
          {isSoldOut ? (
            <span
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-display)'
              }}
            >
              SOLD OUT
            </span>
          ) : isSellingFast ? (
            <span
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                background: 'var(--crimson-subtle)',
                color: 'var(--crimson-base)',
                border: '1px solid var(--border-red)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-display)',
                animation: 'pulse 2s infinite'
              }}
            >
              SELLING FAST
            </span>
          ) : isPast ? (
            <span
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-display)'
              }}
            >
              CONCLUDED
            </span>
          ) : (
            <span
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-display)'
              }}
            >
              TICKETS AVAILABLE
            </span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          {!isPast && !isSoldOut && event.ticketUrl ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.95rem',
                flex: '1'
              }}
            >
              <Ticket size={16} /> TICKETS
            </a>
          ) : null}

          <Link
            href={`/events/${event.slug}`}
            className="btn-secondary"
            style={{
              padding: '0.65rem 1.4rem',
              fontSize: '0.95rem',
              flex: '1'
            }}
          >
            {isPast ? 'VIEW RECAP' : 'DETAILS'} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
