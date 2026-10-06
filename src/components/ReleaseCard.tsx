'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Disc3, Play, ArrowRight, ExternalLink } from 'lucide-react';
import { Release } from '@/data/mockData';

interface ReleaseCardProps {
  release: Release;
  featured?: boolean;
}

export default function ReleaseCard({ release, featured = false }: ReleaseCardProps) {
  return (
    <div
      className="dark-card-interactive"
      style={{
        display: 'flex',
        flexDirection: featured ? 'row' : 'column',
        flexWrap: featured ? 'wrap' : 'nowrap',
        borderRadius: '0px',
        height: '100%'
      }}
    >
      {/* Cover Image Container */}
      <div
        style={{
          position: 'relative',
          width: featured ? '100%' : '100%',
          aspectRatio: '1/1',
          overflow: 'hidden',
          backgroundColor: '#0a0a0c',
          flex: featured ? '1 1 340px' : 'none'
        }}
      >
        <Image
          src={release.coverImage}
          alt={release.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="release-image"
        />

        {/* Badge: Type */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(5, 5, 6, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            padding: '0.25rem 0.75rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            color: 'var(--crimson-base)',
            textTransform: 'uppercase'
          }}
        >
          {release.type}
        </div>

        {/* Release Year */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(5, 5, 6, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            padding: '0.25rem 0.75rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            color: '#fff'
          }}
        >
          {release.year}
        </div>

        {/* Hover Overlay Play Icon */}
        <Link
          href={`/music/${release.slug}`}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s ease'
          }}
          className="overlay-play"
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--crimson-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px var(--crimson-glow)',
              transform: 'scale(0.9)',
              transition: 'transform 0.2s ease'
            }}
          >
            <Play size={26} color="#fff" style={{ marginLeft: '4px' }} />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '1 1 auto'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              {release.tracks.length} TRACKS • {release.releaseDate}
            </span>
          </div>

          <Link href={`/music/${release.slug}`}>
            <h3
              className="font-display"
              style={{
                fontSize: featured ? '2.25rem' : '1.75rem',
                letterSpacing: '0.05em',
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: '0.75rem'
              }}
            >
              {release.title}
            </h3>
          </Link>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              display: '-webkit-box',
              WebkitLineClamp: featured ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {release.shortDescription}
          </p>
        </div>

        {/* Actions & Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            marginTop: 'auto'
          }}
        >
          <Link
            href={`/music/${release.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              letterSpacing: '0.1em',
              color: 'var(--crimson-base)'
            }}
          >
            EXPLORE RELEASE <ArrowRight size={16} />
          </Link>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {release.streamingLinks.spotify && (
              <a
                href={release.streamingLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                title="Listen on Spotify"
                style={{ color: 'var(--text-muted)' }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>SPOTIFY</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dark-card-interactive:hover .release-image {
          transform: scale(1.05);
        }
        .dark-card-interactive:hover .overlay-play {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
