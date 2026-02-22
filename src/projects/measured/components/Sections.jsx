import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Sections() {
  useEffect(() => {
    // Leaderboard scroll animations
    const items = document.querySelectorAll('.lb-item');
    items.forEach((item) => {
      const rank = parseInt(item.dataset.rank);
      gsap.fromTo(item,
        { opacity: rank <= 3 ? 0.5 : 0.15, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 0.5,
          scrollTrigger: { trigger: item, start: 'top 80%', end: 'top 30%', scrub: 1 },
        }
      );
      gsap.to(item, {
        opacity: 0.15, scale: 0.95,
        scrollTrigger: { trigger: item, start: 'top 20%', end: 'top -10%', scrub: 1 },
      });
    });

    // Section reveals
    const reveals = [
      { sel: '.about-subtitle', trigger: '.about', y: 60 },
      { sel: '.about-body', trigger: '.about', y: 40, delay: 0.2 },
      { sel: '.about-text', trigger: '.about-right', y: 60, stagger: 0.2 },
      { sel: '.showcase-card', trigger: '.showcase', y: 80, stagger: 0.2 },
      { sel: '.pricing-title', trigger: '.pricing', y: 60 },
      { sel: '.pricing-tier', trigger: '.pricing-grid', y: 60, stagger: 0.15 },
      { sel: '.section-label', trigger: '.testimonials', y: 80 },
      { sel: '.testimonial-card', trigger: '.testimonials-grid', y: 80, stagger: 0.1 },
      { sel: '.cta-title', trigger: '.cta', y: 60 },
      { sel: '.cta-button', trigger: '.cta', y: 40, delay: 0.3 },
      { sel: '.footer-tagline span', trigger: '.footer-hero', y: 60, stagger: 0.2 },
    ];

    reveals.forEach(({ sel, trigger, y, stagger, delay }) => {
      gsap.from(sel, {
        y, opacity: 0, duration: 1, ease: 'power3.out',
        stagger: stagger || 0, delay: delay || 0,
        scrollTrigger: { trigger, start: 'top 70%' },
      });
    });

    // Smooth nav scroll
    document.querySelectorAll('.nav-link, .nav-join').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {/* Leaderboard */}
      <section className="leaderboard" id="leaderboard">
        <div className="leaderboard-inner">
          <div className="leaderboard-description">
            <p>The leaderboard ranks every site in real time, turning simple analytics into a global competition where creators track growth, and see whats popular.</p>
          </div>
          <div className="leaderboard-list">
            {[
              { rank: 1, site: 'measured.site', visits: '3,805' },
              { rank: 2, site: 'joshchant.com', visits: '1,791' },
              { rank: 3, site: 'urbanlens.site', visits: '1,442' },
              { rank: 4, site: 'medialabforty.site', visits: '1,442' },
              { rank: 5, site: 'polybite.us', visits: '1,079' },
              { rank: 6, site: 'zaliburger.co.il', visits: '1,046' },
              { rank: 7, site: 'coromandelengg.com', visits: '911' },
              { rank: 8, site: 'gridiron-duels.com', visits: '583' },
              { rank: 9, site: 'deutromequestrian.com', visits: '564' },
              { rank: 10, site: 'immanueldavid.design', visits: '542' },
              { rank: 11, site: 'intermission.events', visits: '476' },
              { rank: 12, site: 'nadeemashraf.framer.website', visits: '405' },
              { rank: 13, site: 'rashedalidesign.com', visits: '164' },
              { rank: 14, site: 'honorablethird.com', visits: '125' },
              { rank: 15, site: 'linux-lab.live', visits: '124' },
              { rank: 16, site: 'samanthaguerard.com', visits: '119' },
              { rank: 17, site: 'iamglaze.me', visits: '115' },
              { rank: 18, site: 'lousstudio.com', visits: '112' },
              { rank: 19, site: 'mhl5.vercel.app', visits: '97' },
              { rank: 20, site: 'rafiboz.com', visits: '95' },
            ].map(({ rank, site, visits }) => (
              <a key={rank} href="#" className="lb-item" data-rank={rank}>
                <span className="lb-rank">{rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}</span>
                <span className="lb-site">{site}</span>
                <span className="lb-visits">{visits} visits</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="analytics">
        <div className="about-inner">
          <div className="about-left">
            <p className="about-subtitle">One simple <code>&lt;script /&gt;</code> for fast, beautiful, and reliable website analytics anywhere.</p>
            <p className="about-body">Track visits, devices, and locations in real time - all from a lightweight, privacy-friendly dashboard designed for clarity and speed.</p>
          </div>
          <div className="about-right">
            <p className="about-text">Measured was built out of frustration with cluttered, expensive analytics tools that overcomplicate simple data. We wanted something lean, elegant, and actually enjoyable to use, a tool that gives creators and studios clear, real-time insight without setup pain or unnecessary features.</p>
            <p className="about-text">By combining simplicity, affordability, and a touch of design excellence, Measured turns analytics into something creative, helping you understand your audience while competing for visibility on a global leaderboard.</p>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="showcase">
        <div className="showcase-inner">
          <div className="showcase-card showcase-card--dark" />
          <div className="showcase-card showcase-card--blue">
            <img src="/images/measured/dashboard.png" alt="Analytics Dashboard" className="showcase-dashboard" />
            <span className="showcase-label">Measured.site</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <h2 className="pricing-title">Competitive Pricing</h2>
        <div className="pricing-grid">
          {[
            { name: 'Free', cls: 'free', features: ['One Website', 'Five Thousand Monthly Events', 'Weekly Analytic History', 'Entry To Global Leaderboard'] },
            { name: 'Freelance', cls: 'freelance', features: ['Up To Ten Websites', 'Fifty Thousand Monthly Events', 'One Year Analytic History', 'Entry To All Leaderboards'] },
            { name: 'Studio', cls: 'studio', features: ['Unlimited Website', 'Two Hundred Thousand Events', 'Unlimited Analytic History', 'Entry To All Leaderboard'] },
          ].map(({ name, cls, features }) => (
            <div key={name} className={`pricing-tier pricing-tier--${cls}`}>
              <h3 className="tier-name">{name}</h3>
              <ul className="tier-features">
                {features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonials-heading">
          <h2 className="section-label">Analytics</h2>
        </div>
        <div className="testimonials-grid">
          {[
            { theme: 'light', quote: 'Using Measured has been a total game changer. Their elegant design and focus on simplicity make tracking our sites a joy. The leaderboard adds just the right dose of creative competition.', name: 'Ava Dimitri', co: 'Studio Hollow' },
            { theme: 'blue', quote: 'Working with Measured feels like stepping into the future of analytics. Beautiful, intuitive, and fast - they\'ve turned something boring into something genuinely exciting to use every day.', name: 'Toby Nguyen', co: 'Orbit & Sons' },
            { theme: 'dark', quote: 'Honestly, I didn\'t expect analytics to look this good. Setup took two minutes, and now I check the dashboard every morning.', name: 'Lena Marsh', co: 'Northwave Studio' },
            { theme: 'light', quote: 'Measured fits perfectly into our workflow. Clean, thoughtful design and zero clutter, we finally enjoy checking analytics.', name: 'Peter Mackal', co: 'Sphereo' },
            { theme: 'blue', quote: 'Most analytics tools feel built for spreadsheets, not studios. Measured feels designed for creatives, simple, fast, and genuinely satisfying to use.', name: 'David Reach', co: 'Studio Reach' },
            { theme: 'dark', quote: 'Measured turned analytics into something we actually pay attention to. Beautiful UI, instant insights, and the visitor leaderboard makes internal launches way more fun.', name: 'Mabel Clairo', co: 'Sunstile' },
            { theme: 'light', quote: 'We care a lot about presentation, even with internal tools. Measured nails that balance of clarity and craft.', name: 'Ashad Mabdul', co: 'Manco Marketing' },
          ].map(({ theme, quote, name, co }, i) => (
            <div key={i} className={`testimonial-card testimonial--${theme}`}>
              <p className="testimonial-quote">{quote}</p>
              <span className="testimonial-mark">&ldquo;</span>
              <div className="testimonial-author">
                <strong>{name}</strong>
                <span>{co}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <div className="cta-inner">
          <div className="cta-left">
            <h2 className="cta-title">Start Using Measured</h2>
            <p className="cta-text">Get setup with measured in minutes. Join the leaderboard and start tracking your analytics as simply as it should be.</p>
          </div>
          <div className="cta-right">
            <a href="#" className="cta-button">Get started</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-hero">
            <div className="footer-tagline">
              <span className="footer-get">Get</span>
              <span className="footer-measured">Measured.</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-brand">Measured <span className="footer-year">2026</span></span>
            <a href="#" className="footer-link">Docs</a>
            <a href="#" className="footer-link">Policy</a>
            <a href="mailto:hello@measured.site" className="footer-link">hello@measured.site</a>
            <a href="https://www.joshchant.com" className="footer-link footer-credit">By Josh</a>
          </div>
        </div>
      </footer>
    </>
  );
}
