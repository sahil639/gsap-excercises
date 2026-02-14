import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ========================================
// DOT MAP — Canvas world map dots
// ========================================
function initDotMap() {
  const canvas = document.getElementById('dotMap');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    draw();
  }

  function draw() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    const dotSize = 2.5;
    const spacing = 8;
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);

    // Simple world map approximation using mathematical shapes
    const continents = [
      // North America
      { cx: 0.2, cy: 0.3, rx: 0.12, ry: 0.15 },
      // South America
      { cx: 0.25, cy: 0.65, rx: 0.06, ry: 0.18 },
      // Europe
      { cx: 0.48, cy: 0.25, rx: 0.06, ry: 0.08 },
      // Africa
      { cx: 0.5, cy: 0.55, rx: 0.08, ry: 0.18 },
      // Asia
      { cx: 0.65, cy: 0.3, rx: 0.15, ry: 0.12 },
      // Australia
      { cx: 0.78, cy: 0.7, rx: 0.06, ry: 0.06 },
      // Southeast Asia
      { cx: 0.72, cy: 0.5, rx: 0.05, ry: 0.06 },
    ];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing;
        const y = row * spacing;
        const nx = col / cols;
        const ny = row / rows;

        let inContinent = false;
        for (const c of continents) {
          const dx = (nx - c.cx) / c.rx;
          const dy = (ny - c.cy) / c.ry;
          if (dx * dx + dy * dy < 1) {
            inContinent = true;
            break;
          }
        }

        // Random noise for natural look
        if (inContinent && Math.random() > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        }
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
}

// ========================================
// LEADERBOARD — Scroll-based opacity
// ========================================
function initLeaderboard() {
  const items = document.querySelectorAll('.lb-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    const rank = parseInt(item.dataset.rank);

    // Each item fades in and out based on scroll
    gsap.fromTo(item,
      {
        opacity: rank <= 3 ? 0.5 : 0.15,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Fade out as you scroll past
    gsap.to(item, {
      opacity: 0.15,
      scale: 0.95,
      scrollTrigger: {
        trigger: item,
        start: 'top 20%',
        end: 'top -10%',
        scrub: 1,
      }
    });
  });
}

// ========================================
// SECTION REVEALS
// ========================================
function initReveals() {
  // About section
  gsap.from('.about-subtitle', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    }
  });

  gsap.from('.about-body', {
    y: 40,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    }
  });

  gsap.from('.about-text', {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-right',
      start: 'top 70%',
    }
  });

  // Showcase cards
  gsap.from('.showcase-card', {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.showcase',
      start: 'top 70%',
    }
  });

  // Pricing
  gsap.from('.pricing-title', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.pricing',
      start: 'top 65%',
    }
  });

  gsap.from('.pricing-tier', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 75%',
    }
  });

  // Section label (Analytics)
  gsap.from('.section-label', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials',
      start: 'top 70%',
    }
  });

  // Testimonial cards
  gsap.from('.testimonial-card', {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 75%',
    }
  });

  // CTA
  gsap.from('.cta-title', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta',
      start: 'top 65%',
    }
  });

  gsap.from('.cta-button', {
    y: 40,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta',
      start: 'top 65%',
    }
  });

  // Footer
  gsap.from('.footer-tagline span', {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer-hero',
      start: 'top 70%',
    }
  });
}

// ========================================
// HERO PARALLAX
// ========================================
function initHeroParallax() {
  // Tape measure parallax
  gsap.to('.hero-tape', {
    y: -150,
    rotation: 15,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Title parallax
  gsap.to('.hero-title', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });
}

// ========================================
// VIDEO CARD
// ========================================
function initVideoCard() {
  const card = document.getElementById('videoCard');
  const closeBtn = document.getElementById('closeVideoCard');
  if (!card || !closeBtn) return;

  // Show after scrolling past hero
  ScrollTrigger.create({
    trigger: '.about',
    start: 'top 80%',
    onEnter: () => {
      card.classList.add('is-visible');
      card.classList.remove('is-hidden');
    },
  });

  closeBtn.addEventListener('click', () => {
    card.classList.remove('is-visible');
    card.classList.add('is-hidden');
  });
}

// ========================================
// TAPE IMAGE FLOAT ANIMATION
// ========================================
function initTapeFloat() {
  // Persistent floating tape that follows scroll
  const tapeImg = document.querySelector('.tape-img');
  if (!tapeImg) return;

  // Subtle floating animation
  gsap.to(tapeImg, {
    y: -12,
    rotation: -18,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

// ========================================
// SMOOTH NAV
// ========================================
function initNav() {
  const links = document.querySelectorAll('.nav-link, .nav-join');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initDotMap();
  initLeaderboard();
  initReveals();
  initHeroParallax();
  initVideoCard();
  initTapeFloat();
  initNav();
});
