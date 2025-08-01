import React from 'react';
import Admin from '../../components/Admin/admin';

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
