import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * OmVaidyaIntroSplash: Incorporates the exact ॐ Vaidya.html animation
 * Plays the sacred blooming lotus split and title reveal upon completing onboarding,
 * then smoothly advances into the Case Workspace.
 */
export default function OmVaidyaIntroSplash({
  patientName = 'Patient',
  prakriti = 'Vata-Pitta',
  onComplete,
  autoAdvanceSeconds = 4.8
}) {
  const introRef = useRef(null);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;

    el.classList.add('play');

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const g = el.querySelector('.omg');
      const st = el.querySelector('.stage');
      if (g && st) {
        const gr = g.getBoundingClientRect();
        const sr = st.getBoundingClientRect();
        const dx = sr.left + sr.width / 2 - (gr.left + gr.width / 2);
        const dy = sr.top + sr.height / 2 - (gr.top + gr.height / 2);
        const S = (sr.width * 0.3) / parseFloat(getComputedStyle(g).fontSize || '60');
        const c = 'translate(' + dx + 'px,' + dy + 'px) scale(';
        g.animate([
          { opacity: 0, transform: c + (S * 0.2) + ')', offset: 0 },
          { opacity: 0, transform: c + (S * 0.2) + ')', offset: 0.2778, easing: 'cubic-bezier(.2,.8,.3,1.3)' },
          { opacity: 1, transform: c + S + ')', offset: 0.4722 },
          { opacity: 1, transform: c + S + ')', offset: 0.6944, easing: 'cubic-bezier(.7,0,.3,1)' },
          { opacity: 1, transform: 'translate(0px,0px) scale(1)', offset: 0.9722 },
          { opacity: 1, transform: 'translate(0px,0px) scale(1)', offset: 1 }
        ], { duration: 3600, fill: 'both' });
      }
    }

    // Auto forward after animation completes
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, autoAdvanceSeconds * 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceSeconds, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden animate-fade-in"
      style={{
        background: '#0F2E1A',
        color: '#FFFBE0',
        fontFamily: "'Cormorant Garamond', Georgia, serif"
      }}
    >
      <style>{`
        .om-wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .om-wrap:not(.play) * { animation-play-state: paused !important; }
        .om-wrap:not(.play) .omg { visibility: hidden; }
        .stage { position: absolute; width: min(78vmin, 460px); aspect-ratio: 1; z-index: 1; }
        .half { position: absolute; inset: 0; pointer-events: none; animation: om-split .9s cubic-bezier(.7,0,.3,1) 2.5s forwards; }
        .half.top { clip-path: inset(0 0 50% 0); --d: -70%; }
        .half.bot { clip-path: inset(50% 0 0 0); --d: 70%; }
        .half svg { width: 100%; height: 100%; display: block; }
        .ring { fill: none; stroke: #F5C518; stroke-width: 4; stroke-linecap: round; stroke-dasharray: .1 11.5; transform-origin: 200px 200px; animation: om-fade 1s .1s both, om-spin 24s linear infinite; }
        .pt { transform-origin: 200px 200px; animation: om-bloom .8s cubic-bezier(.2,.8,.2,1.15) both; animation-delay: calc(.3s + var(--i) * .08s); }
        .pt.sm { fill: #F5C518; }
        .pt.bg { fill: #2E7D32; stroke: #F5C518; stroke-width: 3; stroke-linejoin: round; }
        .disc { fill: #0F2E1A; stroke: #F5C518; stroke-width: 4; transform-origin: 200px 200px; animation: om-pop .7s cubic-bezier(.2,.8,.3,1.3) 1s both; }
        .rip { position: absolute; inset: 16%; border: 2px solid #F5C518; border-radius: 50%; opacity: 0; animation: om-ripple 1.4s ease-out both; }
        .rip.a { animation-delay: 2.5s; }
        .rip.b { animation-delay: 2.8s; }
        .brand { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
        .word { display: flex; align-items: center; gap: .06em; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; font-size: clamp(48px, 12vw, 96px); line-height: 1; letter-spacing: .02em; }
        .omg { font-family: 'Noto Serif Devanagari', 'Martel', serif; font-weight: 600; font-size: .95em; line-height: 1; color: #F5C518; display: inline-block; }
        .ltr { display: inline-block; opacity: 0; transform: translateY(45%); animation: om-rise .8s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: calc(3.25s + var(--k) * .08s); color: #FFFBE0; }
        .line { height: 2px; width: min(62vw, 420px); background: #F5C518; transform: scaleX(0); animation: om-draw .9s cubic-bezier(.6,0,.2,1) 2.9s forwards; }
        .tag { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .42em; text-indent: .42em; color: #F5C518; opacity: 0; animation: om-fade .8s 4.0s forwards; }
        .action-banner { opacity: 0; animation: om-fade .8s 4.2s forwards; }
        
        @keyframes om-bloom { from { opacity: 0; transform: rotate(var(--r)) scale(0); } to { opacity: 1; transform: rotate(var(--r)) scale(1); } }
        @keyframes om-pop { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
        @keyframes om-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes om-spin { to { transform: rotate(360deg); } }
        @keyframes om-split { to { transform: translateY(var(--d)); opacity: 0; } }
        @keyframes om-ripple { from { opacity: .9; transform: scale(.4); } to { opacity: 0; transform: scale(2.6); } }
        @keyframes om-rise { to { opacity: 1; transform: none; } }
        @keyframes om-draw { to { transform: scaleX(1); } }
      `}</style>

      {/* Main Wrap ID */}
      <div className="om-wrap play" id="intro" ref={introRef}>
        
        {/* Stage with Top & Bottom Halves */}
        <div className="stage">
          <div className="half top">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <circle className="ring" cx="200" cy="200" r="191" />
              <path className="pt sm" style={{ '--r': '22.5deg', '--i': 0 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '67.5deg', '--i': 1 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '112.5deg', '--i': 2 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '157.5deg', '--i': 3 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '202.5deg', '--i': 4 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '247.5deg', '--i': 5 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '292.5deg', '--i': 6 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '337.5deg', '--i': 7 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt bg" style={{ '--r': '0deg', '--i': 0 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '45deg', '--i': 1 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '90deg', '--i': 2 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '135deg', '--i': 3 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '180deg', '--i': 4 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '225deg', '--i': 5 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '270deg', '--i': 6 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '315deg', '--i': 7 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <circle className="disc" cx="200" cy="200" r="86" />
            </svg>
          </div>
          <div className="half bot">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <circle className="ring" cx="200" cy="200" r="191" />
              <path className="pt sm" style={{ '--r': '22.5deg', '--i': 0 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '67.5deg', '--i': 1 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '112.5deg', '--i': 2 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '157.5deg', '--i': 3 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '202.5deg', '--i': 4 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '247.5deg', '--i': 5 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '292.5deg', '--i': 6 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt sm" style={{ '--r': '337.5deg', '--i': 7 }} d="M200 200 C184 168 184 112 200 72 C216 112 216 168 200 200Z" />
              <path className="pt bg" style={{ '--r': '0deg', '--i': 0 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '45deg', '--i': 1 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '90deg', '--i': 2 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '135deg', '--i': 3 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '180deg', '--i': 4 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '225deg', '--i': 5 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '270deg', '--i': 6 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <path className="pt bg" style={{ '--r': '315deg', '--i': 7 }} d="M200 200 C168 150 168 78 200 28 C232 78 232 150 200 200Z" />
              <circle className="disc" cx="200" cy="200" r="86" />
            </svg>
          </div>
          <div className="rip a" />
          <div className="rip b" />
        </div>

        {/* The Brand Revealed */}
        <div className="brand">
          <div className="word" aria-label="ॐ Vaidya">
            <span className="omg" aria-hidden="true">ॐ</span>
            <span className="ltr" style={{ '--k': 0 }}>V</span>
            <span className="ltr" style={{ '--k': 1 }}>a</span>
            <span className="ltr" style={{ '--k': 2 }}>i</span>
            <span className="ltr" style={{ '--k': 3 }}>d</span>
            <span className="ltr" style={{ '--k': 4 }}>y</span>
            <span className="ltr" style={{ '--k': 5 }}>a</span>
          </div>
          <div className="line" />
          <div className="tag">AYURVEDA &bull; CDSS</div>

          {/* Action / Patient Calibration Pill */}
          <div className="action-banner pt-4 flex flex-col items-center gap-3">
            <div className="px-4 py-1.5 rounded-full bg-[#2E7D32]/40 border border-[#F5C518]/50 text-xs font-sans text-[#FFFBE0]">
              Synthesizing active case for <strong className="text-[#F5C518]">{patientName}</strong> ({prakriti})
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="mt-2 px-6 py-2.5 rounded-full border border-[#F5C518] bg-[#0F2E1A] hover:bg-[#F5C518] text-[#FFFBE0] hover:text-[#0F2E1A] font-sans font-bold text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>Enter Case Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
