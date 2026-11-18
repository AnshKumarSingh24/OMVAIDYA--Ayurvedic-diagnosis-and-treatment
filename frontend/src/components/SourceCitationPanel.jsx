import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { ClinicalCard, EvidenceBadge } from './ClinicalPrimitives';
import CyberToggle from './CyberToggle';

export default function SourceCitationPanel({ 
  citations = [], 
  title = "Canonical Brihat Trayi Evidence Base",
  subtitle = "Direct verse-level citations verified against Charaka, Sushruta, and Ashtanga Hridaya",
  className = ""
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(citations[0]?.shloka_id || null);
  const [filterTreatise, setFilterTreatise] = useState('All');

  const handleCopy = (citation) => {
    const text = `${citation.sanskrit_devanagari}\n${citation.sanskrit_iast}\n-- ${citation.treatise}, ${citation.sthana}, ${citation.adhyaya}, Verse ${citation.shloka_number} [${citation.shloka_id}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(citation.shloka_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCitations = filterTreatise === 'All'
    ? citations
    : citations.filter(c => c && c.treatise && c.treatise.toLowerCase().includes(filterTreatise.toLowerCase()));

  if (!citations || citations.length === 0) {
    return (
      <ClinicalCard
        title={title}
        subtitle={subtitle}
        icon={BookOpen}
        className={className}
      >
        <p className="text-xs text-violet-300/70 italic text-center py-6">
          No classical citations linked to this view yet. Run clinical case analysis to retrieve verified shlokas.
        </p>
      </ClinicalCard>
    );
  }

  return (
    <ClinicalCard
      title={title}
      subtitle={subtitle}
      icon={BookOpen}
      badge={
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-400/40">
          {citations.length} Canonical Sources
        </span>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Treatise CyberToggle Filters */}
        <div className="flex items-center flex-wrap gap-1 p-1 bg-[#171342] border border-violet-400/30 rounded-2xl">
          {[
            { id: 'All', label: `All Sources (${citations.length})`, variant: 'mint' },
            { id: 'Charaka', label: 'Charaka Samhita', variant: 'orange' },
            { id: 'Sushruta', label: 'Sushruta Samhita', variant: 'cyan' },
            { id: 'Ashtanga', label: 'Ashtanga Hridaya', variant: 'violet' }
          ].map((t) => (
            <CyberToggle
              key={t.id}
              active={filterTreatise === t.id}
              onClick={() => setFilterTreatise(t.id)}
              variant={t.variant}
              size="sm"
            >
              {t.label}
            </CyberToggle>
          ))}
        </div>

        {/* Citations List */}
        <div className="space-y-3">
          {filteredCitations.map((c) => {
            const isExpanded = expandedId === c.shloka_id;
            const isCopied = copiedId === c.shloka_id;

            return (
              <div
                key={c.shloka_id}
                className="border border-violet-400/30 rounded-2xl overflow-hidden bg-[#171342] transition-all shadow-md"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : c.shloka_id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-violet-950/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shrink-0">
                      {c.shloka_id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {c.treatise} &bull; {c.sthana}
                      </h4>
                      <p className="text-[11px] text-violet-300/80 truncate">
                        {c.adhyaya}, Verse {c.shloka_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Authentic
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-violet-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-violet-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-violet-400/20 bg-[#120f38] space-y-3">
                    {/* Devanagari Sanskrit */}
                    <div className="p-3.5 rounded-xl bg-[#171342] border border-amber-400/30 shadow-inner">
                      <p className="font-sanskrit text-sm sm:text-base text-amber-200 font-semibold leading-relaxed">
                        {c.sanskrit_devanagari}
                      </p>
                      {c.sanskrit_iast && (
                        <p className="text-xs text-slate-300 italic mt-1.5 font-serif">
                          "{c.sanskrit_iast}"
                        </p>
                      )}
                    </div>

                    {/* Translation */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                        Classical Translation
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {c.english_translation}
                      </p>
                      {c.hindi_translation && (
                        <p className="text-xs text-violet-200/90 font-sanskrit mt-1.5 border-t border-violet-400/20 pt-1.5">
                          {c.hindi_translation}
                        </p>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-violet-400/20">
                      <EvidenceBadge level="aptopadesha" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(c);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-white font-bold px-3 py-1.5 rounded-lg hover:bg-violet-900/50 transition"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied Shloka</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Verse</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ClinicalCard>
  );
}
