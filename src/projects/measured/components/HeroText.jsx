import React from 'react';

/**
 * ============================================================
 * HERO TITLE — "MEASURED" Typography
 * ============================================================
 *
 * POSITIONING:
 *   - Centered horizontally via text-align: center on .hero-title
 *   - Vertically placed with padding: 12vh top, 6vh bottom on .hero-text-wrap
 *   - z-index: 2 keeps it above the pixel canvas below
 *   - The wrapper uses flexbox centering (align-items + justify-content)
 *
 * FONT FAMILY:
 *   'Inter', loaded from Google Fonts (weights 300–700)
 *   Fallbacks: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
 *   Defined in :root as --font in global.css
 *
 * FONT SIZE:
 *   clamp(80px, 18vw, 320px)
 *   - Minimum: 80px (small screens)
 *   - Preferred: 18vw (scales with viewport width)
 *   - Maximum: 320px (large screens)
 *   - Mobile override: 20vw at ≤640px breakpoint
 *
 * FONT WEIGHT: 700 (bold)
 * LETTER SPACING: -0.04em (tight tracking)
 * LINE HEIGHT: 0.85
 *
 * To change the title styling, edit .hero-title in:
 *   src/projects/measured/style.css (line ~94)
 * ============================================================
 */
export default function HeroText() {
  return (
    <div className="hero-text-wrap">
      <h1 className="hero-title">Measured</h1>
    </div>
  );
}
