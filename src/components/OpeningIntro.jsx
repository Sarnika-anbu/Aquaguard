import React, { useState } from 'react';
import { LiquidEffectAnimation } from '@/components/ui/liquid-effect-animation';
import { Droplet } from 'lucide-react';
import '../styles/intro.css';

export default function OpeningIntro({ onComplete }) {
  const [fading, setFading] = useState(false);

  const handleEnter = () => {
    setFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  };

  return (
    <div className={`intro-overlay ${fading ? 'fade-out' : ''}`}>
      {/* Three.js Interactive Water Splash Background Canvas */}
      <LiquidEffectAnimation />

      {/* Intro CTA Overlay - Matches inside webpage aquatic theme */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen pb-16 text-center px-4">
        <div 
          className="p-3 rounded-full border border-cyan-400/40 shadow-[0_0_30px_rgba(0,210,255,0.35)] transition-transform duration-300 hover:scale-105"
          style={{ background: 'rgba(8, 40, 70, 0.85)', backdropFilter: 'blur(16px)' }}
        >
          <button
            className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3 rounded-full"
            onClick={handleEnter}
          >
            <Droplet size={18} /> Enter System →
          </button>
        </div>
      </div>
    </div>
  );
}
