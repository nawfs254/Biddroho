'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<any>({
    title: '',
    slug: '',
    date: '',
    time: '8:00 PM',
    venue: '',
    city: 'Dhaka',
    country: 'Bangladesh',
    description: '',
    status: 'PUBLISHED',
    ticketStatus: 'available',
    ticketPrice: '',
    ticketUrl: '',
    posterImage: '/assets/tour_poster.jpg',
    featured: false,
    tourName: '',
    ageRestriction: '16+',
    doorsOpen: '6:00 PM',
  });

  useEffect(() => {
    fetch(`/api/admin/events/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.event) {
          setForm({
            title: data.event.title || '',
            slug: data.event.slug || '',
            date: data.event.date || '',
            time: data.event.time || '8:00 PM',
            venue: data.event.venue || '',
            city: data.event.city || 'Dhaka',
            country: data.event.country || 'Bangladesh',
            description: data.event.description || '',
            status: data.event.status || 'PUBLISHED',
            ticketStatus: data.event.ticketStatus || 'available',
            ticketPrice: data.event.ticketPrice || '',
            ticketUrl: data.event.ticketUrl || '',
            posterImage: data.event.posterImage || '/assets/tour_poster.jpg',
            featured: Boolean(data.event.featured),
            tourName: data.event.tourName || '',
            ageRestriction: data.event.ageRestriction || '16+',
            doorsOpen: data.event.doorsOpen || '6:00 PM',
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, [resolvedParams.id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name === 'slug') {
      setForm((prev: any) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      }));
      return;
    }
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        slug: (form.slug || form.title)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
      };

      const res = await fetch(`/api/admin/events/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update event.');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating event');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/events/${resolvedParams.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/events');
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete event.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during deletion.');
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <MusicLoader text="RETRIEVING STAGE SOUNDCHECK & TOUR EVENT..." size="card" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Edit Show: ${form.title}`}
        subtitle={`Updating event document ID ${resolvedParams.id}`}
        actionButton={
          <Link
            href="/admin/events"
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
            <ArrowLeft size={14} />
            <span>Back to Shows</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', maxWidth: '880px' }}>
        {error && (
          <div style={{
            padding: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Show Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                URL Slug *
              </label>
              <input
                type="text"
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Date *
              </label>
              <input
                type="text"
                required
                name="date"
                value={form.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Time
              </label>
              <input
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Tour Name
              </label>
              <input
                type="text"
                name="tourName"
                value={form.tourName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Doors Open Time
              </label>
              <input
                type="text"
                name="doorsOpen"
                value={form.doorsOpen}
                onChange={handleChange}
                placeholder="e.g. 6:30 PM"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Show Policy / Age Restriction
              </label>
              <input
                type="text"
                name="ageRestriction"
                value={form.ageRestriction}
                onChange={handleChange}
                placeholder="e.g. 16+ / All Ages"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Venue *
              </label>
              <input
                type="text"
                required
                name="venue"
                value={form.venue}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                City *
              </label>
              <input
                type="text"
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Content Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Row 4: Ticketing & Pricing Configuration */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Ticketing & Pricing Configuration
              </span>
              <span style={{ fontSize: '11px', color: '#71717a' }}>Control pass availability and pricing tiers on live site</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Ticket Status *
                </label>
                <select
                  name="ticketStatus"
                  value={form.ticketStatus}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="available">Available (Tickets on sale)</option>
                  <option value="selling_fast">Selling Fast (Limited tickets remaining)</option>
                  <option value="not_live_yet">Not Live Yet (Coming soon / Announced)</option>
                  <option value="sold_out">Sold Out (Passes fully booked)</option>
                  <option value="closed">Closed (Event concluded)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Ticket Price / Pass Tier
                </label>
                <input
                  type="text"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  placeholder="e.g. BDT 500 - 1500 or ৳ 1000"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Ticketing Purchase URL
                </label>
                <input
                  type="url"
                  name="ticketUrl"
                  value={form.ticketUrl}
                  onChange={handleChange}
                  placeholder="https://getmyticket.com/biddroho"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Event Poster Upload */}
          <ImageUpload
            preset="event"
            value={form.posterImage || ''}
            onChange={(url) => setForm({ ...form, posterImage: url })}
            label="Concert / Tour Gig Poster"
          />

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#f4f4f5',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              disabled={loading || deleting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: loading || deleting ? 'not-allowed' : 'pointer',
              }}
            >
              <Trash2 size={15} />
              <span>Delete Event</span>
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/admin/events"
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  color: '#a1a1aa',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Save size={15} />
                <span>{loading ? 'Updating Show...' : 'Update & Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Tour Event"
        itemName={form.title}
        loading={deleting}
      />
    </div>
  );
}
