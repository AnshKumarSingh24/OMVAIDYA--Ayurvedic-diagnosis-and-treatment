import React from 'react';

/**
 * OmVaidyaLogo: Official Vedic Lotus Logo
 * Sacred Om enclosed by 8 golden rays and 8 green lotus petals with gold trim,
 * surrounded by an astronomical dotted orbit.
 */
export default function OmVaidyaLogo({
  size = 40,
  animate = false,
  className = '',
  showGlow = true
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f5c518 0%, #2e7d32 70%, transparent 100%)' }}
        />
      )}

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 overflow-visible"
        aria-label="ॐ Vaidya Sacred Logo"
      >
        {/* Outer Celestial Dotted Orbit */}
        <circle
          cx="200"
          cy="200"
          r="191"
          fill="none"
          stroke="#F5C518"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="0.1 11.5"
          className={animate ? 'animate-spin-slow' : ''}
          style={{ transformOrigin: '200px 200px', animationDuration: '30s' }}
        />

        {/* 8 Golden Sun/Star Rays */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
          <path
            key={`ray-${idx}`}
            d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z"
            fill="#F5C518"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}

        {/* 8 Emerald Lotus Petals with Golden Rim */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <path
            key={`petal-${idx}`}
            d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z"
            fill="#1e5c2b"
            stroke="#F5C518"
            strokeWidth="3.5"
            strokeLinejoin="round"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}

        {/* Central Dark Green Sanctum Disc */}
        <circle
          cx="200"
          cy="200"
          r="86"
          fill="#0a2414"
          stroke="#F5C518"
          strokeWidth="4"
        />

        {/* Sacred Golden Vedic Om */}
        <text
          x="200"
          y="226"
          textAnchor="middle"
          fontFamily="'Noto Serif Devanagari', 'Martel', serif"
          fontSize="82"
          fill="#F5C518"
          fontWeight="600"
          style={{ userSelect: 'none' }}
        >
          ॐ
        </text>
      </svg>
    </div>
  );
}
