'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { Search, UserCheck, Trash2, Download } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/subscribers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.subscribers) setSubscribers(data.subscribers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [search]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.map((s) => (s._id === id ? { ...s, status: nextStatus } : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this subscriber?')) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Email,Status,Date\n';
    const rows = subscribers
      .map((s) => `"${s.email}","${s.status}","${new Date(s.createdAt).toISOString()}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biddroho_subscribers_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Newsletter Subscribers"
        subtitle="Manage official fan email list for tour announcements and exclusive releases."
        actionButton={
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f4f4f5',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#121216',
          padding: '16px 20px',
          borderRadius: '5px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search subscriber email..."
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

          <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
            Total Active Subscribers: <strong style={{ color: '#10b981' }}>{subscribers.filter((s) => s.status === 'ACTIVE').length}</strong>
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="SYNCING FAN CLUB & NEWSLETTER SUBSCRIBERS..." size="card" />
          ) : subscribers.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <UserCheck size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No subscribers found</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>SUBSCRIBER EMAIL</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>SUBSCRIPTION STATUS</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>JOINED DATE</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f4f4f5' }}>{s.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => handleToggleStatus(s._id, s.status)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        title="Click to toggle status"
                      >
                        <StatusBadge status={s.status || 'ACTIVE'} />
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#71717a' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(s._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
