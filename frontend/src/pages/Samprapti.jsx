import React, { useState, useEffect } from 'react';
import { Activity, GitBranch, Share2 } from 'lucide-react';
import SampraptiFlow from '../components/SampraptiFlow';
import GraphVisualizer from '../components/GraphVisualizer';
import { api } from '../services/api';

export default function Samprapti({ activePatientId, patients = [] }) {
  const [loading, setLoading] = useState(true);
  const [sampraptiData, setSampraptiData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const complaints = [
          activePatient?.full_name?.includes('Sharma')
            ? 'Grahani bloating indigestion loose stools'
            : activePatient?.full_name?.includes('Deshmukh')
            ? 'Prameha frequent urination diabetes thirst'
            : 'Amavata joint swelling stiffness severe morning pain'
        ];

        const res = await api.analyzeConsultation({
          patient_name: activePatient?.full_name || 'Patient',
          age: activePatient?.age || 40,
          gender: activePatient?.gender || 'Female',
          prakriti: activePatient?.prakriti || 'Vata-Kapha',
          agni: activePatient?.agni || 'Mandagni',
          koshtha: activePatient?.koshtha || 'Madhyama',
          chief_complaints: complaints
        });

        setSampraptiData(res);

        // Load Knowledge Graph
        const gRes = await api.getGraphSubgraph(null, 2);
        setGraphData(gRes);
      } catch (err) {
        console.error('Failed to load Samprapti:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePatientId, activePatient]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-stone-500 font-semibold">Modeling Ayurvedic Etiopathogenesis (Samprapti)...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Pathophysiological Reasoning Engine
        </span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          Automated Samprapti Modeling: {sampraptiData?.probable_vyadhi}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Analyzing Dosha-Dushya Sammurchhana, Sroto-rodha, and the six stages of pathogenesis (Shat Kriya Kala).
        </p>
      </div>

      {/* Samprapti Flow Component */}
      <SampraptiFlow
        ghatakas={sampraptiData?.samprapti_ghatakas}
        kriyaKala={sampraptiData?.shat_kriya_kala}
      />

      {/* Knowledge Graph Explorer */}
      <GraphVisualizer graphData={graphData} />
    </div>
  );
}

