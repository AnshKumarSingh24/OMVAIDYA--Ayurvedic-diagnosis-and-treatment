import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import ActiveCase from './pages/ActiveCase';
import Home from './pages/Home';
import DiagnosticPathology from './pages/DiagnosticPathology';
import Samprapti from './pages/Samprapti';
import Chikitsa from './pages/Chikitsa';
import RagExplorer from './pages/RagExplorer';
import SafetyAudit from './pages/SafetyAudit';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import GraphVisualizer from './components/GraphVisualizer';
import { api } from './services/api';
import { UserCircle2, Stethoscope, Sparkles, X, ArrowRight, FlaskConical } from 'lucide-react';
import './styles/index.css';

// ─── Personalization Gate Modal ───────────────────────────────────────────────
function PersonalizationGate({ onPersonalize, onGuestExplore, onDismiss }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,8,38,0.88)', backdropFilter: 'blur(12px)' }}>
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1a1554] via-[#20194f] to-[#241b54]
        border border-violet-500/40 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close */}
        <button onClick={onDismiss}
          className="absolute top-4 right-4 text-violet-300/60 hover:text-white transition z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/15 border border-emerald-400/40
              flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">AyuVaidya CDSS</h2>
              <p className="text-xs text-violet-300/70 font-semibold tracking-wide mt-0.5">
                Clinical Decision Support System
              </p>
            </div>
          </div>

          <p className="text-sm text-violet-200/80 leading-relaxed">
            To deliver personalised Ayurvedic clinical reasoning, the system needs to know your
            patient's <span className="text-emerald-400 font-bold">Prakriti, Agni, and chief complaints</span>.
            Would you like to complete a quick intake, or explore with pre-loaded clinical cases?
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {/* Personalise option */}
            <button onClick={onPersonalize}
              className="group flex items-center gap-4 p-4 rounded-2xl
                bg-gradient-to-r from-emerald-500/20 to-emerald-400/10
                border border-emerald-400/50 hover:border-emerald-400
                hover:from-emerald-500/30 hover:to-emerald-400/15
                transition-all duration-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50
                flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <UserCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm">Personalise — New Patient Intake</p>
                <p className="text-xs text-emerald-300/70 mt-0.5">
                  Complete a 2-minute Ayurvedic intake for accurate diagnosis
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
            </button>

            {/* Guest explore option */}
            <button onClick={onGuestExplore}
              className="group flex items-center gap-4 p-4 rounded-2xl
                bg-gradient-to-r from-violet-500/15 to-violet-400/10
                border border-violet-400/40 hover:border-violet-400
                hover:from-violet-500/25 hover:to-violet-400/15
                transition-all duration-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/50
                flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5 text-violet-300" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm">Explore with Demo Patient Cases</p>
                <p className="text-xs text-violet-300/70 mt-0.5">
                  View pre-loaded cases: Kushtha, Amavata, Prameha, Jwara &amp; more
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-violet-400 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>

          <p className="text-[10px] text-violet-400/50 text-center pt-1">
            AyurVaidya CDSS • For BAMS/MD Vaidyas only • Not a replacement for clinical judgment
          </p>
        </div>
      </div>
    </div>
  );
}

// Dashboard routes that require the gate check
const DASHBOARD_ROUTES = ['/case', '/overview', '/app', '/pathology', '/samprapti', '/chikitsa', '/rag', '/safety', '/tracker', '/graph', '/profile'];

