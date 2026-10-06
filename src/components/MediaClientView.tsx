'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Camera, Film, Maximize2 } from 'lucide-react';
import { MediaItem } from '@/data/mockData';
import MediaLightbox from '@/components/MediaLightbox';

type FilterType = 'all' | 'photo' | 'video' | 'live' | 'portrait';

interface MediaClientViewProps {
  initialMedia: MediaItem[];
}

export default function MediaClientView({ initialMedia }: MediaClientViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = initialMedia.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'photo') return item.type === 'photo';
    if (activeFilter === 'video') return item.type === 'video';
    if (activeFilter === 'live') return item.category === 'live';
    if (activeFilter === 'portrait') return item.category === 'portrait';
    return true;
  });

  const handleNext = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex((m) => m.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedMedia(filteredMedia[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex((m) => m.id === selectedMedia.id);
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedMedia(filteredMedia[prevIndex]);
  };

  return (
    <div>
      {/* Editorial Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '2.5rem',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'all', label: 'ALL MEDIA' },
          { id: 'photo', label: 'PHOTOGRAPHY' },
          { id: 'video', label: 'OFFICIAL VIDEOS' },
          { id: 'live', label: 'LIVE CONCERTS' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as FilterType)}
            style={{
              background: activeFilter === tab.id ? 'var(--crimson-base)' : 'rgba(20, 20, 24, 0.8)',
              color: activeFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
              border: activeFilter === tab.id ? '1px solid var(--crimson-base)' : '1px solid var(--border-subtle)',
              padding: '0.6rem 1.4rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry Layout */}
      <section style={{ paddingTop: '4rem' }}>
        {filteredMedia.length > 0 ? (
          <div className="masonry-grid">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="masonry-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMedia(item)}
              >
                <div
                  className="dark-card-interactive"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: item.type === 'video' ? '16/9' : item.id.includes('srijon') || item.id.includes('ridoy') ? '3/4' : '4/5',
                      backgroundColor: '#0a0a0d',
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      className="media-thumb"
                    />

                    {/* Overlay badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'rgba(5, 5, 6, 0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '0.2rem 0.65rem',
                        fontSize: '0.75rem',
                        color: 'var(--crimson-base)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.12em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {item.type === 'video' ? <Film size={12} /> : <Camera size={12} />}
                      {item.type.toUpperCase()}
                    </div>

                    {/* Video Center Play Marker */}
                    {item.type === 'video' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--crimson-base)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 25px var(--crimson-glow)'
                          }}
                        >
                          <Play size={22} color="#fff" style={{ marginLeft: '3px' }} />
                        </div>
                      </div>
                    )}

                    {/* Hover expand icon */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '0.5rem',
                        borderRadius: '2px',
                        color: '#fff',
                        opacity: 0.8
                      }}
                    >
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      <span>{item.date}</span>
                      {item.location && <span>{item.location}</span>}
                    </div>

                    <h3 className="font-display" style={{ fontSize: '1.45rem', color: '#fff', lineHeight: 1.15 }}>
                      {item.title}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
              No data available
            </p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <MediaLightbox
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <style jsx>{`
        .masonry-item:hover .media-thumb {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
