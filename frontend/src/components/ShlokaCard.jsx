import React, { useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

export default function ShlokaCard({ citation, verse }) {
  const [copied, setCopied] = useState(false);
  const data = citation || verse;

  if (!data) return null;

  const handleCopy = () => {
    const text = `${data.sanskrit_devanagari}\n"${data.sanskrit_iast}"\nTranslation: ${data.english_translation}\nRef: [${data.treatise} ${data.sthana} ${data.adhyaya} Verse ${data.shloka_number}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#20194f] text-slate-100 rounded-2xl p-5 border border-violet-400/30 shadow-xl space-y-3 transition backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between text-xs border-b border-violet-400/20 pb-2.5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold text-amber-300">
            {data.treatise} &bull; {data.sthana}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] bg-[#171342] text-violet-300 px-2.5 py-0.5 rounded border border-violet-400/30">
            {data.shloka_id}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-violet-950/60 text-violet-300 hover:text-white transition"
            title="Copy classical verse"
            aria-label="Copy verse text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="text-[11px] text-violet-300/80 font-bold">
        {data.adhyaya} (Verse {data.shloka_number})
      </div>

      {/* Sanskrit in Devanagari */}
      <div className="text-base font-sanskrit text-amber-100 leading-relaxed font-semibold bg-[#171342] p-3.5 rounded-xl border border-violet-400/20 shadow-inner">
        {data.sanskrit_devanagari}
      </div>

      {/* Sanskrit in IAST Romanization */}
      <div className="text-xs text-slate-300 italic font-mono bg-[#110e35] p-2.5 rounded-lg border border-violet-400/15">
        "{data.sanskrit_iast}"
      </div>

      {/* English Translation */}
      <div className="text-xs text-slate-200 pt-2 border-t border-violet-400/20 leading-relaxed">
        <span className="font-extrabold text-amber-400 mr-1.5">Classical Translation:</span>
        {data.english_translation}
      </div>
    </div>
  );
}
