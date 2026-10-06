'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { Plus, Shield, UserX, UserCheck, Trash2, X, Lock, Mail, User } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roles: ['EDITOR'],
    status: 'ACTIVE',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
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
        if (d.user) setCurrentUser(d.user);
      });
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setModalOpen(false);
      setForm({ name: '', email: '', password: '', roles: ['EDITOR'], status: 'ACTIVE' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error creating user');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: nextStatus } : u)));
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update user status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Delete user account "${email}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        user={currentUser || { name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Team User Management"
        subtitle="Manage administrator and team accounts, role assignments, and active session statuses."
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
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
              cursor: 'pointer',
              letterSpacing: '0.04em'
            }}
          >
            <Plus size={15} />
            <span>Create Team User</span>
          </button>
        }
      />

      <div style={{ padding: '32px' }}>
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="VERIFYING CREW CREDENTIALS & ROLES..." size="card" />
          ) : users.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <Shield size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No users found</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>USER</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>ASSIGNED ROLES</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>LAST LOGIN</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {u.roles?.map((r: string) => (
                          <span
                            key={r}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '3px',
                              backgroundColor: r === 'ADMIN' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                              color: r === 'ADMIN' ? '#f43f5e' : '#38bdf8',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => handleToggleStatus(u._id, u.status)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        title="Click to toggle Active / Suspended"
                      >
                        <StatusBadge status={u.status || 'ACTIVE'} />
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#71717a' }}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {currentUser?._id !== u._id && (
                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#121216', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px', width: '100%', maxWidth: '480px', padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Register Team User</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Mahir Sakib"
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="mahir@biddroho.com"
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Temporary Password * (Min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Assign Role *
                </label>
                <select
                  value={form.roles[0] || 'EDITOR'}
                  onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="ADMIN">ADMIN (Full Access)</option>
                  <option value="BAND_MANAGER">BAND_MANAGER (Tours, Bookings & Releases)</option>
                  <option value="EDITOR">EDITOR (Draft & Edit Content)</option>
                  <option value="MODERATOR">MODERATOR (Review Submissions)</option>
                  <option value="PRESS">PRESS (Press & Media Kit)</option>
                  <option value="BAND_MEMBER">BAND_MEMBER (Musician Profile)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: 'none', color: '#a1a1aa', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px', backgroundColor: '#e11d48', color: '#ffffff',
                    border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
