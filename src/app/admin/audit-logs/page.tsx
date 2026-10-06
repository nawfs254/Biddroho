'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { History, Search, ShieldCheck } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceFilter, setResourceFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/audit-logs?resource=${resourceFilter}&action=${actionFilter}&limit=100`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [resourceFilter, actionFilter]);

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Administrative Security & Audit Trail"
        subtitle="Immutable tamper-resistant log of administrative operations, content mutations, and CRM status changes."
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#121216',
          padding: '16px 20px',
          borderRadius: '5px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginRight: '8px' }}>Resource:</span>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
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
              <option value="">All Resources</option>
              <option value="events">Events</option>
              <option value="music">Music</option>
              <option value="news">News</option>
              <option value="members">Members</option>
              <option value="media">Media</option>
              <option value="bookings">Bookings CRM</option>
              <option value="contacts">Contacts</option>
              <option value="subscribers">Subscribers</option>
              <option value="press">Press</option>
              <option value="users">Users</option>
              <option value="roles">Roles</option>
              <option value="auth">Auth</option>
              <option value="settings">Settings</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="DECRYPTING AUDIT LOGS & EVENT TRAILS..." size="card" />
          ) : logs.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <History size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No audit records found</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>ACTION</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>RESOURCE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>ACTOR</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>TIMESTAMP</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>METADATA</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#e11d48', fontWeight: 600 }}>
                        {l.action}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#38bdf8', fontWeight: 500, textTransform: 'uppercase' }}>
                        {l.resource}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#f4f4f5', fontWeight: 500 }}>
                        {l.userName || l.userId}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#71717a' }}>
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.metadata ? JSON.stringify(l.metadata) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
