'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Disc3, Radio, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [connectLinks, setConnectLinks] = useState<Array<{ label: string; url?: string }>>([]);

  React.useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings && Array.isArray(data.settings.connectLinks)) {
          setConnectLinks(data.settings.connectLinks);
        } else {
          setConnectLinks([]);
        }
      })
      .catch((err) => console.warn('Could not load dynamic connect links:', err));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#070709',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(ellipse at bottom, rgba(229, 9, 20, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Footer Content */}
      <div className="site-container" style={{ paddingTop: '5rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4rem'
          }}
        >
          {/* Col 1: Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                <Image
                  src="/assets/logo.png"
                  alt="BIDDROHO Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3
                  className="font-display"
                  style={{ fontSize: '2rem', letterSpacing: '0.12em', lineHeight: 1, color: '#fff' }}
                >
                  BIDDROHO
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--crimson-base)', letterSpacing: '0.2em', fontWeight: 600 }}>
                  BANGLADESH ROCK LEGACY
                </p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '360px' }}>
              Raw sonic rebellion since 2011. Heavy riffs, soaring melodies, and authentic rock energy forged on stadium stages across Bangladesh.
            </p>

            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book" className="btn-outline-red" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
                DIRECT BOOKINGS
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.2rem',
                letterSpacing: '0.15em',
                color: '#fff',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              EXPLORE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'DISCOGRAPHY & RELEASES', href: '/music' },
                { name: 'TOUR DATES & EVENTS', href: '/events' },
                { name: 'MEDIA & CONCERT GALLERY', href: '/media' },
                { name: 'BAND STORY & MEMBERS', href: '/band' },
                { name: 'OFFICIAL NEWS & UPDATES', href: '/news' },
                { name: 'BOOK BIDDROHO', href: '/book' },
                { name: 'CONTACT US', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'color 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ color: 'var(--crimson-base)' }}>›</span> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Streaming & Connect */}
          <div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.2rem',
                letterSpacing: '0.15em',
                color: '#fff',
                marginBottom: '1.25rem'
              }}
            >
              STREAM & CONNECT
            </h4>
            {connectLinks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(No data available)</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {connectLinks.map((platform, idx) => {
                const isConfigured = Boolean(platform.url && platform.url.trim() !== '');

                if (isConfigured) {
                  return (
                    <a
                      key={platform.label + idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-red)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <span>{platform.label}</span>
                      <ArrowUpRight size={14} style={{ color: 'var(--crimson-base)' }} />
                    </a>
                  );
                }

                return (
                  <button
                    key={platform.label + idx}
                    type="button"
                    disabled
                    title={`${platform.label} link not available yet`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#71717a',
                      fontSize: '0.9rem',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      opacity: 0.38,
                      cursor: 'not-allowed',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span>{platform.label}</span>
                    <ArrowUpRight size={14} style={{ color: '#52525b', opacity: 0.5 }} />
                  </button>
                );
              })}
            </div>
            )}
          </div>

          {/* Col 4: Newsletter / Tour Alerts */}
          <div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.2rem',
                letterSpacing: '0.15em',
                color: '#fff',
                marginBottom: '1.25rem'
              }}
            >
              INSIDER DISPATCH
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Be the first to hear new releases, unannounced concert tickets, and exclusive vinyl editions.
            </p>

            {subscribed ? (
              <div
                style={{
                  background: 'rgba(229, 9, 20, 0.1)',
                  border: '1px solid var(--crimson-base)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#fff'
                }}
              >
                <Check size={18} style={{ color: 'var(--crimson-base)' }} />
                <span style={{ fontSize: '0.85rem' }}>You are on the official BIDDROHO list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-editorial"
                  style={{ fontSize: '0.85rem', padding: '0.75rem 1rem' }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                >
                  JOIN REBELLION <Send size={15} style={{ marginLeft: '4px' }} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}
        >
          <div>
            © 2011–2026 <strong style={{ color: '#fff' }}>BIDDROHO</strong>. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>DHAKA, BANGLADESH</span>
            <span>OFFICIAL ROCK HOME</span>
            <span style={{ color: 'var(--crimson-base)' }}>EST. 2011</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
