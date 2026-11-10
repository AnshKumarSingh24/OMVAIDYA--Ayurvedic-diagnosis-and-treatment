import React, { useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

export default function ShlokaCard({ citation }) {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const handleCopy = () => {
    const text = `${citation.sanskrit_devanagari}\n"${citation.sanskrit_iast}"\nTranslation: ${citation.english_translation}\nRef: [${citation.treatise} ${citation.sthana} ${citation.adhyaya} Verse ${citation.shloka_number}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-md space-y-3 transition">
      {/* Header */}
      <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-300">
            {citation.treatise} &bull; {citation.sthana}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
            {citation.shloka_id}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
            title="Copy classical verse"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="text-[11px] text-stone-400 font-medium">
        {citation.adhyaya} (Verse {citation.shloka_number})
      </div>

      {/* Sanskrit in Devanagari */}
      <div className="text-base font-sanskrit text-amber-100 leading-relaxed font-semibold bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
        {citation.sanskrit_devanagari}
      </div>

      {/* Sanskrit in IAST Romanization */}
      <div className="text-xs text-stone-300 italic font-mono bg-stone-950/30 p-2.5 rounded-lg border border-stone-800/40">
        "{citation.sanskrit_iast}"
      </div>

      {/* English Translation */}
      <div className="text-xs text-stone-300 pt-1.5 border-t border-stone-800/70">
        <span className="font-bold text-amber-400/90 mr-1.5">Classical Translation:</span>
        {citation.english_translation}
      </div>
    </div>
  );
}

