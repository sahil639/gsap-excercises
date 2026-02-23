import React from 'react';
import Navbar from './components/Navbar';
import HeroText from './components/HeroText';
import PixelCanvas from './components/PixelCanvas';
import FloatingObject from './components/FloatingObject';
import Sections from './components/Sections';
import './style.css';

export default function MeasuredProject() {
  return (
    <>
      <FloatingObject />
      {/* Navbar is inside the hero section, aligned right */}
      <section className="hero" id="hero">
        <Navbar />
        <HeroText />
        <div className="hero-canvas-wrap">
          <PixelCanvas />
        </div>
      </section>
      <Sections />
    </>
  );
}
