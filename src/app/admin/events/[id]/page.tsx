import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { ArrowLeft, Edit, MapPin, Calendar, Clock, Ticket, ExternalLink } from 'lucide-react';

export default async function ViewEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDatabase();

  let query: any;
  try {
    query = { _id: new ObjectId(id) };
  } catch {
    query = { _id: id };
  }

  const event = await db.collection('events').findOne(query);
  if (!event) notFound();

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Show Overview: ${event.title}`}
        subtitle={`Venue: ${event.venue}, ${event.city}`}
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#a1a1aa',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
              <span>Public Page</span>
            </Link>
            <Link
              href={`/admin/events/${id}/edit`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Edit size={14} />
              <span>Edit Show</span>
            </Link>
          </div>
        }
      />

      <div style={{ padding: '32px', maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Link
          href="/admin/events"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#71717a', fontSize: '13px', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} />
          <span>Back to All Shows</span>
        </Link>

        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f4f4f5', fontFamily: 'Cinzel, serif', margin: 0 }}>
                {event.title}
              </h2>
              <div style={{ color: '#e11d48', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginTop: '4px' }}>
                {event.tourName || 'HEADLINE CONCERT'}
              </div>
            </div>

            <StatusBadge status={event.status || 'PUBLISHED'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>DATE & TIME</span>
              <div style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                {event.formattedDate || event.date} • {event.time}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>VENUE</span>
              <div style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                {event.venue}, {event.city}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>TICKETS</span>
              <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                {event.ticketStatus?.toUpperCase() || 'AVAILABLE'}
              </div>
            </div>
          </div>

          {event.description && (
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>DESCRIPTION</span>
              <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.6', marginTop: '6px' }}>
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
