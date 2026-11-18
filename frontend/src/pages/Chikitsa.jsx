import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, 
  Printer, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Flame,
  Clock,
  Layers
} from 'lucide-react';
import SourceCitationPanel from '../components/SourceCitationPanel';
import AyurGuardSeal from '../components/AyurGuardSeal';
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';
import { StatusBadge, EmptyState } from '../components/ClinicalPrimitives';
import { api } from '../services/api';

export default function Chikitsa({ activePatientId, patients = [] }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCitations, setShowCitations] = useState(false);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    async function loadRx() {
      if (!activePatient) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let loaded = null;

        // 1. Try active case session first
        try {
          const caseRes = await api.getPatientCase(activePatient.id);
          if (caseRes?.active_analysis?.analysis) {
            loaded = caseRes.active_analysis.analysis;
          }
        } catch (e) {
          // No case yet
        }

        // 2. Try latest consultation
        if (!loaded) {
          try {
            const consult = await api.getLatestPatientConsultation(activePatient.id);
            if (consult) {
              loaded = {
                probable_vyadhi: consult.probable_vyadhi,
                chikitsa_sutra: consult.chikitsa_sutra,
                prescriptions: consult.prescriptions,
                pathya: consult.pathya,
                apathya: consult.apathya,
                citations: consult.citations,
                safety_audit: consult.safety_audit
              };
            }
          } catch (e) {
            // No consultation
          }
        }

        setData(loaded);
      } catch (err) {
        console.error('Failed to load Chikitsa:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRx();
  }, [activePatientId, activePatient?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-violet-300 font-semibold">Formulating Personalized Ayurvedic Therapeutics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 max-w-xl mx-auto space-y-6">
        <EmptyState
          title={`No Treatment Plan for ${activePatient?.full_name || 'Patient'}`}
          description="A clinical case analysis must be generated to formulate personalized therapeutics, approved vehicles (Anupana), and dosage timing."
          actionLabel="Open Active Case Workspace"
          onAction={() => navigate(`/case/${activePatient?.id || 1}`)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 w-full max-w-[1240px] mx-auto min-w-0">
      {/* Header */}
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            Personalized Ayurvedic Therapeutics
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Chikitsa Sutra &amp; Formulation Planner
          </h1>
          <p className="text-xs text-violet-200/80 mt-0.5">
            Patient: <strong className="text-white">{activePatient?.full_name}</strong> &bull; Indication: {data.probable_vyadhi}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ChamferButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/case/${activePatient?.id || 1}`)}
          >
            Case Workspace &rarr;
          </ChamferButton>
          <ChamferButton
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Vaidya Rx
          </ChamferButton>
        </div>
      </div>

      {/* Chikitsa Sutra Card */}
      <div className="bg-[#20194f] border border-amber-400/40 rounded-2xl p-6 shadow-xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
          Governing Classical Chikitsa Sutra
        </span>
        <p className="text-sm font-semibold font-serif text-amber-200 bg-[#171342] p-4 rounded-xl border border-amber-400/30 leading-relaxed">
          {data.chikitsa_sutra}
        </p>
      </div>

      {/* Formulations Prescription Cards */}
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-violet-400/20 pb-3">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-400" />
            <span>Certified Classical Prescriptions</span>
          </h3>
          <CyberToggle
            active={showCitations}
            onClick={() => setShowCitations(!showCitations)}
            variant="violet"
            size="sm"
            icon={BookOpen}
          >
            {showCitations ? 'Hide Citations' : 'View Textual Citations'}
          </CyberToggle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.prescriptions?.map((p, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#171342] rounded-2xl border border-violet-400/25 space-y-3 text-xs shadow-md"
            >
              <div className="flex items-start justify-between gap-2 border-b border-violet-400/20 pb-2.5">
                <div>
                  <h4 className="font-black text-sm text-white">{p.name}</h4>
                  <span className="text-[11px] text-violet-400 font-mono">Ref: {p.shloka_ref}</span>
                </div>
                <StatusBadge 
                  status={p.is_safe ? 'verified' : 'safety_hold'}
                  label={p.is_safe ? 'Safe' : 'Contraindicated'}
                />
              </div>

              <div className="space-y-1.5 text-slate-200">
                <p><span className="font-bold text-violet-300">Dosage: </span>{p.dosage}</p>
                <p><span className="font-bold text-violet-300">Kala (Timing): </span>{p.kala}</p>
                <p>
                  <span className="font-bold text-violet-300">Approved Anupana: </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-400/40 font-bold text-[11px]">
                    {p.anupana}
                  </span>
                </p>
                {p.ingredients && p.ingredients.length > 0 && (
                  <p className="text-[11px] text-violet-300/80 pt-1">
                    <span className="font-bold text-white">Ingredients: </span>
                    {p.ingredients.join(', ')}
                  </p>
                )}
              </div>

              {p.contraindications && p.contraindications.length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-[11px] text-rose-300 space-y-0.5">
                  <span className="font-black block">Contraindications:</span>
                  {p.contraindications.map((c, i) => (
                    <p key={i}>&bull; {c}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pathya & Apathya */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#20194f] border border-emerald-400/30 rounded-2xl p-6 text-xs space-y-3 shadow-xl">
          <h4 className="font-black text-sm text-emerald-400 uppercase tracking-wider">
            Pathya (Wholesome Diet &amp; Regimen)
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-slate-200">
            {data.pathya?.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#20194f] border border-rose-500/30 rounded-2xl p-6 text-xs space-y-3 shadow-xl">
          <h4 className="font-black text-sm text-rose-400 uppercase tracking-wider">
            Apathya (Strict Restrictions &amp; Incompatibilities)
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-rose-300">
            {data.apathya?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* AyurGuard Safety Audit */}
      <AyurGuardSeal audit={data.safety_audit} />

      {/* Dedicated Source Citation Panel */}
      {(showCitations || data.citations?.length > 0) && (
        <SourceCitationPanel
          citations={data.citations || []}
          title="Brihat Trayi Grounding Evidence for this Treatment Plan"
          subtitle="Verifiable classical verses supporting the prescribed formulations and Bheshaja Kala"
        />
      )}
    </div>
  );
}
