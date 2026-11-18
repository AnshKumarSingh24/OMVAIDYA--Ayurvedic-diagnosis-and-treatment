import React from 'react';
import { BookOpen, Cpu, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * MetricStrip: Recreates the exact GutBalance dark translucent metric pill strip
 */
export default function MetricStrip({ items, className = '' }) {
  const defaultItems = [
    {
      icon: BookOpen,
      text: '3 Canonical Treatises (Brihat Trayi)',
      color: 'text-amber-300'
    },
    {
      icon: Cpu,
      text: 'IIT Bombay AyurParam 2.9B',
      color: 'text-emerald-400'
    },
    {
      icon: ShieldCheck,
      text: 'AyurGuard Safety Gate',
      color: 'text-orange-400'
    },
    {
      icon: Sparkles,
      text: '100% Shloka Traceability',
      color: 'text-cyan-300'
    }
  ];

  const displayItems = items || defaultItems;

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 bg-[#120f38]/90 border border-violet-400/30 rounded-full shadow-lg backdrop-blur-md text-xs font-semibold text-slate-200 select-none ${className}`}>
      {displayItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-2">
              {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color || 'text-emerald-400'}`} />}
              <span className="tracking-tight">{item.text}</span>
            </div>
            {idx < displayItems.length - 1 && (
              <span className="text-violet-400/50 hidden sm:inline">&bull;</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

