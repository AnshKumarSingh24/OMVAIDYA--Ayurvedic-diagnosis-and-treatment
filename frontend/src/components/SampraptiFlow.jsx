import React from 'react';
import { GitBranch, AlertCircle, ArrowRight } from 'lucide-react';

export default function SampraptiFlow({ ghatakas, kriyaKala }) {
  if (!ghatakas) return null;

  const stages = [
    { key: '1_sanchaya', title: '1. Sanchaya', subtitle: 'Accumulation in Root Site' },
    { key: '2_prakopa', title: '2. Prakopa', subtitle: 'Dosha Provocation' },
    { key: '3_prasara', title: '3. Prasara', subtitle: 'Systemic Overflow' },
    { key: '4_sthana_samshraya', title: '4. Sthana-Samshraya', subtitle: 'Localization in Defective Channel' },
    { key: '5_vyakti', title: '5. Vyakti', subtitle: 'Clinical Manifestation' },
    { key: '6_bheda', title: '6. Bheda', subtitle: 'Sub-typing & Complications' },
  ];

  return (
    <div className="space-y-6">
      {/* Samprapti Ghatakas Matrix */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <GitBranch className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
            Samprapti Ghatakas (Pathology Components)
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Aggravated Doshas</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {Array.isArray(ghatakas.dosha) ? ghatakas.dosha.join(', ') : ghatakas.dosha}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Vitiated Dhatus</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {Array.isArray(ghatakas.dushya) ? ghatakas.dushya.join(', ') : ghatakas.dushya}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Agni &amp; Ama Status</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {ghatakas.agni} {ghatakas.ama ? '(Ama Present)' : '(Nirama)'}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Affected Srotas</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {Array.isArray(ghatakas.srotas) ? ghatakas.srotas.join(', ') : ghatakas.srotas}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 md:col-span-2">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Sroto-Dushti Prakara</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {ghatakas.sroto_dushti_prakara}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 md:col-span-2">
            <span className="block text-[10px] uppercase font-bold text-stone-400">Adhisthana (Primary Site)</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
              {ghatakas.adhisthana}
            </span>
          </div>
        </div>
      </div>

      {/* Shat Kriya Kala 6-Stage Timeline */}
      {kriyaKala && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Shat Kriya Kala Progression (Sushruta Samhita Sutra 21)
            </h3>
            <span className="text-[11px] text-stone-400">6 Stages of Pathogenesis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stages.map((st, idx) => (
              <div
                key={st.key}
                className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-800 dark:text-emerald-400">
                    {st.title}
                  </span>
                  <span className="text-[10px] font-mono bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded text-stone-600 dark:text-stone-300">
                    Phase {idx + 1}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  {st.subtitle}
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                  {kriyaKala[st.key] || 'Progressive pathological evolution.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

