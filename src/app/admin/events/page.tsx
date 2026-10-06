'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import MusicLoader from '@/components/ui/MusicLoader';
import { Plus, Search, Calendar, MapPin, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/events?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`);
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      });
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [search, statusFilter]);

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => (e._id || e.id) !== deleteTarget.id && e._id !== deleteTarget.id && e.id !== deleteTarget.id));
        setDeleteTarget(null);
        await fetchEvents();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during deletion.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminHeader
        user={user || { name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Events & Concerts"
        subtitle="Manage upcoming tour dates, venue logistics, tickets, and published shows."
        actionButton={
          <Link
            href="/admin/events/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.04em'
            }}
          >
            <Plus size={15} />
            <span>New Tour Date</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Filters Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          backgroundColor: '#121216',
          padding: '16px 20px',
          borderRadius: '5px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search title, venue, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#f4f4f5',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="TUNING STAGE MONITORS & RETRIEVING TOUR DATES..." size="card" />
          ) : events.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <Calendar size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5' }}>No events found</div>
              <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Try modifying your search or create your first show.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>EVENT TITLE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>DATE & TIME</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>LOCATION</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>TICKETS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr
                      key={e._id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{e.title}</div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Slug: /{e.slug}</div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        <div>{e.formattedDate || e.date}</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>{e.time}</div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#e11d48" />
                          <span>{e.venue}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginLeft: '17px' }}>{e.city}, {e.country || 'Bangladesh'}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '11px',
                          color: (e.ticketStatus === 'not_live_yet' || e.ticketStatus === 'not_live') ? '#fbbf24' : e.ticketStatus === 'sold_out' ? '#ef4444' : '#38bdf8',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {(e.ticketStatus === 'not_live_yet' || e.ticketStatus === 'not_live') ? 'NOT LIVE YET' : (e.ticketStatus || 'available').replace('_', ' ')}
                        </span>
                        {e.ticketPrice && (
                          <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                            {e.ticketPrice}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={e.status || 'PUBLISHED'} />
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            href={`/events/${e.slug}`}
                            target="_blank"
                            title="Preview Public Page"
                            style={{ color: '#71717a', padding: '6px' }}
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/events/${e._id}/edit`}
                            title="Edit Event"
                            style={{ color: '#38bdf8', padding: '6px' }}
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: e._id || e.id, title: e.title })}
                            title="Delete Event"
                            style={{ background: 'none', border: 'none', color: '#ef4444', padding: '6px', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Tour Event"
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
