import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PlusCircle,
  Calendar,
  Activity,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../services/api';

export default function Tracker({ activePatientId, patients = [] }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Log Form
  const [severity, setSeverity] = useState(4.0);
  const [agni, setAgni] = useState(4.0);
  const [doshaBalance, setDoshaBalance] = useState(7.5);
  const [notes, setNotes] = useState('');

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    loadTracker();
  }, [activePatientId, activePatient]);

  const loadTracker = async () => {
    if (!activePatient) return;
    setLoading(true);
    try {
      const data = await api.getRecoveryHistory(activePatient.id);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load tracker:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      await api.addRecoveryLog(activePatient.id, {
        symptom_severity_score: Number(severity),
        agni_rating: Number(agni),
        dosha_balance_score: Number(doshaBalance),
        clinical_notes: notes
      });
      setShowAddModal(false);
      setNotes('');
      loadTracker();
    } catch (err) {
      alert('Failed to add recovery log: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-stone-500 font-semibold">Loading Longitudinal Recovery Analytics...</p>
      </div>
    );
  }

  const chartData = history?.timeline || [];

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Clinical Outcome Tracking
          </span>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Patient Recovery &amp; Agni Restoration Analytics
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Patient: <strong className="text-stone-800 dark:text-stone-200">{activePatient?.full_name}</strong> &bull; Total Follow-up Check-ins: {history?.total_checkins || 0}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Follow-up Assessment</span>
        </button>
      </div>

      {/* Recharts Analytics Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Symptom Severity Reduction &amp; Dosha Equilibrium Trend
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">Chronological Progress</span>
        </div>

        {chartData.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-500">
            No recovery logs recorded yet. Click "Record Follow-up Assessment" above to log progress.
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderRadius: '12px',
                    border: '1px solid #44403c',
                    color: '#f5f5f4',
                    fontSize: '11px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="severity"
                  name="Symptom Severity (0-10)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="dosha_balance"
                  name="Dosha Equilibrium (1-10)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="agni"
                  name="Agni Strength (1-5)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Historical Check-in Log Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
          Clinical Progress Logs
        </h3>

        <div className="space-y-3">
          {chartData.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Check-in Date: {log.date}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 mt-1">
                  {log.notes || 'Routine follow-up assessment.'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="px-2.5 py-1 bg-rose-100 text-rose-900 font-semibold rounded-lg text-[11px]">
                  Severity: {log.severity}/10
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-lg text-[11px]">
                  Dosha: {log.dosha_balance}/10
                </span>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-semibold rounded-lg text-[11px]">
                  Agni: {log.agni}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Record Follow-up Assessment
            </h3>

            <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Symptom Severity (0 = None, 10 = Severe): {severity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Dosha Equilibrium Score (1 = High Imbalance, 10 = Samyata): {doshaBalance}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={doshaBalance}
                  onChange={(e) => setDoshaBalance(e.target.value)}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Agni Strength Rating (1 to 5): {agni}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={agni}
                  onChange={(e) => setAgni(e.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Vaidya Follow-up Notes:
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Joint swelling subsided by 40%. Morning stiffness reduced to 30 mins. Patient adhering to warm ginger water pathya."
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-600 dark:text-stone-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

