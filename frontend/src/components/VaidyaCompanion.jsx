import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function VaidyaCompanion({ message, mood = 'happy' }) {
  return (
    <div className="flex items-start space-x-3.5 bg-gradient-to-r from-emerald-50 to-amber-50/60 dark:from-emerald-950/40 dark:to-amber-950/30 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm transition-all duration-300">
      {/* Sage / Companion Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-amber-700 flex items-center justify-center text-amber-200 text-2xl shadow-md border-2 border-amber-300/60 select-none">
          🌿
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[10px] font-extrabold shadow">
          ॐ
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 tracking-wide uppercase">
            AyuVaidya Sage &bull; AyurParam 2.9B
          </span>
          <span className="inline-flex items-center text-[10px] px-2 py-0.2 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold">
            <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-500" /> Guide
          </span>
        </div>
        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
