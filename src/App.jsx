import React from 'react';
import Navbar from './components/Navbar';
import HeroText from './components/HeroText';
import PixelCanvas from './components/PixelCanvas';
import FloatingObject from './components/FloatingObject';
import Sections from './components/Sections';

export default function App() {
  return (
    <>
      <Navbar />
      <FloatingObject />
      <section className="hero" id="hero">
        <HeroText />
        <div className="hero-canvas-wrap">
          <PixelCanvas />
        </div>
      </section>
      <Sections />
    </>
  );
}
