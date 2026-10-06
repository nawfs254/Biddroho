import React from 'react';
import Link from 'next/link';
import { getDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/permissions/rbac';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import {
  Calendar,
  Disc3,
  Newspaper,
  Users,
  Briefcase,
  Mail,
  UserCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = await getDatabase();

  // 1. Fetch Real MongoDB Statistics
  const [
    eventsCount,
    releasesCount,
    newsCount,
    membersCount,
    bookingsCount,
    pendingBookingsCount,
    unreadContactsCount,
    subscribersCount,
    recentBookings,
    upcomingEvents,
    recentAuditLogs
  ] = await Promise.all([
    db.collection('events').countDocuments(),
    db.collection('releases').countDocuments(),
    db.collection('news').countDocuments(),
    db.collection('members').countDocuments(),
    db.collection('bookings').countDocuments(),
    db.collection('bookings').countDocuments({ status: { $in: ['pending', 'NEW'] } }),
    db.collection('contacts').countDocuments({ status: 'UNREAD' }),
    db.collection('subscribers').countDocuments({ status: 'ACTIVE' }),
    db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    db.collection('events').find({}).sort({ date: 1 }).limit(4).toArray(),
    db.collection('audit_logs').find({}).sort({ timestamp: -1 }).limit(6).toArray(),
  ]);

  // Content workflow status counts
  const publishedCount = await db.collection('events').countDocuments({ status: 'PUBLISHED' }) +
    await db.collection('news').countDocuments({ status: 'PUBLISHED' }) +
    await db.collection('releases').countDocuments({ status: 'PUBLISHED' });

  const draftCount = await db.collection('events').countDocuments({ status: 'DRAFT' }) +
    await db.collection('news').countDocuments({ status: 'DRAFT' }) +
    await db.collection('releases').countDocuments({ status: 'DRAFT' });

  const stats = [
    { label: 'Upcoming Shows', value: eventsCount, icon: Calendar, color: '#e11d48', href: '/admin/events' },
    { label: 'Active Catalog', value: releasesCount, icon: Disc3, color: '#38bdf8', href: '/admin/music' },
    { label: 'Articles & News', value: newsCount, icon: Newspaper, color: '#fbbf24', href: '/admin/news' },
    { label: 'Band Members', value: membersCount, icon: Users, color: '#a855f7', href: '/admin/band/members' },
    { label: 'Pending Bookings', value: pendingBookingsCount, icon: Briefcase, color: '#f43f5e', href: '/admin/bookings' },
    { label: 'Unread Inquiries', value: unreadContactsCount, icon: Mail, color: '#f97316', href: '/admin/contacts' },
    { label: 'Subscribers', value: subscribersCount, icon: UserCheck, color: '#10b981', href: '/admin/subscribers' },
  ];

  return (
    <div>
      <AdminHeader
        user={user}
        title="Command Dashboard"
        subtitle={`Welcome back, ${user.name}. Real-time statistics from MongoDB database "biddroho".`}
        actionButton={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/admin/events/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Plus size={14} />
              <span>Add Event</span>
            </Link>
          </div>
        }
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Real Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                style={{
                  backgroundColor: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  padding: '20px 18px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#a1a1aa', textTransform: 'uppercase' }}>
                    {s.label}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={15} color={s.color} />
                  </div>
                </div>

                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#f4f4f5',
                  fontFamily: 'Cinzel, Georgia, serif',
                  letterSpacing: '0.02em'
                }}>
                  {s.value}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Content Workflow Status Bar */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '0.04em' }}>
              Content Lifecycle & Workflow Pipeline
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
              Multi-stage governance: Draft → In Review → Approved → Published → Archived
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Published: <strong style={{ color: '#f4f4f5' }}>{publishedCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Drafts: <strong style={{ color: '#f4f4f5' }}>{draftCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Total Bookings: <strong style={{ color: '#f4f4f5' }}>{bookingsCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Recent Bookings & Upcoming Shows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {/* Recent Bookings CRM */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={16} color="#e11d48" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5' }}>Recent Booking Inquiries</span>
              </div>
              <Link href="/admin/bookings" style={{ fontSize: '11px', color: '#e11d48', fontWeight: 600, textDecoration: 'none' }}>
                View All CRM →
              </Link>
            </div>

            <div style={{ padding: '8px 0' }}>
              {recentBookings.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
                  No booking inquiries recorded yet.
                </div>
              ) : (
                recentBookings.map((b: any) => (
                  <Link
                    key={b._id.toString()}
                    href={`/admin/bookings/${b._id.toString()}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5' }}>
                        {b.name} {b.organization ? `(${b.organization})` : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                        {b.eventDate} • {b.venue}, {b.city}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge status={b.status || 'NEW'} />
                      <ArrowRight size={14} color="#71717a" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Tour Dates */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color="#38bdf8" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5' }}>Tour & Event Calendar</span>
              </div>
              <Link href="/admin/events" style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
                Manage Shows →
              </Link>
            </div>

            <div style={{ padding: '8px 0' }}>
              {upcomingEvents.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
                  No events found in MongoDB.
                </div>
              ) : (
                upcomingEvents.map((e: any) => (
                  <Link
                    key={e._id.toString()}
                    href={`/admin/events/${e._id.toString()}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5' }}>
                        {e.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                        {e.formattedDate || e.date} • {e.venue}, {e.city}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <StatusBadge status={e.status || 'PUBLISHED'} />
                      <ArrowRight size={14} color="#71717a" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Audit Log Trail Preview */}
        <div style={{
          backgroundColor: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={16} color="#10b981" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5' }}>System Security & Audit Trail</span>
            </div>
            <Link href="/admin/audit-logs" style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>
              Full Audit Logs →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', color: '#71717a' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>ACTION</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>RESOURCE</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>USER</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {recentAuditLogs.map((log: any) => (
                  <tr key={log._id.toString()} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: '#e11d48', fontWeight: 600 }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '12px 20px', color: '#a1a1aa' }}>
                      {log.resource}
                    </td>
                    <td style={{ padding: '12px 20px', color: '#f4f4f5', fontWeight: 500 }}>
                      {log.userName || log.userId}
                    </td>
                    <td style={{ padding: '12px 20px', color: '#71717a' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
