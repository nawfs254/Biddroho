'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#050506',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e11d48',
          marginBottom: '20px',
        }}
      >
        <SearchX size={32} />
      </div>

      <span className="editorial-badge" style={{ marginBottom: '16px' }}>
        // NOT FOUND (404)
      </span>

      <h1
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '12px',
          fontFamily: 'var(--font-display, sans-serif)',
        }}
      >
        No data available
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '480px', marginBottom: '28px', lineHeight: 1.6 }}>
        The requested record or page does not exist in the database or may have been unlisted.
      </p>

      <Link
        href="/"
        className="btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
      >
        <ArrowLeft size={16} />
        RETURN TO PORTAL
      </Link>
    </div>
  );
}
