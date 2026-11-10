import React from 'react';
import { ShieldCheck, Cpu, User, Moon, Sun, PlusCircle } from 'lucide-react';

export default function Navbar({
  patients = [],
  activePatientId,
  onSelectPatient,
  onNewPatient,
  isDark,
  onToggleTheme
}) {
  const activePatient = patients.find(p => p.id === activePatientId);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Status Pills */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-amber-300 font-bold text-xl shadow-md">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">AyuVaidya</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                AyurParam 2.9B
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Clinical &amp; Practitioner Intelligence System</p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">AyurParam 2.9B</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">AyurGuard Active</span>
          </div>
        </div>

        {/* Right Actions: Patient Selector & Theme */}
        <div className="flex items-center space-x-3">
          {/* Link back to landing */}
          <button
            onClick={() => window.location.href = '/landing'}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition"
          >
            Landing
          </button>

          {/* Patient Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={activePatientId || ''}
              onChange={(e) => onSelectPatient(Number(e.target.value))}
              className="text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>Select Active Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.age}y &bull; {p.prakriti})
                </option>
              ))}
            </select>

            <button
              onClick={onNewPatient}
              title="Add New Patient Case / Onboarding"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition text-xs font-bold flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Intake</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}

