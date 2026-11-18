import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Pill,
  BookOpen,
  ShieldCheck,
  User,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
import AyurGuardSeal from '../components/AyurGuardSeal';
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';
import { ClinicalCard, StatusBadge, EmptyState } from '../components/ClinicalPrimitives';
import SourceCitationPanel from '../components/SourceCitationPanel';
import { api } from '../services/api';

export default function Home({ activePatientId, patients = [] }) {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('problem');

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    if (!activePatient) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const pDetail = await api.getPatient(activePatient.id);
        setPatientData(pDetail);

        // 1. First check if an active case with analysis exists
        try {
          const caseRes = await api.getPatientCase(activePatient.id);
          setActiveCase(caseRes);
          if (caseRes?.active_analysis?.analysis) {
            setConsultation(caseRes.active_analysis.analysis);
            setLoading(false);
            return;
          }
        } catch (e) {
          // No case yet, try consultation table
        }

        // 2. Fallback to latest persisted consultation record
        try {
          const latestC = await api.getLatestPatientConsultation(activePatient.id);
          setConsultation(latestC);
        } catch (e) {
          setConsultation(null);
        }
      } catch (err) {
        console.error('Failed to load consultation for patient:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePatientId, activePatient?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-violet-300 font-semibold tracking-wide">
          AyurParam 2.9B Reasoning Core &bull; Retrieving Active Case Ledger...
        </p>
      </div>
    );
  }

  if (!patientData || !consultation) {
    return (
      <div className="py-12 max-w-xl mx-auto space-y-6">
        <EmptyState
          title={`No Active Case Recorded for ${patientData?.full_name || 'Selected Patient'}`}
          description="This patient does not yet have a synthesized clinical case analysis. Open the Active Case Workspace to conduct structured intake inquiry, verify observations, and generate a classical Brihat Trayi treatment plan."
          actionLabel="Open Active Case Workspace"
          onAction={() => navigate(`/case/${activePatient?.id || 1}`)}
        />

        <div className="text-center">
          <button
            onClick={() => navigate('/intake')}
            className="text-xs text-emerald-400 font-bold hover:underline"
          >
            Or Register New Patient Intake &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 w-full max-w-[1240px] mx-auto min-w-0">
      
      {/* Patient Header Banner */}
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Active Case Overview
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {patientData.full_name}
          </h1>
          <p className="text-xs text-violet-200/80">
            {patientData.age} Years &bull; {patientData.gender} &bull; Prakriti: <strong className="text-amber-300">{patientData.prakriti}</strong> &bull; Agni: <strong className="text-emerald-300">{patientData.agni}</strong>
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {patientData.is_pregnant && (
            <span className="bg-rose-950/80 text-rose-300 border border-rose-500/50 px-3 py-1 rounded-xl font-bold">
              Pregnant (Garbhini)
            </span>
          )}
          <span className="bg-[#171342] text-violet-300 border border-violet-400/30 px-3 py-1 rounded-xl font-bold">
            Ritu: {patientData.current_season}
          </span>
          <ChamferButton
            variant="ghost"
            size="sm"
            withArrow
            onClick={() => navigate('/case')}
          >
            Update Analysis
          </ChamferButton>
          <button
            onClick={() => window.print()}
            className="p-2 bg-[#171342] hover:bg-violet-950/50 rounded-xl text-violet-300 border border-violet-400/30 transition"
            title="Print Clinical Case"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 p-2 bg-[#20194f] border border-violet-400/30 rounded-2xl shadow-md">
        <CyberToggle
          active={activeView === 'problem'}
          onClick={() => setActiveView('problem')}
          variant="mint"
          size="sm"
        >
          PROBLEM
        </CyberToggle>
        <CyberToggle
          active={activeView === 'chikitsa'}
          onClick={() => setActiveView('chikitsa')}
          variant="orange"
          size="sm"
        >
          Chikitsa Sutra
        </CyberToggle>
      </div>

      {/* Tab: PROBLEM */}
      {activeView === 'problem' && (
        <div className="space-y-6">

          {/* Roganirnaya (Diagnosis) Card */}
          <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-violet-400/20 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300/70">AyurParam 2.9B Roganirnaya</span>
                <h3 className="text-lg font-black text-white">{consultation.probable_vyadhi}</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Brihat Trayi Grounded
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-serif">
              {consultation.roganirnaya_summary}
            </p>

            {/* Confidence Level */}
            {consultation.confidence_level && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300/70">Confidence:</span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 rounded-lg">
                  {consultation.confidence_level}
                </span>
              </div>
            )}

            {/* Differentials */}
            {consultation.differentials?.length > 0 && (
              <div className="pt-2 border-t border-violet-400/20 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">Differential Diagnoses</span>
                <div className="flex flex-wrap gap-2">
                  {consultation.differentials.map((d, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-950/50 text-amber-200 border border-amber-400/30 font-semibold">
                      {typeof d === 'object' ? (d.label || d.disease_key || JSON.stringify(d)) : String(d)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clinical AI & Literature Exploration Insights */}
          {consultation.clinical_exploration && (
            <div className="bg-[#20194f] border border-emerald-400/30 rounded-2xl p-6 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-violet-400/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Clinical AI &amp; Classical Literature Exploration
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                  {consultation.clinical_exploration.clinical_domain}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300/70 block">
                  Etiological Trigger &amp; Pathophysiological Mechanism
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {consultation.clinical_exploration.pathophysiological_rationale}
                </p>
              </div>

              {consultation.clinical_exploration.distinguishing_pearls && (
                <div className="pt-2 border-t border-violet-400/20 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                    Diagnostic Distinguishing Pearls
                  </span>
                  {consultation.clinical_exploration.distinguishing_pearls.map((pearl, pIdx) => (
                    <p key={pIdx} className="text-xs text-slate-200 flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-400 shrink-0 font-bold">&bull;</span>
                      <span>{pearl}</span>
                    </p>
                  ))}
                </div>
              )}

              {consultation.clinical_exploration.classical_verse_anchor && (
                <div className="pt-2 border-t border-violet-400/20 flex items-center gap-2 text-[11px] text-violet-300/70">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Treatise Anchor: <strong className="text-white">{consultation.clinical_exploration.classical_verse_anchor}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Primary Grounding Verse */}
          {consultation.citations?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase tracking-wider text-violet-300/70">
                  Primary Grounding Verse
                </span>
                <button
                  onClick={() => navigate('/rag')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Browse All Verses
                </button>
              </div>
              <ShlokaCard citation={consultation.citations[0]} />
            </div>
          )}

          {/* AyurGuard Safety Seal */}
          <AyurGuardSeal audit={consultation.safety_audit} />

        </div>
      )}

      {/* Tab: Chikitsa Sutra & Planner */}
      {activeView === 'chikitsa' && (
        <div className="space-y-6">

          {/* Prescribed Classical Formulations */}
          <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-violet-400/20 pb-3">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  Prescribed Classical Formulations
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {consultation.prescriptions?.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#171342] rounded-xl border border-violet-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-black text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-violet-300 mt-0.5">
                      Dosage: <strong className="text-emerald-400">{p.dosage}</strong> &bull; Kala: {p.kala}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-[11px] bg-amber-950/70 text-amber-300 border border-amber-400/40">
                      Anupana: {p.anupana}
                    </span>
                    <div className="text-[10px] text-violet-400/70 mt-1">Ref: {p.shloka_ref}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pathya & Apathya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#20194f] border border-emerald-400/30 rounded-2xl text-xs space-y-2 shadow-lg">
              <span className="font-black text-emerald-400 block text-xs uppercase tracking-wider">
                Pathya (Wholesome Diet &amp; Regimen)
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {consultation.pathya?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#20194f] border border-rose-500/30 rounded-2xl text-xs space-y-2 shadow-lg">
              <span className="font-black text-rose-400 block text-xs uppercase tracking-wider">
                Apathya (Strict Restrictions)
              </span>
              <ul className="list-disc list-inside space-y-1 text-rose-300">
                {consultation.apathya?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Brihat Trayi Grounding Evidence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs uppercase tracking-wider text-violet-300/70">
                Brihat Trayi Grounding Evidence
              </span>
              <button
                onClick={() => navigate('/rag')}
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                Browse All Verses
              </button>
            </div>
            {consultation.citations?.length > 0 ? (
              <SourceCitationPanel citations={consultation.citations} />
            ) : (
              <p className="text-xs text-violet-300/60 italic">No classical citations available.</p>
            )}
          </div>

          {/* Clinical AI & Literature Exploration Insights */}
          {consultation.clinical_exploration && (
            <div className="bg-[#20194f] border border-emerald-400/30 rounded-2xl p-6 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-violet-400/20 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Clinical AI &amp; Classical Literature Exploration
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                  {consultation.clinical_exploration.clinical_domain}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300/70 block">
                  Etiological Trigger &amp; Pathophysiological Mechanism
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {consultation.clinical_exploration.pathophysiological_rationale}
                </p>
              </div>

              {consultation.clinical_exploration.distinguishing_pearls && (
                <div className="pt-2 border-t border-violet-400/20 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                    Diagnostic Distinguishing Pearls
                  </span>
                  {consultation.clinical_exploration.distinguishing_pearls.map((pearl, pIdx) => (
                    <p key={pIdx} className="text-xs text-slate-200 flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-400 shrink-0 font-bold">&bull;</span>
                      <span>{pearl}</span>
                    </p>
                  ))}
                </div>
              )}

              {consultation.clinical_exploration.classical_verse_anchor && (
                <div className="pt-2 border-t border-violet-400/20 flex items-center gap-2 text-[11px] text-violet-300/70">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Treatise Anchor: <strong className="text-white">{consultation.clinical_exploration.classical_verse_anchor}</strong></span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
