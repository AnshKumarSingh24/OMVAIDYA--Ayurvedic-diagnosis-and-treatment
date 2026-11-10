/**
 * AyuVaidya API Service Client
 * Communicates with FastAPI backend on /api
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `HTTP Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Patients
  getPatients: () => request('/patients/'),
  getPatient: (id) => request(`/patients/${id}`),
  createPatient: (data) => request('/patients/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Consultations & AyurParam Reasoning
  analyzeConsultation: (data) => request('/consultations/analyze', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getConsultation: (id) => request(`/consultations/${id}`),

  // Knowledge Graph
  getGraphSubgraph: (center = null, depth = 1) => {
    const query = center ? `?center=${encodeURIComponent(center)}&depth=${depth}` : `?depth=${depth}`;
    return request(`/graph/subgraph${query}`);
  },
  traceDiseaseSamprapti: (diseaseId) => request(`/graph/samprapti/${encodeURIComponent(diseaseId)}`),

  // Canonical Brihat Trayi RAG
  searchRag: (query, treatise = null, topK = 4) => {
    let url = `/rag/search?q=${encodeURIComponent(query)}&top_k=${topK}`;
    if (treatise) url += `&treatise=${encodeURIComponent(treatise)}`;
    return request(url);
  },
  getShloka: (id) => request(`/rag/shloka/${encodeURIComponent(id)}`),
  getCorpusStats: () => request('/rag/corpus-stats'),

  // AyurGuard Safety
  verifySafety: (data) => request('/safety/verify', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getViruddhaAhara: () => request('/safety/viruddha-ahara'),
  getFormulationCatalog: () => request('/safety/formulation-registry'),

  // Recovery Tracker
  getRecoveryHistory: (patientId) => request(`/tracker/${patientId}`),
  addRecoveryLog: (patientId, data) => request(`/tracker/${patientId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

