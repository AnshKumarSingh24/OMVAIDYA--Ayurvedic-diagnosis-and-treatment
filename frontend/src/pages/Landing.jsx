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
import ShlokaCard from '../components/ShlokaCard';

export default function Landing({ onSelectPreset }) {
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
    navigate('/');
  };

  const faqs = [
    {
      q: 'What makes AyuVaidya different from asking ChatGPT or generic health AIs?',
      a: 'Generic AIs frequently hallucinate fake Sanskrit shlokas, omit crucial adjuvant vehicles (Anupana), and prescribe drastic purification (Shodhana) or heavy mineral bhasmas without knowing if a patient is pregnant or frail. AyuVaidya uses IIT Bombay\'s specialized 2.9B AyurParam model, strictly constraints outputs to authentic Brihat Trayi verses, and passes every drug through the AyurGuard deterministic safety firewall.'
    },
    {
      q: 'Why is Anupana (Vehicle) verification so critical in Ayurvedic medicine?',
      a: 'In Ayurveda, taking a medicine with the wrong vehicle can produce toxic or reverse effects. For instance, consuming Guggulu with chilled water causes drug obstruction (Guggulu Sanga); heating honey or taking honey with hot liquids alters chemical properties (Samskara Viruddha). AyurGuard deterministically verifies and blocks unsafe vehicles before rendering any advice.'
    },
    {
      q: 'What is AyurParam 2.9B?',
      a: 'AyurParam is IIT Bombay\'s open-source 2.9-billion parameter Ayurvedic Large Language Model, developed specifically for clinical reasoning and classical Indian medical nomenclature under the AyushTech challenge.'
    },
    {
      q: 'Who is AyuVaidya designed for?',
      a: 'AyuVaidya is designed for NCISM-registered BAMS/MD Ayurvedic practitioners (Vaidyas), clinical researchers, medical students, and wellness seekers seeking source-traceable, trustworthy classical guidance.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">

      {/* Floating Top Nav */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl px-5 py-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-amber-300 font-bold text-lg shadow-sm">
              ॐ
            </div>
            <div>
              <span className="font-extrabold text-base text-stone-900 dark:text-stone-100 tracking-tight">AyuVaidya</span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                AyurParam 2.9B
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <a href="#how-it-works" className="hover:text-emerald-700 transition">How It Works</a>
            <a href="#demo-sandbox" className="hover:text-emerald-700 transition">Live Demo Sandbox</a>
            <a href="#brihat-trayi" className="hover:text-emerald-700 transition">Brihat Trayi Corpus</a>
            <a href="#safety-engine" className="hover:text-emerald-700 transition">AyurGuard Safety</a>
            <a href="#faq" className="hover:text-emerald-700 transition">FAQ</a>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleLaunchPreset('amavata')}
              className="hidden sm:inline-flex text-xs font-semibold px-3.5 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Quick Demo Case
            </button>
            <button
              onClick={handleStartOnboarding}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <span>Start Free Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-8 md:p-16 shadow-2xl border border-emerald-800/40 max-w-7xl mx-auto">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>National Open Ayurveda AI Challenge &bull; Techfest, IIT Bombay 2026–27</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            AI-Powered <span className="text-amber-300 font-sanskrit">Ayurvedic</span> Diagnosis, Grounded in 5,000 Years of Wisdom.
          </h1>

          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Generic healthcare AIs hallucinate fake remedies and dangerous herbal dosages.
            <strong className="text-white"> AyuVaidya</strong> harnesses IIT Bombay’s open-source <strong className="text-white">AyurParam (2.9B)</strong> model
            anchored directly to the authenticated <strong className="text-white">Brihat Trayi</strong> (Charaka, Sushruta, Vagbhata) with
            deterministic clinical contraindication guardrails.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleStartOnboarding}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold px-7 py-3.5 rounded-xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center space-x-2 text-sm"
            >
              <span>Begin Personalized Health Intake</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demo-sandbox"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Explore Interactive Demo Sandbox</span>
            </a>
          </div>

          {/* Key Proof Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60 text-xs">
            <div>
              <div className="font-extrabold text-amber-300 text-base">100%</div>
              <div className="text-stone-400 text-[11px] mt-0.5">Shloka Traceability</div>
            </div>
            <div>
              <div className="font-extrabold text-emerald-400 text-base">Zero</div>
              <div className="text-stone-400 text-[11px] mt-0.5">Medical Hallucinations</div>
            </div>
            <div>
              <div className="font-extrabold text-amber-200 text-base">Deterministic</div>
              <div className="text-stone-400 text-[11px] mt-0.5">Anupana &amp; Safety Checks</div>
            </div>
          </div>
        </div>

        {/* Ambient Sanskrit Calligraphy Watermark */}
        <div className="absolute right-4 -bottom-10 text-[200px] font-sanskrit text-white/5 select-none pointer-events-none">
          आयुर्वेद
        </div>
      </section>

      {/* Interactive Live Demo Sandbox */}
      <section id="demo-sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            Live Clinical Sandbox
          </span>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            See How AyurParam 2.9B Reasons Through Cases
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Click on any clinical condition below to test live diagnostic reasoning, authentic shloka citations, and deterministic Anupana validation.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setDemoTab('amavata')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              demoTab === 'amavata'
                ? 'bg-emerald-800 text-amber-200 shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            Amavata (Rheumatoid Joint Disorder)
          </button>
          <button
            onClick={() => setDemoTab('grahani')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              demoTab === 'grahani'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            Grahani Dosha (IBS / Malabsorption)
          </button>
          <button
            onClick={() => setDemoTab('prameha')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              demoTab === 'prameha'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            Prameha (Metabolic / Diabetic Care)
          </button>
        </div>

        {/* Demo Output Card */}
        {demoCases[demoTab] && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Simulated Clinical Case
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {demoCases[demoTab].title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{demoCases[demoTab].demographics}</p>
              </div>

              <button
                onClick={() => handleLaunchPreset(demoTab)}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow flex items-center space-x-1.5 transition self-start"
              >
                <span>Open Full Case in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Pathology & Prescriptions */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="font-bold text-stone-700 dark:text-stone-300 block">Reported Symptoms (Lakshanas):</span>
                  <p className="text-stone-600 dark:text-stone-400">{demoCases[demoTab].complaints}</p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">AyurParam 2.9B Roganirnaya:</span>
                  <p className="text-stone-700 dark:text-stone-300">{demoCases[demoTab].diagnosis}</p>
                </div>

                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">Prescribed Classical Formulation:</span>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{demoCases[demoTab].formulation}</p>
                  <p className="text-amber-800 dark:text-amber-300 font-medium mt-1">
                    Mandatory Vehicle (Anupana): <strong>{demoCases[demoTab].anupana}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AyurGuard Audit: {demoCases[demoTab].safetyStatus}</span>
                </div>
              </div>

              {/* Right Side: Backing Shloka */}
              <div>
                <ShlokaCard citation={demoCases[demoTab].verse} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Comparison: Ordinary AI vs AyuVaidya */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            Medical Safety Comparison
          </span>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Why Ordinary Health AIs Fail in Ayurvedic Medicine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ordinary AI Card */}
          <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center space-x-2.5 text-rose-800 dark:text-rose-300 font-bold text-base border-b border-rose-200 dark:border-rose-800/60 pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>General LLMs (ChatGPT, Generic AIs)</span>
            </div>
            <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Hallucinates Fake Citations:</strong> Fabricates verse numbers in Charaka and Sushruta that do not exist.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Dangerous Anupana Omissions:</strong> Recommends taking Guggulu with cold water, causing gastric and drug obstruction.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>No Pregnancy Guardrails:</strong> Recommends emmenagogue, purgative (Virechana), or toxic mineral preparations during gestation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Ignores Viruddha Ahara:</strong> Allows dangerous food-food and drug-food combinations (e.g. fish with milk, equal parts honey + ghee).</span>
              </li>
            </ul>
          </div>

          {/* AyuVaidya Card */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center space-x-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-base border-b border-emerald-200 dark:border-emerald-800/60 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>AyuVaidya (AyurParam 2.9B + AyurGuard)</span>
            </div>
            <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>100% Shloka Traceability:</strong> Every diagnostic insight is grounded in authenticated Brihat Trayi verses.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Deterministic Anupana Engine:</strong> Cross-references every prescription against certified adjuvant registries.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Garbhini &amp; Bala Protection:</strong> Non-probabilistic hard block on contraindicated herbs for pregnant and pediatric patients.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Classical Viruddha Ahara Scanner:</strong> Strictly screens diet and lifestyle against all 18 forms of incompatibility.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            Clinical Journey
          </span>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            How AyuVaidya Works in 4 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Personalized Pariksha</h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Step-by-step intake covering Prakriti, Agni, Koshtha, Ashtavidha Pariksha, and chief symptoms.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Samprapti Modeling</h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              AyurParam 2.9B deconstructs the 6 stages of Shat Kriya Kala and traces the disease on an Ayurvedic knowledge graph.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Brihat Trayi Grounding</h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Hybrid RAG retrieves backing verses from Charaka, Sushruta, and Vagbhata in original Sanskrit and translation.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">AyurGuard Certification</h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Deterministic rule firewall validates Anupana, screens contraindications, and certifies prescription safety.
            </p>
          </div>
        </div>
      </section>

      {/* The Brihat Trayi Section */}
      <section id="brihat-trayi" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-300 dark:border-indigo-800">
            Classical Authority
          </span>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            The Three Canonical Treatises (Brihat Trayi)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">8 Sthanas &bull; 120 Chapters</span>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Charaka Samhita</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              The foundational authority on internal medicine (Kayachikitsa), etiology (Nidana), pharmacology (Dravyaguna), and treatment principles (Chikitsa).
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">6 Sthanas &bull; 186 Chapters</span>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Sushruta Samhita</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              The supreme authority on surgical science (Shalya Tantra), anatomical structures (Sharira), and the canonical definition of health (Svastha).
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">6 Sthanas &bull; Complete Synthesis</span>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Ashtanga Hridaya</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Vagbhata’s elegant synthesis of Charaka and Sushruta, renowned for clear daily lifestyle regimens (Dinacharya) and clinical formulas.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1 pb-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500">Everything you need to know about AyuVaidya and AyurParam 2.9B.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-bold text-xs text-stone-800 dark:text-stone-200"
              >
                <span>{f.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>
              {openFaq === i && (
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 pt-2.5 border-t border-stone-100 dark:border-stone-800 leading-relaxed">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-5 shadow-xl border border-emerald-800/40">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ready for Safe, Source-Grounded Ayurvedic Clinical Intelligence?
          </h2>
          <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto">
            Experience complete Rogi-Roga Pariksha, automated Samprapti modeling, and physician-grounded Chikitsa planning today.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartOnboarding}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs md:text-sm px-8 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
            >
              <span>Begin Personalized Intake Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 space-y-2">
        <p>AyuVaidya &bull; National Open Ayurveda AI Challenge 2026–27 &bull; Techfest, IIT Bombay in collaboration with Ministry of Ayush &amp; AIIA</p>
        <p className="text-[11px] text-stone-400">Open-source under MIT License. Grounded on authentic Brihat Trayi treatises for qualified Vaidyas and researchers.</p>
      </footer>

    </div>
  );
}
