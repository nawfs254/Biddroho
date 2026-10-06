import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || '').toUpperCase();

  let bg = 'rgba(113, 113, 122, 0.15)';
  let color = '#a1a1aa';
  let border = 'rgba(113, 113, 122, 0.3)';

  switch (normalized) {
    case 'PUBLISHED':
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'READ':
      bg = 'rgba(16, 185, 129, 0.12)';
      color = '#34d399';
      border = 'rgba(16, 185, 129, 0.3)';
      break;

    case 'IN_REVIEW':
    case 'IN_PROGRESS':
    case 'CONTACTED':
      bg = 'rgba(59, 130, 246, 0.12)';
      color = '#60a5fa';
      border = 'rgba(59, 130, 246, 0.3)';
      break;

    case 'APPROVED':
      bg = 'rgba(147, 51, 234, 0.12)';
      color = '#c084fc';
      border = 'rgba(147, 51, 234, 0.3)';
      break;

    case 'DRAFT':
    case 'NEW':
    case 'UNREAD':
    case 'PENDING':
      bg = 'rgba(245, 158, 11, 0.12)';
      color = '#fbbf24';
      border = 'rgba(245, 158, 11, 0.3)';
      break;

    case 'ARCHIVED':
    case 'CANCELLED':
    case 'REJECTED':
    case 'SUSPENDED':
    case 'UNSUBSCRIBED':
      bg = 'rgba(239, 68, 68, 0.12)';
      color = '#f87171';
      border = 'rgba(239, 68, 68, 0.3)';
      break;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.05em',
      borderRadius: '3px',
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      textTransform: 'uppercase',
      lineHeight: '16px'
    }}>
      {normalized}
    </span>
  );
}
