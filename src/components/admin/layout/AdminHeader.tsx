'use client';

import React from 'react';
import Link from 'next/link';
import { AuthUser } from '@/lib/permissions/rbac';
import { ExternalLink, Database, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  user?: Partial<AuthUser> | any;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export default function AdminHeader({ user, title, subtitle, actionButton }: HeaderProps) {
  return (
    <header style={{
      backgroundColor: '#0c0c0e',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <h1 style={{
          fontSize: '19px',
          fontWeight: 700,
          color: '#f4f4f5',
          fontFamily: 'Cinzel, Georgia, serif',
          letterSpacing: '0.04em',
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: '12px',
            color: '#71717a',
            margin: '3px 0 0 0',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* DB Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* Action Button slot */}
        {actionButton && (
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {actionButton}
          </div>
        )}

        {/* Public site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#a1a1aa',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f4f4f5';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#a1a1aa';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <span>View Site</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </header>
  );
}
