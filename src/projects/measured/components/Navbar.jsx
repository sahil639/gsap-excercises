import React from 'react';

/**
 * Navbar — positioned inside the hero section (not fixed to viewport).
 * Aligned to the right side, same side as the "Join" CTA button.
 */
export default function Navbar() {
  return (
    <nav className="nav" id="nav">
      <div className="nav-links">
        <a href="#analytics" className="nav-link">Analytics</a>
        <a href="#leaderboard" className="nav-link">Leaderboard</a>
        <a href="#pricing" className="nav-link">Pricing</a>
      </div>
      <a href="#cta" className="nav-join">Join</a>
    </nav>
  );
}
