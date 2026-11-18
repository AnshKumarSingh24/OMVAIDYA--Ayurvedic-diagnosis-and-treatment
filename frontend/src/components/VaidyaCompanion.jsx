import React from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * VaidyaAvatar: Dignified elderly Ayurvedic Acharya / Vaidya visual
 * Clean vector SVG artwork with graceful grey beard, saffron/ochre shawl, and serene aura.
 */
export function VaidyaAvatar({ mood = 'calm', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative shrink-0 select-none ${containerSize} ${className}`}>
      {/* Background Aura Glow */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          mood === 'processing'
            ? 'bg-[var(--gb-orange)]/40 animate-pulse blur-sm'
            : mood === 'celebrating'
            ? 'bg-[var(--gb-mint)]/40 blur-sm'
            : 'bg-[var(--gb-mint)]/15'
        }`}
      />

      {/* Illustrated Vaidya Acharya SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-2xl bg-gradient-to-br from-[#241b54] to-[#171342] border-2 border-[var(--gb-border)] shadow-md"
      >
        {/* Soft background halo */}
        <circle cx="32" cy="32" r="28" fill="#171342" opacity="0.6" />
        <circle cx="32" cy="22" r="14" fill="#3d2d84" opacity="0.8" />

        {/* Shoulders / Ochre Uttariya (Shawl) */}
        <path
          d="M10 56C10 44 20 40 32 40C44 40 54 44 54 56C54 58 52 60 50 60H14C12 60 10 58 10 56Z"
          fill="#D97706"
        />
        <path
          d="M16 46C20 42 26 41 32 41C38 41 44 42 48 46L46 60H18L16 46Z"
          fill="#B45309"
        />
        {/* Rudraksha / Pearl Mala strand */}
        <circle cx="28" cy="46" r="1.5" fill="#FCD34D" />
        <circle cx="32" cy="47" r="1.8" fill="#F59E0B" />
        <circle cx="36" cy="46" r="1.5" fill="#FCD34D" />

        {/* Head / Face */}
        <circle cx="32" cy="24" r="10" fill="#FBBF24" />

        {/* Dignified Silver/White Hair & Topknot (Jata) */}
        <path
          d="M26 12C26 8.5 29 7 32 7C35 7 38 8.5 38 12C38 14 36 15 32 15C28 15 26 14 26 12Z"
          fill="#E2E8F0"
        />
        <path
          d="M22 22C22 15 26 13 32 13C38 13 42 15 42 22C42 23 41 23 40 22C38 18 35 17 32 17C29 17 26 18 24 22C23 23 22 23 22 22Z"
          fill="#CBD5E1"
        />

        {/* Calming Eyes (half closed, contemplative) */}
        <path d="M27 22C28 23.2 29.5 23.2 30.5 22" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M33.5 22C34.5 23.2 36 23.2 37 22" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />

        {/* Gentle Ayurvedic Tilak (Chandan / Kumkum) on forehead */}
        <path d="M32 15V19" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="32" cy="20" r="0.8" fill="#F59E0B" />

        {/* Dignified flowing white beard (Shveta Kurca) */}
        <path
          d="M26 28C26 36 29 40 32 40C35 40 38 36 38 28C38 27 36 28 32 28C28 28 26 27 26 28Z"
          fill="#F8FAFC"
        />
        <path
          d="M29 28C29 33 30.5 36 32 36C33.5 36 35 33 35 28"
          stroke="#E2E8F0"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Gentle serene smile indicator */}
        <path d="M30.5 26.5C31.5 27.2 32.5 27.2 33.5 26.5" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" />
      </svg>

      {/* Mood indicator badge at bottom right */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--gb-bg-deep)] border border-[var(--gb-border)] flex items-center justify-center shadow-xs">
        {mood === 'processing' ? (
          <div className="w-2 h-2 rounded-full bg-[var(--gb-orange)] animate-ping" />
        ) : mood === 'celebrating' ? (
          <CheckCircle2 className="w-2.5 h-2.5 text-[var(--gb-mint)]" />
        ) : mood === 'thoughtful' ? (
          <Brain className="w-2.5 h-2.5 text-[var(--gb-orange)]" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-[var(--gb-mint)]" />
        )}
      </div>
    </div>
  );
}

/**
 * VaidyaCompanion: Conversational speech bubble with dignified companion
 */
export default function VaidyaCompanion({ 
  message, 
  mood = 'calm', 
  title = "Vaidya Companion", 
  subtitle = "Brihat Trayi Clinical Intelligence",
  className = "" 
}) {
  return (
    <div className={`flex items-start gap-3.5 bg-[var(--gb-surface)] border border-[var(--gb-border)] p-4 rounded-2xl shadow-[var(--gb-shadow)] transition-all duration-200 ${className}`}>
      {/* Avatar */}
      <VaidyaAvatar mood={mood} size="md" />

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[var(--gb-white)] tracking-wide">
              {title}
            </span>
            <span className="text-[10px] text-[var(--gb-dim)] hidden sm:inline">&bull; {subtitle}</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[var(--gb-mint)]/10 text-[var(--gb-mint)] font-semibold border border-[var(--gb-mint)]/30">
            <Sparkles className="w-2.5 h-2.5 text-[var(--gb-orange)]" />
            Decision Support
          </span>
        </div>

        <p className="text-xs text-[var(--gb-muted)] leading-relaxed font-normal">
          {message}
        </p>
      </div>
    </div>
  );
}
