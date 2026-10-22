'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Disc,
  Maximize2,
} from 'lucide-react';
import { BandMember } from '@/lib/dataService';

interface BandRosterClientProps {
  members: BandMember[];
}

export default function BandRosterClient({ members }: BandRosterClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isOpen = selectedIndex !== null;
  const selectedMember = selectedIndex !== null ? members[selectedIndex] : null;

  // Background scroll lock & Lenis pause
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Pause Lenis smooth scroll if active
    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      // Resume Lenis smooth scroll
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % members.length : 0
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + members.length) % members.length : members.length - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, members.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + members.length) % members.length : 0
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % members.length : 0
    );
  };

  return (
    <>
      {/* Members Compact 2-Column Responsive Grid with Click-to-Modal */}
      {members.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {members.map((member, index) => (
            <motion.div
              key={member.id || index}
              onClick={() => setSelectedIndex(index)}
              whileHover={{
                y: -3,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 9, 20, 0.25)',
              }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.2 }}
              className="dark-card"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1.25rem',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                background: 'rgba(13, 13, 17, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                alignItems: 'stretch',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Compact Portrait */}
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(120px, 28%, 150px)',
                  minWidth: '120px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexShrink: 0,
                  backgroundColor: '#070709',
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 140px, 160px"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 60%, rgba(5,5,6,0.92) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.4rem',
                    left: '0.4rem',
                    right: '0.4rem',
                    textAlign: 'center',
                    background: 'rgba(5, 5, 6, 0.88)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.15rem 0.35rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.65rem',
                    color: '#ff6b72',
                    letterSpacing: '0.08em',
                    borderRadius: '3px',
                  }}
                >
                  SINCE {member.joinedYear}
                </div>
              </div>

              {/* Biography & Specs Column */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.2rem',
                  }}
                >
                  <span
                    style={{
                      color: '#ff6b72',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                    }}
                  >
                    // {member.instrument.toUpperCase()}
                  </span>
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {member.role}
                  </span>
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.2rem, 1.6vw, 1.55rem)',
                    color: '#fff',
                    lineHeight: 1.15,
                    marginBottom: '0.3rem',
                  }}
                >
                  {member.name}
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    marginBottom: member.quote ? '0.4rem' : '0.6rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {member.bio}
                </p>

                {/* Member Quote */}
                {member.quote && (
                  <div
                    style={{
                      backgroundColor: 'rgba(229, 9, 20, 0.05)',
                      borderLeft: '2px solid var(--crimson-base)',
                      padding: '0.3rem 0.6rem',
                      marginBottom: '0.45rem',
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <p
                      style={{
                        color: '#eee',
                        fontStyle: 'italic',
                        fontSize: '0.74rem',
                        lineHeight: 1.35,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </div>
                )}

                {/* Gear / Weapons & Expand indicator */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  {member.gear && member.gear.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.3rem',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.62rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '0.1em',
                          marginRight: '0.15rem',
                        }}
                      >
                        RIG:
                      </span>
                      {member.gear.slice(0, 2).map((gearItem: any, gIdx: any) => (
                        <span
                          key={gIdx}
                          style={{
                            backgroundColor: '#0a0a0e',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            padding: '0.12rem 0.45rem',
                            fontSize: '0.68rem',
                            borderRadius: '3px',
                          }}
                        >
                          {gearItem}
                        </span>
                      ))}
                      {member.gear.length > 2 && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--crimson-base)',
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          +{member.gear.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Expand Hint */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      color: '#ff6b72',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    EXPAND <Maximize2 size={11} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            border: '1px dashed var(--border-subtle)',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            No data available
          </p>
        </div>
      )}

      {/* Interactive Member Modal */}
      <AnimatePresence>
        {selectedMember && selectedIndex !== null && (
          <div
            data-lenis-prevent="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 3vw, 2.5rem)',
              overscrollBehavior: 'contain',
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedIndex(null)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(3, 3, 5, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                touchAction: 'none',
                overscrollBehavior: 'contain',
              }}
            />

            {/* Modal Card Content */}
            <motion.div
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '880px',
                maxHeight: '90vh',
                backgroundColor: 'rgba(15, 15, 20, 0.98)',
                border: '1px solid rgba(229, 9, 20, 0.45)',
                borderRadius: '20px',
                boxShadow:
                  '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(229, 9, 20, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                overscrollBehavior: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Crimson Accent Top Laser Line */}
              <div
                style={{
                  height: '2px',
                  width: '100%',
                  background:
                    'linear-gradient(90deg, transparent, var(--crimson-base), transparent)',
                }}
              />

              {/* Modal Top Bar (Counter, Next/Prev, Close) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: 'rgba(10, 10, 14, 0.85)',
                }}
              >
                {/* Left: Architect Index */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.15em',
                      color: 'var(--crimson-base)',
                    }}
                  >
                    ARCHITECT 0{selectedIndex + 1} / 0{members.length}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      borderLeft: '1px solid var(--border-subtle)',
                      paddingLeft: '0.75rem',
                    }}
                  >
                    SINCE {selectedMember.joinedYear}
                  </span>
                </div>

                {/* Right: Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {/* Prev Button */}
                  <button
                    onClick={handlePrev}
                    aria-label="Previous member"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    aria-label="Next member"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedIndex(null)}
                    aria-label="Close modal"
                    style={{
                      background: 'rgba(229, 9, 20, 0.15)',
                      border: '1px solid rgba(229, 9, 20, 0.4)',
                      color: '#ffffff',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginLeft: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Body (Scrollable if height exceeds) */}
              <div
                data-lenis-prevent="true"
                style={{
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  padding: 'clamp(1.25rem, 3vw, 2.25rem)',
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                  alignItems: 'start',
                }}
              >
                {/* Left: Big Stage Portrait */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    width: '100%',
                    maxWidth: '360px',
                    margin: '0 auto',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow:
                      '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(229, 9, 20, 0.15)',
                    backgroundColor: '#070709',
                  }}
                >
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    priority
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                  />

                  {/* Gradient overlays */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, transparent 55%, rgba(5,5,6,0.92) 100%)',
                    }}
                  />

                  {/* Instrument Badge on Photo */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(5, 5, 6, 0.88)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229, 9, 20, 0.35)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.82rem',
                        color: 'var(--crimson-base)',
                        letterSpacing: '0.12em',
                      }}
                    >
                      // {selectedMember.instrument.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {selectedMember.role}
                    </span>
                  </div>
                </div>

                {/* Right: Full Biography, Creed & Equipment Arsenal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span
                      style={{
                        color: 'var(--crimson-base)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.18em',
                      }}
                    >
                      // OFFICIAL BAND MEMBER
                    </span>

                    <h2
                      className="font-display"
                      style={{
                        fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                        color: '#ffffff',
                        lineHeight: 1.05,
                        margin: '0.25rem 0 0.5rem',
                      }}
                    >
                      {selectedMember.name}
                    </h2>

                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>{selectedMember.role}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--crimson-base)' }}>
                        Member Since {selectedMember.joinedYear}
                      </span>
                    </div>
                  </div>

                  {/* Full Unabridged Biography */}
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-display)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      ARTIST BIOGRAPHY
                    </div>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {selectedMember.bio}
                    </p>
                  </div>

                  {/* Full Signature Quote */}
                  {selectedMember.quote && (
                    <div
                      style={{
                        backgroundColor: 'rgba(229, 9, 20, 0.08)',
                        borderLeft: '3px solid var(--crimson-base)',
                        padding: '0.85rem 1.15rem',
                        borderRadius: '0 8px 8px 0',
                      }}
                    >
                      <p
                        style={{
                          color: '#ffffff',
                          fontStyle: 'italic',
                          fontSize: '0.9rem',
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        &ldquo;{selectedMember.quote}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Gear & Weapons Arsenal */}
                  {selectedMember.gear && selectedMember.gear.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          letterSpacing: '0.15em',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-display)',
                          marginBottom: '0.6rem',
                        }}
                      >
                        RIG & WEAPONS SPECIFICATIONS
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.45rem',
                        }}
                      >
                        {selectedMember.gear.map((gearItem: any, gIdx: any) => (
                          <span
                            key={gIdx}
                            style={{
                              backgroundColor: '#0a0a0f',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: 'var(--text-primary)',
                              padding: '0.3rem 0.75rem',
                              fontSize: '0.78rem',
                              borderRadius: '4px',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {gearItem}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking CTA Button */}
                  <div
                    style={{
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Available for live performances & tours
                    </span>
                    <Link
                      href="/book"
                      onClick={() => setSelectedIndex(null)}
                      className="btn-primary"
                      style={{
                        padding: '0.65rem 1.5rem',
                        fontSize: '0.88rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      BOOK CONCERT <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
