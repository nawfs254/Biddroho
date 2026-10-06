'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import MusicLoader from '@/components/ui/MusicLoader';
import { ArrowLeft, Send, Trash2, Calendar, MapPin, Mail, Phone, Building2, DollarSign, MessageSquare, ShieldAlert, XCircle, Ban, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

function parseFee(val?: string | number): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).toLowerCase().trim();
  if (str.endsWith('k')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num * 1000;
  }
  const clean = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  // Retained advance / settlement tracking for cancelled shows
  const [retainedAmountInput, setRetainedAmountInput] = useState('');
  const [editingRetained, setEditingRetained] = useState(false);

  // In-app modal states for 100% reliable action triggers (no browser confirm blocking)
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const bookingId = booking?._id || resolvedParams?.id;

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/bookings/${bookingId}`);
      const data = await res.json();
      if (data.booking) {
        setBooking(data.booking);
        setNewStatus(data.booking.status || 'NEW');
        setBudgetInput(data.booking.budget || '');
        if (data.booking.retainedAmount !== undefined && data.booking.retainedAmount !== null) {
          setRetainedAmountInput(String(data.booking.retainedAmount));
        } else {
          setRetainedAmountInput('');
        }
        if (data.booking.cancellationReason) {
          setCancellationReason(data.booking.cancellationReason);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleUpdateStatusAndNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setFeedback(null);

    // If changing to CANCELLED from dropdown and not yet cancelled, trigger modal to prompt for advance/settlement
    if (newStatus === 'CANCELLED' && booking.status !== 'CANCELLED') {
      setCancelModalOpen(true);
      setUpdating(false);
      return;
    }

    try {
      const payload: any = {
        status: newStatus,
        budget: budgetInput,
        noteText: newNote.trim() ? newNote : undefined,
      };

      if (newStatus === 'CANCELLED' && retainedAmountInput !== '') {
        payload.retainedAmount = parseFloat(retainedAmountInput) || 0;
      }

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update booking.');
      }

      setNewNote('');
      setFeedback({ type: 'success', message: 'Status updated successfully.' });
      fetchBooking();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating booking' });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveRetainedSettlement = async (amount: string | number) => {
    setUpdating(true);
    setFeedback(null);

    try {
      const parsed = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retainedAmount: parsed,
          noteText: `Retained advance / cancellation compensation updated to BDT ${parsed.toLocaleString()} on ${new Date().toLocaleDateString()}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update retained settlement');

      setFeedback({
        type: 'success',
        message: `Retained compensation updated to BDT ${parsed.toLocaleString()}. Credited to Band Earnings Report.`
      });
      setEditingRetained(false);
      fetchBooking();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating retained amount' });
    } finally {
      setUpdating(false);
    }
  };

  const executeCancelShow = async () => {
    setUpdating(true);
    setFeedback(null);

    try {
      const retainedNum = parseFloat(String(retainedAmountInput || '0').replace(/[^0-9.]/g, '')) || 0;
      const reasonText = cancellationReason.trim();

      let note = `Show officially marked as CANCELLED on ${new Date().toLocaleDateString()}.`;
      if (reasonText) {
        note += ` Reason: ${reasonText}.`;
      }
      if (retainedNum > 0) {
        note += ` Advance / Settlement Kept by Band: BDT ${retainedNum.toLocaleString()} (credited to Band Earnings).`;
      } else {
        note += ` No advance kept / 100% refunded.`;
      }

      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          retainedAmount: retainedNum,
          cancellationReason: reasonText || undefined,
          noteText: note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel show.');

      setFeedback({
        type: 'success',
        message: retainedNum > 0
          ? `Show marked as CANCELLED. Retained funds of BDT ${retainedNum.toLocaleString()} added to your Band Earnings!`
          : 'Show marked as CANCELLED in MongoDB Atlas.'
      });
      setCancelModalOpen(false);
      setDeleteModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error cancelling show' });
    } finally {
      setUpdating(false);
    }
  };

  const executeDelete = async (force = false) => {
    setUpdating(true);
    setFeedback(null);

    try {
      const url = `/api/admin/bookings/${bookingId}${force ? '?force=true' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete booking inquiry.');
      }

      setFeedback({ type: 'success', message: 'Booking inquiry deleted. Redirecting to CRM...' });
      setDeleteModalOpen(false);

      setTimeout(() => {
        window.location.href = '/admin/bookings';
      }, 700);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error during deletion' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
        <MusicLoader text="RETRIEVING BOOKING DOSSIER FROM MONGO ATLAS..." size="fullscreen" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <h2 style={{ color: '#f4f4f5' }}>Booking Inquiry Not Found</h2>
        <Link href="/admin/bookings" style={{ color: '#e11d48', marginTop: '12px', display: 'inline-block' }}>
          Back to Bookings CRM
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Booking Dossier: ${booking.name}`}
        subtitle={`Target Date: ${booking.eventDate} • ${booking.venue}, ${booking.city}`}
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/admin/bookings"
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
              <span>Back to CRM</span>
            </Link>

            {booking.status === 'CONFIRMED' ? (
              <>
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={updating}
                  title="Cancel this confirmed show"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.16)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  <XCircle size={14} />
                  <span>Cancel Confirmed Show</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={updating}
                  title="Delete booking record"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#d4d4d8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Inquiry</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                disabled={updating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: updating ? 'not-allowed' : 'pointer'
                }}
              >
                <Trash2 size={14} />
                <span>Delete Inquiry</span>
              </button>
            )}
          </div>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Dynamic Action Feedback Alert Banner */}
        {feedback && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '5px',
            backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: feedback.type === 'success' ? '#10b981' : '#f87171',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        )}
        {/* Top Status & Quick Updater Panel */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Current Negotiation Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <StatusBadge status={booking.status || 'NEW'} />
              <span style={{ fontSize: '12px', color: '#71717a' }}>
                Received on {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
                Update Pipeline Status:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="NEW">NEW INQUIRY</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="IN_PROGRESS">IN PROGRESS / NEGOTIATING</option>
                <option value="CONFIRMED">CONFIRMED / CONTRACT SIGNED</option>
                <option value="REJECTED">DECLINED / REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatusAndNote}
              disabled={updating}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: updating ? 'not-allowed' : 'pointer'
              }}
            >
              {updating ? 'Saving...' : 'Save Status'}
            </button>
          </div>
        </div>

        {/* Cancellation Commercial Settlement Banner */}
        {booking.status === 'CANCELLED' && (() => {
          const bookedFee = parseFee(booking.budget);
          const retained = parseFee(booking.retainedAmount);
          const netLost = Math.max(0, bookedFee - retained);

          return (
            <div style={{
              backgroundColor: '#161214',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '6px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                    <XCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                      Performance Cancelled — Commercial Settlement
                    </h3>
                    <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '2px 0 0' }}>
                      {booking.cancellationReason ? `Reason: ${booking.cancellationReason}` : 'No cancellation reason specified.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  style={{
                    padding: '7px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#e4e4e7',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Adjust Cancellation Settlement / Advance
                </button>
              </div>

              {/* 3 Settlement Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: '#0c0c0f',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>
                    Contracted Deal Value
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#f4f4f5', marginTop: '6px' }}>
                    BDT {bookedFee.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                    Original agreed fee before cancellation
                  </div>
                </div>

                <div style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.06)',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}>
                  <div style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>
                    Advance Kept (Band Earnings)
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
                    + BDT {retained.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px' }}>
                    ✓ Credited into your Show Earnings Report
                  </div>
                </div>

                <div style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ fontSize: '11px', color: '#ef4444', textTransform: 'uppercase', fontWeight: 600 }}>
                    Net Lost Deal Value
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444', marginTop: '6px' }}>
                    - BDT {netLost.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                    Contract deficit after advance retention
                  </div>
                </div>
              </div>

              {/* Inline Quick Retained Settlement Adjuster */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 600 }}>
                    Quick Settlement Adjuster:
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 10000"
                    value={retainedAmountInput}
                    onChange={(e) => setRetainedAmountInput(e.target.value)}
                    style={{
                      width: '130px',
                      padding: '6px 10px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '4px',
                      color: '#10b981',
                      fontSize: '13px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#71717a' }}>BDT retained by band</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveRetainedSettlement(retainedAmountInput)}
                  disabled={updating}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  {updating ? 'Saving...' : 'Save Retained Earnings'}
                </button>
              </div>
            </div>
          );
        })()}

        {/* 2-Column: Dossier Details & Internal Negotiation Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
          {/* Column 1: Client & Concert Specifications */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f4f4f5', margin: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
              Client & Event Specifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>CONTACT PERSON</span>
                <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{booking.name}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>ORGANIZATION</span>
                <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{booking.organization || 'Independent Organizer'}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>EMAIL ADDRESS</span>
                <div style={{ color: '#38bdf8', fontSize: '13px', marginTop: '2px' }}>
                  <a href={`mailto:${booking.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{booking.email}</a>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>PHONE / WHATSAPP</span>
                <div style={{ color: '#f4f4f5', fontSize: '13px', marginTop: '2px' }}>
                  <a href={`tel:${booking.phone}`} style={{ color: '#f4f4f5', textDecoration: 'none' }}>{booking.phone}</a>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>TARGET EVENT DATE</span>
                <div style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{booking.eventDate}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>EVENT TYPE</span>
                <div style={{ color: '#f4f4f5', fontSize: '13px', marginTop: '2px' }}>{booking.eventType}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>VENUE & CITY</span>
                <div style={{ color: '#f4f4f5', fontSize: '13px', marginTop: '2px' }}>{booking.venue}, {booking.city}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>EXPECTED AUDIENCE</span>
                <div style={{ color: '#f4f4f5', fontSize: '13px', marginTop: '2px' }}>{booking.expectedAudience || 'Not specified'}</div>
              </div>
            </div>

            {/* Additional info */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>VENUE SETTING & NATURE</span>
              <div style={{ color: '#d4d4d8', fontSize: '13px', marginTop: '4px' }}>
                {booking.venueSetting || 'Indoor / Outdoor'} • {booking.eventNature || 'Ticketed Concert'}
              </div>
            </div>

            {booking.otherArtists && (
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>CO-PERFORMING BANDS</span>
                <div style={{ color: '#d4d4d8', fontSize: '13px', marginTop: '4px' }}>{booking.otherArtists}</div>
              </div>
            )}

            {booking.additionalInfo && (
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>ADDITIONAL REQUIREMENTS / NOTES</span>
                <div style={{ color: '#f4f4f5', fontSize: '13px', lineHeight: '1.6', backgroundColor: '#18181b', padding: '12px', borderRadius: '4px', marginTop: '6px' }}>
                  {booking.additionalInfo}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Negotiation Fee & Internal Notes Thread */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} color="#e11d48" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                    Internal Negotiation Log
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>CONFIDENTIAL / STAFF ONLY</span>
              </div>

              {/* Budget Field */}
              <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                  Agreed Performance Fee / Budget (BDT):
                </label>
                <input
                  type="text"
                  placeholder="e.g. BDT 150,000 + Tech Rider"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Existing Notes Thread */}
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '6px'
              }}>
                {(!booking.internalNotes || booking.internalNotes.length === 0) ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
                    No internal notes logged yet. Use the composer below to record conversation summaries or contract terms.
                  </div>
                ) : (
                  booking.internalNotes.map((note: any, idx: number) => (
                    <div
                      key={note.id || idx}
                      style={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '4px',
                        padding: '12px 14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5' }}>{note.author}</span>
                        <span style={{ fontSize: '10px', color: '#71717a' }}>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: '1.5' }}>
                        {note.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Note Composer */}
            <form onSubmit={handleUpdateStatusAndNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <textarea
                rows={3}
                placeholder="Add confidential internal note (e.g. Phone discussion with sponsor, stage plot approval, fee negotiation)..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
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
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={updating || (!newNote.trim() && budgetInput === booking.budget && newStatus === booking.status)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={13} />
                  <span>Post Internal Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal 1: Cancel Confirmed Show Modal */}
        {cancelModalOpen && (
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
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                    <XCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                      Cancel Confirmed Performance
                    </h3>
                    <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0' }}>
                      Updates status to CANCELLED and settles commercial advance in MongoDB.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCancelModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Show details summary */}
              <div style={{ backgroundColor: '#0f0f13', padding: '14px 16px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#d4d4d8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Client / Org:</strong> {booking.name} {booking.organization ? `(${booking.organization})` : ''}</span>
                  <span style={{ color: '#71717a' }}>{booking.eventDate}</span>
                </div>
                <div style={{ marginTop: '4px' }}><strong>Venue:</strong> {booking.venue}, {booking.city}</div>
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#a1a1aa' }}>Agreed Performance Fee:</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>
                    BDT {parseFee(booking.budget).toLocaleString()} {booking.budget && !booking.budget.match(/^\d+$/) ? `(${booking.budget})` : ''}
                  </span>
                </div>
              </div>

              {/* Retained Money Input (Core Requirement) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Advance / Money Received & Kept by Band (BDT)
                  </label>
                  <span style={{ fontSize: '11px', color: '#71717a' }}>Enter 0 if 100% refunded</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="e.g. 10000"
                  value={retainedAmountInput}
                  onChange={(e) => setRetainedAmountInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(16, 185, 129, 0.45)',
                    borderRadius: '4px',
                    color: '#10b981',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#a1a1aa', margin: '6px 0 0', lineHeight: 1.4 }}>
                  Example: If the show was booked for <strong>BDT 35,000</strong> and after cancellation BIDDROHO kept an advance of <strong>BDT 10,000</strong>, enter <code>10000</code>. This will be added directly into your <strong>Band Earnings</strong>.
                </p>
              </div>

              {/* Financial Calculation Live Preview */}
              {(() => {
                const booked = parseFee(booking.budget);
                const retained = parseFloat(String(retainedAmountInput || '0').replace(/[^0-9.]/g, '')) || 0;
                const netLoss = Math.max(0, booked - retained);
                return (
                  <div style={{
                    backgroundColor: '#0c0c0f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                      <span>Booked Deal Value:</span>
                      <span style={{ color: '#f4f4f5', fontWeight: 600 }}>BDT {booked.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Retained in Band Earnings:</span>
                      <span style={{ fontWeight: 800 }}>+ BDT {retained.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
                      <span>Net Lost Deal Revenue:</span>
                      <span style={{ fontWeight: 600 }}>- BDT {netLoss.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Cancellation Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Official Cancellation Reason (Optional Note)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client postponed / Venue scheduling conflict"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  disabled={updating}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#27272a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#e4e4e7',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Keep Show Active
                </button>
                <button
                  type="button"
                  onClick={executeCancelShow}
                  disabled={updating}
                  style={{
                    padding: '9px 18px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {updating ? 'Cancelling...' : 'Confirm Cancellation & Settle Retained Funds'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Delete Booking Inquiry Modal */}
        {deleteModalOpen && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                    <Trash2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                      Delete Booking Record
                    </h3>
                    <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0' }}>
                      Permanent removal from MongoDB Atlas database.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {booking.status === 'CONFIRMED' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    color: '#fbbf24',
                    fontSize: '13px',
                    lineHeight: 1.5
                  }}>
                    <strong>Notice:</strong> This show is currently <strong>CONFIRMED</strong> (Contract Signed).
                    Confirmed shows should usually be <strong>CANCELLED</strong> rather than deleted, so your commercial fee data and any retained advance are preserved in the <em>Show Earnings Report</em>.
                  </div>

                  <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0 }}>
                    Would you like to cancel the show instead (and log any retained money), or permanently delete the entire record?
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setCancelModalOpen(true);
                      }}
                      disabled={updating}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: updating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancel Show Instead (Recommended)
                    </button>
                    <button
                      type="button"
                      onClick={() => executeDelete(true)}
                      disabled={updating}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '4px',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: updating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {updating ? 'Deleting...' : 'Force Permanently Delete Anyway'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(false)}
                      disabled={updating}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: '#71717a',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Dismiss / Keep Show Active
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: 1.6 }}>
                    Are you sure you want to permanently delete the booking inquiry from <strong>{booking.name}</strong> ({booking.venue}, {booking.city})? This cannot be undone.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(false)}
                      disabled={updating}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#27272a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: '#e4e4e7',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Keep Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => executeDelete(false)}
                      disabled={updating}
                      style={{
                        padding: '9px 18px',
                        backgroundColor: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: updating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {updating ? 'Deleting...' : 'Yes, Permanently Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
