import React from 'react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function ContactLoading() {
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
        text="OPENING SECURE DESK TRANSMISSION LINES..."
      />
    </div>
  );
}
