import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Samprapti from './pages/Samprapti';
import Chikitsa from './pages/Chikitsa';
import RagExplorer from './pages/RagExplorer';
import SafetyAudit from './pages/SafetyAudit';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import GraphVisualizer from './components/GraphVisualizer';
import { api } from './services/api';
import './styles/index.css';

function AppLayout() {
  const [patients, setPatients] = useState([]);
  const [activePatientId, setActivePatientId] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [graphData, setGraphData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load patients on mount
  useEffect(() => {
    loadPatients();
    api.getGraphSubgraph(null, 2).then(setGraphData).catch(console.error);
  }, []);

  const loadPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
      if (data.length > 0 && !activePatientId) {
        setActivePatientId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handlePatientCreated = (newId) => {
    loadPatients();
    setActivePatientId(newId);
  };

  const isLandingView = location.pathname === '/landing';

  return (
    <div className={`min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        patients={patients}
        activePatientId={activePatientId}
        onSelectPatient={(id) => setActivePatientId(id)}
        onNewPatient={() => navigate('/intake')}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex">
        {/* Left Sidebar (hidden on Landing page) */}
        {!isLandingView && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full ${!isLandingView ? 'md:pl-72' : 'max-w-7xl mx-auto'}`}>
          <Routes>
            <Route path="/" element={<Home activePatientId={activePatientId} patients={patients} />} />
            <Route path="/landing" element={<Landing onSelectPreset={(p) => console.log(p)} />} />
            <Route path="/intake" element={<Onboarding onPatientCreated={handlePatientCreated} />} />
            <Route path="/samprapti" element={<Samprapti activePatientId={activePatientId} patients={patients} />} />
            <Route path="/chikitsa" element={<Chikitsa activePatientId={activePatientId} patients={patients} />} />
            <Route path="/rag" element={<RagExplorer />} />
            <Route path="/safety" element={<SafetyAudit />} />
            <Route path="/tracker" element={<Tracker activePatientId={activePatientId} patients={patients} />} />
            <Route path="/graph" element={
              <div className="py-4 space-y-4">
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">Ayurvedic Knowledge Graph</h1>
                  <p className="text-xs text-stone-500 mt-1">Multi-relational graph connecting diseases, doshas, dhatus, srotas, herbs, and classical verses.</p>
                </div>
                <GraphVisualizer graphData={graphData} />
              </div>
            } />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

