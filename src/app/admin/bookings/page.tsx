'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import MusicLoader from '@/components/ui/MusicLoader';
import { Search, Briefcase, Calendar, MapPin, ArrowRight, User, DollarSign, Trash2, Ban, X, AlertTriangle } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [user, setUser] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; status: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bookings?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`);
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBooking = async (force = false) => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      const url = `/api/admin/bookings/${itemToDelete.id}${force ? '?force=true' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete inquiry');
        return;
      }
      setItemToDelete(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error deleting inquiry');
    } finally {
      setDeleting(false);
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
    fetchBookings();
  }, [search, statusFilter]);

  return (
    <div>
      <AdminHeader
        user={user || { name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Concert & Festival Bookings CRM"
        subtitle="Review booking inquiries submitted via the official website form, manage negotiation statuses, and track contract notes."
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/admin/bookings/reports"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <DollarSign size={14} />
              <span>Show Earnings Report</span>
            </Link>
          </div>
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
              placeholder="Search client, email, venue, or city..."
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
              <option value="NEW">New Inquiries</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REJECTED">Declined / Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="RETRIEVING CONCERT INQUIRIES & DOSSIERS..." size="card" />
          ) : bookings.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <Briefcase size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5' }}>No booking inquiries found</div>
              <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Submissions made via the public booking form will appear here.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>CLIENT / ORG</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>TARGET DATE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>VENUE & LOCATION</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>EVENT TYPE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{b.name}</div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                          {b.organization ? `${b.organization} • ` : ''}{b.email}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        <div>{b.eventDate}</div>
                        <div style={{ fontSize: '11px', color: '#71717a' }}>{b.expectedAudience ? `Est. ${b.expectedAudience} crowd` : ''}</div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#e11d48" />
                          <span>{b.venue}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginLeft: '17px' }}>{b.city}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '12px', color: '#d4d4d8' }}>
                          {b.eventType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={b.status || 'NEW'} />
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            href={`/admin/bookings/${b._id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#18181b',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '4px',
                              color: '#38bdf8',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <span>Manage CRM</span>
                            <ArrowRight size={13} />
                          </Link>

                          {b.status === 'CONFIRMED' ? (
                            <span
                              title="Confirmed bookings represent contractual shows and cannot be deleted. Confirmed shows can only be cancelled."
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '6px 8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '4px',
                                color: '#52525b',
                                cursor: 'not-allowed'
                              }}
                            >
                              <Ban size={13} />
                            </span>
                          ) : (
                            <button
                              onClick={() => setItemToDelete({ id: b._id, name: b.name, status: b.status })}
                              title="Delete booking inquiry"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '6px 8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: '4px',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {itemToDelete && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#141418',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                    <Trash2 size={20} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                    Delete Booking Inquiry
                  </h3>
                </div>
                <button
                  onClick={() => setItemToDelete(null)}
                  style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: 1.6 }}>
                Permanently delete inquiry from <strong>{itemToDelete.name}</strong>? This action cannot be undone and removes it from MongoDB.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  disabled={deleting}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#27272a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#e4e4e7',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmDeleteBooking(false)}
                  disabled={deleting}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: deleting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
