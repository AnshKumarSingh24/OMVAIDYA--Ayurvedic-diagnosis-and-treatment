import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BookOpen,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Heart,
  Pill,
  Leaf,
  Stethoscope,
  HelpCircle,
  Eye,
  Flame,
  Award
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import DecorativeMemphisBackground from '../components/DecorativeMemphisBackground';
import MetricStrip from '../components/MetricStrip';
import ChamferButton from '../components/ChamferButton';
import SegmentedToggle from '../components/SegmentedToggle';
import CyberToggle from '../components/CyberToggle';
import { ClinicalCard, StatusBadge, EvidenceBadge } from '../components/ClinicalPrimitives';
import ShlokaCard from '../components/ShlokaCard';

export default function Landing({ onSelectPreset, isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [demoTab, setDemoTab] = useState('amavata');

  const demoCases = {
    amavata: {
      title: 'Amavata (Rheumatoid / Inflammatory Joint Disorder)',
      demographics: '42y Female • Vata-Kapha Prakriti • Mandagni',
      complaints: 'Severe morning joint stiffness (> 90 mins), swelling in bilateral knee and wrist joints, feeling of heavy limbs (Gaurava), loss of appetite.',
      diagnosis: 'Amavata with profound Ama Srotorodha in Rasavaha and Asthivaha channels',
      formulation: 'Simhanada Guggulu (2 tablets twice daily)',
      anupana: 'Ushnodaka (Warm water) or Shunthi Kwatha',
      safetyStatus: 'Approved Safe (Non-pregnant adult)',
      verse: {
        shloka_id: 'AH_CHI_21_042',
        treatise: 'Ashtanga Hridaya',
        sthana: 'Chikitsa Sthana',
        adhyaya: 'Amavata Chikitsa (Chapter 21)',
        shloka_number: '42',
        sanskrit_devanagari: 'लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च। विरेचनं स्नेहपानं बस्तयश्चाममारुते॥',
        sanskrit_iast: 'laṅghanaṁ svedanaṁ tiktaṁ dīpanāni kaṭūni ca | virecanaṁ snehapānaṁ vastayaścāmamārute ||',
        english_translation: 'In Amavata, fasting (Langhana), dry sweating (Svedana), bitter and pungent appetizers, purgation, medicated oleation, and basti are indicated.'
      }
    },
    grahani: {
      title: 'Grahani Dosha (Malabsorption & Agnimandya / IBS)',
      demographics: '36y Male • Vata-Pitta Prakriti • Vishamagni',
      complaints: 'Alternating constipation and diarrhea, abdominal bloating after meals, loud gurgling sounds, fatigue, indigestion.',
      diagnosis: 'Grahani Dosha with Samana Vata and Pachaka Pitta derangement in Duodenum',
      formulation: 'Chitrakadi Vati (1 tablet before meals)',
      anupana: 'Takra (Fresh Buttermilk) infused with roasted cumin',
      safetyStatus: 'Approved Safe (Vehicle matched)',
      verse: {
        shloka_id: 'CS_CHI_15_051',
        treatise: 'Charaka Samhita',
        sthana: 'Chikitsa Sthana',
        adhyaya: 'Grahani Dosha Chikitsa (Chapter 15)',
        shloka_number: '51',
        sanskrit_devanagari: 'शान्तेऽग्नौ म्रियते, युक्ते चिरं जीवत्यनामयः। रोगी स्याद्विकृते, मूलमग्निस्तस्मान्निरुच्यते॥',
        sanskrit_iast: 'śānte\'gnau mriyate, yukte ciraṁ jīvatyanāmayaḥ | rogī syādvikṛte, mūlamagnistasmānnirucyate ||',
        english_translation: 'When Agni is extinguished, the person dies; when it is balanced, one lives a long and disease-free life; when deranged, one suffers from diseases. Agni is the root cause of health and longevity.'
      }
    },
    prameha: {
      title: 'Prameha / Madhumeha (Metabolic Derangement / Diabetes)',
      demographics: '55y Female • Kapha Prakriti • Mandagni',
      complaints: 'Turbid, frequent urination (Prabhuta Mutrata), excessive thirst, sweetness in mouth, lethargy, burning sensation in soles.',
      diagnosis: 'Prameha with Kaphapradhana Medo-dushti and Kleda accumulation',
      formulation: 'Chandraprabha Vati (2 tablets twice daily)',
      anupana: 'Warm water or Amalaki Swarasa',
      safetyStatus: 'Approved Safe (Contraindicated in Pregnancy)',
      verse: {
        shloka_id: 'CS_CHI_06_015',
        treatise: 'Charaka Samhita',
        sthana: 'Chikitsa Sthana',
        adhyaya: 'Prameha Chikitsa (Chapter 6)',
        shloka_number: '15',
        sanskrit_devanagari: 'आस्यासुखं स्वप्नसुखं दधीनि ग्राम्योदकानूपरसाः पयांसि। नवान्नपानं गुडवैकृतं च प्रमेहहेतुः कफकृच्च सर्वम्॥',
        sanskrit_iast: 'āsyāsukhaṁ svapnasukhaṁ dadhīni grāmyodakānūparasāḥ payāṁsi | navānnapānaṁ guḍavaikṛtaṁ ca pramehahetuḥ kaphakṛcca sarvam ||',
        english_translation: 'Sedentary habits, excessive daytime sleep, curd, and sugar preparations are primary causes of Prameha.'
      }
    }
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  const handleLaunchPreset = (type) => {
    localStorage.setItem('ayuvaidya_onboarded', 'true');
    if (onSelectPreset) onSelectPreset(type);
    navigate('/case');
  };

  const faqs = [
    {
      q: 'What makes AyuVaidya different from asking generic health AIs?',
      a: 'Generic AIs hallucinate fake Sanskrit shlokas, omit crucial adjuvant vehicles (Anupana), and prescribe drastic purification (Shodhana) or heavy mineral bhasmas without knowing if a patient is pregnant or frail. AyuVaidya uses IIT Bombay\'s specialized 2.9B AyurParam model, strictly constraints outputs to authentic Brihat Trayi verses, and passes every recommendation through the AyurGuard deterministic safety gate.'
    },
    {
      q: 'Why is Anupana (Vehicle) verification so critical in Ayurvedic medicine?',
      a: 'In Ayurveda, taking a medicine with the wrong vehicle can produce toxic or reversed effects. For instance, consuming Guggulu with chilled water causes drug obstruction (Guggulu Sanga); heating honey or taking honey with hot liquids alters chemical properties (Samskara Viruddha). AyurGuard deterministically verifies and blocks unsafe vehicles before rendering any advice.'
    },
    {
      q: 'What is AyurParam 2.9B?',
      a: 'AyurParam is IIT Bombay\'s open-source 2.9-billion parameter Ayurvedic Large Language Model, developed specifically for clinical reasoning and classical Indian medical nomenclature under the AyushTech challenge.'
    },
    {
      q: 'Who is AyuVaidya designed for?',
      a: 'AyuVaidya is designed for NCISM-registered BAMS/MD Ayurvedic practitioners (Vaidyas), clinical researchers, medical students, and wellness seekers looking for source-traceable, trustworthy classical guidance.'
    }
  ];

  const currentCase = demoCases[demoTab];

  return (
    <div className="w-full space-y-16 pb-20">
      
      {/* Floating Top Navigation */}
      <TopNavigation
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      {/* Hero Section with Memphis Background & Layered Waves */}
      <DecorativeMemphisBackground className="pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto text-center space-y-8">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1754]/90 border border-violet-400/40 text-xs font-bold text-violet-200 shadow-lg backdrop-blur-md">
            <span className="text-orange-400 font-mono tracking-widest">:::</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="tracking-wide uppercase">BRIHAT TRAYI CLINICAL AI &times; AYURPARAM 2.9B</span>
          </div>

          {/* Headline with Crisp White + Electric Mint Accent */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Ground your clinical reasoning.
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-400 tracking-tight leading-[1.12]">
              Harmonize the Samprapti.
            </h2>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            IIT Bombay's AyurParam 2.9B LLM anchored to authentic Brihat Trayi verses, multi-factor Lakshana differentiation, and deterministic AyurGuard safety guardrails — united into one calm, source-grounded clinical workspace.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <ChamferButton
              variant="primary"
              size="lg"
              withArrow
              onClick={handleStartOnboarding}
              className="text-sm sm:text-base font-extrabold"
            >
              Personalised Clinical Intake
            </ChamferButton>

            <ChamferButton
              variant="orange"
              size="lg"
              onClick={() => {
                localStorage.setItem('ayuvaidya_onboarded', 'true');
                navigate('/case');
              }}
              className="text-sm sm:text-base font-extrabold"
            >
              Explore Case Workspace
            </ChamferButton>

            <ChamferButton
              variant="ghost"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm sm:text-base font-extrabold"
            >
              &or; Know More
            </ChamferButton>
          </div>

          {/* Metric Strip */}
          <div className="pt-6">
            <MetricStrip />
          </div>

        </div>
      </DecorativeMemphisBackground>

      {/* Interactive Live Demo Sandbox */}
      <section id="demo-sandbox" className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-[#20194f]/95 border border-violet-400/35 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-400/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnostic Sandbox</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Experience Classical Clinical Reasoning</h2>
              <p className="text-xs sm:text-sm text-violet-200/70 mt-1">
                Select a benchmark clinical presentation to test differential Lakshana mapping and Brihat Trayi grounding.
              </p>
            </div>

            {/* Cyber Wing Segmented Toggles (Matching Reference Screenshot) */}
            <div className="flex items-center flex-wrap gap-1 p-1 bg-[#171342] border border-violet-400/30 rounded-2xl">
              {[
                { key: 'amavata', label: 'Amavata (Arthritis)', variant: 'red' },
                { key: 'grahani', label: 'Grahani (IBS / Agni)', variant: 'cyan' },
                { key: 'prameha', label: 'Prameha (Diabetes)', variant: 'orange' }
              ].map((tab) => (
                <CyberToggle
                  key={tab.key}
                  active={demoTab === tab.key}
                  onClick={() => setDemoTab(tab.key)}
                  variant={tab.variant}
                  size="sm"
                >
                  {tab.label}
                </CyberToggle>
              ))}
            </div>
          </div>

          {/* Sandbox Case Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Clinical Presentation & Diagnosis */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#171342]/90 border border-violet-400/25 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">{currentCase.title}</h3>
                  <StatusBadge status="verified" label="AyurParam Verified" />
                </div>
                
                <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-400/20 text-xs text-violet-200 font-medium">
                  <strong>Patient Profile:</strong> {currentCase.demographics}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="font-bold text-slate-100 uppercase tracking-wide text-[11px]">Lakshanas (Reported Symptoms):</div>
                  <p className="leading-relaxed bg-[#110e35] p-3 rounded-xl border border-violet-400/15">
                    {currentCase.complaints}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="font-bold text-emerald-400 uppercase tracking-wide text-[11px]">Algorithmic Samprapti Diagnosis:</div>
                  <p className="font-semibold text-white leading-relaxed bg-[#110e35] p-3 rounded-xl border border-emerald-400/30">
                    {currentCase.diagnosis}
                  </p>
                </div>

                {/* Treatment & Anupana */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-xl p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">Recommended Classical Rx:</div>
                    <div className="text-xs font-black text-white">{currentCase.formulation}</div>
                  </div>
                  <div className="bg-orange-950/40 border border-orange-400/30 rounded-xl p-3.5 space-y-1">
                    <div className="text-[10px] font-bold text-orange-400 uppercase">Mandatory Vehicle (Anupana):</div>
                    <div className="text-xs font-black text-white">{currentCase.anupana}</div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <ChamferButton
                    variant="primary"
                    size="md"
                    withArrow
                    onClick={() => handleLaunchPreset(demoTab)}
                    className="w-full justify-center"
                  >
                    Open Case in Practitioner Workspace
                  </ChamferButton>
                </div>
              </div>
            </div>

            {/* Right Column: Authenticated Shloka Verse */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-200">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Grounded Brihat Trayi Authority (Aptopadesha)</span>
              </div>
              <ShlokaCard verse={currentCase.verse} />
            </div>

          </div>

        </div>
      </section>

      {/* 5-Stage Precision Diagnostic Flow */}
      <section id="how-it-works" className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Pipeline Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How AyuVaidya Bridges Ancient Logic &amp; Modern Safety
          </h2>
          <p className="text-xs sm:text-sm text-violet-200/70">
            A 5-layer deterministic clinical workflow ensuring verifiable Ayurvedic reasoning without AI hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Pariksha Intake',
              desc: 'Structured Ashtavidha Pariksha, Rogi Bala, Agni assessment, and cardinal Lakshana collection.',
              icon: Stethoscope,
              color: 'text-emerald-400',
              border: 'border-emerald-400/40'
            },
            {
              step: '02',
              title: 'Epistemic Grounding',
              desc: 'Tri-Pramana validation: Aptopadesha (texts), Pratyaksha (observation), and Anumana (inference).',
              icon: BookOpen,
              color: 'text-amber-400',
              border: 'border-amber-400/40'
            },
            {
              step: '03',
              title: 'Shat Kriya Kala',
              desc: 'Pathological stage tracing: Sanchaya, Prakopa, Prasara, Sthana Samshraya, Vyakti, and Bheda.',
              icon: Activity,
              color: 'text-violet-400',
              border: 'border-violet-400/40'
            },
            {
              step: '04',
              title: 'AyurParam 2.9B',
              desc: 'Specialized 2.9B LLM trained on classical Sanskrit commentaries and formulations.',
              icon: Cpu,
              color: 'text-sky-400',
              border: 'border-sky-400/40'
            },
            {
              step: '05',
              title: 'AyurGuard Firewall',
              desc: 'Hardcoded deterministic safety rules blocking pregnancy, vehicle, and heavy-metal contraindications.',
              icon: ShieldCheck,
              color: 'text-orange-400',
              border: 'border-orange-400/40'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`bg-[#20194f]/80 border ${item.border} rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200`}
              >
                <div className="text-3xl font-black text-violet-400/20 absolute -top-1 -right-1 font-mono select-none">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-950/70 border border-violet-400/30 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                <p className="text-xs text-violet-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brihat Trayi Classical Grounding Section */}
      <section id="brihat-trayi" className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-[#171342]/95 border border-violet-400/35 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Canonical Corpus Grounding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">The Brihat Trayi Foundation</h2>
            <p className="text-xs sm:text-sm text-violet-200/70">
              Every diagnostic rule and therapeutic suggestion links to specific verses from the Great Triad of Ayurveda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                treatise: 'Charaka Samhita',
                authority: 'Acharya Charaka',
                focus: 'Kayachikitsa (Internal Medicine) & Nidana Sthana',
                shlokas: 'Sutra, Nidana, Chikitsa Sthana',
                quote: 'शान्तेऽग्नौ म्रियते, युक्ते चिरं जीवत्यनामयः (CS.Chi.15.51)',
                tag: 'Primary Internal Medicine'
              },
              {
                treatise: 'Sushruta Samhita',
                authority: 'Acharya Sushruta',
                focus: 'Shalya Tantra (Surgical Logic) & Sharira Sthana',
                shlokas: 'Sutra & Sharira Sthana',
                quote: 'समादोषः समाग्निश्च समधातुमलक्रियः (SS.Su.15.41)',
                tag: 'Surgical & Anatomical'
              },
              {
                treatise: 'Ashtanga Hridaya',
                authority: 'Acharya Vagbhata',
                focus: 'Condensed Clinical Quintessence & Daily Regimen',
                shlokas: 'Sutra, Nidana & Chikitsa Sthana',
                quote: 'रोगाः सर्वेऽपि मन्देऽग्नौ सुतरामुदराणि तु (AH.Ni.12.01)',
                tag: 'Clinical Synthesis'
              }
            ].map((t) => (
              <div
                key={t.treatise}
                className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 space-y-4 shadow-lg hover:border-emerald-400/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-400/30">
                    {t.tag}
                  </span>
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{t.treatise}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{t.authority}</p>
                </div>
                <p className="text-xs text-violet-200/80 leading-relaxed">
                  {t.focus}
                </p>
                <div className="p-3 bg-[#110e35] rounded-xl border border-violet-400/20 text-xs font-sanskrit text-amber-200/90 italic">
                  "{t.quote}"
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AyurGuard Deterministic Safety Gate */}
      <section id="safety-engine" className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#20194f] to-[#120f38] border border-orange-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Deterministic Clinical Safety</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">AyurGuard Safety Gate</h2>
              <p className="text-xs sm:text-sm text-violet-200/70 max-w-xl">
                Independent rule-based firewall that inspects every therapeutic proposal before delivery.
              </p>
            </div>
            <ChamferButton
              variant="orange"
              size="md"
              onClick={() => navigate('/safety')}
            >
              Inspect AyurGuard Rules
            </ChamferButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Garbhini (Pregnancy) Gate</span>
              </div>
              <p className="text-xs text-violet-200/80 leading-relaxed">
                Blocks intense purgatives (Tikshna Virechana), abortifacient herbs (Kasisadi), and high-potency mineral bhasmas.
              </p>
            </div>

            <div className="p-4 bg-orange-950/40 border border-orange-500/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-orange-300 font-extrabold text-xs">
                <Flame className="w-4 h-4 shrink-0" />
                <span>Anupana (Vehicle) Gate</span>
              </div>
              <p className="text-xs text-violet-200/80 leading-relaxed">
                Prevents fatal dietetic incompatibilities like heated honey (Ushna Madhu) or cold water with resinous Guggulu.
              </p>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Dose &amp; Toxicity Guard</span>
              </div>
              <p className="text-xs text-violet-200/80 leading-relaxed">
                Restricts heavy metal purification requirements (Shodhana) and flags excessive usage duration beyond clinical limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Understanding AyuVaidya</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#20194f] border border-violet-400/30 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-white hover:text-emerald-300 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-violet-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs text-violet-200/80 leading-relaxed border-t border-violet-400/15">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 border-t border-violet-400/20 text-xs text-violet-300/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-white">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-sanskrit">
            ॐ
          </div>
          <span>AyuVaidya &bull; National Open Ayurveda AI Challenge 2026–27</span>
        </div>
        <div>
          Anchored in Charaka, Sushruta &amp; Ashtanga Hridaya &bull; Techfest, IIT Bombay
        </div>
      </footer>

    </div>
  );
}
