import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <>
      <Link
        to="/"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1.5rem',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '0.4rem 1rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 500,
          textDecoration: 'none',
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.2s',
        }}
      >
        &larr; Hub
      </Link>
      <Suspense
        fallback={
          <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
            Loading project...
          </div>
        }
      >
        {children}
      </Suspense>
    </>
  );
}
