'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function NewMusicReleasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    type: 'album',
    releaseDate: 'October 2026',
    year: 2026,
    coverImage: '/assets/album_biddrohi.jpg',
    shortDescription: '',
    fullDescription: '',
    status: 'PUBLISHED',
    featured: false,
    youtubeUrl: 'https://youtube.com',
    streamingLinks: {
      spotify: '',
      appleMusic: '',
      youtubeMusic: '',
      soundcloud: '',
      tidal: '',
    },
    credits: {
      producedBy: 'BIDDROHO',
      mixedMasteredBy: 'Acoustic Fire Studios',
      recordedAt: 'Studio 11, Dhaka',
      artworkBy: 'BIDDROHO Visuals',
      lineup: [
        { name: 'Srijon Tawsif Hossain', role: 'Lead Vocals & Rhythm Guitar' },
        { name: 'Sayed Alvi Haque', role: 'Lead Guitar' },
        { name: 'Mahir Sakib', role: 'Bass' },
        { name: 'Nawfs Ul Ahsun Arnob', role: 'Drums & Percussion' },
        { name: 'Zhasid Hasan Aurko', role: 'Keyboards & Synths' },
        { name: 'Yasin Ridoy', role: 'Sound Engineer' },
        { name: 'Tanim Reza', role: 'Management' },
      ],
    },
    tracks: [
      { number: 1, title: 'Title Anthem', duration: '04:12' },
      { number: 2, title: 'Rebellion Beat', duration: '03:48' },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name === 'slug') {
      setForm((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStreamingLinkChange = (field: string, val: string) => {
    setForm((prev) => ({
      ...prev,
      streamingLinks: {
        ...(prev.streamingLinks || {}),
        [field]: val,
      },
    }));
  };

  const handleCreditChange = (field: string, val: string) => {
    setForm((prev) => ({
      ...prev,
      credits: {
        ...(prev.credits || {}),
        [field]: val,
      },
    }));
  };

  const handleAddLineupMember = () => {
    setForm((prev) => ({
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
    setForm((prev) => ({
      ...prev,
      credits: {
        ...(prev.credits || {}),
        lineup: (prev.credits?.lineup || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleLineupMemberChange = (index: number, field: string, val: string) => {
    setForm((prev) => {
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

  const handleTitleBlur = () => {
    if (!form.slug && form.title) {
      setForm((prev) => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleAddTrack = () => {
    setForm((prev) => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        { number: prev.tracks.length + 1, title: 'New Track', duration: '03:30' },
      ],
    }));
  };

  const handleRemoveTrack = (index: number) => {
    setForm((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((_, i) => i !== index),
    }));
  };

  const handleTrackChange = (index: number, field: string, val: any) => {
    setForm((prev) => {
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

      const res = await fetch('/api/admin/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create release.');
      }

      router.push('/admin/music');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating release');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Add Catalog Release"
        subtitle="Publish a studio album, EP, or single to the official discography."
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
          {/* Title and Slug */}
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
                onBlur={handleTitleBlur}
                placeholder="e.g. BIDDROHI (The Rebel)"
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
                placeholder="e.g. biddrohi-the-rebel"
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

          {/* Format, Year, Release Date, Status */}
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
                Date Label
              </label>
              <input
                type="text"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                placeholder="November 2024"
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
                Content Status
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
                value={form.youtubeUrl}
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

          {/* Short Description */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Short Editorial Summary
            </label>
            <textarea
              rows={2}
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Crucial heavy guitar textures and poetic commentary..."
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

            {form.tracks.map((t, idx) => (
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

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
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
              <span>{loading ? 'Publishing Release...' : 'Save & Publish Release'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
