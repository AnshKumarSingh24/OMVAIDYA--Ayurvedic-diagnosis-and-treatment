import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Activity,
  Heart,
  Feather,
  Wind,
  Droplets,
  Sun,
  AlertTriangle,
  User,
  Check
} from 'lucide-react';
import VaidyaCompanion from '../components/VaidyaCompanion';
import { api } from '../services/api';

export default function Onboarding({ onPatientCreated }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '35',
    gender: 'Female',
    // Prakriti selections
    frame: 'medium',       // slim (Vata), medium (Pitta), broad (Kapha)
    skin: 'warm',          // dry/cold (Vata), warm/sensitive (Pitta), smooth/oily (Kapha)
    energy: 'steady',      // variable/quick (Vata), intense/driven (Pitta), calm/steady (Kapha)
    stress: 'anxious',     // anxiety/worry (Vata), irritability/frustration (Pitta), withdrawal/calm (Kapha)
    // Agni & Gut
    agni: 'Mandagni',      // Mandagni, Tikshnagni, Vishamagni, Samagni
    koshtha: 'Madhyama',   // Mridu, Madhyama, Krura
    season: 'Hemanta (Early Winter)',
    // Safety Flags
    isPregnant: false,
    isLactating: false,
    // Complaints
    symptoms: [],
    customNotes: '',
    duration: '1-3 months'
  });

  const symptomOptions = [
    { id: 'joints', label: 'Morning Joint Stiffness & Pain', dosha: 'Vata-Kapha' },
    { id: 'bloat', label: 'Indigestion, Gas & Post-meal Bloating', dosha: 'Vata-Samana' },
    { id: 'acidity', label: 'Heartburn & Burning Sensation', dosha: 'Pitta' },
    { id: 'skin', label: 'Skin Itching, Eczema or Rashes', dosha: 'Pitta-Kapha' },
    { id: 'fatigue', label: 'Chronic Lethargy & Heavy Limbs (Gaurava)', dosha: 'Kapha-Ama' },
    { id: 'urine', label: 'Frequent Turbid Urination & Thirst', dosha: 'Kapha-Meda' },
    { id: 'cough', label: 'Dry Cough & Breathlessness', dosha: 'Prana Vata' }
  ];

  const handleToggleSymptom = (label) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(label);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter(s => s !== label) : [...prev.symptoms, label]
      };
    });
  };

  // Derive calculated Prakriti
  const calculatePrakriti = () => {
    let v = 0, p = 0, k = 0;
    if (formData.frame === 'slim') v += 2; else if (formData.frame === 'medium') p += 2; else k += 2;
    if (formData.skin === 'dry') v += 2; else if (formData.skin === 'warm') p += 2; else k += 2;
    if (formData.energy === 'variable') v += 2; else if (formData.energy === 'intense') p += 2; else k += 2;
    if (formData.stress === 'anxious') v += 2; else if (formData.stress === 'irritable') p += 2; else k += 2;

    if (v >= p && v >= k && p >= k) return 'Vata-Pitta';
    if (v >= p && v >= k && k >= p) return 'Vata-Kapha';
    if (p >= v && p >= k && v >= k) return 'Pitta-Vata';
    if (p >= v && p >= k && k >= v) return 'Pitta-Kapha';
    if (k >= v && k >= p && p >= v) return 'Kapha-Pitta';
    return 'Vata-Kapha';
  };

  const getCompanionMessage = () => {
    switch (step) {
      case 1:
        return "Namaste! I am your AyuVaidya clinical guide. Let's start with your basic profile so we can calibrate your care.";
      case 2:
        return "Prakriti is your unique bodily constitution decided at birth. Select the traits that describe your natural tendencies!";
      case 3:
        return "Agni is your digestive fire—the root cause of all health and disease in Ayurveda. How does your stomach feel?";
      case 4:
        return "AyurGuard strictly blocks dangerous herbs for pregnant or nursing individuals. Let us know so your safety is guaranteed.";
      case 5:
        return "Tell me what symptoms you are experiencing today. You can select the chips below or type in details.";
      default:
        return "Synthesizing your personalized Ayurvedic care plan...";
    }
  };

  const handleCompleteIntake = async () => {
    setIsSynthesizing(true);

    // Animated synthesis stages
    setTimeout(() => setSynthesisStage(1), 700);
    setTimeout(() => setSynthesisStage(2), 1600);
    setTimeout(() => setSynthesisStage(3), 2500);

    const derivedPrakriti = calculatePrakriti();
    const chiefComplaints = formData.symptoms.length > 0
      ? formData.symptoms
      : [formData.customNotes || 'General health evaluation & joint wellness'];

    if (formData.customNotes && !formData.symptoms.includes(formData.customNotes)) {
      chiefComplaints.push(formData.customNotes);
    }

    try {
      // 1. Create Patient in Database
      const pRes = await api.createPatient({
        full_name: formData.name || 'Patient',
        age: Number(formData.age),
        gender: formData.gender,
        prakriti: derivedPrakriti,
        agni: formData.agni,
        koshtha: formData.koshtha,
        bala: 'Madhyama',
        current_season: formData.season,
        is_pregnant: formData.isPregnant,
        is_lactating: formData.isLactating
      });

      const newId = pRes.patient_id;

      // 2. Run AyurParam 2.9B Analysis & Save Consultation
      await api.analyzeConsultation({
        patient_id: newId,
        patient_name: formData.name || 'Patient',
        age: Number(formData.age),
        gender: formData.gender,
        is_pregnant: formData.isPregnant,
        is_lactating: formData.isLactating,
        prakriti: derivedPrakriti,
        agni: formData.agni,
        koshtha: formData.koshtha,
        bala: 'Madhyama',
        current_season: formData.season,
        chief_complaints: chiefComplaints,
        duration: formData.duration,
        save_to_patient: true
      });

      localStorage.setItem('ayuvaidya_onboarded', 'true');

      setTimeout(() => {
        if (onPatientCreated) onPatientCreated(newId);
        navigate('/');
      }, 3400);

    } catch (err) {
      console.error('Onboarding failed:', err);
      setIsSynthesizing(false);
      alert('Error saving intake: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">

      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
          <button
            onClick={() => navigate('/landing')}
            className="hover:text-emerald-700 flex items-center gap-1 text-[11px]"
          >
            &larr; Return to Landing Page
          </button>
          <span>Step {step} of 5</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Vaidya Companion Message Bubble */}
      <VaidyaCompanion message={getCompanionMessage()} />

      {/* ============================================================ */}
      {/* SYNTHESIZING MODAL / STATE */}
      {/* ============================================================ */}
      {isSynthesizing ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-10 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mx-auto flex items-center justify-center text-3xl animate-bounce">
            🌿
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              AyurParam 2.9B Synthesizing Case...
            </h2>
            <p className="text-xs text-stone-500">
              Please wait while our reasoning engine computes your personalized Ayurvedic care plan.
            </p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto text-left text-xs font-semibold">
            <div className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
              synthesisStage >= 1
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${synthesisStage >= 1 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span>Deconstructing Samprapti &amp; Dosha imbalances</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
              synthesisStage >= 2
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${synthesisStage >= 2 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span>Grounded retrieval from Brihat Trayi treatises</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
              synthesisStage >= 3
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}>
              <CheckCircle2 className={`w-4 h-4 ${synthesisStage >= 3 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span>AyurGuard Anupana &amp; Contraindication certification</span>
            </div>
          </div>
        </div>
      ) : (

        /* ============================================================ */
        /* STEP-BY-STEP QUESTION WIZARD */
        /* ============================================================ */
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

          {/* STEP 1: Basic Demographics */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Section 1
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Welcome! What should we call you?
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Age:</label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Gender:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Prakriti (Mind-Body Constitution) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Section 2
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Discover Your Prakriti (Constitution)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Select the physical traits that best describe your natural baseline.</p>
              </div>

              {/* Physical Frame */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">1. Body Build &amp; Weight:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'slim', label: 'Slender / Hard to gain weight', tag: 'Vata' },
                    { id: 'medium', label: 'Moderate / Athletic build', tag: 'Pitta' },
                    { id: 'broad', label: 'Broad / Heavy bone frame', tag: 'Kapha' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, frame: item.id })}
                      className={`p-3 rounded-xl border text-xs text-left transition ${
                        formData.frame === item.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase text-stone-400">{item.tag}</div>
                      <div>{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin & Thermal Sensitivity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">2. Skin &amp; Temperature Sensitivity:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dry', label: 'Dry, rough / Dislikes cold', tag: 'Vata' },
                    { id: 'warm', label: 'Warm, sensitive / Dislikes heat', tag: 'Pitta' },
                    { id: 'smooth', label: 'Thick, cool / Dislikes damp', tag: 'Kapha' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, skin: item.id })}
                      className={`p-3 rounded-xl border text-xs text-left transition ${
                        formData.skin === item.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase text-stone-400">{item.tag}</div>
                      <div>{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Prakriti Preview */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-amber-900 dark:text-amber-300 font-medium">Calculated Constitutional Prakriti:</span>
                <span className="font-bold text-amber-800 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-lg">
                  {calculatePrakriti()}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Agni (Digestive Fire) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Section 3
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Agni: Your Digestive Power
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Which statement best reflects your stomach and digestion?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'Mandagni',
                    title: 'Mandagni (Sluggish Digestion)',
                    desc: 'Feel heavy after meals, low hunger, slow metabolism, morning tongue coating.',
                    tag: 'Kapha Dominant'
                  },
                  {
                    id: 'Vishamagni',
                    title: 'Vishamagni (Irregular Digestion)',
                    desc: 'Sometimes very hungry, sometimes no appetite; frequent gas, constipation, bloating.',
                    tag: 'Vata Dominant'
                  },
                  {
                    id: 'Tikshnagni',
                    title: 'Tikshnagni (Hyperactive Fire)',
                    desc: 'Intense hunger, gets irritable when delayed, acid reflux, burning sensation.',
                    tag: 'Pitta Dominant'
                  },
                  {
                    id: 'Samagni',
                    title: 'Samagni (Balanced Fire)',
                    desc: 'Hungry at regular intervals, digests meals smoothly without discomfort.',
                    tag: 'Balanced'
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, agni: item.id })}
                    className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                      formData.agni === item.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{item.title}</span>
                      <span className="text-[10px] font-semibold text-stone-400">{item.tag}</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Safety & Season */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Section 4
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  AyurGuard Safety Screening
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">We enforce non-negotiable medical rules to eliminate drug contraindications.</p>
              </div>

              {/* Pregnancy Guardrail Box */}
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-2">
                <span className="font-bold text-rose-900 dark:text-rose-300 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  Maternal &amp; Pregnancy Protection
                </span>
                <label className="flex items-center space-x-2.5 text-xs text-stone-800 dark:text-stone-200 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isPregnant}
                    onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold">I am currently pregnant (Garbhini Avastha)</span>
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 pl-6">
                  If selected, AyurGuard automatically strips and blocks all emmenagogues (e.g. Guggulu, Chitraka) and drastic purges (Virechana).
                </p>
              </div>

              {/* Season Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Current Season (Ritucharya Calibration):
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Hemanta (Early Winter)">Hemanta (Early Winter - Cold, Unctuous)</option>
                  <option value="Shishira (Late Winter)">Shishira (Late Winter - Dry Cold)</option>
                  <option value="Vasanta (Spring)">Vasanta (Spring - Kapha Liquefaction)</option>
                  <option value="Grishma (Summer)">Grishma (Summer - High Pitta / Dryness)</option>
                  <option value="Varsha (Monsoon)">Varsha (Monsoon - Vata Aggravation)</option>
                  <option value="Sharad (Autumn)">Sharad (Autumn - Pitta Aggravation)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: Chief Complaints */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  Section 5
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  What Symptoms Are You Experiencing?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Click any symptoms that apply to you:</p>
              </div>

              {/* Clickable Symptom Chips */}
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map(opt => {
                  const isSelected = formData.symptoms.includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleSymptom(opt.label)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-emerald-800 text-amber-200 border-emerald-900 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Freeform details */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Additional Details / How long have you felt this?
                </label>
                <textarea
                  rows="3"
                  value={formData.customNotes}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="e.g. The morning stiffness takes about an hour to ease; pain is worse when it rains..."
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div></div>}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteIntake}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Case with AyurParam 2.9B</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
