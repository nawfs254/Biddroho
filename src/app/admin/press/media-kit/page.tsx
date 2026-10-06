import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { ArrowLeft, Download, FolderGit2, FileText, Image as ImageIcon } from 'lucide-react';

export default function AdminMediaKitPage() {
  const assets = [
    { title: 'Official Distressed Band Emblem (High Res PNG)', category: 'Branding & Logos', size: '1.2 MB', path: '/assets/logo.png', format: 'PNG' },
    { title: 'Concert Stage Live Hero Key Visual', category: 'Concert Photography', size: '2.8 MB', path: '/assets/hero_live.jpg', format: 'JPG' },
    { title: 'BIDDROHI Studio Album Artwork (3000x3000px)', category: 'Album Artwork', size: '3.4 MB', path: '/assets/album_biddrohi.jpg', format: 'JPG' },
    { title: 'Nationwide Arena Tour Poster Art', category: 'Tour Promotion', size: '2.1 MB', path: '/assets/tour_poster.jpg', format: 'JPG' },
    { title: 'Official Audio Technical Rider & Channel List', category: 'Production Specs', size: '480 KB', path: '#', format: 'PDF' },
    { title: 'Stage Plot & Monitoring Arrangement 2026', category: 'Production Specs', size: '320 KB', path: '#', format: 'PDF' },
  ];

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Official Press & Media Kit"
        subtitle="Download official branding assets, technical riders, stage plots, and high-resolution photography."
        actionButton={
          <Link
            href="/admin/press/press-releases"
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
            <span>Press Releases</span>
          </Link>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {assets.map((a, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#121216',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '5px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: '#e11d48', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {a.category}
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '15px', fontWeight: 700, color: '#f4f4f5' }}>
                  {a.title}
                </h3>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{ fontSize: '11px', color: '#71717a' }}>{a.format} • {a.size}</span>
                <a
                  href={a.path}
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#38bdf8',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
