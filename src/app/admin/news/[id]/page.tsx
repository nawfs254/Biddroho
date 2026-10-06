import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';

export default async function ViewNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDatabase();

  let query: any;
  try {
    query = { _id: new ObjectId(id) };
  } catch {
    query = { _id: id };
  }

  const post = await db.collection('news').findOne(query);
  if (!post) notFound();

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title={`Article: ${post.title}`}
        subtitle={`Category: ${post.category} • Author: ${post.author || 'BIDDROHO'}`}
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href={`/news/${post.slug}`}
              target="_blank"
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
              <ExternalLink size={14} />
              <span>Public Page</span>
            </Link>
            <Link
              href={`/admin/news/${id}/edit`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Edit size={14} />
              <span>Edit Article</span>
            </Link>
          </div>
        }
      />

      <div style={{ padding: '32px', maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Link
          href="/admin/news"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#71717a', fontSize: '13px', textDecoration: 'none' }}
        >
          <ArrowLeft size={14} />
          <span>Back to All News</span>
        </Link>

        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f4f4f5', fontFamily: 'Cinzel, serif', margin: 0 }}>
                {post.title}
              </h2>
              <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginTop: '6px' }}>
                {post.category} • {post.readTime}
              </div>
            </div>

            <StatusBadge status={post.status || 'PUBLISHED'} />
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '3px solid #e11d48',
            fontSize: '14px',
            color: '#d4d4d8',
            fontStyle: 'italic',
            lineHeight: '1.6'
          }}>
            {post.excerpt}
          </div>

          <div style={{ fontSize: '14px', color: '#f4f4f5', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
}
