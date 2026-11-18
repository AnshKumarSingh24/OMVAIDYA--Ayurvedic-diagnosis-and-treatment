import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle: Dynamic theme toggle with clear state indicator
 */
export default function ThemeToggle({
  isDark = true,
  onToggle,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`relative px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gb-mint)] active:scale-95 shadow-sm ${
        isDark
          ? 'bg-[#20194f] text-amber-300 border-violet-400/40 hover:border-amber-300'
          : 'bg-white text-indigo-900 border-indigo-200 hover:border-indigo-500 shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline text-[11px] font-semibold text-amber-200">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline text-[11px] font-semibold text-indigo-900">Dark</span>
        </>
      )}
    </button>
  );
}

