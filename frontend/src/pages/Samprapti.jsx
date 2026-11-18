import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, GitBranch, Share2, Layers } from 'lucide-react';
import SampraptiFlow from '../components/SampraptiFlow';
import GraphVisualizer from '../components/GraphVisualizer';
import ChamferButton from '../components/ChamferButton';
import { EmptyState } from '../components/ClinicalPrimitives';
import { api } from '../services/api';

export default function Samprapti({ activePatientId, patients = [] }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sampraptiData, setSampraptiData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    async function loadData() {
      if (!activePatient) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let loaded = null;

        // 1. Try active case session first
        try {
          const caseRes = await api.getPatientCase(activePatient.id);
          if (caseRes?.active_analysis?.analysis) {
            loaded = caseRes.active_analysis.analysis;
          }
        } catch (e) {
          // No case yet
        }

        // 2. Try latest consultation
        if (!loaded) {
          try {
            const consult = await api.getLatestPatientConsultation(activePatient.id);
            if (consult) {
              loaded = {
                probable_vyadhi: consult.probable_vyadhi,
                samprapti_ghatakas: consult.samprapti_ghatakas,
                shat_kriya_kala: consult.shat_kriya_kala || consult.samprapti_ghatakas?.shat_kriya_kala
              };
            }
          } catch (e) {
            // No consultation
          }
        }

        setSampraptiData(loaded);

        // Load Knowledge Graph subgraph
        const gRes = await api.getGraphSubgraph(null, 2);
        setGraphData(gRes);
      } catch (err) {
        console.error('Failed to load Samprapti:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePatientId, activePatient?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-violet-300 font-semibold">Modeling Ayurvedic Etiopathogenesis (Samprapti)...</p>
      </div>
    );
  }

  if (!sampraptiData) {
    return (
      <div className="py-12 max-w-xl mx-auto space-y-6">
        <EmptyState
          title={`No Samprapti Model for ${activePatient?.full_name || 'Patient'}`}
          description="A diagnostic analysis must be run to construct the 6-stage Shat Kriya Kala and Dosha-Dushya Sammurchhana for this patient."
          actionLabel="Open Active Case Workspace"
          onAction={() => navigate(`/case/${activePatient?.id || 1}`)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 w-full max-w-[1240px] mx-auto min-w-0">
      {/* Header */}
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            Pathophysiological Reasoning Engine
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Automated Samprapti Modeling: {sampraptiData.probable_vyadhi}
          </h1>
          <p className="text-xs text-violet-200/80 mt-1">
            Analyzing Dosha-Dushya Sammurchhana, Sroto-rodha, and the six stages of pathogenesis (Shat Kriya Kala).
          </p>
        </div>

        <ChamferButton
          variant="primary"
          size="sm"
          withArrow
          onClick={() => navigate(`/case/${activePatient?.id || 1}`)}
        >
          Active Case Workspace
        </ChamferButton>
      </div>

      {/* Samprapti Flow Component */}
      <SampraptiFlow
        ghatakas={sampraptiData.samprapti_ghatakas}
        kriyaKala={sampraptiData.shat_kriya_kala}
      />

      {/* Knowledge Graph Explorer */}
      <GraphVisualizer graphData={graphData} />
    </div>
  );
}
