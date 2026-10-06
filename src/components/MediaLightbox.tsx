'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface MediaLightboxProps {
  item: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MediaLightbox({ item, onClose, onNext, onPrev }: MediaLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(3, 3, 4, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          padding: '0.6rem',
          cursor: 'pointer',
          zIndex: 10
        }}
        aria-label="Close Lightbox"
      >
        <X size={24} />
      </button>

      {/* Prev / Next controls */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          style={{
            position: 'absolute',
            left: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '1rem',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label="Previous Media"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          style={{
            position: 'absolute',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '1rem',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label="Next Media"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0d',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '65vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {item.type === 'video' && item.youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1`}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Image
              src={item.url}
              alt={item.title}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          )}
        </div>

        {/* Caption & Metadata */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: 'var(--crimson-base)',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase'
                }}
              >
                // {item.type.toUpperCase()} • {item.category.toUpperCase()}
              </span>
              <h3 className="font-display" style={{ fontSize: '1.8rem', color: '#fff', marginTop: '0.25rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                {item.caption}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} /> {item.date}
              </div>
              {item.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color="var(--crimson-base)" /> {item.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
