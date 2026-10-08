'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Music, Calendar, Disc, Volume2 } from 'lucide-react';

const NAV_LINKS = [
  { name: 'MUSIC', href: '/music' },
  { name: 'EVENTS', href: '/events' },
  { name: 'MEDIA', href: '/media' },
  { name: 'BAND', href: '/band' },
  { name: 'NEWS', href: '/news' },
  { name: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          transition: 'all 0.3s ease',
          backgroundColor: (scrolled || mobileMenuOpen) ? 'rgba(5, 5, 6, 0.96)' : 'transparent',
          backdropFilter: (scrolled || mobileMenuOpen) ? 'blur(16px)' : 'none',
          borderBottom: (scrolled || mobileMenuOpen) ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
          padding: scrolled ? '0.75rem 0' : '1.25rem 0'
        }}
      >
        <div className="site-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo & Name */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              textDecoration: 'none'
            }}
          >
            <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
              <Image
                src="/assets/logo.png"
                alt="BIDDROHO Official Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="font-display"
                style={{
                  fontSize: '1.75rem',
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                  color: '#ffffff'
                }}
              >
                BIDDROHO
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  color: 'var(--crimson-base)',
                  fontWeight: 600,
                  marginTop: '2px'
                }}
              >
                EST. 2011 • BANGLA ROCK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.5rem'
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-display"
                  style={{
                    fontSize: '1.05rem',
                    letterSpacing: '0.14em',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    position: 'relative',
                    padding: '0.5rem 0',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--crimson-base)',
                        boxShadow: '0 0 10px var(--crimson-glow)'
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA: BOOK BIDDROHO */}
            <Link
              href="/book"
              className="btn-outline-red"
              style={{
                fontSize: '0.95rem',
                padding: '0.55rem 1.4rem'
              }}
            >
              BOOK BIDDROHO
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            height: '100dvh',
            width: '100%',
            backgroundColor: '#050506',
            zIndex: 99,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            animation: 'fadeIn 0.25s ease forwards'
          }}
        >
          <div
            style={{
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6.5rem 1.75rem calc(2.5rem + env(safe-area-inset-bottom, 24px))',
              gap: '2rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.25em',
                  color: 'var(--crimson-base)',
                  textTransform: 'uppercase'
                }}
              >
                // NAVIGATION
              </span>
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-display"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: 'clamp(1.85rem, 5.5vw, 2.25rem)',
                    letterSpacing: '0.08em',
                    color: pathname === link.href ? 'var(--crimson-base)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                    0{idx + 1}
                  </span>
                  {link.name}
                </Link>
              ))}

              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{
                  marginTop: '0.75rem',
                  fontSize: '1.15rem',
                  textAlign: 'center',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                BOOK BIDDROHO
              </Link>
            </div>

            {/* Mobile Menu Footer */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                DHAKA, BANGLADESH
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span>SPOTIFY</span>
                <span>YOUTUBE</span>
                <span>FACEBOOK</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
