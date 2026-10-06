'use client';

import React from 'react';

interface MusicLoaderProps {
  text?: string;
  size?: 'fullscreen' | 'card' | 'inline' | 'compact';
  showEq?: boolean;
  showNotes?: boolean;
}

export default function MusicLoader({
  text = 'AMPLIFYING FREQUENCIES...',
  size = 'card',
  showEq = true,
  showNotes = true,
}: MusicLoaderProps) {
  const isFullscreen = size === 'fullscreen';
  const isInline = size === 'inline';
  const isCompact = size === 'compact';

  // Dimension scaling
  const diskSize = isFullscreen ? 88 : isCompact ? 36 : isInline ? 24 : 56;
  const eqHeight = isFullscreen ? 28 : isCompact ? 16 : isInline ? 12 : 22;

  return (
    <div
      className="music-loader-container"
      style={{
        display: 'flex',
        flexDirection: isInline ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isInline ? '10px' : isFullscreen ? '20px' : '14px',
        padding: isFullscreen ? '0' : isInline ? '4px' : '40px 20px',
        minHeight: isFullscreen ? '60vh' : 'auto',
        width: '100%',
        color: '#f4f4f5',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotateDisk {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes eqPulse1 {
          0%, 100% { height: 25%; }
          50% { height: 95%; }
        }
        @keyframes eqPulse2 {
          0%, 100% { height: 70%; }
          50% { height: 30%; }
        }
        @keyframes eqPulse3 {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }
        @keyframes eqPulse4 {
          0%, 100% { height: 85%; }
          50% { height: 40%; }
        }
        @keyframes eqPulse5 {
          0%, 100% { height: 35%; }
          50% { height: 90%; }
        }
        @keyframes floatNote1 {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-8px) rotate(-10deg); opacity: 0.8; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
        }
        @keyframes floatNote2 {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-10px) rotate(12deg); opacity: 0.9; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        }
        @keyframes textBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      ` }} />

      {/* Music Notations Floating Left */}
      {showNotes && !isInline && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span
            style={{
              position: 'absolute',
              left: `-${diskSize * 0.55}px`,
              top: '5px',
              fontSize: isFullscreen ? '22px' : '15px',
              color: '#e11d48',
              animation: 'floatNote1 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 6px rgba(225, 29, 72, 0.6))',
            }}
          >
            ♪
          </span>
          <span
            style={{
              position: 'absolute',
              right: `-${diskSize * 0.55}px`,
              top: '-2px',
              fontSize: isFullscreen ? '24px' : '16px',
              color: '#f59e0b',
              animation: 'floatNote2 2.4s ease-in-out infinite',
              filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))',
            }}
          >
            ♫
          </span>

          {/* Spinning Vinyl Disk */}
          <div
            style={{
              width: `${diskSize}px`,
              height: `${diskSize}px`,
              borderRadius: '50%',
              background: 'repeating-radial-gradient(circle, #09090b 0, #18181b 2px, #09090b 4px, #27272a 6px)',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 12px rgba(225, 29, 72, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              animation: 'rotateDisk 2.2s linear infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {/* Vinyl Center Red Label */}
            <div
              style={{
                width: `${diskSize * 0.42}px`,
                height: `${diskSize * 0.42}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #e11d48 0%, #991b1b 100%)',
                boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Spindle Hole */}
              <div
                style={{
                  width: `${diskSize * 0.12}px`,
                  height: `${diskSize * 0.12}px`,
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* If inline without notes container, just render the disk */}
      {(isInline || !showNotes) && (
        <div
          style={{
            width: `${diskSize}px`,
            height: `${diskSize}px`,
            borderRadius: '50%',
            background: 'repeating-radial-gradient(circle, #09090b 0, #18181b 2px, #09090b 4px, #27272a 6px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            position: 'relative',
            animation: 'rotateDisk 2s linear infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${diskSize * 0.4}px`,
              height: `${diskSize * 0.4}px`,
              borderRadius: '50%',
              backgroundColor: '#e11d48',
            }}
          />
        </div>
      )}

      {/* Audio Equalizer (EQ) Visualizer Bars */}
      {showEq && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: isFullscreen ? '4px' : '3px',
            height: `${eqHeight}px`,
            padding: '0 4px',
          }}
        >
          <div
            style={{
              width: isFullscreen ? '4px' : '3px',
              backgroundColor: '#e11d48',
              borderRadius: '2px',
              animation: 'eqPulse1 0.7s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(225, 29, 72, 0.5)',
            }}
          />
          <div
            style={{
              width: isFullscreen ? '4px' : '3px',
              backgroundColor: '#f43f5e',
              borderRadius: '2px',
              animation: 'eqPulse2 0.6s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(244, 63, 94, 0.5)',
            }}
          />
          <div
            style={{
              width: isFullscreen ? '4px' : '3px',
              backgroundColor: '#fb7185',
              borderRadius: '2px',
              animation: 'eqPulse3 0.8s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(251, 113, 133, 0.5)',
            }}
          />
          <div
            style={{
              width: isFullscreen ? '4px' : '3px',
              backgroundColor: '#f59e0b',
              borderRadius: '2px',
              animation: 'eqPulse4 0.65s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.5)',
            }}
          />
          <div
            style={{
              width: isFullscreen ? '4px' : '3px',
              backgroundColor: '#e11d48',
              borderRadius: '2px',
              animation: 'eqPulse5 0.75s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(225, 29, 72, 0.5)',
            }}
          />
        </div>
      )}

      {/* Rock Caption / Status Text */}
      {text && (
        <div
          style={{
            fontSize: isFullscreen ? '12px' : isInline ? '11px' : '10.5px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            animation: 'textBlink 1.8s ease-in-out infinite',
            textAlign: 'center',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
