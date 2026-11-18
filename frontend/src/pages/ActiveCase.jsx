import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Send,
  BookOpen,
  History,
  Activity,
  Layers,
  FileText,
  User,
  HeartPulse,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Check,
  Undo2,
  Info,
  X
} from 'lucide-react';
import { api } from '../services/api';
import {
  ClinicalCard,
  ClinicalButton,
  StatusBadge,
  EvidenceBadge,
  ClinicalModal,
  EmptyState
} from '../components/ClinicalPrimitives';
import ChamferButton from '../components/ChamferButton';
import SegmentedToggle from '../components/SegmentedToggle';
import CyberToggle from '../components/CyberToggle';
import VaidyaCompanion, { VaidyaAvatar } from '../components/VaidyaCompanion';
import SourceCitationPanel from '../components/SourceCitationPanel';
import AyurGuardSeal from '../components/AyurGuardSeal';
import SampraptiFlow from '../components/SampraptiFlow';
import {
  normalizeClinicalText,
  canonicalizeFactKey,
  humanizeFactKey,
  generateFactId,
  deduplicateAndGroupFacts,
  getPendingUnknowns
} from '../utils/normalization';

export default function ActiveCase({ activePatientId, patients = [], onSelectPatient }) {
  const { patientId: routePatientId } = useParams();
  const navigate = useNavigate();
  const dialogueEndRef = useRef(null);
  const trainScrollRef = useRef(null);

  // ─── Resolve the target patient ID robustly ─────────────────────────────────
  // The URL param might be a patient ID or could be stale/invalid.
  // We validate it against the loaded patients list first.
  const parsedRouteId = routePatientId ? parseInt(routePatientId, 10) : null;
  const isValidRouteId = parsedRouteId && patients.length > 0
    ? patients.some(p => p.id === parsedRouteId)
    : Boolean(parsedRouteId); // If patients not loaded yet, trust the param provisionally

  const effectivePatientId = isValidRouteId
    ? parsedRouteId
    : (activePatientId || (patients.length > 0 ? patients[0].id : 1));

  // Loading & Session State
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [activeTab, setActiveTab] = useState('differential'); // differential, samprapti, chikitsa, safety, citations

  // Fact Management & Conflict State
  const [editingFact, setEditingFact] = useState(null);
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [newFact, setNewFact] = useState({ category: 'symptom', key: '', value: '' });
  const [conflictWarning, setConflictWarning] = useState(null);
  const [lastDeletedFact, setLastDeletedFact] = useState(null);
  const [confirmDeleteFact, setConfirmDeleteFact] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Snapshot History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [analysesList, setAnalysesList] = useState([]);

  // Auto-dismiss feedback toast
  useEffect(() => {
    if (feedbackToast) {
      const timer = setTimeout(() => setFeedbackToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackToast]);

  // Horizontal scroll handler for Recorded Case Facts Train
  const scrollTrain = (direction) => {
    if (trainScrollRef.current) {
      const shift = direction === 'left' ? -350 : 350;
      trainScrollRef.current.scrollBy({ left: shift, behavior: 'smooth' });
    }
  };

  // Load Active Case Session
  const loadCase = async (preserveScroll = false) => {
    if (!effectivePatientId) return;
    if (!preserveScroll) setLoading(true);
    try {
      const data = await api.getPatientCase(effectivePatientId);
      setCaseData(data);
      setAnalysisError(null);

      if (data && data.id) {
        loadNextQuestion(data.id);
      }
      // If we got a valid case, sync the global active patient
      if (data?.patient?.id && onSelectPatient) {
        onSelectPatient(data.patient.id);
      }
    } catch (err) {
      console.error('Failed to load active case:', err);
      // If 404 / patient not found, redirect to first valid patient
      if (err.message?.includes('404') || err.message?.includes('not found') || err.message?.toLowerCase().includes('patient')) {
        if (patients.length > 0) {
          navigate(`/case/${patients[0].id}`, { replace: true });
          return;
        } else {
          navigate('/onboarding', { replace: true });
          return;
        }
      }
    } finally {
      if (!preserveScroll) setLoading(false);
    }
  };

  const loadNextQuestion = async (caseId) => {
    setLoadingQuestion(true);
    try {
      const q = await api.getNextQuestion(caseId);
      setNextQuestion(q.has_next ? q : null);
      setCustomAnswer('');
    } catch (err) {
      console.error('Failed to fetch next question:', err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [effectivePatientId]);

  // If route patient ID doesn't match any real patient (e.g. /case/49 when only 1–47 exist),
  // redirect to the first valid patient so the page doesn't go blank.
  useEffect(() => {
    if (!parsedRouteId || patients.length === 0) return;
    const validPatient = patients.find(p => p.id === parsedRouteId);
    if (!validPatient) {
      const fallback = patients[0];
      if (onSelectPatient) onSelectPatient(fallback.id);
      navigate(`/case/${fallback.id}`, { replace: true });
    }
  }, [parsedRouteId, patients.length]);

  // Answer Clarifying Question
  const handleAnswerQuestion = async (answerText) => {
    if (!answerText || !caseData || !nextQuestion) return;
    const cleanAnswer = normalizeClinicalText(answerText);
    setIsSubmittingTurn(true);
    try {
      await api.addConversationTurn(caseData.id, {
        role: 'vaidya',
        message: cleanAnswer,
        question_key: nextQuestion.question_key
      });

      // Fetch next inquiry question to determine if inquiry has concluded
      const nextQ = await api.getNextQuestion(caseData.id);
      if (nextQ && nextQ.has_next) {
        setNextQuestion(nextQ);
        setCustomAnswer('');
        await loadCase(true);
      } else {
        // Last question answered -> automatically trigger source-grounded clinical analysis & Roganirnaya!
        setNextQuestion(null);
        setCustomAnswer('');
        setIsAnalyzing(true);
        setFeedbackToast('Final inquiry response recorded. Synthesizing source-grounded Roganirnaya...');
        try {
          await api.analyzeCase(caseData.id);
          await loadCase(true);
          setActiveTab('differential');
          setFeedbackToast('Inquiry complete! Clinical analysis automatically synthesized and verified.');
        } catch (analysisErr) {
          console.error('Auto-analysis after last question failed:', analysisErr);
          await loadCase(true);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (err) {
      alert('Error recording clinical response: ' + err.message);
    } finally {
      setIsSubmittingTurn(false);
    }
  };

  // Run or Refresh Clinical Reasoning
  const handleRunAnalysis = async () => {
    if (!caseData || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      await api.analyzeCase(caseData.id);
      await loadCase(true);
      setActiveTab('differential');
      setFeedbackToast('Clinical reasoning synthesized with Brihat Trayi grounding.');
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'Engine computation timed out. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Clinician Confirmation on Fact
  const handleConfirmFact = async (fact) => {
    try {
      const dbId = fact.dbId || (typeof fact.id === 'number' ? fact.id : null);
      if (dbId) {
        await api.updateCaseFact(caseData.id, dbId, {
          confirmed_by_clinician: !fact.confirmed_by_clinician
        });
      }
      await loadCase(true);
      setFeedbackToast(`Observation '${fact.humanKey}' confirmation updated.`);
    } catch (err) {
      alert('Failed to update fact: ' + err.message);
    }
  };

  // Delete Fact with Confirmation & Undo State
  const handleDeleteFact = async (fact) => {
    setConfirmDeleteFact(fact);
  };

  const executeDeleteFact = async () => {
    if (!confirmDeleteFact) return;
    const fact = confirmDeleteFact;
    setConfirmDeleteFact(null);
    try {
      const dbId = fact.dbId || (typeof fact.id === 'number' ? fact.id : null);
      if (dbId) {
        await api.deleteCaseFact(caseData.id, dbId);
      }
      setLastDeletedFact(fact);
      await loadCase(true);
      setFeedbackToast(`Observation '${fact.humanKey}' removed.`);
    } catch (err) {
      alert('Failed to delete fact: ' + err.message);
    }
  };

  // Undo Last Deleted Fact
  const handleUndoDelete = async () => {
    if (!lastDeletedFact || !caseData) return;
    try {
      await api.addCaseFact(caseData.id, {
        category: lastDeletedFact.category,
        key: lastDeletedFact.rawKey || lastDeletedFact.key,
        value: lastDeletedFact.value,
        source_type: lastDeletedFact.source_type || 'clinician_observed',
        confirmed_by_clinician: lastDeletedFact.confirmed_by_clinician
      });
      setFeedbackToast(`Observation '${lastDeletedFact.humanKey}' restored.`);
      setLastDeletedFact(null);
      await loadCase(true);
    } catch (err) {
      alert('Failed to restore observation: ' + err.message);
    }
  };

  // Add New Clinical Fact with Deduplication and Conflict Check
  const handleSaveNewFact = async () => {
    if (!newFact.key || !newFact.value) return;
    const rawKey = newFact.key.trim();
    const canonicalKey = canonicalizeFactKey(rawKey);
    const cleanVal = normalizeClinicalText(newFact.value);

    // Check if fact with identical or synonymous key already exists
    const existing = (caseData?.facts || []).find(
      f => canonicalizeFactKey(f.key) === canonicalKey
    );

    if (existing) {
      const existingClean = normalizeClinicalText(existing.value || existing.normalized_value);
      if (existingClean.toLowerCase() === cleanVal.toLowerCase()) {
        setFeedbackToast(`'${humanizeFactKey(canonicalKey)}' is already recorded with identical value.`);
        setIsAddingFact(false);
        setNewFact({ category: 'symptom', key: '', value: '' });
        return;
      }

      // Existing key with different value -> trigger conflict resolution
      setConflictWarning({
        existing,
        canonicalKey,
        newVal: cleanVal,
        category: newFact.category
      });
      return;
    }

    try {
      await api.addCaseFact(caseData.id, {
        category: newFact.category,
        key: canonicalKey,
        value: cleanVal,
        source_type: 'clinician_observed',
        confirmed_by_clinician: true
      });
      setIsAddingFact(false);
      setNewFact({ category: 'symptom', key: '', value: '' });
      setFeedbackToast(`Observation '${humanizeFactKey(canonicalKey)}' recorded.`);
      await loadCase(true);
    } catch (err) {
      alert('Failed to add fact: ' + err.message);
    }
  };

  // Conflict Resolution Handler
  const handleResolveConflict = async (resolution) => {
    if (!conflictWarning) return;
    try {
      const dbId = conflictWarning.existing.id;
      if (resolution === 'replace') {
        await api.updateCaseFact(caseData.id, dbId, {
          value: conflictWarning.newVal,
          confirmed_by_clinician: true
        });
        setFeedbackToast(`Observation '${humanizeFactKey(conflictWarning.canonicalKey)}' replaced with new value.`);
      } else if (resolution === 'keep_both') {
        const mergedVal = `${conflictWarning.existing.value}; Updated: ${conflictWarning.newVal}`;
        await api.updateCaseFact(caseData.id, dbId, {
          value: mergedVal,
          confirmed_by_clinician: true
        });
        setFeedbackToast(`Observation '${humanizeFactKey(conflictWarning.canonicalKey)}' appended.`);
      }
      setConflictWarning(null);
      setIsAddingFact(false);
      setNewFact({ category: 'symptom', key: '', value: '' });
      await loadCase(true);
    } catch (err) {
      alert('Failed to resolve conflict: ' + err.message);
    }
  };

  // Edit Existing Fact
  const handleSaveEditFact = async () => {
    if (!editingFact || !editingFact.value) return;
    try {
      const cleanVal = normalizeClinicalText(editingFact.value);
      const dbId = editingFact.dbId || (typeof editingFact.id === 'number' ? editingFact.id : null);
      if (dbId) {
        await api.updateCaseFact(caseData.id, dbId, {
          value: cleanVal,
          confirmed_by_clinician: true
        });
      }
      setEditingFact(null);
      setFeedbackToast(`Observation '${editingFact.humanKey}' updated.`);
      await loadCase(true);
    } catch (err) {
      alert('Failed to update fact: ' + err.message);
    }
  };

  // History Modal
  const handleOpenHistory = async () => {
    if (!caseData) return;
    try {
      const list = await api.getCaseAnalyses(caseData.id);
      setAnalysesList(list);
      setShowHistoryModal(true);
    } catch (err) {
      alert('Failed to fetch snapshot history: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto shadow-[0_0_15px_rgba(74,222,128,0.3)]" />
        <p className="text-sm text-emerald-300 font-bold tracking-wider uppercase">
          Loading Active Clinical Case &bull; Brihat Trayi Knowledge Core...
        </p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center">
          <User className="w-8 h-8 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">No clinical case found</h3>
          <p className="text-sm text-[var(--gb-muted)] mt-1 max-w-sm mx-auto">
            The patient case could not be loaded. Select a patient from the list or start a new intake.
          </p>
        </div>
        <div className="flex gap-3">
          {patients.length > 0 && (
            <button
              onClick={() => navigate(`/case/${patients[0].id}`, { replace: true })}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50
                text-emerald-300 font-bold text-sm hover:bg-emerald-500/30 transition">
              Open Demo Case
            </button>
          )}
          <button
            onClick={() => navigate('/onboarding')}
            className="px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-400/50
              text-violet-300 font-bold text-sm hover:bg-violet-500/30 transition">
            New Patient Intake
          </button>
        </div>
      </div>
    );
  }

  const patient = caseData.patient || {};
  const activeAnalysis = caseData.active_analysis?.analysis || null;
  const analysisMeta = caseData.active_analysis || null;
  const hasAnalysis = Boolean(activeAnalysis);

  // Normalization & Fact Grouping into Fixed 12 Sections
  const groupedSections = deduplicateAndGroupFacts(caseData.facts || []);
  const allDedupedFacts = groupedSections.flatMap(sec => sec.facts.map(f => ({ ...f, sectionTitle: sec.title })));
  const totalDedupedFactsCount = allDedupedFacts.length;
  const pendingUnknowns = getPendingUnknowns(caseData.facts || []);

  // Chronologically Sorted Turns: createdAt asc, id asc
  const sortedTurns = [...(caseData.turns || [])].sort((a, b) => {
    const tA = new Date(a.created_at || 0).getTime();
    const tB = new Date(b.created_at || 0).getTime();
    if (tA !== tB) return tA - tB;
    return (a.id || 0) - (b.id || 0);
  });

  // Action Registry (Mandatory Contract)
  const caseActions = {
    runReasoning: {
      id: 'run-reasoning',
      label: 'Run Clinical Reasoning',
      loadingLabel: 'Preparing clinical reasoning...',
      handler: handleRunAnalysis,
      visible: !hasAnalysis,
      enabled: totalDedupedFactsCount > 0 && !isAnalyzing
    },
    updateAnalysis: {
      id: 'update-analysis',
      label: 'Update Case Analysis',
      loadingLabel: 'Updating case analysis...',
      handler: handleRunAnalysis,
      visible: hasAnalysis,
      enabled: !isAnalyzing
    }
  };

  const primaryAction = hasAnalysis ? caseActions.updateAnalysis : caseActions.runReasoning;

  return (
    <div className="space-y-6 w-full max-w-[1280px] mx-auto pb-16 min-w-0">
      
      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="p-3 bg-[var(--gb-purple-dark)] border border-[var(--gb-mint)]/40 text-[var(--gb-mint)] text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--gb-mint)] shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-[var(--gb-dim)] hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP CASE HEADER (Unified Patient & Case Identity)           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-4 sm:p-5 shadow-[var(--gb-shadow)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Patient Identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#241b54] to-[var(--gb-mint)]/80 border border-[var(--gb-mint)]/40 text-[var(--gb-mint)] flex items-center justify-center font-black text-sm shrink-0 shadow-md">
            {patient.full_name ? patient.full_name.substring(0, 2).toUpperCase() : 'PT'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-[var(--gb-white)] truncate">
                {patient.full_name || 'Patient'}
              </h2>
              <span className="text-xs text-[var(--gb-dim)] font-medium">
                {patient.age}y &bull; {patient.gender}
              </span>
              <StatusBadge status={hasAnalysis ? 'analyzed' : caseData.status} />
              {caseData.red_flag_status && caseData.red_flag_status !== 'none' && (
                <StatusBadge 
                  status={caseData.red_flag_status === 'alert' ? 'safety_hold' : 'warning'} 
                  label={caseData.red_flag_details || 'Red Flag Alert'} 
                />
              )}
            </div>
            <p className="text-xs text-[var(--gb-muted)] mt-0.5 truncate">
              {patient.prakriti && <>Prakriti: <span className="font-bold text-[var(--gb-mint)]">{patient.prakriti}</span> &bull; </>}
              {patient.agni && <>Agni: <span className="font-bold text-[var(--gb-orange)]">{patient.agni}</span> &bull; </>}
              {patient.koshtha && <>Koshtha: <span className="font-bold text-[var(--gb-violet)]">{patient.koshtha}</span></>}
            </p>
          </div>
        </div>

        {/* Engine Status & Primary Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {analysisMeta && (
            <button
              type="button"
              onClick={handleOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--gb-muted)] bg-[var(--gb-surface-raised)] hover:bg-[var(--gb-purple-mid)]/40 border border-[var(--gb-border)] transition-colors"
              title="View versioned snapshot history"
              aria-label="View snapshot history"
            >
              <History className="w-3.5 h-3.5 text-[var(--gb-violet)]" />
              <span>Snapshot v{analysisMeta.version || 1}</span>
            </button>
          )}

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--gb-dim)]">Inference Mode</span>
            <span className="text-xs font-bold text-[var(--gb-mint)] flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gb-mint)] animate-pulse" />
              <span>Brihat Trayi Knowledge Core</span>
            </span>
          </div>

          <ChamferButton
            variant="mint"
            size="sm"
            icon={isAnalyzing ? undefined : Sparkles}
            loading={isAnalyzing}
            disabled={!primaryAction.enabled}
            onClick={primaryAction.handler}
            title={primaryAction.label}
            ariaLabel={primaryAction.label}
          >
            {isAnalyzing ? primaryAction.loadingLabel : primaryAction.label}
          </ChamferButton>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN ACTIVE-CASE WORKSPACE GRID (Strict 2-Region CSS Grid)  */}
      {/* ------------------------------------------------------------- */}
      <div className="active-case-grid">
        
        {/* =========================================================== */}
        {/* LEFT / MAIN COLUMN: Clinical Dialogue & Reasoning Engine    */}
        {/* =========================================================== */}
        <div className="active-case-main space-y-6">
          
          {/* Synthesized Condition Ribbon (ONLY displayed after diagnostic inquiry has completed) */}
          {!nextQuestion && activeAnalysis && !activeAnalysis.probable_vyadhi?.includes('Asiddha Roganirnaya') && !activeAnalysis.probable_vyadhi?.includes('Vatavyadhi (General Vata') && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 via-[var(--gb-surface-raised)] to-[var(--gb-purple-dark)] border-2 border-[var(--gb-mint)]/60 rounded-2xl shadow-lg gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[var(--gb-mint)] animate-pulse shrink-0" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--gb-mint)] block">
                    Identified Condition &bull; {activeAnalysis.confidence_level || 'SYNTHESIZED'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {activeAnalysis.probable_vyadhi}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ChamferButton
                  variant="mint"
                  size="sm"
                  onClick={() => navigate('/pathology')}
                  className="font-bold text-xs"
                >
                  Diagnostic Pathology &rarr;
                </ChamferButton>
                <ChamferButton
                  variant="orange"
                  size="sm"
                  onClick={() => navigate('/overview')}
                  className="font-bold text-xs"
                >
                  Clinical Overview &rarr;
                </ChamferButton>
              </div>
            </div>
          )}

          {/* Prominent Clinical Inquiry Banner */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[var(--gb-mint)]/20 via-[var(--gb-surface-raised)] to-[var(--gb-purple-dark)] border border-[var(--gb-mint)]/50 rounded-2xl shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[var(--gb-mint)] animate-pulse" />
              <span className="font-extrabold text-sm text-[var(--gb-white)] tracking-wide">
                Clinical Diagnostic Inquiry
              </span>
            </div>
            <span className="text-[11px] font-bold text-[var(--gb-mint)] bg-[var(--gb-mint)]/10 px-3 py-1 rounded-full border border-[var(--gb-mint)]/30">
              {nextQuestion ? 'Diagnostic Assessment in Progress' : 'Intake Complete &bull; Verified'}
            </span>
          </div>

          {/* Active Clarifying Question Hero OR Intake Complete Banner */}
          {nextQuestion ? (
            <div className="relative overflow-hidden rounded-2xl bg-[var(--gb-surface)] border-2 border-[var(--gb-mint)] p-6 shadow-[var(--gb-shadow)] space-y-4">
              
              {/* Eyebrow & Step Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gb-border)]/60 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gb-mint)]/15 border border-[var(--gb-mint)]/30 text-[var(--gb-mint)] text-xs font-bold tracking-wide">
                  <span className="text-[var(--gb-orange)] font-mono">:::</span>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gb-orange)] animate-spin" />
                  <span className="uppercase">ACTIVE DIAGNOSTIC INQUIRY &bull; LAKSHANA DIFFERENTIATION</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--gb-orange)]/15 text-[var(--gb-orange)] border border-[var(--gb-orange)]/30">
                  Step: {nextQuestion.category?.toUpperCase() || 'SYMPTOM'}
                </span>
              </div>

              {/* Question Text */}
              <div className="flex items-start gap-3.5">
                <VaidyaAvatar mood="thoughtful" size="md" className="hidden sm:block" />
                <div className="space-y-2 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-extrabold text-[var(--gb-white)] leading-snug">
                    {nextQuestion.question_text}
                  </h3>

                  {/* Classical Rationale */}
                  <div className="p-3 rounded-xl bg-[var(--gb-surface-raised)] border border-[var(--gb-orange)]/30 text-xs text-[var(--gb-orange)] flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--gb-orange)] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-[var(--gb-white)]">Ayurvedic Clinical Rationale: </strong>
                      {nextQuestion.clinical_rationale}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Observation Option Chips */}
              {nextQuestion.options && nextQuestion.options.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gb-mint)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gb-mint)] animate-pulse" />
                    <span>Select Clinical Finding (Pratyaksha):</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {nextQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswerQuestion(opt)}
                        disabled={isSubmittingTurn}
                        className="text-left p-3 rounded-xl text-xs font-semibold border border-[var(--gb-border)] bg-[var(--gb-surface-raised)] hover:border-[var(--gb-mint)] hover:text-white text-[var(--gb-muted)] transition-all flex items-center justify-between gap-3 group"
                      >
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        <ChevronRight className="w-4 h-4 text-[var(--gb-dim)] shrink-0 group-hover:text-[var(--gb-mint)] transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Observation Input */}
              {nextQuestion.allow_custom && (
                <div className="pt-3 border-t border-[var(--gb-border)]/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="text"
                    placeholder="Or type specific clinical finding..."
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customAnswer.trim()) {
                        handleAnswerQuestion(customAnswer.trim());
                      }
                    }}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[var(--gb-border)] bg-[var(--gb-surface-raised)] text-[var(--gb-white)] placeholder:text-[var(--gb-dim)] focus:outline-none focus:border-[var(--gb-mint)]"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <ChamferButton
                      variant="mint"
                      size="sm"
                      disabled={!customAnswer.trim() || isSubmittingTurn}
                      onClick={() => handleAnswerQuestion(customAnswer.trim())}
                      ariaLabel="Submit clinical finding"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      <span>Assert Finding</span>
                    </ChamferButton>
                    <ChamferButton
                      variant="purple"
                      size="sm"
                      onClick={() => handleAnswerQuestion('No clear aggravating pattern')}
                      ariaLabel="Skip question"
                    >
                      Skip
                    </ChamferButton>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Intake Complete Status Banner with Real CTA Button */
            <div className="bg-[var(--gb-surface)] border border-[var(--gb-mint)]/40 rounded-2xl p-5 shadow-[var(--gb-shadow)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <VaidyaAvatar mood="celebrating" size="md" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-[var(--gb-white)]">
                      {hasAnalysis ? `Clinical Reasoning Snapshot v${analysisMeta?.version || 1}` : 'Intake Complete'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--gb-mint)]/15 text-[var(--gb-mint)] border border-[var(--gb-mint)]/30">
                      Brihat Trayi Grounded
                    </span>
                  </div>
                  <p className="text-xs text-[var(--gb-muted)] mt-1 leading-relaxed">
                    {hasAnalysis
                      ? `Clinical synthesis active (${totalDedupedFactsCount} observations synthesized). Review the Roganirnaya findings below or click '${primaryAction.label}' to refresh.`
                      : `Intake complete. ${totalDedupedFactsCount} clinical observations are recorded. Review the facts on the right, then click '${primaryAction.label}'.`}
                  </p>
                </div>
              </div>

              <ChamferButton
                variant="mint"
                size="md"
                icon={isAnalyzing ? undefined : Sparkles}
                loading={isAnalyzing}
                disabled={!primaryAction.enabled}
                onClick={primaryAction.handler}
                className="shrink-0"
                title={primaryAction.label}
                ariaLabel={primaryAction.label}
              >
                {primaryAction.label}
              </ChamferButton>
            </div>
          )}

          {/* Analysis Error Notification if occurred */}
          {analysisError && (
            <div className="p-4 bg-[var(--gb-danger)]/15 border border-[var(--gb-danger)]/40 rounded-2xl text-xs text-[var(--gb-danger)] flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{analysisError}</span>
              </div>
              <ChamferButton variant="danger" size="sm" onClick={handleRunAnalysis}>
                Retry Analysis
              </ChamferButton>
            </div>
          )}

        </div>

        {/* =========================================================== */}
        {/* RIGHT RAIL: Compact Clinical Inquiry Dialogue               */}
        {/* =========================================================== */}
        <div className="active-case-rail">
          {/* Compact Dialogue History in Right Rail */}
          <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-4 shadow-[var(--gb-shadow)] space-y-3 sticky top-24">
            <div className="flex items-center justify-between border-b border-[var(--gb-border)]/60 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-[var(--gb-mint)]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)]">
                  Inquiry Dialogue
                </h3>
              </div>
              <span className="text-[10px] text-[var(--gb-dim)] font-mono bg-[var(--gb-surface-raised)] px-2 py-0.5 rounded-full border border-[var(--gb-border)]">{sortedTurns.length} turns</span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-[var(--gb-border)]">
              {sortedTurns.length > 0 ? (
                sortedTurns.map((turn) => {
                  const isAssistant = turn.role === 'assistant';
                  return (
                    <div
                      key={turn.id || `turn-${turn.created_at}`}
                      className={`flex items-start gap-2 text-xs ${
                        isAssistant ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {isAssistant && <VaidyaAvatar mood="calm" size="sm" />}
                      <div
                        className={`max-w-[90%] p-2.5 rounded-xl leading-relaxed ${
                          isAssistant
                            ? 'bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] text-[var(--gb-white)] rounded-tl-none shadow-sm'
                            : 'bg-[var(--gb-mint)] text-[#171342] font-bold rounded-tr-none shadow-md'
                        }`}
                      >
                        <p className="text-[11px] leading-snug">{turn.message}</p>
                        {turn.question_key && (
                          <span className={`text-[9px] block mt-1 font-mono uppercase ${isAssistant ? 'text-[var(--gb-dim)]' : 'text-[#171342]/80 font-bold'}`}>
                            {humanizeFactKey(turn.question_key)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center space-y-2">
                  <History className="w-6 h-6 text-[var(--gb-dim)] mx-auto" />
                  <p className="text-[11px] text-[var(--gb-dim)]">No inquiry messages yet.</p>
                </div>
              )}
              <div ref={dialogueEndRef} />
            </div>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. RECORDED CASE FACTS: Clinical Train Track System (Bottom)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[var(--gb-surface)] border-2 border-[var(--gb-border)] rounded-3xl p-5 sm:p-6 shadow-[var(--gb-shadow)] space-y-4 relative overflow-hidden">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Title, Count, Add Fact, and Left/Right Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gb-border)]/60 pb-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[var(--gb-mint)] animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              <h3 className="text-sm sm:text-base font-black text-[var(--gb-white)] tracking-wide flex items-center gap-2">
                <span>RECORDED CASE FACTS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-[var(--gb-mint)] border border-emerald-400/30">
                  CLINICAL TRAIN LEDGER
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-[var(--gb-dim)] font-medium">
              {totalDedupedFactsCount} clinical carriages linked &bull; Scroll sideways to inspect verified Brihat Trayi evidence chain
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Scroll Left & Right Controls */}
            <div className="flex items-center gap-1.5 bg-[var(--gb-surface-raised)] p-1.5 rounded-2xl border border-[var(--gb-border)] shadow-inner">
              <button
                type="button"
                onClick={() => scrollTrain('left')}
                className="p-2 rounded-xl bg-[var(--gb-surface)] hover:bg-[var(--gb-mint)]/20 text-[var(--gb-muted)] hover:text-[var(--gb-white)] transition border border-[var(--gb-border)] active:scale-95 shadow-sm"
                title="Scroll Train Left"
                aria-label="Scroll facts left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 px-1.5 text-[10px] font-mono font-extrabold text-[var(--gb-dim)]">
                <span>TRACK</span>
              </div>
              <button
                type="button"
                onClick={() => scrollTrain('right')}
                className="p-2 rounded-xl bg-[var(--gb-surface)] hover:bg-[var(--gb-mint)]/20 text-[var(--gb-muted)] hover:text-[var(--gb-white)] transition border border-[var(--gb-border)] active:scale-95 shadow-sm"
                title="Scroll Train Right"
                aria-label="Scroll facts right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <ChamferButton
              variant="mint"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddingFact(true)}
              title="Add new clinical observation"
              ariaLabel="Add clinical fact"
              className="font-bold text-xs"
            >
              Add Fact
            </ChamferButton>
          </div>
        </div>

        {/* Undo Notification if fact was deleted */}
        {lastDeletedFact && (
          <div className="p-3 bg-[var(--gb-surface-raised)] border border-[var(--gb-orange)]/40 rounded-2xl text-xs text-[var(--gb-orange)] flex items-center justify-between shadow-sm animate-fade-in relative z-10">
            <div className="flex items-center gap-2 truncate">
              <Info className="w-4 h-4 shrink-0 text-[var(--gb-orange)]" />
              <span className="truncate">Uncoupled observation: '{lastDeletedFact.humanKey}'.</span>
            </div>
            <button
              type="button"
              onClick={handleUndoDelete}
              className="font-bold underline hover:text-[var(--gb-white)] flex items-center gap-1 text-xs shrink-0 ml-2"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Removal</span>
            </button>
          </div>
        )}

        {/* Horizontal Train Chain of Carriages */}
        <div
          ref={trainScrollRef}
          className="flex items-stretch gap-3 overflow-x-auto py-3 px-1 scrollbar-thin scrollbar-thumb-[var(--gb-border)] select-none relative z-10"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* LOCOMOTIVE LEAD ENGINE CAR */}
          <div className="w-[220px] shrink-0 p-4 rounded-2xl border-2 border-[var(--gb-mint)]/60 bg-gradient-to-br from-emerald-500/15 via-[var(--gb-surface-raised)] to-[var(--gb-purple-dark)]/40 shadow-md flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[var(--gb-mint)]">
                  ENGINE 01
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--gb-mint)] animate-ping" />
              </div>
              <h4 className="text-sm font-black text-[var(--gb-white)] mt-1">
                AyuParam Locomotive
              </h4>
              <p className="text-[11px] text-[var(--gb-dim)] mt-0.5 leading-snug">
                Powering clinical reasoning core grounded in Charaka, Sushruta &amp; Vagbhata.
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--gb-border)]/50 flex items-center justify-between text-[10px] font-mono text-[var(--gb-mint)] font-bold">
              <span>LEAD CARRIAGE</span>
              <span className="text-base">🚆</span>
            </div>
          </div>

          {/* Connected Observation Carriages */}
          {allDedupedFacts.length > 0 ? (
            allDedupedFacts.map((fact, index) => (
              <div
                key={fact.id || index}
                className="w-[280px] sm:w-[320px] shrink-0 p-4 rounded-2xl border border-[var(--gb-border)] bg-[var(--gb-surface-raised)] hover:border-[var(--gb-mint)]/80 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col justify-between gap-3 relative group"
              >
                {/* Carriage Coupler/Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[var(--gb-border)]/50 pb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--gb-surface)] text-[var(--gb-mint)] border border-[var(--gb-border)]">
                      CAR #{index + 1} &bull; {fact.category}
                    </span>
                    {fact.referenceCount > 1 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--gb-mint)]/20 text-[var(--gb-mint)] font-bold">
                        &times;{fact.referenceCount}
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleConfirmFact(fact)}
                      className={`p-1 rounded-lg hover:bg-[var(--gb-surface)] transition ${
                        fact.confirmed_by_clinician ? 'text-[var(--gb-mint)]' : 'text-[var(--gb-dim)] hover:text-[var(--gb-white)]'
                      }`}
                      title={fact.confirmed_by_clinician ? 'Confirmed by clinician' : 'Click to confirm'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEditFact(fact)}
                      className="p-1 rounded-lg hover:bg-[var(--gb-surface)] text-[var(--gb-dim)] hover:text-[var(--gb-white)] transition"
                      title="Edit observation"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFact(fact)}
                      className="p-1 rounded-lg hover:bg-[var(--gb-surface)] text-[var(--gb-dim)] hover:text-[var(--gb-danger)] transition"
                      title="Delete observation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Carriage Body / Observation Detail */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--gb-dim)] block">
                    {fact.sectionTitle || 'Clinical Observation'}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--gb-white)] leading-snug">
                    {fact.humanKey}
                  </h4>
                  <p className="text-[11px] text-[var(--gb-muted)] line-clamp-3 leading-relaxed">
                    {fact.value}
                  </p>
                </div>

                {/* Train Carriage Footer / Coupler Link */}
                <div className="pt-2 border-t border-[var(--gb-border)]/40 flex items-center justify-between text-[9px] font-mono text-[var(--gb-dim)]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gb-dim)] group-hover:bg-[var(--gb-mint)] transition-colors" />
                    COUPLER #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--gb-mint)] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gb-mint)] animate-pulse" />
                    VERIFIED FACT
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center text-xs text-[var(--gb-dim)] space-y-2">
              <p>No observations coupled to track yet.</p>
              <ChamferButton variant="purple" size="sm" onClick={() => setIsAddingFact(true)} className="mx-auto">
                Coupled First Observation
              </ChamferButton>
            </div>
          )}
        </div>

        {/* Visual Metallic Train Tracks beneath carriages */}
        <div className="relative pt-1 px-2 select-none pointer-events-none">
          <div className="h-1 bg-gradient-to-r from-emerald-500/30 via-violet-500/40 to-emerald-500/30 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.3)]" />
          <div className="h-0.5 bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-emerald-500/20 rounded-full mt-1" />
        </div>

      </div>

      {/* duplicate closing div removed — modals follow below */}
      {/*  the grid's closing </div> was already emitted above, next comes modals */}

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS: Add Fact, Edit Fact, Conflict Resolution, Delete    */}
      {/* ------------------------------------------------------------- */}

      {/* Add New Fact Modal */}
      {isAddingFact && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gb-surface)] border border-[var(--gb-border-strong)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddingFact(false)}
              className="absolute top-4 right-4 text-[var(--gb-dim)] hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gb-mint)]">
                Clinical Ledger Entry
              </span>
              <h3 className="font-bold text-base text-[var(--gb-white)] mt-0.5">
                Record Clinical Observation
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[var(--gb-muted)] mb-1">Category:</label>
                <select
                  value={newFact.category}
                  onChange={(e) => setNewFact({ ...newFact, category: e.target.value })}
                  className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
                >
                  <option value="symptom">Symptom / Lakshana</option>
                  <option value="timing">Timing &amp; Duration (Kala)</option>
                  <option value="prakriti">Prakriti Baseline</option>
                  <option value="agni">Agni State</option>
                  <option value="lifestyle">Lifestyle &amp; Diet (Ahara-Vihara)</option>
                  <option value="pariksha">Pariksha Finding (Ashtavidha)</option>
                  <option value="red_flag">Medical History / Risk Factor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[var(--gb-muted)] mb-1">Clinical Factor Key:</label>
                <input
                  type="text"
                  placeholder="e.g. morning_stiffness, tongue_coating, appetite"
                  value={newFact.key}
                  onChange={(e) => setNewFact({ ...newFact, key: e.target.value })}
                  className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] placeholder:text-[var(--gb-dim)] focus:outline-none focus:border-[var(--gb-mint)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--gb-muted)] mb-1">Observed Value / Finding:</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Severe morning stiffness in bilateral fingers lasting > 90 minutes"
                  value={newFact.value}
                  onChange={(e) => setNewFact({ ...newFact, value: e.target.value })}
                  className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] placeholder:text-[var(--gb-dim)] focus:outline-none focus:border-[var(--gb-mint)]"
                />
              </div>

              <div className="flex justify-end items-center gap-2 pt-2 border-t border-[var(--gb-border)]/60">
                <button
                  type="button"
                  onClick={() => setIsAddingFact(false)}
                  className="px-4 py-2 border border-[var(--gb-border)] rounded-xl text-[var(--gb-muted)] hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <ChamferButton
                  variant="mint"
                  size="sm"
                  disabled={!newFact.key.trim() || !newFact.value.trim()}
                  onClick={handleSaveNewFact}
                >
                  Save Observation
                </ChamferButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fact Modal */}
      {editingFact && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gb-surface)] border border-[var(--gb-border-strong)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingFact(null)}
              className="absolute top-4 right-4 text-[var(--gb-dim)] hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gb-mint)]">
                Observation Revision
              </span>
              <h3 className="font-bold text-base text-[var(--gb-white)] mt-0.5">
                Edit {editingFact.humanKey}
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[var(--gb-muted)] mb-1">Updated Clinical Value:</label>
                <textarea
                  rows="3"
                  value={editingFact.value}
                  onChange={(e) => setEditingFact({ ...editingFact, value: e.target.value })}
                  className="w-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-xl p-2.5 text-[var(--gb-white)] focus:outline-none focus:border-[var(--gb-mint)]"
                />
              </div>

              <div className="flex justify-end items-center gap-2 pt-2 border-t border-[var(--gb-border)]/60">
                <button
                  type="button"
                  onClick={() => setEditingFact(null)}
                  className="px-4 py-2 border border-[var(--gb-border)] rounded-xl text-[var(--gb-muted)] hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <ChamferButton
                  variant="mint"
                  size="sm"
                  disabled={!editingFact.value.trim()}
                  onClick={handleSaveEditFact}
                >
                  Update Observation
                </ChamferButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Resolution Modal */}
      {conflictWarning && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gb-surface)] border-2 border-[var(--gb-orange)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-2.5 text-[var(--gb-orange)]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-sm text-white">Clinical Fact Discrepancy</h3>
            </div>

            <p className="text-xs text-[var(--gb-muted)] leading-relaxed">
              A different observation is already recorded for <strong className="text-[var(--gb-white)]">{humanizeFactKey(conflictWarning.canonicalKey)}</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[var(--gb-surface-raised)] border border-[var(--gb-border)]">
                <span className="text-[10px] font-bold text-[var(--gb-dim)] uppercase block">Existing Value:</span>
                <p className="text-[var(--gb-white)] font-semibold mt-0.5">{conflictWarning.existing.value}</p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--gb-orange)]/15 border border-[var(--gb-orange)]/40">
                <span className="text-[10px] font-bold text-[var(--gb-orange)] uppercase block">New Incoming Value:</span>
                <p className="text-[var(--gb-white)] font-semibold mt-0.5">{conflictWarning.newVal}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--gb-dim)]">
              How would you like to record this finding?
            </p>

            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-2 border-t border-[var(--gb-border)]/60">
              <button
                type="button"
                onClick={() => setConflictWarning(null)}
                className="px-3.5 py-2 border border-[var(--gb-border)] rounded-xl text-[var(--gb-muted)] hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <ChamferButton
                variant="purple"
                size="sm"
                onClick={() => handleResolveConflict('keep_both')}
              >
                Keep Both with Timestamp
              </ChamferButton>
              <ChamferButton
                variant="mint"
                size="sm"
                onClick={() => handleResolveConflict('replace')}
              >
                Replace Existing
              </ChamferButton>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {confirmDeleteFact && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gb-surface)] border-2 border-[var(--gb-danger)] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-2.5 text-[var(--gb-danger)]">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-sm text-white">Confirm Removal</h3>
            </div>

            <p className="text-xs text-[var(--gb-muted)] leading-relaxed">
              Are you sure you want to remove the observation <strong className="text-[var(--gb-white)]">'{confirmDeleteFact.humanKey}'</strong> ({confirmDeleteFact.value}) from this case session?
            </p>

            <div className="flex justify-end items-center gap-2 pt-2 border-t border-[var(--gb-border)]/60">
              <button
                type="button"
                onClick={() => setConfirmDeleteFact(null)}
                className="px-4 py-2 border border-[var(--gb-border)] rounded-xl text-[var(--gb-muted)] hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <ChamferButton
                variant="danger"
                size="sm"
                onClick={executeDeleteFact}
              >
                Remove Fact
              </ChamferButton>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot History Modal */}
      {showHistoryModal && (
        <ClinicalModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title="Clinical Reasoning Snapshot History"
        >
          <div className="space-y-3">
            {analysesList.length === 0 ? (
              <p className="text-xs text-[var(--gb-dim)] text-center py-4">No prior snapshots recorded.</p>
            ) : (
              analysesList.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3.5 bg-[var(--gb-surface-raised)] rounded-xl border border-[var(--gb-border)] text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-[var(--gb-white)] flex items-center gap-2">
                      <span>Snapshot Version {snap.version}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--gb-mint)]/20 text-[var(--gb-mint)] font-mono font-bold">
                        {snap.engine_status}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--gb-dim)]">
                      Generated: {snap.created_at ? new Date(snap.created_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ClinicalModal>
      )}

    </div>
  );
}
