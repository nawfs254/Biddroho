'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function EditMusicReleasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<any>({
    title: '',
    slug: '',
    type: 'album',
    releaseDate: '',
    year: 2024,
    coverImage: '/assets/album_biddrohi.jpg',
    shortDescription: '',
    fullDescription: '',
    status: 'PUBLISHED',
    featured: false,
    youtubeUrl: '',
    streamingLinks: { spotify: '', appleMusic: '', youtubeMusic: '', soundcloud: '', tidal: '' },
    credits: { producedBy: 'BIDDROHO', mixedMasteredBy: '', recordedAt: '', artworkBy: '', lineup: [] },
    tracks: [],
  });

  useEffect(() => {
    fetch(`/api/admin/music/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.release) {
          const rawLineup = data.release.credits?.lineup || [];
          const normalizedLineup = Array.isArray(rawLineup)
            ? rawLineup.map((item: any) => {
                if (typeof item === 'string') return { name: item, role: '' };
                return { name: item?.name || '', role: item?.role || '' };
              })
            : [];

          setForm({
            title: data.release.title || '',
            slug: data.release.slug || '',
            type: data.release.type || 'album',
            releaseDate: data.release.releaseDate || '',
            year: data.release.year || 2024,
            coverImage: data.release.coverImage || '/assets/album_biddrohi.jpg',
            shortDescription: data.release.shortDescription || '',
            fullDescription: data.release.fullDescription || '',
            status: data.release.status || 'PUBLISHED',
            featured: Boolean(data.release.featured),
            youtubeUrl: data.release.youtubeUrl || '',
            streamingLinks: {
              spotify: data.release.streamingLinks?.spotify || '',
              appleMusic: data.release.streamingLinks?.appleMusic || '',
              youtubeMusic: data.release.streamingLinks?.youtubeMusic || '',
              soundcloud: data.release.streamingLinks?.soundcloud || '',
              tidal: data.release.streamingLinks?.tidal || '',
            },
            credits: {
              producedBy: data.release.credits?.producedBy || 'BIDDROHO',
              mixedMasteredBy: data.release.credits?.mixedMasteredBy || '',
              recordedAt: data.release.credits?.recordedAt || '',
              artworkBy: data.release.credits?.artworkBy || '',
              lineup: normalizedLineup,
            },
            tracks: data.release.tracks || [],
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, [resolvedParams.id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name === 'slug') {
      setForm((prev: any) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      }));
      return;
    }
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStreamingLinkChange = (field: string, val: string) => {
    setForm((prev: any) => ({
      ...prev,
      streamingLinks: {
        ...(prev.streamingLinks || {}),
        [field]: val,
      },
    }));
  };

  const handleCreditChange = (field: string, val: string) => {
    setForm((prev: any) => ({
      ...prev,
      credits: {
        ...(prev.credits || {}),
        [field]: val,
      },
    }));
  };

  const handleAddLineupMember = () => {
    setForm((prev: any) => ({
      ...prev,
      credits: {
        ...(prev.credits || {}),
        lineup: [
          ...(prev.credits?.lineup || []),
          { name: '', role: '' },
        ],
      },
    }));
  };

  const handleRemoveLineupMember = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      credits: {
        ...(prev.credits || {}),
        lineup: (prev.credits?.lineup || []).filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const handleLineupMemberChange = (index: number, field: string, val: string) => {
    setForm((prev: any) => {
      const current = [...(prev.credits?.lineup || [])];
      current[index] = { ...current[index], [field]: val };
      return {
        ...prev,
        credits: {
          ...(prev.credits || {}),
          lineup: current,
        },
      };
    });
  };

  const handleAddTrack = () => {
    setForm((prev: any) => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        { number: prev.tracks.length + 1, title: 'New Track', duration: '03:30' },
      ],
    }));
  };

  const handleRemoveTrack = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      tracks: prev.tracks.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleTrackChange = (index: number, field: string, val: any) => {
    setForm((prev: any) => {
      const updated = [...prev.tracks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, tracks: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedLineup = (form.credits?.lineup || [])
        .filter((m: any) => m && m.name && m.name.trim() !== '')
        .map((m: any) => ({ name: m.name.trim(), role: (m.role || '').trim() }));

      const payload = {
        ...form,
        credits: {
          ...(form.credits || {}),
          lineup: cleanedLineup,
        },
        slug: (form.slug || form.title)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
      };

      const res = await fetch(`/api/admin/music/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update release.');
      }

      router.push('/admin/music');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating release');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/music/${resolvedParams.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/music');
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete release.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during deletion.');
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <MusicLoader text="READING VINYL GROOVES & RELEASE DETAILS..." size="card" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Edit Release: ${form.title}`}
        subtitle={`Updating document ID ${resolvedParams.id}`}
        actionButton={
          <Link
            href="/admin/music"
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
            <span>Back to Catalog</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', maxWidth: '880px' }}>
        {error && (
          <div style={{
            padding: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Release Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                URL Slug *
              </label>
              <input
                type="text"
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Format
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="album">Studio Album (LP)</option>
                <option value="ep">EP</option>
                <option value="single">Single</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Year
              </label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Date String
              </label>
              <input
                type="text"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f4f4f5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Cover image & Youtube */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ImageUpload
              preset="album"
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              label="Album / Single Cover Artwork"
            />

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                YouTube Stream / Video URL
              </label>
              <input
                type="text"
                name="youtubeUrl"
                value={form.youtubeUrl || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
          </div>

          {/* Streaming Platforms & Distribution Links */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Streaming Platforms & Distribution Links
              </span>
              <p style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
                Provide official platform URLs. If any link is empty or blank, its button will automatically be disabled on public pages.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Spotify URL
                </label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/album/..."
                  value={form.streamingLinks?.spotify || ''}
                  onChange={(e) => handleStreamingLinkChange('spotify', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Apple Music URL
                </label>
                <input
                  type="text"
                  placeholder="https://music.apple.com/..."
                  value={form.streamingLinks?.appleMusic || ''}
                  onChange={(e) => handleStreamingLinkChange('appleMusic', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  YouTube Music URL
                </label>
                <input
                  type="text"
                  placeholder="https://music.youtube.com/..."
                  value={form.streamingLinks?.youtubeMusic || ''}
                  onChange={(e) => handleStreamingLinkChange('youtubeMusic', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  SoundCloud URL
                </label>
                <input
                  type="text"
                  placeholder="https://soundcloud.com/biddroho2011/..."
                  value={form.streamingLinks?.soundcloud || ''}
                  onChange={(e) => handleStreamingLinkChange('soundcloud', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Tidal URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://tidal.com/..."
                  value={form.streamingLinks?.tidal || ''}
                  onChange={(e) => handleStreamingLinkChange('tidal', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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
            </div>
          </div>

          {/* Production Credits & Band Lineup */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Production & Release Credits
              </span>
              <p style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
                Credits, engineering, and musicians for this release. These are rendered in the Production & Release Credits block on the release page.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Produced By
                </label>
                <input
                  type="text"
                  placeholder="e.g. BIDDROHO"
                  value={form.credits?.producedBy || ''}
                  onChange={(e) => handleCreditChange('producedBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Mixing & Mastering
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic Fire Studios"
                  value={form.credits?.mixedMasteredBy || ''}
                  onChange={(e) => handleCreditChange('mixedMasteredBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Recorded At
                </label>
                <input
                  type="text"
                  placeholder="e.g. Studio 11, Dhaka"
                  value={form.credits?.recordedAt || ''}
                  onChange={(e) => handleCreditChange('recordedAt', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Artwork By
                </label>
                <input
                  type="text"
                  placeholder="e.g. BIDDROHO Visuals"
                  value={form.credits?.artworkBy || ''}
                  onChange={(e) => handleCreditChange('artworkBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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
            </div>

            {/* Official Band Lineup for this Release */}
            <div style={{
              marginTop: '10px',
              backgroundColor: '#121216',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Release Lineup & Roles ({form.credits?.lineup?.length || 0} Members)
                  </span>
                  <p style={{ fontSize: '11px', color: '#71717a', margin: '2px 0 0' }}>
                    Put the names and roles since lineup can change per release (e.g. Lead Vocals, Guitars, Guest Bassist).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLineupMember}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#38bdf8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={13} />
                  <span>Add Lineup Member</span>
                </button>
              </div>

              {(!form.credits?.lineup || form.credits.lineup.length === 0) ? (
                <div style={{ color: '#71717a', fontSize: '12px', fontStyle: 'italic', padding: '8px 0' }}>
                  No lineup members added yet. Click &quot;Add Lineup Member&quot; to specify musicians and their roles for this release.
                </div>
              ) : (
                form.credits.lineup.map((member: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#71717a', fontSize: '12px', width: '20px' }}>{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="Musician / Member Name (e.g. Srijon Tawsif Hossain)"
                      value={member.name || ''}
                      onChange={(e) => handleLineupMemberChange(idx, 'name', e.target.value)}
                      style={{
                        flex: 1.2,
                        padding: '8px 12px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        color: '#f4f4f5',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Role / Instrument (e.g. Lead Vocals, Guitars)"
                      value={member.role || ''}
                      onChange={(e) => handleLineupMemberChange(idx, 'role', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        color: '#f4f4f5',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLineupMember(idx)}
                      title="Remove member"
                      style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tracklist Builder */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tracklist ({form.tracks.length} Tracks)
              </span>
              <button
                type="button"
                onClick={handleAddTrack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#38bdf8',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} />
                <span>Add Track</span>
              </button>
            </div>

            {form.tracks.map((t: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#71717a', fontSize: '12px', width: '20px' }}>{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="Song Title"
                  value={t.title}
                  onChange={(e) => handleTrackChange(idx, 'title', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="03:45"
                  value={t.duration}
                  onChange={(e) => handleTrackChange(idx, 'duration', e.target.value)}
                  style={{
                    width: '90px',
                    padding: '8px 12px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrack(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    padding: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              disabled={loading || deleting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: loading || deleting ? 'not-allowed' : 'pointer',
              }}
            >
              <Trash2 size={15} />
              <span>Delete Release</span>
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/admin/music"
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  color: '#a1a1aa',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Save size={15} />
                <span>{loading ? 'Updating Release...' : 'Update & Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Music Release"
        itemName={form.title}
        loading={deleting}
      />
    </div>
  );
}
