'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import MusicLoader from '@/components/ui/MusicLoader';
import { Search, Mail, Trash2, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/contacts?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`);
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
        if (selectedContact?._id === id) {
          setSelectedContact((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedContact?._id === id) setSelectedContact(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Contact Messages & Inquiries"
        subtitle="Manage inbound messages, collaboration requests, and fan communications."
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Filters */}
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
              placeholder="Search sender, email, subject..."
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
              <option value="">All Messages</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* 2-Pane View: List & Reading Pane */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedContact ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* List */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            {loading ? (
              <MusicLoader text="TUNING FREQUENCIES & FETCHING INQUIRIES..." size="card" />
            ) : contacts.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center' }}>
                <Mail size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
                <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No messages found</div>
              </div>
            ) : (
              <div>
                {contacts.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setSelectedContact(c);
                      if (c.status === 'UNREAD') handleStatusChange(c._id, 'READ');
                    }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      backgroundColor: selectedContact?._id === c._id ? 'rgba(225, 29, 72, 0.08)' : 'transparent',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '13px' }}>{c.name}</span>
                      <StatusBadge status={c.status || 'UNREAD'} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '4px' }}>
                      {c.subject || 'General Inquiry'}
                    </div>
                    <p style={{
                      fontSize: '11px',
                      color: '#a1a1aa',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reading Pane */}
          {selectedContact && (
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f4f4f5' }}>
                    {selectedContact.subject || 'Message Details'}
                  </h3>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginBottom: '16px' }}>
                  <div><strong style={{ color: '#71717a' }}>From:</strong> <span style={{ color: '#f4f4f5' }}>{selectedContact.name} ({selectedContact.email})</span></div>
                  <div><strong style={{ color: '#71717a' }}>Received:</strong> <span style={{ color: '#a1a1aa' }}>{new Date(selectedContact.createdAt).toLocaleString()}</span></div>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#18181b',
                  borderRadius: '4px',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  color: '#f4f4f5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedContact.message}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => handleStatusChange(selectedContact._id, 'REPLIED')}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Mark Replied
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject || 'BIDDROHO Inquiry')}`}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
