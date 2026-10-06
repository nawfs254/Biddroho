'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import { Plus, Image as ImageIcon, Video, Trash2, X, Play } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [newAsset, setNewAsset] = useState({
    title: '',
    type: 'photo',
    category: 'live',
    url: '',
    thumbnailUrl: '',
    caption: '',
    location: 'Dhaka, Bangladesh',
    youtubeId: '',
  });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/media?type=${typeFilter}&category=${categoryFilter}`);
      const data = await res.json();
      if (data.media) setMediaList(data.media);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [typeFilter, categoryFilter]);

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => (m._id || m.id) !== deleteTarget.id && m._id !== deleteTarget.id && m.id !== deleteTarget.id));
        setDeleteTarget(null);
        await fetchMedia();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete media asset');
      }
    } catch (err) {
      console.error(err);
      alert('Error during deletion');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset),
      });

      if (!res.ok) throw new Error('Failed to create media asset');

      setModalOpen(false);
      setNewAsset({
        title: '',
        type: 'photo',
        category: 'live',
        url: '',
        thumbnailUrl: '',
        caption: '',
        location: 'Dhaka, Bangladesh',
        youtubeId: '',
      });
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Error saving media');
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Photography & Video Archive"
        subtitle="Manage live stage photography, press portraits, and official music videos."
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
            <span>Add Media Asset</span>
          </button>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <Link
            href="/admin/media"
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
            All Media
          </Link>
          <Link
            href="/admin/media/photos"
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
            Photography
          </Link>
          <Link
            href="/admin/media/videos"
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
            Music Videos
          </Link>
        </div>

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
            <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginRight: '8px' }}>Type:</span>
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
              <option value="">All Types</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginRight: '8px' }}>Category:</span>
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
              <option value="live">Live Stage</option>
              <option value="studio">Studio Sessions</option>
              <option value="portrait">Band Portraits</option>
              <option value="backstage">Backstage</option>
            </select>
          </div>
        </div>

        {/* Grid of Media Assets */}
        {loading ? (
          <MusicLoader text="DIGITIZING ARCHIVES & REELS..." size="card" />
        ) : mediaList.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', backgroundColor: '#121216', borderRadius: '5px' }}>
            <ImageIcon size={32} color="#71717a" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#f4f4f5', fontWeight: 600 }}>No media items found</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {mediaList.map((m) => (
              <div
                key={m._id || m.id}
                style={{
                  backgroundColor: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '170px', backgroundColor: '#000000' }}>
                  <Image
                    src={m.thumbnailUrl || m.url || '/assets/hero_live.jpg'}
                    alt={m.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#e11d48',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {m.type === 'video' ? <Video size={11} /> : <ImageIcon size={11} />}
                    <span>{m.category}</span>
                  </div>
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 600, color: '#f4f4f5' }}>
                      {m.title}
                    </h4>
                    {m.caption && (
                      <p style={{ margin: 0, fontSize: '11px', color: '#71717a', lineHeight: '1.4' }}>
                        {m.caption}
                      </p>
                    )}
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '10px', color: '#71717a' }}>{m.location || 'Bangladesh'}</span>
                    <button
                      onClick={() => setDeleteTarget({ id: m._id || m.id, title: m.title })}
                      title="Delete Asset"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            width: '100%', maxWidth: '520px', padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Add Media Asset</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.title}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  placeholder="e.g. Srijon Solo Vocal Screams - Live"
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Type
                  </label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                    style={{
                      width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    style={{
                      width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="live">Live Stage</option>
                    <option value="studio">Studio Sessions</option>
                    <option value="portrait">Band Portraits</option>
                    <option value="backstage">Backstage</option>
                  </select>
                </div>
              </div>

              {newAsset.type === 'photo' ? (
                <ImageUpload
                  preset="gallery"
                  value={newAsset.url}
                  onChange={(url: string) => setNewAsset({ ...newAsset, url, thumbnailUrl: url })}
                  label="Concert / Stage Photo"
                  required
                />
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Video URL / YouTube Embed *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAsset.url}
                    onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or direct MP4"
                    style={{
                      width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Caption / Notes
                </label>
                <input
                  type="text"
                  value={newAsset.caption}
                  onChange={(e) => setNewAsset({ ...newAsset, caption: e.target.value })}
                  placeholder="Caption for lightbox overlay..."
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Media Asset"
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
