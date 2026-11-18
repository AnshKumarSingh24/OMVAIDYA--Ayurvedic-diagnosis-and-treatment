import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

export default function AyurGuardSeal({ audit }) {
  if (!audit) return null;

  const isSafe = audit.is_safe;
  const contraindications = audit.contraindications || audit.contraindications_detected || [];
  const warnings = audit.warnings || [];
  const anupanaValidations = audit.anupana_validations || [];

  return (
    <div className={`
      rounded-2xl p-5 border shadow-xl transition space-y-4 backdrop-blur-xl
      ${isSafe
        ? 'bg-[#20194f] border-emerald-400/40 text-white'
        : 'bg-[#20194f] border-rose-500/50 text-white'
      }
    `}>
      {/* Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-violet-400/20">
        <div className="flex items-center space-x-3">
          {isSafe ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-300 flex items-center justify-center shadow">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-white">
                {isSafe ? 'AyurGuard Certified Safe' : 'AyurGuard Clinical Warning / Contraindicated'}
              </h4>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isSafe ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'}`}>
                Deterministic Audit
              </span>
            </div>
            <p className="text-[11px] text-violet-300/80">
              Evaluated against authentic Anupana, Garbhini, and Viruddha Ahara registries
            </p>
          </div>
        </div>
      </div>

      {/* Contraindications List */}
      {contraindications.length > 0 && (
        <div className="space-y-1.5 bg-rose-950/60 p-3.5 rounded-xl border border-rose-500/40 text-xs text-rose-200">
          <div className="font-black flex items-center gap-1.5 text-rose-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Severe Contraindications Detected:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {contraindications.map((c, i) => (
              <li key={i} className="font-bold">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings & Advisories */}
      {warnings.length > 0 && (
        <div className="space-y-1.5 text-xs text-slate-200 bg-[#171342] p-3 rounded-xl border border-violet-400/20">
          <span className="font-black text-amber-300 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-400" /> Clinical Advisories:
          </span>
          <ul className="list-disc list-inside pl-1 space-y-0.5 text-violet-200/90">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Anupana Validations */}
      {anupanaValidations.length > 0 && (
        <div className="pt-2 border-t border-violet-400/20 text-[11px] text-violet-300/80">
          <span className="font-bold text-white">Vehicle (Anupana) Checks: </span>
          {anupanaValidations.join(' | ')}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-violet-400/70 italic pt-1">
        {audit.disclaimer || 'AYURGUARD NOTICE: Decision support engine for NCISM-registered BAMS/MD Vaidyas.'}
      </p>
    </div>
  );
}
