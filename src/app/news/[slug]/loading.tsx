import React from 'react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function NewsDetailLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        backgroundColor: '#050506',
        width: '100%',
      }}
    >
      <MusicLoader
        size="fullscreen"
        text="PRINTING ARTICLE & PRESS ARCHIVES..."
      />
    </div>
  );
}
