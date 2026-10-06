import React from 'react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function AdminLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        backgroundColor: '#0c0c0e',
      }}
    >
      <MusicLoader
        size="fullscreen"
        text="LOADING CRM & OPERATIONAL DATA..."
      />
    </div>
  );
}
