'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Save, Check, Plus, Trash2, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState<any>({
    bandName: 'BIDDROHO',
    tagline: 'Heavy Rock & Raw Rebellion from Dhaka',
    contactEmail: 'contact@biddroho.com',
    bookingEmail: 'booking@biddroho.com',
    pressEmail: 'press@biddroho.com',
    phone: '+880 1711 000000',
    address: 'Dhaka, Bangladesh',
    connectLinks: [],
    maintenanceMode: false,
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const links = Array.isArray(data.settings.connectLinks)
            ? data.settings.connectLinks
            : [];

          setSettings((prev: any) => ({
            ...prev,
            ...data.settings,
            connectLinks: links,
          }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSuccess(false);
  };

  const handleConnectLinkChange = (index: number, field: 'label' | 'url', val: string) => {
    setSettings((prev: any) => {
      const updated = [...(prev.connectLinks || [])];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, connectLinks: updated };
    });
    setSuccess(false);
  };

  const handleAddConnectLink = (customLabel = '') => {
    setSettings((prev: any) => ({
      ...prev,
      connectLinks: [
        ...(prev.connectLinks || []),
        {
          id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          label: customLabel || '',
          url: ''
        },
      ],
    }));
    setSuccess(false);
  };

  const handleRemoveConnectLink = async (index: number) => {
    const target = settings.connectLinks?.[index];
    const updated = (settings.connectLinks || []).filter((_: any, i: number) => i !== index);
    setSettings((prev: any) => ({
      ...prev,
      connectLinks: updated,
    }));
    setSuccess(false);

    // Also delete directly from MongoDB backend if item has an ID
    if (target?.id) {
      try {
        await fetch(`/api/admin/settings?id=${encodeURIComponent(target.id)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete link on backend:', err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Official System & Brand Settings"
        subtitle="Manage public contact coordinates, streaming profiles, and operational parameters stored in MongoDB."
      />

      <div style={{ padding: '32px', maxWidth: '880px' }}>
        <form onSubmit={handleSave} style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* General Information */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 16px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
              Band Identity & Communications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Band Name
                </label>
                <input
                  type="text"
                  name="bandName"
                  value={settings.bandName}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Booking Email
                </label>
                <input
                  type="email"
                  name="bookingEmail"
                  value={settings.bookingEmail}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Press / PR Email
                </label>
                <input
                  type="email"
                  name="pressEmail"
                  value={settings.pressEmail}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '8px 12px', backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', color: '#f4f4f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Official Streaming & Social Links (STREAM & CONNECT) */}
          <div style={{
            backgroundColor: '#18181d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                  Official Streaming & Social Links (STREAM & CONNECT)
                </h3>
                <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0' }}>
                  Dynamic buttons displayed under STREAM & CONNECT in the public footer. If a link is blank, the button remains visible but is automatically disabled.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddConnectLink('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  backgroundColor: '#27272a',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '4px',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>Add Platform Button</span>
              </button>
            </div>

            {/* Quick Add presets bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '10px 12px', backgroundColor: '#121215', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase' }}>Quick Add:</span>
              {['JioSaavn', 'SoundCloud', 'Tidal', 'Amazon Music', 'YouTube Music', 'Deezer', 'Bandcamp', 'TikTok'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddConnectLink(preset)}
                  style={{
                    padding: '3px 9px',
                    backgroundColor: '#1f1f23',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    color: '#e4e4e7',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  + {preset}
                </button>
              ))}
            </div>

            {/* Dynamic Links List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(settings.connectLinks || []).length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#121215', borderRadius: '4px', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#71717a', fontSize: '12px' }}>
                  No platform buttons configured. Click &ldquo;+ Add Platform Button&rdquo; or select a Quick Add preset above.
                </div>
              ) : (
                (settings.connectLinks || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#121215',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <span style={{ color: '#71717a', fontSize: '12px', width: '22px' }}>{idx + 1}.</span>
                  <div style={{ width: '180px' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Platform Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JioSaavn"
                      value={item.label || ''}
                      onChange={(e) => handleConnectLinkChange(idx, 'label', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        color: '#f4f4f5',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Destination URL (Leave blank to show disabled button)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={item.url || ''}
                      onChange={(e) => handleConnectLinkChange(idx, 'url', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        color: '#f4f4f5',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ paddingTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveConnectLink(idx)}
                      title="Remove platform"
                      style={{
                        padding: '7px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              {success && (
                <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} />
                  <span>Settings successfully saved in MongoDB!</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
