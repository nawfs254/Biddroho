'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import MusicLoader from '@/components/ui/MusicLoader';
import { Plus, Search, Disc3, Music2, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

export default function AdminMusicPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/music?search=${encodeURIComponent(search)}&type=${encodeURIComponent(typeFilter)}`);
      const data = await res.json();
      if (data.releases) setReleases(data.releases);
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
    fetchReleases();
  }, [search, typeFilter]);

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/music/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setReleases((prev) => prev.filter((r) => (r._id || r.id) !== deleteTarget.id && r._id !== deleteTarget.id && r.id !== deleteTarget.id));
        setDeleteTarget(null);
        await fetchReleases();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete release.');
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
        title="Music Catalog & Discography"
        subtitle="Manage official albums, EPs, singles, tracklists, and streaming distribution."
        actionButton={
          <Link
            href="/admin/music/new"
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
            <span>New Release</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <Link
            href="/admin/music"
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
            All Releases
          </Link>
          <Link
            href="/admin/music/albums"
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
            Studio Albums
          </Link>
          <Link
            href="/admin/music/tracks"
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
            Track Index
          </Link>
        </div>

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
              placeholder="Search release title or notes..."
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
            <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Format:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
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
              <option value="">All Formats</option>
              <option value="album">Full Album (LP)</option>
              <option value="ep">EP</option>
              <option value="single">Single</option>
            </select>
          </div>
        </div>

        {/* Music Releases Table */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <MusicLoader text="SPINNING VINYL & LOADING DISCOGRAPHY..." size="card" />
          ) : releases.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <Disc3 size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5' }}>No releases found</div>
              <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>Add your first album or single to the catalog.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>RELEASE TITLE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>TYPE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>YEAR</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>TRACKS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((r) => (
                    <tr
                      key={r._id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{r.title}</div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>Slug: /{r.slug}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                          {r.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        {r.year || 2024}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Music2 size={13} color="#71717a" />
                          <span>{Array.isArray(r.tracks) ? r.tracks.length : 0} tracks</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={r.status || 'PUBLISHED'} />
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            href={`/music/${r.slug}`}
                            target="_blank"
                            title="Preview Public Page"
                            style={{ color: '#71717a', padding: '6px' }}
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/music/${r._id}/edit`}
                            title="Edit Release"
                            style={{ color: '#38bdf8', padding: '6px' }}
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: r._id || r.id, title: r.title })}
                            title="Delete Release"
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
        title="Delete Music Release"
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
