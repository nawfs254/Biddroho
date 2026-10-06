'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import MusicLoader from '@/components/ui/MusicLoader';
import { Plus, Search, Newspaper, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/news?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}&status=${encodeURIComponent(statusFilter)}`);
      const data = await res.json();
      if (data.news) setNews(data.news);
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
    fetchNews();
  }, [search, categoryFilter, statusFilter]);

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/news/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => (n._id || n.id) !== deleteTarget.id && n._id !== deleteTarget.id && n.id !== deleteTarget.id));
        setDeleteTarget(null);
        await fetchNews();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete news article.');
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
        title="News & Press Dispatches"
        subtitle="Manage official press announcements, tour reports, and backstage news."
        actionButton={
          <Link
            href="/admin/news/new"
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
            <span>Draft Article</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Filter Bar */}
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
              placeholder="Search headline or content..."
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
            <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
              <option value="">All Categories</option>
              <option value="Announcement">Announcement</option>
              <option value="Live">Live</option>
              <option value="Behind The Music">Behind The Music</option>
              <option value="Press">Press</option>
            </select>

            <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginLeft: '8px' }}>Status:</span>
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

        {/* News Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="PRINTING PRESS DISPATCHES & EDITORIALS..." size="card" />
          ) : news.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <Newspaper size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5' }}>No news articles found</div>
              <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Draft your first press dispatch or announcement.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>HEADLINE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>CATEGORY</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>AUTHOR</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((n) => (
                    <tr
                      key={n._id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{n.title}</div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Slug: /{n.slug}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>
                          {n.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        {n.author || 'BIDDROHO'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={n.status || 'PUBLISHED'} />
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            href={`/news/${n.slug}`}
                            target="_blank"
                            title="Preview Public Page"
                            style={{ color: '#71717a', padding: '6px' }}
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/news/${n._id}/edit`}
                            title="Edit Article"
                            style={{ color: '#38bdf8', padding: '6px' }}
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: n._id || n.id, title: n.title })}
                            title="Delete Article"
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
        title="Delete Press Article"
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
