'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { useLiveContainerScroll } from '@/lib/useLiveContainerScroll';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Volume2,
  Disc,
} from 'lucide-react';
import { BandMember } from '@/lib/dataService';
import { BAND_MEMBERS } from '@/data/mockData';

interface AppleHorizontalReelProps {
  members?: BandMember[];
}

interface CardProps {
  member: BandMember;
  index: number;
  total: number;
  activeProgress: any;
  isActive: boolean;
  onSelect: () => void;
  isMobile?: boolean;
}

function Architect3DCard({
  member,
  index,
  total,
  activeProgress,
  isActive,
  onSelect,
  isMobile,
}: CardProps) {
  // Smooth continuous 3D transforms based on distance from center
  const spacing = isMobile ? 185 : 290;
  const x = useTransform(activeProgress, (val: number) => {
    const diff = index - val;
    // Curved amphitheater horizontal layout
    return diff * spacing;
  });

  const rotateY = useTransform(activeProgress, (val: number) => {
    const diff = index - val;
    // Curved facing toward center viewer
    return Math.max(-48, Math.min(48, -diff * 30));
  });

  const z = useTransform(activeProgress, (val: number) => {
    const diff = Math.abs(index - val);
    // Center card steps forward into the spotlight; side cards recede
    return -diff * 140;
  });

  const scale = useTransform(activeProgress, (val: number) => {
    const diff = Math.abs(index - val);
    return Math.max(0.72, 1.08 - diff * 0.16);
  });

  const opacity = useTransform(activeProgress, (val: number) => {
    const diff = Math.abs(index - val);
    if (diff > 2.6) return 0;
    return Math.max(0, 1 - diff * 0.36);
  });

  const zIndex = useTransform(activeProgress, (val: number) => {
    const diff = Math.abs(index - val);
    return Math.round(100 - diff * 12);
  });

  return (
    <motion.div
      onClick={!isActive ? onSelect : undefined}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        x,
        y: '-50%',
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        width: isMobile ? '215px' : 'clamp(240px, 18vw, 290px)',
        height: isMobile ? '265px' : 'clamp(350px, 48vh, 400px)',
        transformStyle: 'preserve-3d',
        cursor: isActive ? 'default' : 'pointer',
      }}
    >
      <div
        className="dark-card"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isActive ? 'rgba(18, 18, 24, 0.92)' : 'rgba(12, 12, 16, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isActive
            ? '1.5px solid rgba(229, 9, 20, 0.65)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isActive
            ? '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(229, 9, 20, 0.3)'
            : '0 15px 35px rgba(0, 0, 0, 0.65)',
          transition: 'border 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Active Spotlight Highlight Sheen */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--crimson-base), transparent)',
              zIndex: 3,
            }}
          />
        )}

        {/* Portrait Image (Top-Aligned for clear face view) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '50%' : '52%',
            backgroundColor: '#050506',
            overflow: 'hidden',
          }}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="340px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: isActive ? 'brightness(1.05) contrast(1.05)' : 'brightness(0.7) contrast(1)',
              transition: 'filter 0.4s ease',
            }}
          />

          {/* Gradients to blend smoothly into info container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, transparent 40%, rgba(12,12,16,0.6) 75%, rgba(12,12,16,0.98) 100%)',
            }}
          />

          {/* Member Index Number Watermark */}
          <div
            className="font-display"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '1rem',
              fontSize: '2.5rem',
              lineHeight: 1,
              color: isActive ? 'rgba(229, 9, 20, 0.45)' : 'rgba(255, 255, 255, 0.12)',
              pointerEvents: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            0{index + 1}
          </div>

          {/* Stage Role Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.65rem',
              left: '0.85rem',
              background: 'rgba(5, 5, 6, 0.85)',
              backdropFilter: 'blur(8px)',
              border: isActive ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
              padding: '0.2rem 0.6rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              color: isActive ? 'var(--crimson-base)' : 'var(--text-muted)',
              letterSpacing: '0.12em',
              borderRadius: '4px',
            }}
          >
            // {member.instrument.toUpperCase()}
          </div>
        </div>

        {/* Member Details */}
        <div
          style={{
            padding: isMobile ? '0.65rem 0.85rem 0.75rem' : '1rem 1.15rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            gap: isMobile ? '0.2rem' : '0.35rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.15rem',
              }}
            >
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: isMobile ? '0.65rem' : '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {member.role}
              </span>
              <span
                style={{
                  color: 'var(--crimson-base)',
                  fontSize: isMobile ? '0.62rem' : '0.68rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                }}
              >
                SINCE {member.joinedYear}
              </span>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: isMobile ? '1.15rem' : 'clamp(1.25rem, 1.8vw, 1.55rem)',
                color: '#ffffff',
                lineHeight: 1.1,
                margin: isMobile ? '0 0 0.2rem' : '0 0 0.35rem',
                letterSpacing: '0.03em',
              }}
            >
              {member.name}
            </h3>

            <p
              style={{
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.35,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: isMobile ? 2 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {member.bio}
            </p>
          </div>

          {/* Member Quote Snippet (Hidden on mobile to keep card sleek) */}
          {member.quote && !isMobile && (
            <div
              style={{
                backgroundColor: 'rgba(229, 9, 20, 0.06)',
                borderLeft: '2px solid var(--crimson-base)',
                padding: '0.3rem 0.55rem',
                borderRadius: '0 4px 4px 0',
                margin: '0.2rem 0',
              }}
            >
              <p
                style={{
                  color: '#e4e4e7',
                  fontStyle: 'italic',
                  fontSize: '0.72rem',
                  lineHeight: 1.35,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Footer Action */}
          <div
            style={{
              paddingTop: '0.45rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              ARCHITECT {index + 1} / {total}
            </span>

            <Link
              href="/band"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.74rem',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.1em',
                transition: 'color 0.2s ease',
              }}
            >
              FULL BIO <ArrowRight size={13} color="var(--crimson-base)" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AppleHorizontalReel({ members }: AppleHorizontalReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const activeMembers = (members && members.length > 0) ? members : BAND_MEMBERS;
  const totalMembers = Math.max(activeMembers.length, 1);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollYProgress = useLiveContainerScroll(containerRef, {
    startOffset: 80,
  });

  // Map progress across members: 0 to (totalMembers - 1)
  const activeProgress = useTransform(
    scrollYProgress,
    [0.02, 0.98],
    [0, totalMembers - 1]
  );

  // Track discrete active member index for background effects & navigation pills
  useMotionValueEvent(activeProgress, 'change', (latest) => {
    const rounded = Math.min(Math.max(Math.round(latest), 0), totalMembers - 1);
    if (rounded !== activeIndex) {
      setActiveIndex(rounded);
    }
  });

  // Jump to specific member on click
  const scrollToMember = (targetIndex: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const fraction = 0.02 + (targetIndex / Math.max(totalMembers - 1, 1)) * 0.96;
    const targetY = docTop + fraction * totalScrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (activeIndex < totalMembers - 1) {
      scrollToMember(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToMember(activeIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -35) {
      handleNext();
    } else if (deltaX > 35) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentMember = activeMembers[activeIndex] || activeMembers[0];

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '320vh',
        backgroundColor: '#060608',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        touchAction: 'pan-y',
      }}
    >
      {/* Sticky Fullscreen 3D Stage Viewport */}
      <div
        style={{
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 80px)',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? '0.6rem 0 0.6rem' : '1.25rem 0 1.25rem',
          touchAction: 'pan-y',
        }}
      >
        {/* Giant Kinetic Atmospheric Backdrop Typography */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 0,
          }}
        >
          {/* Crimson Stadium Spotlight Aura */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '650px',
              height: '450px',
              background:
                'radial-gradient(circle, rgba(229, 9, 20, 0.18) 0%, rgba(229, 9, 20, 0.05) 50%, transparent 75%)',
              filter: 'blur(80px)',
            }}
          />

          {/* Colossal Watermark of Active Member's Name */}
          <motion.div
            key={currentMember?.name || activeIndex}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 0.07, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display"
            style={{
              fontSize: 'clamp(4rem, 13vw, 11rem)',
              color: '#ffffff',
              lineHeight: 0.9,
              textAlign: 'center',
              userSelect: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              position: 'absolute',
            }}
          >
            {currentMember?.name?.toUpperCase()}
          </motion.div>
        </div>

        {/* Section Header */}
        <div
          className="site-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-end',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            gap: isMobile ? '0.5rem' : '1rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.2em',
                color: 'var(--crimson-base)',
                marginBottom: isMobile ? '0.1rem' : '0.2rem',
              }}
            >
              <Sparkles size={isMobile ? 12 : 14} /> // 3D ARCHITECTS SHOWCASE
            </div>
            <h2
              className="section-title"
              style={{
                margin: 0,
                fontSize: isMobile ? '1.35rem' : 'clamp(1.9rem, 3.4vw, 2.8rem)',
                lineHeight: 1,
              }}
            >
              MEET THE ARCHITECTS
            </h2>
          </div>

          {/* Controls: Step Arrows & Direct Directory Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.45rem' : '0.85rem' }}>
            {/* Step Backward (Desktop) */}
            {!isMobile && (
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous Band Member"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: activeIndex === 0 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Step Forward (Desktop) */}
            {!isMobile && (
              <button
                onClick={handleNext}
                disabled={activeIndex === totalMembers - 1}
                aria-label="Next Band Member"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: activeIndex === totalMembers - 1 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeIndex === totalMembers - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronRight size={18} />
              </button>
            )}

            <Link
              href="/band"
              className="btn-outline-red"
              style={{
                padding: isMobile ? '0.35rem 0.65rem' : '0.45rem 1.15rem',
                fontSize: isMobile ? '0.72rem' : '0.82rem',
                whiteSpace: 'nowrap',
              }}
            >
              ALL <span className="hidden sm:inline">PROFILES</span> <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* 3D Perspective Stage Area with Touch Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '275px' : 'clamp(360px, 50vh, 420px)',
            perspective: '1300px',
            perspectiveOrigin: 'center center',
            overflow: 'visible',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'pan-y',
          }}
        >
          {activeMembers.map((member, index) => (
            <Architect3DCard
              key={member.id || index}
              member={member}
              index={index}
              total={totalMembers}
              activeProgress={activeProgress}
              isActive={index === activeIndex}
              onSelect={() => scrollToMember(index)}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Bottom Interactive Navigation Rail */}
        <div
          className="site-container"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '0.45rem' : '0.65rem',
          }}
        >
          {/* Desktop/Tablet Member Pill Scrubber Buttons */}
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.4rem',
                maxWidth: '900px',
              }}
            >
              {activeMembers.map((member, idx) => {
                const isSelected = idx === activeIndex;
                const firstName = member.name.split(' ')[0];
                return (
                  <button
                    key={member.id || idx}
                    onClick={() => scrollToMember(idx)}
                    style={{
                      backgroundColor: isSelected ? 'var(--crimson-base)' : 'rgba(20, 20, 26, 0.75)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      border: isSelected
                        ? '1px solid var(--crimson-hover)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 15px var(--crimson-glow)' : 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.76rem',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ opacity: isSelected ? 1 : 0.6 }}>0{idx + 1}</span>
                    <span>{firstName.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile Sleek Member Counter & Swipe Guide */}
          {isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '340px',
                padding: '0 0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  className="font-display"
                  style={{
                    color: 'var(--crimson-base)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    backgroundColor: 'rgba(229, 9, 20, 0.12)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                  }}
                >
                  0{activeIndex + 1} / 0{totalMembers}
                </span>
                <span style={{ color: '#ffffff', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {currentMember?.name}
                </span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                SWIPE ⇄
              </span>
            </div>
          )}

          {/* Scroll progress scrub indicator */}
          <div
            style={{
              width: '100%',
              maxWidth: isMobile ? '260px' : '320px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']),
                backgroundColor: 'var(--crimson-base)',
                boxShadow: '0 0 8px var(--crimson-base)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
