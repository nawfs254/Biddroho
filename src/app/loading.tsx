import React from 'react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function GlobalLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        backgroundColor: '#050506',
        width: '100%',
      }}
    >
      <MusicLoader
        size="fullscreen"
        text="LOADING TRACKS & FREQUENCIES..."
      />
    </div>
  );
}
