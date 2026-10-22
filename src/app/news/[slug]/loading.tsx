import React from 'react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function SingleNewsLoading() {
  return (
    <div
      style={{
        backgroundColor: '#050506',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
      }}
    >
      <MusicLoader
        size="fullscreen"
        text="LOADING ARTICLE & FREQUENCIES..."
      />
    </div>
  );
}
