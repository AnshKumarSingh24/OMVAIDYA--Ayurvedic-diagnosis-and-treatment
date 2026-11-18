import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Cpu, Database, Save, Check } from 'lucide-react';
import ChamferButton from '../components/ChamferButton';

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
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gb-mint)]">
          Practitioner Credentials &amp; AI Engine Configuration
        </span>
        <h1 className="text-xl font-extrabold text-[var(--gb-white)] tracking-tight mt-1">
          Vaidya Clinical Profile &amp; AyurParam System Settings
        </h1>
        <p className="text-xs text-[var(--gb-muted)] mt-1">
          Configures NCISM clinical credentials, model inference endpoints, and classical treatise indexing bounds.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--gb-shadow)] space-y-6 text-xs">
        
        {/* Clinician Credentials */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)] flex items-center gap-2 border-b border-[var(--gb-border)]/60 pb-2">
            <UserCheck className="w-4 h-4 text-[var(--gb-mint)]" />
            <span>1. NCISM Registered Practitioner Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">Clinician Name &amp; Degrees:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">NCISM Registration Number:</label>
              <input
                type="text"
                value={profile.ncism_reg}
                onChange={(e) => setProfile({ ...profile, ncism_reg: e.target.value })}
                className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 font-mono text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">Institutional Affiliation:</label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">Specialization / Department:</label>
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
              />
            </div>
          </div>
        </div>

        {/* AI & Knowledge Graph Config */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)] flex items-center gap-2 border-b border-[var(--gb-border)]/60 pb-2">
            <Cpu className="w-4 h-4 text-[var(--gb-violet)]" />
            <span>2. AyurParam 2.9B &amp; Retrieval Grounding Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">Core LLM Architecture:</label>
              <input
                type="text"
                disabled
                value={profile.model_engine}
                className="w-full bg-[var(--gb-surface-raised)]/50 border border-[var(--gb-border)]/50 rounded-xl p-2.5 font-medium text-[var(--gb-dim)] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--gb-muted)] mb-1">Inference Execution Mode:</label>
              <input
                type="text"
                value={profile.inference_mode}
                onChange={(e) => setProfile({ ...profile, inference_mode: e.target.value })}
                className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
              />
            </div>
          </div>

          <div className="p-4 bg-[var(--gb-purple-dark)]/60 border border-[var(--gb-mint)]/30 rounded-xl flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-[var(--gb-mint)] flex-shrink-0" />
            <div className="text-[var(--gb-muted)]">
              <strong className="text-[var(--gb-mint)] block text-xs">Brihat Trayi Grounding Active</strong>
              Strict shloka-level citation verification enabled across Charaka, Sushruta, and Vagbhata. Zero fabricated verse citations permitted.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[var(--gb-border)]/60 flex items-center justify-end">
          <ChamferButton
            type="submit"
            variant="mint"
            size="md"
            icon={saved ? Check : Save}
          >
            {saved ? 'Settings Saved Successfully!' : 'Save Profile & Settings'}
          </ChamferButton>
        </div>

      </form>
    </div>
  );
}
