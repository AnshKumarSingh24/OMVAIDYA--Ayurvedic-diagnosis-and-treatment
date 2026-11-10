import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { api } from '../services/api';

export default function SafetyAudit() {
  const [formulation, setFormulation] = useState('Simhanada Guggulu');
  const [anupana, setAnupana] = useState('Cold water');
  const [age, setAge] = useState(32);
  const [isPregnant, setIsPregnant] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [viruddhaRules, setViruddhaRules] = useState([]);
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
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
          Zero-Tolerance Clinical Firewall
        </span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          AyurGuard Deterministic Clinical Safety &amp; Anupana Validator
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Enforces non-probabilistic rule checking for Anupana compatibility, Garbhini restrictions, and Viruddha Ahara food toxicity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Live Safety Tester (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-800 pb-3">
            Interactive Safety Simulator
          </h3>

          <form onSubmit={runAudit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Formulation:</label>
              <select
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Simhanada Guggulu">Simhanada Guggulu (Contains Castor Oil &amp; Guggulu)</option>
                <option value="Chitrakadi Vati">Chitrakadi Vati (Contains Chitraka &amp; Alkalis)</option>
                <option value="Chandraprabha Vati">Chandraprabha Vati (Contains Shilajit &amp; Guggulu)</option>
                <option value="Punarnava Mandur">Punarnava Mandur (Contains Iron Bhasma)</option>
                <option value="Yogaraj Guggulu">Yogaraj Guggulu (Contains Guggulu &amp; Chitraka)</option>
                <option value="Sudarshana Churna">Sudarshana Churna (Bitter antipyretic churna)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Prescribed Anupana (Vehicle):</label>
              <input
                type="text"
                value={anupana}
                onChange={(e) => setAnupana(e.target.value)}
                placeholder="e.g. Warm water, Cold water, Milk, Curd"
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Patient Age:</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-xs">Pregnant (Garbhini)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow transition"
            >
              {loading ? 'Evaluating...' : 'Run AyurGuard Audit'}
            </button>
          </form>

          {/* Test Audit Result Box */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              testResult.is_safe
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-950 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {testResult.is_safe ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>APPROVED SAFE</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>REJECTED / CONTRAINDICATED</span>
                  </>
                )}
              </div>

              {testResult.contraindications.length > 0 && (
                <div className="space-y-1 font-semibold pt-1">
                  {testResult.contraindications.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span>🚫</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {testResult.warnings.length > 0 && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                  <span className="font-bold">Advisories:</span>
                  {testResult.warnings.map((w, i) => (
                    <div key={i}>&bull; {w}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Viruddha Ahara Reference Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Canonical Incompatible Combinations (Viruddha Ahara)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Strictly filtered to prevent dietary toxicity, channel obstruction, and allergic reactions.
            </p>
          </div>

          <div className="space-y-3">
            {viruddhaRules.map((r, i) => (
              <div
                key={i}
                className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 dark:text-rose-400 text-sm">
                    {r.pair.join(' + ')}
                  </span>
                  <span className="text-[10px] font-mono bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                    {r.reference}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
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

