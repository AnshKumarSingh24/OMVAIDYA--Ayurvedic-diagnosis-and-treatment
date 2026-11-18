import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Flame,
  HeartPulse,
  Layers,
  User,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import CyberToggle from '../components/CyberToggle';
import ChamferButton from '../components/ChamferButton';
import SampraptiFlow from '../components/SampraptiFlow';
import AyurGuardSeal from '../components/AyurGuardSeal';
import SourceCitationPanel from '../components/SourceCitationPanel';
import { EmptyState } from '../components/ClinicalPrimitives';
import { api } from '../services/api';

export default function DiagnosticPathology({ activePatientId, patients = [] }) {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('differential');

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

        // 1. Check if active case with analysis exists
        try {
          const caseRes = await api.getPatientCase(activePatient.id);
          if (caseRes?.active_analysis?.analysis) {
            setConsultation(caseRes.active_analysis.analysis);
            setLoading(false);
            return;
          }
        } catch (e) {
          // No case yet
        }

        // 2. Fallback to latest persisted consultation record
        try {
          const latestC = await api.getLatestPatientConsultation(activePatient.id);
          setConsultation(latestC);
        } catch (e) {
          setConsultation(null);
        }
      } catch (err) {
        console.error('Failed to load pathology analysis for patient:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePatientId, activePatient?.id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--gb-mint)] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-[var(--gb-muted)] font-semibold tracking-wide">
          AyurParam Roganirnaya Engine &bull; Compiling Diagnostic Pathology Core...
        </p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="py-12 max-w-3xl mx-auto space-y-6">
        <div className="p-6 bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] flex items-center justify-center mx-auto text-[var(--gb-mint)]">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[var(--gb-white)]">
            No Diagnostic Pathology Synthesized Yet
          </h2>
          <p className="text-sm text-[var(--gb-muted)] max-w-lg mx-auto">
            {activePatient?.full_name ? `${activePatient.full_name} needs` : 'The active case needs'} clinical symptom intake and inquiry in the Case Workspace to derive the Roganirnaya differential and Samprapti Ghatakas.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <ChamferButton
              variant="orange"
              withArrow
              onClick={() => navigate('/case')}
            >
              Open Case Workspace
            </ChamferButton>
            <ChamferButton
              variant="ghost"
              onClick={() => navigate('/overview')}
            >
              View Clinical Overview
            </ChamferButton>
          </div>
        </div>
      </div>
    );
  }

  const probableVyadhi = consultation.probable_vyadhi || 'Unknown Vyadhi';
  const confidence = consultation.confidence_level || 'possible';
  const citationsCount = consultation.citations?.length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gb-mint)] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--gb-mint)]">
              AyurParam 2.9B Roganirnaya Synthesis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--gb-white)] tracking-tight flex items-center gap-3 flex-wrap">
            <span>Diagnostic Pathology</span>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-[var(--gb-mint)]/15 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30 font-sans">
              {probableVyadhi}
            </span>
          </h1>
          <p className="text-xs text-[var(--gb-muted)] mt-1.5 flex items-center gap-3 flex-wrap">
            <span>Patient: <strong className="text-[var(--gb-white)]">{patientData?.full_name || activePatient?.full_name || 'Patient'}</strong> ({patientData?.age || activePatient?.age || 35}y / {patientData?.gender || activePatient?.gender || 'N/A'})</span>
            <span>&bull;</span>
            <span>Prakriti: <strong className="text-[var(--gb-mint)]">{patientData?.prakriti || 'Vata-Pitta'}</strong></span>
            <span>&bull;</span>
            <span>Agni: <strong className="text-[var(--gb-orange)]">{patientData?.agni || 'Mandagni'}</strong></span>
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <ChamferButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/case')}
          >
            Case Workspace
          </ChamferButton>
          <ChamferButton
            variant="orange"
            size="sm"
            withArrow
            onClick={() => navigate('/overview')}
          >
            Clinical Overview
          </ChamferButton>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[var(--gb-border)]/60 pb-3 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--gb-white)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--gb-mint)]" />
            <span>Pathology &amp; Clinical Reasoning Core</span>
          </h3>
          <p className="text-[11px] text-[var(--gb-dim)]">
            Detailed Lakshana scoring, Dosha-Dushya Sammurchhana, and verifiable Brihat Trayi evidence
          </p>
        </div>

        {/* Segmented Cyber Controls */}
        <div className="flex items-center flex-wrap gap-1 p-1 bg-[var(--gb-surface-raised)]/70 border border-[var(--gb-border)] rounded-2xl overflow-x-auto">
          {[
            { id: 'differential', label: 'Differential & Roganirnaya', variant: 'mint' },
            { id: 'samprapti', label: 'Samprapti Ghatakas', variant: 'orange' },
            { id: 'safety', label: 'AyurGuard Seal', variant: 'red' },
            { id: 'citations', label: 'Brihat Trayi Sources', badge: citationsCount, variant: 'violet' }
          ].map((tab) => (
            <CyberToggle
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={tab.variant}
              badge={tab.badge}
              size="sm"
            >
              {tab.label}
            </CyberToggle>
          ))}
        </div>
      </div>

      {/* TAB 1: DIFFERENTIAL & ROGANIRNAYA */}
      {activeTab === 'differential' && (
        <div className="space-y-6">
          {/* Roganirnaya Assessment Banner */}
          <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gb-border)]/60 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[var(--gb-mint)]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)]">
                  Roganirnaya Assessment
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--gb-mint)]/15 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30 uppercase">
                Confidence: {confidence}
              </span>
            </div>

            <p className="text-sm font-medium text-[var(--gb-white)] leading-relaxed font-serif">
              {consultation.roganirnaya_summary}
            </p>

            {/* Clinical AI & Literature Exploration Card */}
            {consultation.clinical_exploration && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--gb-surface-raised)] to-[var(--gb-surface)] border border-[var(--gb-mint)]/40 shadow-lg space-y-3.5 mt-4">
                <div className="flex items-center justify-between border-b border-[var(--gb-border)]/60 pb-2.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--gb-mint)]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--gb-mint)]">
                      AyurParam Clinical AI &amp; Literature Exploration
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--gb-mint)]/10 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30">
                    {consultation.clinical_exploration.clinical_domain}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-[var(--gb-dim)]">
                    Pathophysiological Mechanism &amp; Samprapti Deconstruction
                  </h5>
                  <p className="text-xs text-[var(--gb-muted)] mt-1 leading-relaxed">
                    {consultation.clinical_exploration.pathophysiological_rationale}
                  </p>
                </div>

                {consultation.clinical_exploration.distinguishing_pearls && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gb-orange)]">
                      Diagnostic Distinguishing Pearls &amp; Clinical Mandate
                    </span>
                    {consultation.clinical_exploration.distinguishing_pearls.map((pearl, pIdx) => (
                      <p key={pIdx} className="text-xs text-[var(--gb-white)] flex items-start gap-1.5 leading-snug">
                        <span className="text-[var(--gb-mint)] shrink-0 font-bold">&bull;</span>
                        <span>{pearl}</span>
                      </p>
                    ))}
                  </div>
                )}

                {consultation.clinical_exploration.classical_verse_anchor && (
                  <div className="pt-2 border-t border-[var(--gb-border)]/50 flex items-center gap-2 text-[11px] text-[var(--gb-dim)]">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--gb-orange)] shrink-0" />
                    <span>Treatise Anchor: <strong className="text-[var(--gb-white)]">{consultation.clinical_exploration.classical_verse_anchor}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Uncertainty & Distinguishing Notes */}
            {consultation.uncertainty_notes && consultation.uncertainty_notes.length > 0 && (
              <div className="p-4 rounded-xl bg-[var(--gb-orange)]/10 border border-[var(--gb-orange)]/30 text-xs text-[var(--gb-orange)] space-y-1.5">
                <span className="font-extrabold flex items-center gap-1.5 text-[var(--gb-orange)]">
                  <AlertTriangle className="w-4 h-4 text-[var(--gb-orange)]" />
                  Clinical Distinction &amp; Uncertainty Flag
                </span>
                {consultation.uncertainty_notes.map((note, i) => (
                  <p key={i} className="leading-relaxed font-sans">&bull; {note}</p>
                ))}
              </div>
            )}
          </div>

          {/* Scored Differentials Grid */}
          {consultation.differentials && consultation.differentials.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gb-dim)]">
                Differential Diagnoses Scored by Lakshana Matching
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultation.differentials.map((diff, idx) => {
                  const label = typeof diff === 'object' ? (diff.label || diff.disease_key) : String(diff);
                  const score = typeof diff === 'object' ? diff.score : null;
                  const diffConfidence = typeof diff === 'object' ? diff.confidence : null;
                  const factors = typeof diff === 'object' ? diff.distinguishing_factors : [];

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        idx === 0
                          ? 'border-[var(--gb-mint)] bg-[var(--gb-surface)] shadow-md'
                          : 'border-[var(--gb-border)] bg-[var(--gb-surface-raised)]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-sm font-bold text-[var(--gb-white)]">{label}</h5>
                          {score !== null && score !== undefined && (
                            <span className="text-[11px] text-[var(--gb-dim)]">Score: {score} points</span>
                          )}
                        </div>
                        {diffConfidence && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            diffConfidence === 'more consistent with' || diffConfidence === 'probable'
                              ? 'bg-[var(--gb-mint)] text-[#171342]'
                              : 'bg-[var(--gb-surface)] text-[var(--gb-muted)] border border-[var(--gb-border)]'
                          }`}>
                            {diffConfidence}
                          </span>
                        )}
                      </div>

                      {factors && factors.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--gb-border)]/60 text-xs text-[var(--gb-muted)] space-y-1">
                          {factors.map((df, j) => (
                            <p key={j} className="leading-snug">&bull; {df}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAMPRAPTI GHATAKAS & SHAT KRIYA KALA */}
      {activeTab === 'samprapti' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Dosha', val: consultation.samprapti_ghatakas?.dosha?.join(', ') || 'N/A', icon: Flame },
              { label: 'Dushya', val: consultation.samprapti_ghatakas?.dushya?.join(', ') || 'N/A', icon: HeartPulse },
              { label: 'Agni', val: consultation.samprapti_ghatakas?.agni || 'Mandagni', icon: Flame },
              { label: 'Ama', val: consultation.samprapti_ghatakas?.ama ? 'Present (Sama)' : 'Absent (Nirama)', icon: Activity },
              { label: 'Srotas', val: consultation.samprapti_ghatakas?.srotas?.join(', ') || 'N/A', icon: Layers },
              { label: 'Adhisthana', val: consultation.samprapti_ghatakas?.adhisthana || 'N/A', icon: User }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[var(--gb-dim)] mb-1">
                    <Icon className="w-3.5 h-3.5 text-[var(--gb-mint)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-xs font-bold text-[var(--gb-white)] truncate">
                    {item.val}
                  </p>
                </div>
              );
            })}
          </div>

          {consultation.shat_kriya_kala && (
            <SampraptiFlow stages={consultation.shat_kriya_kala} />
          )}
        </div>
      )}

      {/* TAB 3: AYURGUARD SAFETY SEAL */}
      {activeTab === 'safety' && (
        <AyurGuardSeal
          isSafe={consultation.safety_audit?.is_safe}
          contraindications={consultation.safety_audit?.contraindications || []}
          warnings={consultation.safety_audit?.warnings || []}
          disclaimer={consultation.safety_audit?.disclaimer}
        />
      )}

      {/* TAB 4: BRIHAT TRAYI SOURCES */}
      {activeTab === 'citations' && (
        <SourceCitationPanel
          citations={consultation.citations || []}
          title="Classical Brihat Trayi Source Grounding"
          subtitle="Verifiable verse citations backing the Roganirnaya and Chikitsa formulation"
        />
      )}
    </div>
  );
}

