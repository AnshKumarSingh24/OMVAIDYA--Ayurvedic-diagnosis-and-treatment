import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Cpu, Database, Save, Check } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Dr. Aarav Nambiar, BAMS, MD (Ayu)',
    ncism_reg: 'NCISM/AYU/2026/84920',
    institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
    specialization: 'Kayachikitsa (Internal Medicine) & Dravyaguna',
    clinic_name: 'AyuVaidya Center for Classical Ayurvedic Care',
    location: 'IIT Bombay Campus & Powai OPD, Mumbai',
    model_engine: 'IIT Bombay AyurParam (2.9B Parameter Open Model)',
    inference_mode: 'Local Quantized vLLM / Ollama (Offline Capable)',
    safety_level: 'Strict Zero-Tolerance (AyurGuard Certified)'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Practitioner Credentials &amp; AI Engine Configuration
        </span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          Vaidya Clinical Profile &amp; AyurParam System Settings
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Configures NCISM clinical credentials, model inference endpoints, and classical treatise indexing bounds.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-sm space-y-6 text-xs">
        
        {/* Clinician Credentials */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>1. NCISM Registered Practitioner Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Clinician Name &amp; Degrees:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">NCISM Registration Number:</label>
              <input
                type="text"
                value={profile.ncism_reg}
                onChange={(e) => setProfile({ ...profile, ncism_reg: e.target.value })}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Institutional Affiliation:</label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Specialization / Department:</label>
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5"
              />
            </div>
          </div>
        </div>

        {/* AI & Knowledge Graph Config */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>2. AyurParam 2.9B &amp; Retrieval Grounding Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Core LLM Architecture:</label>
              <input
                type="text"
                disabled
                value={profile.model_engine}
                className="w-full bg-stone-100 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 font-medium text-stone-600 dark:text-stone-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Inference Execution Mode:</label>
              <input
                type="text"
                value={profile.inference_mode}
                onChange={(e) => setProfile({ ...profile, inference_mode: e.target.value })}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-stone-700 dark:text-stone-300">
              <strong className="text-emerald-900 dark:text-emerald-300 block">Brihat Trayi Grounding Active</strong>
              Strict shloka-level citation verification enabled across Charaka, Sushruta, and Vagbhata. Zero fabricated verse citations permitted.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end">
          <button
            type="submit"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2 text-xs"
          >
            {saved ? <Check className="w-4 h-4 text-amber-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved Successfully!' : 'Save Profile & Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

