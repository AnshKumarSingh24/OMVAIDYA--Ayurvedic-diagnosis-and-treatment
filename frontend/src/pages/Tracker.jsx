import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PlusCircle,
  Calendar,
  Activity,
  Flame,
  CheckCircle2,
  X
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
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';

export default function Tracker({ activePatientId, patients = [] }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Metric curve toggles
  const [showSeverity, setShowSeverity] = useState(true);
  const [showDosha, setShowDosha] = useState(true);
  const [showAgni, setShowAgni] = useState(true);

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
        <div className="animate-spin w-8 h-8 border-4 border-[var(--gb-mint)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-[var(--gb-dim)] font-semibold uppercase tracking-wider">
          Loading Longitudinal Recovery Analytics...
        </p>
      </div>
    );
  }

  const chartData = history?.timeline || [];

  return (
    <div className="space-y-6 py-4">
      {/* Header Banner */}
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--gb-mint)]/10 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3 h-3" />
            <span>Clinical Outcome Tracking</span>
          </div>
          <h1 className="text-xl font-extrabold text-[var(--gb-white)] tracking-tight">
            Patient Recovery &amp; Agni Restoration Analytics
          </h1>
          <p className="text-xs text-[var(--gb-muted)] mt-1">
            Patient: <strong className="text-[var(--gb-white)] font-semibold">{activePatient?.full_name || 'Active Case'}</strong> &bull; Total Follow-up Check-ins: <span className="text-[var(--gb-mint)] font-bold">{history?.total_checkins || 0}</span>
          </p>
        </div>

        <ChamferButton
          variant="mint"
          size="sm"
          icon={PlusCircle}
          onClick={() => setShowAddModal(true)}
        >
          Record Follow-up Assessment
        </ChamferButton>
      </div>

      {/* Recharts Analytics Card */}
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gb-border)]/60 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[var(--gb-mint)]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)]">
              Symptom Severity Reduction &amp; Dosha Equilibrium Trend
            </h3>
          </div>
          
          {/* Curve Toggles */}
          <div className="flex flex-wrap items-center gap-1">
            <CyberToggle
              active={showSeverity}
              onClick={() => setShowSeverity(!showSeverity)}
              variant="red"
              size="sm"
            >
              Severity (0-10)
            </CyberToggle>
            <CyberToggle
              active={showDosha}
              onClick={() => setShowDosha(!showDosha)}
              variant="mint"
              size="sm"
            >
              Dosha Balance (1-10)
            </CyberToggle>
            <CyberToggle
              active={showAgni}
              onClick={() => setShowAgni(!showAgni)}
              variant="orange"
              size="sm"
            >
              Agni (1-5)
            </CyberToggle>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--gb-dim)] space-y-2">
            <p>No recovery logs recorded yet for this patient.</p>
            <p className="text-[11px] text-[var(--gb-muted)]">Click "Record Follow-up Assessment" above to record a new clinical assessment.</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167, 139, 250, 0.15)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 10]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171342',
                    borderRadius: '12px',
                    border: '1px solid rgba(167, 139, 250, 0.4)',
                    color: '#f8fafc',
                    fontSize: '11px',
                    boxShadow: '0 8px 24px rgba(7, 5, 35, 0.5)'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '12px',
                    fontSize: '11px',
                    color: '#cbd5e1'
                  }}
                />
                {showSeverity && (
                  <Line
                    type="monotone"
                    dataKey="severity"
                    name="Symptom Severity (0-10)"
                    stroke="#fb7185"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#fb7185', strokeWidth: 1.5, stroke: '#171342' }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {showDosha && (
                  <Line
                    type="monotone"
                    dataKey="dosha_balance"
                    name="Dosha Equilibrium (1-10)"
                    stroke="#4ade80"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4ade80', strokeWidth: 1.5, stroke: '#171342' }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {showAgni && (
                  <Line
                    type="monotone"
                    dataKey="agni"
                    name="Agni Strength (1-5)"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3.5, fill: '#f97316', strokeWidth: 1.5, stroke: '#171342' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Historical Check-in Log Table */}
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-6 shadow-[var(--gb-shadow)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--gb-violet)]" />
            <span>Clinical Progress Logs</span>
          </h3>
          <span className="text-[11px] text-[var(--gb-dim)]">{chartData.length} records</span>
        </div>

        <div className="space-y-2.5">
          {chartData.length === 0 ? (
            <p className="text-xs text-[var(--gb-dim)] py-4 text-center">No progress entries logged yet.</p>
          ) : (
            chartData.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-[var(--gb-surface-raised)]/70 hover:bg-[var(--gb-surface-raised)] rounded-xl border border-[var(--gb-border)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div>
                  <div className="font-bold text-[var(--gb-white)] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gb-mint)]" />
                    <span>Check-in Date: {log.date}</span>
                  </div>
                  <p className="text-[var(--gb-muted)] mt-1 text-[11px]">
                    {log.notes || 'Routine follow-up assessment.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-[var(--gb-danger)]/15 text-[var(--gb-danger)] border border-[var(--gb-danger)]/30 font-semibold rounded-lg text-[11px]">
                    Severity: {log.severity}/10
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--gb-mint)]/15 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30 font-semibold rounded-lg text-[11px]">
                    Dosha: {log.dosha_balance}/10
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--gb-orange)]/15 text-[var(--gb-orange)] border border-[var(--gb-orange)]/30 font-semibold rounded-lg text-[11px]">
                    Agni: {log.agni}/5
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gb-surface)] border border-[var(--gb-border-strong)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[var(--gb-dim)] hover:text-[var(--gb-white)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gb-mint)]">
                Vaidya Clinical Entry
              </span>
              <h3 className="font-bold text-base text-[var(--gb-white)] mt-0.5">
                Record Follow-up Assessment
              </h3>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-[var(--gb-muted)]">
                  <span>Symptom Severity (0 = None, 10 = Severe)</span>
                  <span className="text-[var(--gb-danger)] font-bold">{severity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full accent-[var(--gb-danger)]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-[var(--gb-muted)]">
                  <span>Dosha Equilibrium (1 = High Imbalance, 10 = Samyata)</span>
                  <span className="text-[var(--gb-mint)] font-bold">{doshaBalance}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={doshaBalance}
                  onChange={(e) => setDoshaBalance(e.target.value)}
                  className="w-full accent-[var(--gb-mint)]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-[var(--gb-muted)]">
                  <span>Agni Strength Rating (1 to 5)</span>
                  <span className="text-[var(--gb-orange)] font-bold">{agni}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={agni}
                  onChange={(e) => setAgni(e.target.value)}
                  className="w-full accent-[var(--gb-orange)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--gb-muted)] mb-1">
                  Vaidya Follow-up Notes:
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Joint swelling subsided by 40%. Morning stiffness reduced to 30 mins. Patient adhering to warm ginger water pathya."
                  className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-3 text-[var(--gb-white)] placeholder:text-[var(--gb-dim)] text-xs focus:outline-none focus:border-[var(--gb-mint)]"
                ></textarea>
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-[var(--gb-border)]/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[var(--gb-border)] rounded-xl text-[var(--gb-muted)] hover:text-[var(--gb-white)] font-semibold transition"
                >
                  Cancel
                </button>
                <ChamferButton
                  variant="mint"
                  size="sm"
                  type="submit"
                >
                  Save Check-in
                </ChamferButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
