import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

/**
 * Layout wrapper — provides a floating "Hub" back button
 * and Suspense fallback for lazy-loaded project components.
 */
export default function Layout({ children }) {
  return (
    <>
      {/* ================================================
       * BACK BUTTON — Circular glassmorphism, bottom-right
       * Home icon (SVG) + "Hub" label on hover
       * ================================================ */}
      <Link
        to="/"
        className="hub-button"
        aria-label="Back to Hub"
      >
        {/* Home icon SVG */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="hub-button__label">Hub</span>
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
