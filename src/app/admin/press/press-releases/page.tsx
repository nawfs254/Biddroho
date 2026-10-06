'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { Plus, FileText, Trash2, Edit, X } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminPressReleasesPage() {
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    pdfUrl: '',
    status: 'PUBLISHED',
  });

  const fetchPress = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/press');
      const data = await res.json();
      if (data.pressReleases) setPressReleases(data.pressReleases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPress();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/press', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create press release');
      setModalOpen(false);
      setForm({ title: '', slug: '', excerpt: '', content: '', pdfUrl: '', status: 'PUBLISHED' });
      fetchPress();
    } catch (err: any) {
      alert(err.message || 'Error saving press release');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete press release "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/press/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPressReleases((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Official Press Releases"
        subtitle="Manage official press communications, tour press dispatches, and journalist statements."
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
            <span>New Press Release</span>
          </button>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <Link
            href="/admin/press/press-releases"
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Press Releases
          </Link>
          <Link
            href="/admin/press/media-kit"
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#18181b',
              color: '#a1a1aa',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Media Kit & Assets
          </Link>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="RETRIEVING OFFICIAL PRESS RELEASES..." size="card" />
          ) : pressReleases.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <FileText size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No press releases found</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>HEADLINE</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>DATE</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pressReleases.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{p.title}</div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Slug: /{p.slug}</div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>{p.date}</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={p.status || 'PUBLISHED'} /></td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
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

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#121216', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px', width: '100%', maxWidth: '600px', padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>New Press Statement</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Release Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      title: val,
                      slug: !form.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : form.slug,
                    });
                  }}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Summary Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Statement Body *
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
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
                  Publish Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
