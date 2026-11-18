import React from 'react';

/**
 * DecorativeMemphisBackground: Recreates the exact GutBalance hero background atmosphere
 * Layered purple waves, white plus signs, dot matrices, mint/violet rings, and orange accent strokes.
 */
export default function DecorativeMemphisBackground({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Wave Layers SVG */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full object-cover opacity-90"
        >
          {/* Base gradient */}
          <rect width="1440" height="800" fill="url(#bgGradient)" />

          {/* Deep undulating wave layer 1 */}
          <path
            d="M-100 480C180 340 380 560 680 430C980 300 1200 460 1540 360V850H-100V480Z"
            fill="#211855"
            fillOpacity="0.85"
          />

          {/* Mid undulating wave layer 2 */}
          <path
            d="M-100 590C220 500 440 680 760 560C1080 440 1280 620 1540 520V850H-100V590Z"
            fill="#181347"
            fillOpacity="0.95"
          />

          {/* Deep floor wave layer 3 */}
          <path
            d="M-100 680C260 620 520 740 840 660C1160 580 1340 700 1540 640V850H-100V680Z"
            fill="#110e35"
          />

          <defs>
            <linearGradient id="bgGradient" x1="720" y1="0" x2="720" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3d2c88" />
              <stop offset="0.45" stopColor="#2b1f69" />
              <stop offset="1" stopColor="#171342" />
            </linearGradient>
          </defs>
        </svg>

        {/* Memphis Geometric Shapes (Positioned exactly as in reference) */}
        
        {/* Top-left concentric ring */}
        <div className="absolute top-12 left-20 w-16 h-16 rounded-full border-4 border-violet-400/35 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-violet-400/25" />
        </div>

        {/* Top-left plus signs */}
        <div className="absolute top-8 left-1/4 text-white/40 text-2xl font-light select-none">+</div>
        <div className="absolute top-36 left-48 text-white/30 text-xl font-light select-none">+</div>

        {/* Top-right mint arc / ring */}
        <div className="absolute top-8 right-1/4 w-20 h-20 rounded-full border-4 border-emerald-400/50 border-b-transparent -rotate-12" />

        {/* Top-right plus sign */}
        <div className="absolute top-28 right-36 text-white/40 text-2xl font-light select-none">+</div>

        {/* Top-center orange accent capsules / strokes */}
        <div className="absolute top-2 left-1/3 w-2.5 h-7 rounded-full bg-orange-400/80 -rotate-12" />
        <div className="absolute top-6 left-[37%] w-2.5 h-6 rounded-full bg-orange-400/80 rotate-45" />

        {/* Mid-right dot matrix (4x3) */}
        <div className="absolute top-64 right-16 grid grid-cols-4 gap-2.5 opacity-40">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-300" />
          ))}
        </div>

        {/* Bottom-center dot matrix (4x3) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 grid grid-cols-4 gap-2.5 opacity-35">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-300" />
          ))}
        </div>

        {/* Bottom-right inverted arc (semicircle) */}
        <div className="absolute bottom-20 right-28 w-16 h-9 border-4 border-violet-400/50 border-b-0 rounded-t-full" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

