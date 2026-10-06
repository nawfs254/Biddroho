'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import ConfirmDeleteModal from '@/components/admin/ui/ConfirmDeleteModal';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function EditNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
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
    category: 'Announcement',
    readTime: '4 min read',
    coverImage: '/assets/hero_live.jpg',
    excerpt: '',
    content: '',
    status: 'PUBLISHED',
    featured: false,
  });

  useEffect(() => {
    fetch(`/api/admin/news/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.news) {
          setForm({
            title: data.news.title || '',
            slug: data.news.slug || '',
            category: data.news.category || 'Announcement',
            readTime: data.news.readTime || '4 min read',
            coverImage: data.news.coverImage || '/assets/hero_live.jpg',
            excerpt: data.news.excerpt || '',
            content: data.news.content || '',
            status: data.news.status || 'PUBLISHED',
            featured: Boolean(data.news.featured),
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

      const res = await fetch(`/api/admin/news/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update article.');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating article');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/news/${resolvedParams.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteModalOpen(false);
        router.push('/admin/news');
        router.refresh();
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

  if (fetching) {
    return (
      <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <MusicLoader text="RETRIEVING EDITORIAL DISPATCH..." size="card" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Edit Article: ${form.title}`}
        subtitle={`Updating news article document ID ${resolvedParams.id}`}
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
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <ImageUpload
            preset="news"
            value={form.coverImage || ''}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="Editorial Cover Image"
          />

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Summary Excerpt *
            </label>
            <textarea
              rows={2}
              required
              name="excerpt"
              value={form.excerpt}
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
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
              Full Article Body *
            </label>
            <textarea
              rows={8}
              required
              name="content"
              value={form.content}
              onChange={handleChange}
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
              <span>{loading ? 'Saving...' : 'Update Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
