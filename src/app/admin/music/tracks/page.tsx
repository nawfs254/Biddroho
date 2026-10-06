import React from 'react';
import Link from 'next/link';
import { getDatabase } from '@/lib/mongodb';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { ArrowLeft, Music2, Clock } from 'lucide-react';

export default async function AdminTracksPage() {
  const db = await getDatabase();
  const releases = await db.collection('releases').find({}).toArray();

  const allTracks: Array<{ releaseTitle: string; releaseId: string; number: number; title: string; duration: string }> = [];
  for (const r of releases) {
    if (Array.isArray(r.tracks)) {
      for (const t of r.tracks) {
        allTracks.push({
          releaseTitle: r.title,
          releaseId: r._id.toString(),
          number: t.number,
          title: t.title,
          duration: t.duration,
        });
      }
    }
  }

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Track Index"
        subtitle={`Total of ${allTracks.length} official songs and tracks across all catalog releases.`}
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
            <span>All Catalog</span>
          </Link>
        }
      />

      <div style={{ padding: '32px' }}>
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#71717a', backgroundColor: '#0f0f13' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>#</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>TRACK TITLE</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>RELEASE</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>DURATION</th>
              </tr>
            </thead>
            <tbody>
              {allTracks.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 20px', color: '#71717a', width: '40px' }}>{t.number || idx + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f4f4f5' }}>{t.title}</td>
                  <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>
                    <Link href={`/admin/music/${t.releaseId}/edit`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                      {t.releaseTitle}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#71717a' }}>{t.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
