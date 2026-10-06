'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewNewsArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Announcement',
    readTime: '4 min read',
    coverImage: '/assets/hero_live.jpg',
    excerpt: '',
    content: '',
    status: 'PUBLISHED',
    featured: false,
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

  const handleTitleBlur = () => {
    if (!form.slug && form.title) {
      setForm((prev) => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        slug: (form.slug || form.title)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
      };

      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create article.');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Draft News Dispatch"
        subtitle="Write an official band announcement, tour update, or press release."
        actionButton={
          <Link
            href="/admin/news"
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
            <span>Back to News</span>
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
                Article Headline *
              </label>
              <input
                type="text"
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={handleTitleBlur}
                placeholder="e.g. BIDDROHO Announces Nationwide Arena Tour"
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
                placeholder="e.g. biddroho-announces-nationwide-arena-tour"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Category
              </label>
              <select
                name="category"
                value={form.category}
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
                <option value="Announcement">Announcement</option>
                <option value="Live">Live</option>
                <option value="Behind The Music">Behind The Music</option>
                <option value="Press">Press</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={form.readTime}
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
                <option value="PUBLISHED">PUBLISHED (Live on Site)</option>
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <ImageUpload
            preset="news"
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="Editorial Cover Image"
          />

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Summary Excerpt * (Displayed in news grid and previews)
            </label>
            <textarea
              rows={2}
              required
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Crucial short summary of the announcement..."
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#f4f4f5',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Full Article Content *
            </label>
            <textarea
              rows={8}
              required
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Full editorial article body, statements from band members, and quotes..."
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#f4f4f5',
                fontSize: '13px',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Link
              href="/admin/news"
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
              <span>{loading ? 'Publishing...' : 'Save & Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
