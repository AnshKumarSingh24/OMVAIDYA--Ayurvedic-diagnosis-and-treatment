import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, BookOpen, Activity, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Landing({ onSelectPreset }) {
  const navigate = useNavigate();

  const handlePreset = (type) => {
    if (onSelectPreset) onSelectPreset(type);
    navigate('/');
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-8 md:p-14 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Open Ayurveda AI Challenge 2026–27 &bull; Techfest, IIT Bombay</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Source-Grounded <span className="text-amber-300 font-sanskrit">Ayurvedic</span> Clinical AI
          </h1>

          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Bridging authentic <strong className="text-white">Brihat Trayi</strong> classical wisdom (Charaka, Sushruta, Vagbhata)
            with IIT Bombay’s open-source <strong className="text-white">AyurParam (2.9B)</strong> model.
            Delivering automated <em>Samprapti</em> pathology modeling, personalized <em>Chikitsa</em> planning, and zero-hallucination safety guardrails for qualified Vaidyas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/intake')}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-xl transition shadow-lg flex items-center space-x-2 text-xs md:text-sm"
            >
              <span>Begin Patient Intake Pariksha</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl transition text-xs md:text-sm"
            >
              Open Active Dashboard
            </button>
          </div>
        </div>

        {/* Background Sanskrit Watermark */}
        <div className="absolute right-6 -bottom-10 text-[180px] font-sanskrit text-white/5 select-none pointer-events-none">
          आयुर्वेद
        </div>
      </section>

      {/* Quick Launch Clinical Presets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Interactive Clinical Test Cases
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Select an authenticated test case to immediately inspect AyurParam’s Roganirnaya, Samprapti deconstruction, and AyurGuard audit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1: Amavata */}
          <div
            onClick={() => handlePreset('amavata')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Rheumatoid Pathology
              </span>
              <span className="text-xs text-stone-400">42y &bull; Female</span>
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 transition">
              Amavata Case
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
              Severe morning joint stiffness (&gt; 90 mins), migratory joint swelling, loss of appetite (Aruchi), and profound Ama.
            </p>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
              <span>Grounding: Ashtanga Hridaya Chi 21</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Preset 2: Grahani */}
          <div
            onClick={() => handlePreset('grahani')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Digestive &amp; IBS
              </span>
              <span className="text-xs text-stone-400">36y &bull; Male</span>
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-700 transition">
              Grahani Dosha Case
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
              Alternating bowel habits, post-meal bloating, gurgling sounds, Mandagni with impaired Samana Vata.
            </p>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center justify-between">
              <span>Grounding: Charaka Samhita Chi 15</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Preset 3: Prameha */}
          <div
            onClick={() => handlePreset('prameha')}
            className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-indigo-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Metabolic Syndrome
              </span>
              <span className="text-xs text-stone-400">55y &bull; Female</span>
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-indigo-700 transition">
              Prameha / Madhumeha Case
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
              Turbid frequent urination (Prabhuta Mutrata), excessive thirst, Medo-dushti, and Kaphapradhana pathology.
            </p>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-400 flex items-center justify-between">
              <span>Grounding: Charaka Samhita Chi 6</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Triad of Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Shloka-Level Traceability</h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Every clinical recommendation, formulation, and pathology stage maps to authentic Sanskrit verses in Charaka, Sushruta, and Vagbhata.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Automated Samprapti Modeler</h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Deconstructs the disease through the 6 stages of Shat Kriya Kala and maps Dosha-Dushya-Srotas interactions on an Ayurvedic knowledge graph.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">AyurGuard Safety Firewall</h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Deterministic validation verifying Anupana (vehicle) safety, Garbhini (pregnancy) restrictions, and Viruddha Ahara food incompatibilities.
          </p>
        </div>
      </section>

    </div>
  );
}

