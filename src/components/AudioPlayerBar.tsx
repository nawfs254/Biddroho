'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { RELEASES_DATA } from '@/data/mockData';

export default function AudioPlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [progress, setProgress] = useState(25);

  const currentRelease = RELEASES_DATA[0]; // BIDDROHI
  const tracks = currentRelease.tracks;
  const currentTrack = tracks[currentTrackIndex];

  // Simulated playback timer for ambient visualizer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 90,
        transition: 'transform 0.3s ease',
        transform: isCollapsed ? 'translateY(calc(100% - 24px))' : 'translateY(0)'
      }}
    >
      {/* Collapse/Expand Toggle Handle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(11, 11, 13, 0.95)',
            border: '1px solid var(--border-subtle)',
            borderBottom: 'none',
            color: 'var(--text-secondary)',
            padding: '2px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
          aria-label={isCollapsed ? 'Expand Player' : 'Collapse Player'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp size={14} color="var(--crimson-base)" /> NOW PLAYING: {currentTrack.title}
            </>
          ) : (
            <>
              <ChevronDown size={14} /> MINIMIZE
            </>
          )}
        </button>
      </div>

      {/* Main Bar */}
      <div
        style={{
          backgroundColor: 'rgba(9, 9, 11, 0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(229, 9, 20, 0.3)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Track Info & Artwork */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
          <div
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '2px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Image
              src={currentRelease.coverImage}
              alt={currentRelease.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ overflow: 'hidden' }}>
            <Link
              href={`/music/${currentRelease.slug}`}
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block'
              }}
            >
              {currentTrack.title}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>BIDDROHO</span>
              <span>•</span>
              <span style={{ color: 'var(--crimson-base)' }}>{currentRelease.title}</span>
            </div>
          </div>
        </div>

        {/* Center Controls & Waveform */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            flex: '1 1 400px',
            maxWidth: '560px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={prevTrack}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Previous Track"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--crimson-base)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isPlaying ? '0 0 16px var(--crimson-glow)' : 'none',
                transition: 'transform 0.2s ease'
              }}
              title={isPlaying ? 'Pause' : 'Play Preview'}
            >
              {isPlaying ? <Pause size={18} color="#fff" /> : <Play size={18} color="#fff" style={{ marginLeft: '2px' }} />}
            </button>

            <button
              onClick={nextTrack}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Progress bar and Audio Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              0:{Math.floor(progress * 0.3).toString().padStart(2, '0')}
            </span>

            <div
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.floor(pos * 100));
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--crimson-base)',
                  boxShadow: '0 0 8px var(--crimson-glow)'
                }}
              />
            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {currentTrack.duration}
            </span>

            {/* Subtle animated sound wave bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px', width: '24px' }}>
              {[0.4, 0.9, 0.6, 1.0, 0.5].map((h, i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '3px',
                    height: isPlaying ? `${Math.max(20, Math.sin(progress + i) * 100 * h)}%` : '20%',
                    backgroundColor: isPlaying ? 'var(--crimson-base)' : 'var(--text-muted)',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Volume & External Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="player-right-group">
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <Link
            href={`/music/${currentRelease.slug}`}
            className="btn-outline-red"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
          >
            VIEW ALBUM
          </Link>

          {currentRelease.streamingLinks.spotify && (
            <a
              href={currentRelease.streamingLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
              title="Open Spotify"
            >
              <span>SPOTIFY</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 850px) {
          .player-right-group {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
