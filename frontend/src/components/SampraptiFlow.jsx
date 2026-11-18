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
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-violet-400/20 pb-3">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
            Samprapti Ghatakas (Pathology Components)
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Aggravated Doshas</span>
            <span className="font-bold text-amber-300 mt-1 block">
              {Array.isArray(ghatakas.dosha) ? ghatakas.dosha.join(', ') : ghatakas.dosha}
            </span>
          </div>

          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Vitiated Dhatus</span>
            <span className="font-bold text-emerald-300 mt-1 block">
              {Array.isArray(ghatakas.dushya) ? ghatakas.dushya.join(', ') : ghatakas.dushya}
            </span>
          </div>

          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Agni &amp; Ama Status</span>
            <span className="font-bold text-white mt-1 block">
              {ghatakas.agni} {ghatakas.ama ? '(Ama Present)' : '(Nirama)'}
            </span>
          </div>

          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Affected Srotas</span>
            <span className="font-bold text-sky-300 mt-1 block">
              {Array.isArray(ghatakas.srotas) ? ghatakas.srotas.join(', ') : ghatakas.srotas}
            </span>
          </div>

          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25 md:col-span-2">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Sroto-Dushti Prakara</span>
            <span className="font-bold text-white mt-1 block">
              {ghatakas.sroto_dushti_prakara}
            </span>
          </div>

          <div className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25 md:col-span-2">
            <span className="block text-[10px] uppercase font-bold text-violet-300/70">Adhisthana (Primary Site)</span>
            <span className="font-bold text-white mt-1 block">
              {ghatakas.adhisthana}
            </span>
          </div>
        </div>
      </div>

      {/* Shat Kriya Kala 6-Stage Timeline */}
      {kriyaKala && (
        <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-violet-400/20 pb-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Shat Kriya Kala Progression (Sushruta Samhita Sutra 21)
            </h3>
            <span className="text-[11px] text-violet-300 font-semibold">6 Stages of Pathogenesis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stages.map((st, idx) => (
              <div
                key={st.key}
                className="p-4 bg-[#171342] rounded-xl border border-violet-400/25 space-y-2 relative shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-emerald-400">
                    {st.title}
                  </span>
                  <span className="text-[10px] font-mono bg-violet-950 text-violet-300 px-2 py-0.5 rounded border border-violet-400/30">
                    Phase {idx + 1}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-violet-300">
                  {st.subtitle}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed pt-1">
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
