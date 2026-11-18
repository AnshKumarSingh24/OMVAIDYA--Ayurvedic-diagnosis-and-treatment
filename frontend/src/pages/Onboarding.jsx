import React, { useState, useRef } from 'react';
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
import { normalizeClinicalText } from '../utils/normalization';
import VaidyaCompanion from '../components/VaidyaCompanion';
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';
import { api } from '../services/api';
import OmVaidyaIntroSplash from '../components/OmVaidyaIntroSplash';

export default function Onboarding({ onPatientCreated }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState(0);
  const [createdPatientId, setCreatedPatientId] = useState(null);
  const createdIdRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '35',
    gender: 'Female',
    // Prakriti selections
    frame: 'medium',       // slim (Vata), medium (Pitta), broad (Kapha), other
    customFrame: '',
    skin: 'warm',          // dry/cold (Vata), warm/sensitive (Pitta), smooth/oily (Kapha)
    customSkin: '',
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

  // Derive calculated Prakriti with Dosha Score Breakdown
  const calculatePrakritiScores = () => {
    let v = 0, p = 0, k = 0;
    
    // 1. Frame scoring
    if (formData.frame === 'slim') {
      v += 3;
    } else if (formData.frame === 'medium') {
      p += 3;
    } else if (formData.frame === 'broad') {
      k += 3;
    } else if (formData.frame === 'other') {
      const lower = (formData.customFrame || '').toLowerCase();
      if (lower.includes('vata') || lower.includes('fluctuat') || lower.includes('delicate') || lower.includes('asymmetr') || lower.includes('thin')) {
        v += 3;
      } else if (lower.includes('pitta') || lower.includes('muscul') || lower.includes('athletic') || lower.includes('lean')) {
        p += 3;
      } else if (lower.includes('kapha') || lower.includes('heavy') || lower.includes('dense') || lower.includes('stocky')) {
        k += 3;
      } else {
        v += 1; p += 1; k += 1;
      }
    }

    // 2. Skin scoring
    if (formData.skin === 'dry') v += 3;
    else if (formData.skin === 'warm') p += 3;
    else k += 3;

    // 3. Energy & Stress
    if (formData.energy === 'variable') v += 2;
    else if (formData.energy === 'intense') p += 2;
    else k += 2;

    if (formData.stress === 'anxious') v += 2;
    else if (formData.stress === 'irritable') p += 2;
    else k += 2;

    const total = v + p + k || 1;
    const vPct = Math.round((v / total) * 100);
    const pPct = Math.round((p / total) * 100);
    const kPct = Math.max(0, 100 - (vPct + pPct));

    let type = 'Vata-Kapha';
    if (v >= p && v >= k && p >= k) type = 'Vata-Pitta';
    else if (v >= p && v >= k && k >= p) type = 'Vata-Kapha';
    else if (p >= v && p >= k && v >= k) type = 'Pitta-Vata';
    else if (p >= v && p >= k && k >= v) type = 'Pitta-Kapha';
    else if (k >= v && k >= p && p >= v) type = 'Kapha-Pitta';
    else if (k >= v && k >= p && v >= p) type = 'Kapha-Vata';
    else type = 'Tridoshic (Sama)';

    return { type, v, p, k, vPct, pPct, kPct };
  };

  const calculatePrakriti = () => calculatePrakritiScores().type;

  const getCompanionMessage = () => {
    if (formData.gender === 'Male') {
      switch (step) {
        case 1:
          return "Namaste! I am your AyuVaidya clinical guide. Let's record your basic demographic profile so we can calibrate dosage and Rogi Bala.";
        case 2:
          return "Prakriti is your unique bodily constitution established at conception. Select the baseline physical and metabolic traits that describe you.";
        case 3:
          return "Agni is your digestive fire—the root cause of all health and disease in Ayurveda. How does your stomach and digestion typically behave?";
        case 4:
          return "Tell me what symptoms (Lakshanas) you are experiencing today. You can select the chips below or add clinical notes.";
        default:
          return "Synthesizing your personalized Ayurvedic case workspace...";
      }
    }
    switch (step) {
      case 1:
        return "Namaste! I am your AyuVaidya clinical guide. Let's record your basic demographic profile so we can calibrate dosage and Rogi Bala.";
      case 2:
        return "Prakriti is your unique bodily constitution established at conception. Select the baseline physical and metabolic traits that describe you.";
      case 3:
        return "Agni is your digestive fire—the root cause of all health and disease in Ayurveda. How does your stomach and digestion typically behave?";
      case 4:
        return "AyurGuard strictly blocks emmenagogues and toxic herbs for pregnant or nursing individuals. Let us know so your safety is guaranteed.";
      case 5:
        return "Tell me what symptoms (Lakshanas) you are experiencing today. You can select the chips below or add clinical notes.";
      default:
        return "Synthesizing your personalized Ayurvedic case workspace...";
    }
  };

  const getCompanionMood = () => {
    if (step === 2) return 'thoughtful';
    if (formData.gender !== 'Male' && step === 4) return 'thoughtful';
    if ((formData.gender === 'Male' && step === 4) || step === 5) return 'processing';
    return 'calm';
  };

  const handleCompleteIntake = async () => {
    setIsSynthesizing(true);

    // Animated synthesis stages
    setTimeout(() => setSynthesisStage(1), 700);
    setTimeout(() => setSynthesisStage(2), 1600);
    setTimeout(() => setSynthesisStage(3), 2500);

    const derivedPrakriti = calculatePrakriti();
    const cleanNotes = normalizeClinicalText(formData.customNotes);
    const selectedSymptoms = formData.symptoms.map(s => normalizeClinicalText(s)).filter(Boolean);

    // If user provided custom notes (their unlisted condition), prioritize it as primary problem
    let chiefComplaintsText = '';
    if (cleanNotes) {
      chiefComplaintsText = selectedSymptoms.length > 0
        ? `${cleanNotes} (Accompanying signs: ${selectedSymptoms.join(', ')})`
        : cleanNotes;
    } else if (selectedSymptoms.length > 0) {
      chiefComplaintsText = selectedSymptoms.join(', ');
    } else {
      chiefComplaintsText = 'General health evaluation & wellness inquiry';
    }

    try {
      // 1. Create Patient in Database
      const pRes = await api.createPatient({
        full_name: normalizeClinicalText(formData.name) || 'Patient',
        age: Number(formData.age),
        gender: formData.gender,
        prakriti: derivedPrakriti,
        agni: formData.agni,
        koshtha: formData.koshtha,
        bala: 'Madhyama',
        current_season: formData.season,
        is_pregnant: formData.gender === 'Male' ? false : formData.isPregnant,
        is_lactating: formData.gender === 'Male' ? false : formData.isLactating
      });

      const newId = pRes.patient_id;
      setCreatedPatientId(newId);
      createdIdRef.current = newId;

      // 2. Initialize Persistent Active Case Session with Facts (deduplicated)
      const frameDesc = formData.frame === 'other' && formData.customFrame
        ? `Custom Frame: ${formData.customFrame}`
        : `${formData.frame} build`;
      const initialFacts = [
        { category: 'lifestyle', key: 'prakriti_frame_energy', value: `${frameDesc}, ${formData.energy} energy pattern` },
        { category: 'lifestyle', key: 'stress_response', value: formData.stress }
      ];
      if (formData.customFrame) {
        initialFacts.push({ category: 'prakriti', key: 'body_build_morphology', value: formData.customFrame });
      }
      if (cleanNotes) {
        initialFacts.push({
          category: 'symptom',
          key: 'user_described_problem',
          value: cleanNotes,
          confidence: 1.0,
          confirmed_by_clinician: true
        });
      }
      selectedSymptoms.forEach(sym => {
        initialFacts.push({
          category: 'symptom',
          key: sym.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30),
          value: sym,
          confidence: 1.0,
          confirmed_by_clinician: true
        });
      });

      const caseRes = await api.createCase({
        patient_id: newId,
        chief_problem: chiefComplaintsText,
        duration: formData.duration,
        initial_facts: initialFacts
      });

      // 3. Run Initial Analysis Snapshot on Active Case
      if (caseRes && caseRes.id) {
        await api.analyzeCase(caseRes.id);
      }

      localStorage.setItem('ayuvaidya_onboarded', 'true');
      // The OmVaidyaIntroSplash screen persists and advances cleanly via user click or its persist timer

    } catch (err) {
      console.error('Onboarding failed:', err);
      setIsSynthesizing(false);
      alert('Error saving intake: ' + err.message);
    }
  };

  const totalSteps = formData.gender === 'Male' ? 4 : 5;

  const stepsList = formData.gender === 'Male'
    ? [
        { num: 1, title: 'Profile' },
        { num: 2, title: 'Prakriti' },
        { num: 3, title: 'Agni Fire' },
        { num: 4, title: 'Lakshanas' }
      ]
    : [
        { num: 1, title: 'Profile' },
        { num: 2, title: 'Prakriti' },
        { num: 3, title: 'Agni Fire' },
        { num: 4, title: 'AyurGuard' },
        { num: 5, title: 'Lakshanas' }
      ];

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">

      {/* Progress & Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-violet-300">
          <button
            onClick={() => navigate('/landing')}
            className="hover:text-emerald-400 flex items-center gap-1.5 transition"
          >
            &larr; Return to Landing
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-400/30 text-emerald-300">
            Step {step} of {totalSteps} &bull; {stepsList[step - 1].title}
          </span>
        </div>

        {/* Stepper Dots & Progress Bar */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-violet-950/80 rounded-full z-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          {stepsList.map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                s.num === step
                  ? 'bg-emerald-400 text-[#0c1b2d] shadow-[0_0_15px_rgba(74,222,128,0.5)] scale-110'
                  : s.num < step
                  ? 'bg-violet-800 text-emerald-300 cursor-pointer border border-emerald-400/50'
                  : 'bg-[#20194f] text-slate-400 border border-violet-400/30'
              }`}
            >
              {s.num < step ? '✓' : s.num}
            </div>
          ))}
        </div>
      </div>

      {/* Vaidya Companion Message Bubble */}
      <VaidyaCompanion
        message={getCompanionMessage()}
        mood={getCompanionMood()}
      />

      {/* ॐ Vaidya Cinematic Entrance Ceremony Screen */}
      {isSynthesizing ? (
        <OmVaidyaIntroSplash
          patientName={formData.name || 'Patient'}
          prakriti={calculatePrakriti()}
          autoAdvanceSeconds={4.8}
          onComplete={() => {
            const targetId = createdIdRef.current || createdPatientId || 67;
            if (onPatientCreated) onPatientCreated(targetId);
            navigate(`/case/${targetId}`);
          }}
        />
      ) : (

        /* Wizard Card */
        <div className="bg-[#20194f]/95 border border-violet-400/35 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">

          {/* STEP 1: Basic Demographics */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-violet-400/20 pb-3">
                <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                  Section 1 &bull; Identification
                </span>
                <h3 className="text-lg font-black text-white">
                  Welcome! What should we call you?
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-violet-200 mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-violet-200 mb-1">Your Age:</label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-violet-200 mb-1">Gender:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => {
                      const g = e.target.value;
                      setFormData({
                        ...formData,
                        gender: g,
                        isPregnant: g === 'Male' ? false : formData.isPregnant,
                        isLactating: g === 'Male' ? false : formData.isLactating
                      });
                    }}
                    className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
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
              <div className="border-b border-violet-400/20 pb-3">
                <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                  Section 2 &bull; Constitutional Baselines
                </span>
                <h3 className="text-lg font-black text-white">
                  Discover Your Prakriti (Constitution)
                </h3>
                <p className="text-xs text-violet-200/70 mt-0.5">Select the physical traits that best describe your natural baseline.</p>
              </div>

              {/* Physical Frame */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <span>1. Body Build &amp; Frame:</span>
                  </label>
                  {formData.frame === 'other' && (
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                      Custom Specification Active
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 p-2.5 bg-[#171342] border border-violet-400/30 rounded-2xl">
                  {[
                    { id: 'slim', label: 'Slender / Hard to gain weight (Vata)', variant: 'cyan' },
                    { id: 'medium', label: 'Moderate / Athletic build (Pitta)', variant: 'orange' },
                    { id: 'broad', label: 'Broad / Heavy bone frame (Kapha)', variant: 'mint' },
                    { id: 'other', label: 'Other / Custom Body Build...', variant: 'violet' }
                  ].map(item => (
                    <CyberToggle
                      key={item.id}
                      active={formData.frame === item.id}
                      onClick={() => setFormData({ ...formData, frame: item.id })}
                      variant={item.variant}
                      size="sm"
                    >
                      {item.label}
                    </CyberToggle>
                  ))}
                </div>

                {/* Animated Input when "Other" is chosen */}
                {formData.frame === 'other' && (
                  <div className="p-4 bg-gradient-to-r from-purple-950/60 via-[#1c1448] to-purple-950/60 border border-purple-400/40 rounded-2xl space-y-2.5 animate-fade-in shadow-lg">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-purple-200">
                        Describe your natural body frame or build:
                      </label>
                      <span className="text-[10px] text-purple-300/70">Classical Ayurvedic Morphology</span>
                    </div>
                    <input
                      type="text"
                      value={formData.customFrame}
                      onChange={(e) => setFormData({ ...formData, customFrame: e.target.value })}
                      placeholder="e.g. Asymmetrical build, fluctuating weight, lean athletic with delicate bone structure..."
                      className="w-full bg-[#120e36] border border-purple-400/40 rounded-xl p-3 text-xs text-white placeholder:text-violet-400/40 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                    {/* Quick suggestion tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] font-bold text-purple-300">Quick Traits:</span>
                      {[
                        'Fluctuating Weight (Vishama)',
                        'Lean & Muscular (Pitta-Tikshna)',
                        'Dense & Heavy Bone (Sthula)',
                        'Tall & Asymmetrical (Vata-Kala)',
                        'Petite & Delicate (Alpa-Sarira)',
                        'Variable Joint Proportions'
                      ].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            customFrame: prev.customFrame ? `${prev.customFrame}, ${tag}` : tag
                          }))}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800/70 border border-purple-400/40 text-purple-200 hover:text-white transition font-medium"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Skin & Thermal Sensitivity */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-white">2. Skin &amp; Temperature Sensitivity:</label>
                <div className="flex flex-wrap gap-2 p-2.5 bg-[#171342] border border-violet-400/30 rounded-2xl">
                  {[
                    { id: 'dry', label: 'Dry, rough / Dislikes cold (Vata)', variant: 'cyan' },
                    { id: 'warm', label: 'Warm, sensitive / Dislikes heat (Pitta)', variant: 'orange' },
                    { id: 'smooth', label: 'Thick, cool / Dislikes damp (Kapha)', variant: 'mint' }
                  ].map(item => (
                    <CyberToggle
                      key={item.id}
                      active={formData.skin === item.id}
                      onClick={() => setFormData({ ...formData, skin: item.id })}
                      variant={item.variant}
                      size="sm"
                    >
                      {item.label}
                    </CyberToggle>
                  ))}
                </div>
              </div>

              {/* Live Tri-Dosha Prakriti Spectrum & Preview */}
              {(() => {
                const scores = calculatePrakritiScores();
                return (
                  <div className="p-4 bg-gradient-to-br from-violet-950/70 via-[#1f1854] to-purple-950/70 border border-violet-400/40 rounded-2xl space-y-3 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-violet-400/20 pb-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                          Live Constitutional Synthesis
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          Calculated Prakriti: <span className="text-amber-300 font-extrabold text-sm ml-1">{scores.type}</span>
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 self-start sm:self-auto">
                        Brihat Trayi Grounded
                      </span>
                    </div>

                    {/* Tri-Dosha Spectrum Bars */}
                    <div className="space-y-2 pt-1 text-[11px]">
                      {/* Vata */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-cyan-300 flex items-center gap-1">
                            <span>💨 Vata (Movement &bull; Air / Ether)</span>
                          </span>
                          <span className="text-cyan-300 font-mono">{scores.vPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#120d36] rounded-full overflow-hidden border border-cyan-400/20">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500 rounded-full"
                            style={{ width: `${scores.vPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Pitta */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-orange-300 flex items-center gap-1">
                            <span>🔥 Pitta (Metabolism &bull; Fire / Water)</span>
                          </span>
                          <span className="text-orange-300 font-mono">{scores.pPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#120d36] rounded-full overflow-hidden border border-orange-400/20">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-500 rounded-full"
                            style={{ width: `${scores.pPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Kapha */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-emerald-300 flex items-center gap-1">
                            <span>💧 Kapha (Structure &bull; Water / Earth)</span>
                          </span>
                          <span className="text-emerald-300 font-mono">{scores.kPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#120d36] rounded-full overflow-hidden border border-emerald-400/20">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500 rounded-full"
                            style={{ width: `${scores.kPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 3: Agni (Digestive Fire) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-violet-400/20 pb-3">
                <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                  Section 3 &bull; Digestive Intelligence
                </span>
                <h3 className="text-lg font-black text-white">
                  Agni: Your Digestive Power
                </h3>
                <p className="text-xs text-violet-200/70 mt-0.5">Which statement best reflects your stomach and digestion?</p>
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
                        ? 'border-emerald-400 bg-emerald-950/60 text-white font-bold shadow-[0_0_15px_rgba(74,222,128,0.25)]'
                        : 'border-violet-400/25 bg-[#171342] text-slate-300 hover:border-violet-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{item.title}</span>
                      <span className="text-[10px] font-bold text-violet-300">{item.tag}</span>
                    </div>
                    <p className="text-violet-200/80 text-[11px] leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Safety & Season */}
          {formData.gender !== 'Male' && step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-violet-400/20 pb-3">
                <span className="text-[10px] uppercase font-extrabold text-orange-400 tracking-wider">
                  Section 4 &bull; Deterministic Safety
                </span>
                <h3 className="text-lg font-black text-white">
                  AyurGuard Safety Screening
                </h3>
                <p className="text-xs text-violet-200/70 mt-0.5">We enforce non-negotiable medical rules to eliminate drug contraindications.</p>
              </div>

              {/* Pregnancy Guardrail Box */}
              <div className="p-4 bg-rose-950/50 border border-rose-500/40 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-extrabold text-rose-300 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Maternal &amp; Pregnancy Protection
                  </span>
                  <CyberToggle
                    active={formData.isPregnant}
                    onClick={() => setFormData({ ...formData, isPregnant: !formData.isPregnant })}
                    variant="red"
                    size="sm"
                  >
                    {formData.isPregnant ? 'Pregnant (Garbhini): ACTIVE' : 'Not Pregnant: CLEAR'}
                  </CyberToggle>
                </div>
                <p className="text-[11px] text-violet-200/70">
                  When active, AyurGuard automatically strips and blocks all emmenagogues (e.g. Guggulu, Chitraka) and drastic purges (Virechana).
                </p>
              </div>

              {/* Season Selection */}
              <div>
                <label className="block text-xs font-bold text-violet-200 mb-1">
                  Current Season (Ritucharya Calibration):
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
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
          {(step === 5 || (formData.gender === 'Male' && step === 4)) && (
            <div className="space-y-4">
              <div className="border-b border-violet-400/20 pb-3">
                <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                  Section 5 &bull; Clinical Lakshanas
                </span>
                <h3 className="text-lg font-black text-white">
                  What Symptoms Are You Experiencing?
                </h3>
                <p className="text-xs text-violet-200/70 mt-0.5">Click any symptoms that apply to you:</p>
              </div>

              {/* Clickable Symptom Chips with CyberToggle Reference Architecture */}
              <div className="flex flex-wrap gap-1 p-2 bg-[#171342] border border-violet-400/30 rounded-2xl">
                {symptomOptions.map(opt => {
                  const isSelected = formData.symptoms.includes(opt.label);
                  return (
                    <CyberToggle
                      key={opt.id}
                      active={isSelected}
                      onClick={() => handleToggleSymptom(opt.label)}
                      variant={isSelected ? 'mint' : 'cyan'}
                      size="sm"
                    >
                      {opt.label}
                    </CyberToggle>
                  );
                })}
              </div>

              {/* Freeform details / Unlisted Symptoms */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-violet-200">
                    Specific Symptoms, Unlisted Condition, or Detailed Description
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    AyurParam AI Synthesizer
                  </span>
                </div>
                <textarea
                  rows="3"
                  value={formData.customNotes}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="e.g. Severe right-sided migraine with nausea and light sensitivity, shooting sciatica pain down leg, chronic eczema with scaling, kidney stone colic, tremors in hands, etc."
                  className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-violet-400/50"
                />
                <p className="text-[10px] text-violet-300/70">
                  If your condition is not listed in the options above, describe it here in your own words. AyurParam will explore and synthesize the problem, match canonical Brihat Trayi evidence, and dynamically calibrate your case workspace.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-violet-400/20">
            {step > 1 ? (
              <ChamferButton
                variant="ghost"
                size="md"
                onClick={() => setStep(step - 1)}
              >
                &larr; Previous
              </ChamferButton>
            ) : <div />}

            {step < totalSteps ? (
              <ChamferButton
                variant="primary"
                size="md"
                withArrow
                onClick={() => setStep(step + 1)}
              >
                Continue
              </ChamferButton>
            ) : (
              <ChamferButton
                variant="primary"
                size="lg"
                icon={Sparkles}
                onClick={handleCompleteIntake}
              >
                Generate Case with AyurParam 2.9B
              </ChamferButton>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
