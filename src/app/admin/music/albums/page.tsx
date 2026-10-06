import React from 'react';
import Link from 'next/link';
import { getDatabase } from '@/lib/mongodb';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { ArrowLeft, Disc3, Music2, Edit } from 'lucide-react';

export default async function AdminAlbumsPage() {
  const db = await getDatabase();
  const albums = await db.collection('releases').find({ type: 'album' }).sort({ year: -1 }).toArray();

  return (
    <div>
      <AdminHeader
        user={{ name: 'Admin', roles: ['ADMIN'], permissions: ['*'] }}
        title="Studio Albums (LPs)"
        subtitle="Full-length studio album discography."
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>ALBUM TITLE</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>YEAR</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>TRACKS</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((a: any) => (
                <tr key={a._id.toString()} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f4f4f5' }}>{a.title}</td>
                  <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>{a.year}</td>
                  <td style={{ padding: '14px 20px', color: '#a1a1aa' }}>{a.tracks?.length || 0} tracks</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={a.status || 'PUBLISHED'} /></td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link href={`/admin/music/${a._id.toString()}/edit`} style={{ color: '#38bdf8' }}>
                      <Edit size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
