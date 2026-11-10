import React, { useState, useEffect } from 'react';
import { Pill, Printer, BookOpen, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
import AyurGuardSeal from '../components/AyurGuardSeal';
import { api } from '../services/api';

export default function Chikitsa({ activePatientId, patients = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    async function loadRx() {
      setLoading(true);
      try {
        const complaints = [
          activePatient?.full_name?.includes('Sharma')
            ? 'Grahani bloating indigestion loose stools'
            : activePatient?.full_name?.includes('Deshmukh')
            ? 'Prameha frequent urination diabetes thirst'
            : 'Amavata joint swelling stiffness severe morning pain'
        ];

        const res = await api.analyzeConsultation({
          patient_name: activePatient?.full_name || 'Patient',
          age: activePatient?.age || 40,
          gender: activePatient?.gender || 'Female',
          prakriti: activePatient?.prakriti || 'Vata-Kapha',
          agni: activePatient?.agni || 'Mandagni',
          koshtha: activePatient?.koshtha || 'Madhyama',
          chief_complaints: complaints
        });

        setData(res);
      } catch (err) {
        console.error('Failed to load Chikitsa:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRx();
  }, [activePatientId, activePatient]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-stone-500 font-semibold">Formulating Personalized Ayurvedic Therapeutics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Personalized Therapeutics
          </span>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Chikitsa Sutra &amp; Formulation Prescription Planner
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Patient: <strong className="text-stone-800 dark:text-stone-200">{activePatient?.full_name}</strong> &bull; Indication: {data?.probable_vyadhi}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Vaidya Rx Sheet</span>
        </button>
      </div>

      {/* Chikitsa Sutra Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
          Governing Classical Chikitsa Sutra
        </span>
        <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 leading-relaxed">
          {data?.chikitsa_sutra}
        </p>
      </div>

      {/* Formulations Prescription Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>Prescribed Classical Formulations (With Verified Anupana)</span>
        </h3>

        <div className="space-y-3">
          {data?.prescriptions.map((p, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{p.name}</h4>
                  <span className="text-[11px] text-stone-500">Ref: {p.shloka_ref}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold rounded-lg text-[11px]">
                    Anupana: {p.anupana}
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px]">
                    {p.is_safe ? 'Safe' : 'Warning'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-stone-600 dark:text-stone-300">
                <div><strong>Dosage:</strong> {p.dosage}</div>
                <div><strong>Kala (Timing):</strong> {p.kala}</div>
                <div><strong>Key Herbs:</strong> {p.ingredients?.join(', ') || 'Classical compound'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pathya & Apathya */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-xs space-y-3">
          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
            Pathya (Wholesome Diet &amp; Regimen)
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300">
            {data?.pathya.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 text-xs space-y-3">
          <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300 uppercase tracking-wider">
            Apathya (Strict Restrictions &amp; Incompatibilities)
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300">
            {data?.apathya.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* AyurGuard Safety Audit */}
      <AyurGuardSeal audit={data?.safety_audit} />

      {/* Backing Classical Shlokas */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Authenticated Grounding Verses (Brihat Trayi)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.citations.map((c, i) => (
            <ShlokaCard key={i} citation={c} />
          ))}
        </div>
      </div>

    </div>
  );
}

