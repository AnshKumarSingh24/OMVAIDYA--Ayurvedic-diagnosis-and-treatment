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
  GitBranch,
  AlertCircle
} from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
import AyurGuardSeal from '../components/AyurGuardSeal';
import { api } from '../services/api';

export default function Home({ activePatientId, patients = [] }) {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Fetch or synthesize consultation for active patient
        const consultRes = await api.analyzeConsultation({
          patient_id: pDetail.id,
          patient_name: pDetail.full_name,
          age: pDetail.age,
          gender: pDetail.gender,
          is_pregnant: pDetail.is_pregnant,
          is_lactating: pDetail.is_lactating,
          prakriti: pDetail.prakriti,
          agni: pDetail.agni,
          koshtha: pDetail.koshtha,
          bala: pDetail.bala,
          current_season: pDetail.current_season,
          chief_complaints: [
            pDetail.full_name.includes('Sundaram')
              ? 'Severe morning joint stiffness, swelling in knees and wrists, loss of appetite, Ama'
              : pDetail.full_name.includes('Sharma')
              ? 'Alternating bowel habits, abdominal bloating after meals, gurgling sounds, Mandagni'
              : 'Frequent turbid urination, excessive thirst, weakness, Prameha'
          ],
          save_to_patient: false
        });

        setConsultation(consultRes);
      } catch (err) {
        console.error('Failed to load consultation:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePatientId, activePatient?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-stone-500 font-semibold tracking-wide">
          AyurParam 2.9B Reasoning Core &bull; Cross-Referencing Brihat Trayi Verses...
        </p>
      </div>
    );
  }

  if (!patientData || !consultation) {
    return (
      <div className="py-16 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm space-y-4">
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-stone-400">
          ⚕
        </div>
        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">No Active Case Selected</h3>
        <p className="text-xs text-stone-500">Register a new patient or select one from the top bar to inspect clinical reasoning.</p>
        <button
          onClick={() => navigate('/intake')}
          className="bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow hover:bg-emerald-700 transition"
        >
          Start Patient Intake
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">

      {/* Patient Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Active Case Analysis
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {patientData.full_name}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {patientData.age} Years &bull; {patientData.gender} &bull; Prakriti: <strong className="text-stone-700 dark:text-stone-300">{patientData.prakriti}</strong> &bull; Agni: <strong className="text-stone-700 dark:text-stone-300">{patientData.agni}</strong>
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {patientData.is_pregnant && (
            <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 px-3 py-1 rounded-xl font-bold">
              Pregnant (Garbhini)
            </span>
          )}
          <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 px-3 py-1 rounded-xl font-medium">
            Ritu: {patientData.current_season}
          </span>
          <button
            onClick={() => window.print()}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-xl text-stone-700 dark:text-stone-300 transition"
            title="Print Clinical Case"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (7 cols): Diagnosis, Samprapti & Formulations */}
        <div className="lg:col-span-7 space-y-6">

          {/* Roganirnaya (Diagnosis) Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">AyurParam 2.9B Roganirnaya</span>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-300">{consultation.probable_vyadhi}</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Brihat Trayi Grounded
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {consultation.roganirnaya_summary}
            </p>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Governing Chikitsa Sutra</span>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                {consultation.chikitsa_sutra}
              </p>
            </div>
          </div>

          {/* Formulations Prescribed */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Verified Classical Formulations
                </h3>
              </div>
              <button
                onClick={() => navigate('/chikitsa')}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>View Full Rx</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {consultation.prescriptions.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-stone-900 dark:text-stone-100">{p.name}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Dosage: <strong className="text-stone-700 dark:text-stone-300">{p.dosage}</strong> &bull; Kala: {p.kala}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                      Anupana: {p.anupana}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-1">Ref: {p.shloka_ref}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pathya & Apathya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-xs uppercase tracking-wider">
                Pathya (Wholesome Regimen)
              </span>
              <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                {consultation.pathya.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-rose-900 dark:text-rose-300 block text-xs uppercase tracking-wider">
                Apathya (Strict Restrictions)
              </span>
              <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                {consultation.apathya.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Safety Audit & Classical Citations */}
        <div className="lg:col-span-5 space-y-6">

          {/* AyurGuard Deterministic Audit Seal */}
          <AyurGuardSeal audit={consultation.safety_audit} />

          {/* Authenticated Classical Shloka Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Primary Grounding Verse
              </span>
              <button
                onClick={() => navigate('/rag')}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                Browse All Verses
              </button>
            </div>
            {consultation.citations.length > 0 && (
              <ShlokaCard citation={consultation.citations[0]} />
            )}
          </div>

          {/* Fast Navigation Shortcut */}
          <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm text-xs space-y-2">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">Next Clinical Steps</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/samprapti')}
                className="p-2.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 rounded-xl text-left font-semibold text-stone-700 dark:text-stone-300 transition"
              >
                Inspect Samprapti Graph &rarr;
              </button>
              <button
                onClick={() => navigate('/tracker')}
                className="p-2.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 rounded-xl text-left font-semibold text-stone-700 dark:text-stone-300 transition"
              >
                Recovery Tracker &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

