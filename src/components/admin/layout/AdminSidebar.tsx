'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Disc3,
  Newspaper,
  Image as ImageIcon,
  Users,
  Briefcase,
  Mail,
  UserCheck,
  FileText,
  FolderGit2,
  Shield,
  KeyRound,
  History,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Music2,
  Video,
  Radio,
  DollarSign
} from 'lucide-react';
import { AuthUser } from '@/lib/permissions/rbac';

interface SidebarProps {
  user: AuthUser;
}

export default function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userPerms = user.permissions || [];
  const isAdmin = user.roles.includes('ADMIN') || userPerms.includes('*');

  const can = (perm: string) => isAdmin || userPerms.includes(perm);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, visible: can('dashboard.view') },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { label: 'Events & Shows', href: '/admin/events', icon: Calendar, visible: can('events.view') },
        { label: 'Music & Catalog', href: '/admin/music', icon: Disc3, visible: can('music.view') },
        { label: 'News & Articles', href: '/admin/news', icon: Newspaper, visible: can('news.view') },
        { label: 'Media & Photos', href: '/admin/media', icon: ImageIcon, visible: can('media.view') },
        { label: 'Band Members', href: '/admin/band/members', icon: Users, visible: can('members.view') },
      ],
    },
    {
      title: 'BUSINESS & CRM',
      items: [
        { label: 'Bookings CRM', href: '/admin/bookings', icon: Briefcase, visible: can('bookings.view') },
        { label: 'Show Earnings Report', href: '/admin/bookings/reports', icon: DollarSign, visible: can('bookings.view') },
        { label: 'Contact Messages', href: '/admin/contacts', icon: Mail, visible: can('contacts.view') },
        { label: 'Subscribers', href: '/admin/subscribers', icon: UserCheck, visible: can('subscribers.view') },
      ],
    },
    {
      title: 'PRESS & MEDIA',
      items: [
        { label: 'Press Releases', href: '/admin/press/press-releases', icon: FileText, visible: can('press.view') },
        { label: 'Media Kit', href: '/admin/press/media-kit', icon: FolderGit2, visible: can('press.view') },
      ],
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        { label: 'Team Accounts', href: '/admin/users', icon: Shield, visible: can('users.view') },
        { label: 'Roles & RBAC', href: '/admin/roles', icon: KeyRound, visible: can('roles.view') },
        { label: 'Audit Trail', href: '/admin/audit-logs', icon: History, visible: can('audit.view') },
        { label: 'System Settings', href: '/admin/settings', icon: Settings, visible: can('settings.view') },
      ],
    },
  ];

  return (
    <aside className="no-print" style={{
      width: '280px',
      backgroundColor: '#09090b',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      userSelect: 'none',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            width: '34px',
            height: '34px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#18181b',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image
              src="/assets/logo.png"
              alt="BIDDROHO"
              width={26}
              height={26}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#f4f4f5',
              fontFamily: 'Cinzel, Georgia, serif',
            }}>
              BIDDROHO
            </div>
            <div style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#e11d48',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              CMS & CRM PORTAL
            </div>
          </div>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Public Website"
          style={{
            color: '#71717a',
            padding: '6px',
            borderRadius: '4px',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f4f4f5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Navigation Sections */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {navSections.map((section, idx) => {
          const visibleItems = section.items.filter((item) => item.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx}>
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#71717a',
                padding: '0 8px 8px 8px',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif'
              }}>
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#f4f4f5' : '#a1a1aa',
                        backgroundColor: isActive ? 'rgba(225, 29, 72, 0.12)' : 'transparent',
                        borderLeft: isActive ? '3px solid #e11d48' : '3px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.color = '#f4f4f5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#a1a1aa';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} color={isActive ? '#e11d48' : '#71717a'} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight size={14} color="#e11d48" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Status & Logout Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        backgroundColor: '#0c0c0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e11d48',
            fontWeight: 700,
            fontSize: '13px',
            flexShrink: 0
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#f4f4f5',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#e11d48',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              {user.roles.join(', ') || 'TEAM'}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'none',
            border: 'none',
            color: '#71717a',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s, background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#71717a';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
