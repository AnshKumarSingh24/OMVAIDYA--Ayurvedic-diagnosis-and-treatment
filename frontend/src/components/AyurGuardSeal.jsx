import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

export default function AyurGuardSeal({ audit }) {
  if (!audit) return null;

  const isSafe = audit.is_safe;
  const contraindications = audit.contraindications || audit.contraindications_detected || [];
  const warnings = audit.warnings || [];
  const anupanaValidations = audit.anupana_validations || [];
  const ageFlags = audit.age_pregnancy_flags || [];

  return (
    <div className={`
      rounded-2xl p-5 border shadow-sm transition space-y-3.5
      ${isSafe
        ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
        : 'bg-rose-50/80 border-rose-300 dark:bg-rose-950/30 dark:border-rose-800'
      }
    `}>
      {/* Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-stone-200/60 dark:border-stone-700/60">
        <div className="flex items-center space-x-2.5">
          {isSafe ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {isSafe ? 'AyurGuard Certified Safe' : 'AyurGuard Clinical Warning / Contraindicated'}
              </h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isSafe ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                Deterministic Audit
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Evaluated against authentic Anupana, Garbhini, and Viruddha Ahara registries
            </p>
          </div>
        </div>
      </div>

      {/* Contraindications List */}
      {contraindications.length > 0 && (
        <div className="space-y-1.5 bg-rose-100/70 dark:bg-rose-900/40 p-3 rounded-xl border border-rose-200 dark:border-rose-700 text-xs text-rose-900 dark:text-rose-200">
          <div className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Severe Contraindications Detected:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {contraindications.map((c, i) => (
              <li key={i} className="font-semibold">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings & Advisories */}
      {warnings.length > 0 && (
        <div className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
          <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Clinical Advisories:
          </span>
          <ul className="list-disc list-inside pl-1 space-y-0.5">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Anupana Validations */}
      {anupanaValidations.length > 0 && (
        <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/50 text-[11px] text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-800 dark:text-stone-200">Vehicle (Anupana) Checks: </span>
          {anupanaValidations.join(' | ')}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-stone-400 dark:text-stone-500 italic pt-1">
        {audit.disclaimer || 'AYURGUARD NOTICE: Decision support engine for NCISM-registered BAMS/MD Vaidyas.'}
      </p>
    </div>
  );
}

