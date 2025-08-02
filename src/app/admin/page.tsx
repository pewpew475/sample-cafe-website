'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Admin component to avoid SSR issues
const Admin = dynamic(() => import('../../components/Admin/admin'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 9999,
      background: '#fff8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Loading Admin Panel...</h2>
        <p>Please wait while we initialize the admin interface.</p>
      </div>
    </div>
  )
});

export default function AdminPage() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 9999,
      background: 'var(--background-cream, #fff8f0)'
    }}>
      <Admin />
    </div>
  );
}
