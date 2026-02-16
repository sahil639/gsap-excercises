import React from 'react';

export default function Navbar() {
  return (
    <nav className="nav" id="nav">
      <a href="/" className="nav-brand">Measured</a>
      <div className="nav-links">
        <a href="#analytics" className="nav-link">Analytics</a>
        <a href="#leaderboard" className="nav-link">Leaderboard</a>
        <a href="#pricing" className="nav-link">Pricing</a>
      </div>
      <a href="#cta" className="nav-join">Join</a>
    </nav>
  );
}