function AppLayout() {
  const [patients, setPatients] = useState([]);
  const [activePatientId, setActivePatientId] = useState(null);
  const [showGate, setShowGate] = useState(false);
  
  // Default to true (dark indigo/purple theme)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ayuvaidya_theme');
    return saved !== 'light';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [graphData, setGraphData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Full bleed views without dashboard sidebar
  const isLandingView = location.pathname === '/' || location.pathname === '/landing';
  const isOnboardingView = location.pathname === '/onboarding' || location.pathname === '/intake';

  // Check if current route is a dashboard route that needs the gate
  const isDashboardRoute = DASHBOARD_ROUTES.some(r => location.pathname.startsWith(r));

  // Show gate if user is on a dashboard route but hasn't onboarded/set an active patient
  useEffect(() => {
    if (!isDashboardRoute || isOnboardingView || isLandingView) return;
    const hasOnboarded = localStorage.getItem('ayuvaidya_onboarded') === 'true';
    const hasPatient = localStorage.getItem('ayuvaidya_active_patient');
    if (!hasOnboarded && !hasPatient) {
      // Small delay so the page renders first, then gate slides in
      const t = setTimeout(() => setShowGate(true), 350);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // Landing page is always dark — reset to dark whenever user visits /
  useEffect(() => {
    if (isLandingView) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      // Don't save to localStorage so the user's dashboard theme is preserved
    }
  }, [isLandingView]);

  // Sync theme with DOM and localStorage (dashboard only)
  useEffect(() => {
    if (isLandingView) return; // Landing page always dark — handled above
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('ayuvaidya_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ayuvaidya_theme', 'light');
    }
  }, [isDark, isLandingView]);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
    api.getGraphSubgraph(null, 2).then(setGraphData).catch(console.error);
  }, []);

  const loadPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
      // Restore previously selected patient from localStorage
      const savedPatientId = localStorage.getItem('ayuvaidya_active_patient');
      if (savedPatientId && data.find(p => p.id === parseInt(savedPatientId))) {
        setActivePatientId(parseInt(savedPatientId));
      } else if (data.length > 0 && !activePatientId) {
        setActivePatientId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handlePatientCreated = (newId) => {
    loadPatients();
    setActivePatientId(newId);
    localStorage.setItem('ayuvaidya_active_patient', String(newId));
    localStorage.setItem('ayuvaidya_onboarded', 'true');
  };

  const handleSelectPatient = (id) => {
    setActivePatientId(id);
    localStorage.setItem('ayuvaidya_active_patient', String(id));
  };

  const handleSelectPreset = (type) => {
    localStorage.setItem('ayuvaidya_onboarded', 'true');
    setShowGate(false);
    // Map preset to demo patient
    if (patients.length > 0) {
      let targetPatient = patients[0];
      if (type === 'amavata') {
        targetPatient = patients.find(p => p.full_name.includes('Sundaram') || p.full_name.includes('Kamala')) || patients[0];
      } else if (type === 'grahani') {
        targetPatient = patients.find(p => p.full_name.includes('Sharma')) || patients[0];
      } else if (type === 'prameha') {
        targetPatient = patients.find(p => p.full_name.includes('Deshmukh') || p.full_name.includes('ANSH') || p.full_name.includes('Ansh')) || patients[0];
      }
      setActivePatientId(targetPatient.id);
      localStorage.setItem('ayuvaidya_active_patient', String(targetPatient.id));
      navigate(`/case/${targetPatient.id}`);
      return;
    }
    navigate('/case');
  };

  // Gate handlers
  const handlePersonalize = () => {
    setShowGate(false);
    navigate('/onboarding');
  };

  const handleGuestExplore = () => {
    localStorage.setItem('ayuvaidya_onboarded', 'true');
    setShowGate(false);
    // Pick the first real demo patient (Sundaram = Kushtha case)
    if (patients.length > 0) {
      const demo = patients[0];
      setActivePatientId(demo.id);
      localStorage.setItem('ayuvaidya_active_patient', String(demo.id));
      navigate(`/case/${demo.id}`);
    }
  };

  // Full-bleed Landing View
  if (isLandingView) {
    return (
      <div className="min-h-screen bg-[var(--gb-bg-deep)] text-[var(--gb-white)] transition-colors">
        <Landing
          onSelectPreset={handleSelectPreset}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  // Full-bleed Onboarding View
  if (isOnboardingView) {
    return (
      <div className="min-h-screen bg-[var(--gb-bg-deep)] text-[var(--gb-white)] transition-colors">
        <Navbar
          patients={patients}
          activePatientId={activePatientId}
          onSelectPatient={handleSelectPatient}
          onNewPatient={() => navigate('/onboarding')}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Onboarding onPatientCreated={handlePatientCreated} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gb-bg-deep)] text-[var(--gb-white)] transition-colors flex flex-col">
      {/* Personalization Gate Modal */}
      {showGate && (
        <PersonalizationGate
          onPersonalize={handlePersonalize}
          onGuestExplore={handleGuestExplore}
          onDismiss={() => setShowGate(false)}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        patients={patients}
        activePatientId={activePatientId}
        onSelectPatient={handleSelectPatient}
        onNewPatient={() => navigate('/onboarding')}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex w-full min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Dashboard Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden max-w-[1440px] mx-auto w-full">
          <Routes>
            <Route path="/overview" element={<Home activePatientId={activePatientId} patients={patients} />} />
            <Route path="/app" element={<Home activePatientId={activePatientId} patients={patients} />} />
            <Route path="/case" element={<ActiveCase activePatientId={activePatientId} patients={patients} onSelectPatient={handleSelectPatient} />} />
            <Route path="/case/:patientId" element={<ActiveCase activePatientId={activePatientId} patients={patients} onSelectPatient={handleSelectPatient} />} />
            <Route path="/case/:patientId/:caseId" element={<ActiveCase activePatientId={activePatientId} patients={patients} onSelectPatient={handleSelectPatient} />} />
            <Route path="/pathology" element={<DiagnosticPathology activePatientId={activePatientId} patients={patients} />} />
            <Route path="/samprapti" element={<Samprapti activePatientId={activePatientId} patients={patients} />} />
            <Route path="/chikitsa" element={<Chikitsa activePatientId={activePatientId} patients={patients} />} />
            <Route path="/rag" element={<RagExplorer />} />
            <Route path="/safety" element={<SafetyAudit />} />
            <Route path="/tracker" element={<Tracker activePatientId={activePatientId} patients={patients} />} />
            <Route path="/graph" element={
              <div className="py-4 space-y-4">
                <div className="bg-[var(--gb-surface)] p-6 rounded-2xl border border-[var(--gb-border)] shadow-[var(--gb-shadow)]">
                  <h1 className="text-xl font-extrabold text-[var(--gb-white)] tracking-tight">Ayurvedic Knowledge Graph</h1>
                  <p className="text-xs text-[var(--gb-muted)] mt-1">Multi-relational graph connecting diseases, doshas, dhatus, srotas, herbs, and classical verses.</p>
                </div>
                <GraphVisualizer graphData={graphData} />
              </div>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
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
