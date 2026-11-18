import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Info, Filter } from 'lucide-react';
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';
import { api } from '../services/api';

export default function SafetyAudit() {
  const [formulation, setFormulation] = useState('Simhanada Guggulu');
  const [anupana, setAnupana] = useState('Cold water');
  const [age, setAge] = useState(32);
  const [isPregnant, setIsPregnant] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [viruddhaRules, setViruddhaRules] = useState([]);
  const [ruleCategory, setRuleCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getViruddhaAhara().then(res => setViruddhaRules(res.rules || [])).catch(console.error);
    runAudit();
  }, []);

  const runAudit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifySafety({
        formulation_name: formulation,
        prescribed_anupana: anupana,
        age: Number(age),
        is_pregnant: isPregnant
      });
      setTestResult(res);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 w-full max-w-[1240px] mx-auto min-w-0">
      {/* Header */}
      <div className="bg-[#20194f] border border-orange-500/40 rounded-2xl p-6 shadow-xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
          Zero-Tolerance Clinical Firewall
        </span>
        <h1 className="text-xl font-black text-white">
          AyurGuard Deterministic Clinical Safety &amp; Anupana Validator
        </h1>
        <p className="text-xs text-violet-200/80">
          Enforces non-probabilistic rule checking for Anupana compatibility, Garbhini restrictions, and Viruddha Ahara food toxicity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Live Safety Tester (5 cols) */}
        <div className="lg:col-span-5 bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-white border-b border-violet-400/20 pb-3">
            Interactive Safety Simulator
          </h3>

          <form onSubmit={runAudit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-violet-200 mb-1">Formulation:</label>
              <select
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <option value="Simhanada Guggulu">Simhanada Guggulu (Contains Castor Oil &amp; Guggulu)</option>
                <option value="Chitrakadi Vati">Chitrakadi Vati (Contains Chitraka &amp; Alkalis)</option>
                <option value="Chandraprabha Vati">Chandraprabha Vati (Contains Shilajit &amp; Guggulu)</option>
                <option value="Punarnava Mandur">Punarnava Mandur (Contains Iron Bhasma)</option>
                <option value="Yogaraj Guggulu">Yogaraj Guggulu (Contains Guggulu &amp; Chitraka)</option>
                <option value="Sudarshana Churna">Sudarshana Churna (Bitter antipyretic churna)</option>
                <option value="Avipattikar Churna">Avipattikar Churna (Contains Trivrit &amp; Lavana)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-violet-200 mb-1">Prescribed Anupana (Vehicle):</label>
              <input
                type="text"
                value={anupana}
                onChange={(e) => setAnupana(e.target.value)}
                placeholder="e.g. Warm water, Cold water, Milk, Curd"
                className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-violet-200 mb-1">Patient Age:</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#171342] border border-violet-400/40 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-[#171342] border-rose-400"
                  />
                  <span className="font-bold text-xs">Pregnant (Garbhini)</span>
                </label>
              </div>
            </div>

            <ChamferButton
              variant="orange"
              size="md"
              type="submit"
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? 'Evaluating...' : 'Run AyurGuard Audit'}
            </ChamferButton>
          </form>

          {/* Test Audit Result Box */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              testResult.is_safe
                ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200'
                : 'bg-rose-950/50 border-rose-500 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm">
                {testResult.is_safe ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>APPROVED SAFE</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>REJECTED / CONTRAINDICATED</span>
                  </>
                )}
              </div>

              {testResult.contraindications.length > 0 && (
                <div className="space-y-1 font-bold pt-1">
                  {testResult.contraindications.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-rose-300">
                      <span>&bull;</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {testResult.warnings.length > 0 && (
                <div className="pt-2 border-t border-violet-400/20 text-slate-200 space-y-1">
                  <span className="font-extrabold text-amber-300">Advisories:</span>
                  {testResult.warnings.map((w, i) => (
                    <div key={i}>&bull; {w}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Viruddha Ahara Reference Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-violet-400/20 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                Canonical Incompatible Combinations (Viruddha Ahara)
              </h3>
              <p className="text-xs text-violet-200/80 mt-0.5">
                Strictly filtered to prevent dietary toxicity, channel obstruction, and allergic reactions.
              </p>
            </div>
          </div>

          {/* CyberToggle Filter Row */}
          <div className="flex items-center flex-wrap gap-1 p-1 bg-[#171342] border border-violet-400/30 rounded-2xl">
            {[
              { id: 'all', label: 'All Rules', variant: 'mint' },
              { id: 'viruddha', label: 'Dietary (Viruddha)', variant: 'orange' },
              { id: 'garbhini', label: 'Maternal (Garbhini)', variant: 'red' },
              { id: 'dhatu', label: 'Dhatu Kshaya', variant: 'cyan' },
              { id: 'kala', label: 'Seasonal (Kala)', variant: 'violet' }
            ].map((cat) => (
              <CyberToggle
                key={cat.id}
                active={ruleCategory === cat.id}
                onClick={() => setRuleCategory(cat.id)}
                variant={cat.variant}
                size="sm"
              >
                {cat.label}
              </CyberToggle>
            ))}
          </div>

          <div className="space-y-3">
            {viruddhaRules.map((r, i) => (
              <div
                key={i}
                className="p-4 bg-[#171342] rounded-xl border border-violet-400/25 text-xs space-y-1.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-rose-400 text-sm">
                    {r.pair.join(' + ')}
                  </span>
                  <span className="text-[10px] font-mono bg-violet-950 text-violet-300 px-2.5 py-0.5 rounded border border-violet-400/30">
                    {r.reference}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {r.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
