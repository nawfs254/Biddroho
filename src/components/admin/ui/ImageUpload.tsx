'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export type ImagePreset = 'member' | 'album' | 'event' | 'news' | 'gallery' | 'general';

interface PresetConfig {
  label: string;
  recommended: string;
  aspectDesc: string;
  targetRatio?: number; // width / height
  tolerance?: number;
  minWidth: number;
  minHeight: number;
  category: string;
  help: string;
}

const PRESET_CONFIGS: Record<ImagePreset, PresetConfig> = {
  member: {
    label: 'Band Member Portrait',
    recommended: '800 × 1000 px (4:5) or 800 × 800 px (1:1)',
    aspectDesc: '4:5 vertical portrait or 1:1 square',
    targetRatio: 0.8, // 4:5 preferred, but 1:1 also acceptable
    tolerance: 0.25,
    minWidth: 400,
    minHeight: 400,
    category: 'members',
    help: 'Used for official lineup cards, roster grid, and member dossier pages.',
  },
  album: {
    label: 'Album / Release Cover Artwork',
    recommended: '1400 × 1400 px (1:1 Square)',
    aspectDesc: '1:1 perfect square',
    targetRatio: 1.0,
    tolerance: 0.05,
    minWidth: 600,
    minHeight: 600,
    category: 'music',
    help: 'Square high-resolution artwork for Spotify, Apple Music & discography catalog.',
  },
  event: {
    label: 'Concert & Tour Poster',
    recommended: '1200 × 1600 px (3:4) or 1920 × 1080 px (16:9)',
    aspectDesc: '3:4 vertical poster or 16:9 banner',
    targetRatio: 0.75, // 3:4
    tolerance: 0.35,
    minWidth: 600,
    minHeight: 800,
    category: 'events',
    help: 'Official gig poster for tour calendar, event listing, and detail page banner.',
  },
  news: {
    label: 'Editorial News Cover',
    recommended: '1920 × 1080 px (16:9 Landscape)',
    aspectDesc: '16:9 widescreen landscape',
    targetRatio: 1.777,
    tolerance: 0.15,
    minWidth: 800,
    minHeight: 450,
    category: 'news',
    help: 'Cinematic wide cover photo displayed atop press releases and news feeds.',
  },
  gallery: {
    label: 'Live Photography & Media Asset',
    recommended: '1920 × 1280 px (3:2) or 1920 × 1080 px (16:9)',
    aspectDesc: '3:2 or 16:9 landscape',
    targetRatio: 1.5,
    tolerance: 0.35,
    minWidth: 800,
    minHeight: 500,
    category: 'gallery',
    help: 'High-resolution live concert, stage lights, or promotional photography.',
  },
  general: {
    label: 'General Media Asset',
    recommended: 'Min 1200 px width recommended',
    aspectDesc: 'Flexible aspect ratio',
    minWidth: 300,
    minHeight: 300,
    category: 'general',
    help: 'Brand graphics, logos, and miscellaneous band media assets.',
  },
};

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  preset?: ImagePreset;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  preset = 'general',
  label,
  required = false,
}: ImageUploadProps) {
  const config = PRESET_CONFIGS[preset] || PRESET_CONFIGS.general;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dimensions state
  const [dimensions, setDimensions] = useState<{ width: number; height: number; ratio: number } | null>(null);

  // Measure dimensions whenever value changes
  useEffect(() => {
    if (!value || typeof value !== 'string') {
      setDimensions(null);
      return;
    }

    const img = new window.Image();
    img.src = value;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = height > 0 ? width / height : 1;
      setDimensions({ width, height, ratio });
    };
    img.onerror = () => {
      setDimensions(null);
    };
  }, [value]);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max upload size is 15MB.`);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPEG, PNG, WebP, GIF, SVG) are permitted.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', config.category);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image file.');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Evaluate dimension compatibility
  const checkCompatibility = () => {
    if (!dimensions) return null;

    const { width, height, ratio } = dimensions;
    const isLowRes = width < config.minWidth || height < config.minHeight;

    let ratioMatch = true;
    if (config.targetRatio && config.tolerance) {
      // Check if within tolerance of target ratio, or for members also check 1:1
      const diff = Math.abs(ratio - config.targetRatio);
      const isSquareMatch = preset === 'member' ? Math.abs(ratio - 1.0) <= 0.08 : false;
      const isPosterOrBannerMatch = preset === 'event' ? Math.abs(ratio - 1.777) <= 0.15 : false;

      ratioMatch = diff <= config.tolerance || isSquareMatch || isPosterOrBannerMatch;
    }

    return {
      width,
      height,
      ratio: ratio.toFixed(2),
      isLowRes,
      ratioMatch,
    };
  };

  const status = checkCompatibility();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {/* Label and Presets Notice */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <label
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#a1a1aa',
            textTransform: 'uppercase',
          }}
        >
          {label || config.label} {required && <span style={{ color: '#e11d48' }}>*</span>}
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '3px 8px',
              backgroundColor: mode === 'upload' ? '#e11d48' : '#18181b',
              color: mode === 'upload' ? '#ffffff' : '#71717a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <UploadCloud size={11} />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '3px 8px',
              backgroundColor: mode === 'url' ? '#e11d48' : '#18181b',
              color: mode === 'url' ? '#ffffff' : '#71717a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <LinkIcon size={11} />
            <span>Direct URL</span>
          </button>
        </div>
      </div>

      {/* Recommended Dimension Hint Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 12px',
          backgroundColor: 'rgba(225, 29, 72, 0.05)',
          border: '1px solid rgba(225, 29, 72, 0.15)',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#d4d4d8',
        }}
      >
        <Info size={13} color="#e11d48" style={{ flexShrink: 0 }} />
        <div>
          <span style={{ color: '#e11d48', fontWeight: 700, marginRight: '4px' }}>Ideal Dimensions:</span>
          <strong>{config.recommended}</strong>
          <span style={{ color: '#71717a', marginLeft: '6px' }}>({config.help})</span>
        </div>
      </div>

      {/* Upload Zone / URL Input */}
      {mode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            border: isDragging
              ? '2px dashed #e11d48'
              : '1px dashed rgba(255, 255, 255, 0.18)',
            backgroundColor: isDragging ? 'rgba(225, 29, 72, 0.08)' : '#141419',
            borderRadius: '5px',
            padding: '24px 16px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div style={{ padding: '8px 0' }}>
              <MusicLoader
                text="UPLOADING MEDIA TO SERVER STORAGE..."
                size="compact"
                showNotes={true}
                showEq={true}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDragging ? '#e11d48' : '#a1a1aa',
                }}
              >
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5' }}>
                {isDragging ? 'Drop Image Here' : 'Click to Browse or Drag & Drop Image'}
              </div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>
                Supports WebP, PNG, JPG (up to 15MB) • Auto-optimized for {config.label}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <LinkIcon size={14} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. /assets/members/srijon.png or https://..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#f4f4f5',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                padding: '0 12px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: '#a1a1aa',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            color: '#fca5a5',
            fontSize: '12px',
          }}
        >
          <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Card with Live Dimension Inspection */}
      {value && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '12px',
            backgroundColor: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '5px',
            marginTop: '4px',
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}
          >
            <Image
              src={value}
              alt="Media Preview"
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Details & Live Dimension Evaluation */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#f4f4f5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '260px',
                  fontFamily: 'monospace',
                }}
                title={value}
              >
                {value}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open full resolution image in new tab"
                  style={{
                    color: '#71717a',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  title="Remove image"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Dimension Status Badge */}
            {status ? (
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      backgroundColor: '#18181b',
                      color: '#f4f4f5',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {status.width} × {status.height} px
                  </span>

                  {status.ratioMatch && !status.isLowRes ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <CheckCircle2 size={11} />
                      <span>Valid Dimension</span>
                    </span>
                  ) : status.isLowRes ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <AlertTriangle size={11} />
                      <span>Low Resolution (Min: {config.minWidth}px)</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <AlertTriangle size={11} />
                      <span>Ratio Notice</span>
                    </span>
                  )}
                </div>

                {!status.ratioMatch && (
                  <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '2px' }}>
                    Uploaded ratio is {status.ratio}:1. Recommended is {config.aspectDesc}. Image will be cropped to fit layout.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
                Detecting image dimensions...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
