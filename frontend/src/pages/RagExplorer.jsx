import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
import ChamferButton from '../components/ChamferButton';
import CyberToggle from '../components/CyberToggle';
import { api } from '../services/api';

export default function RagExplorer() {
  const [query, setQuery] = useState('Jwara');
  const [treatise, setTreatise] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    handleSearch();
    api.getCorpusStats().then(setStats).catch(console.error);
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await api.searchRag(query || 'Jwara', treatise || null, 6);
      setResults(data);
    } catch (err) {
      console.error('RAG Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 w-full max-w-[1240px] mx-auto min-w-0">
      {/* Header */}
      <div className="bg-[#20194f] border border-violet-400/30 rounded-2xl p-6 shadow-xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
          Source Grounding Engine
        </span>
        <h1 className="text-xl font-black text-white">
          Canonical Brihat Trayi Retrieval Engine (Charaka &bull; Sushruta &bull; Vagbhata)
        </h1>
        <p className="text-xs text-violet-200/80">
          Hybrid dense-sparse retrieval over verified Sanskrit treatises with shloka-level citation traceability.
        </p>

        {stats && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-violet-300 font-semibold">
            <span className="text-emerald-400">Indexed Verses: {stats.total_verses}</span>
            <span>&bull;</span>
            <span>Supported: Devanagari, IAST Sanskrit, English, Hindi</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-violet-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search classical concepts: 'Amavata', 'Langhana', 'Agni', 'Chitrakadi', 'Brahma Muhurta'..."
              className="w-full pl-10 pr-4 py-3 bg-[#171342] border border-violet-400/40 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-violet-400/50"
            />
          </div>

          <ChamferButton
            variant="mint"
            size="md"
            icon={Search}
            type="submit"
          >
            Search Verses
          </ChamferButton>
        </div>

        {/* Treatise CyberToggle Filters */}
        <div className="flex items-center flex-wrap gap-1 p-1 bg-[#20194f]/80 border border-violet-400/30 rounded-2xl">
          {[
            { id: '', label: 'All Treatises (Brihat Trayi)', variant: 'mint' },
            { id: 'Charaka Samhita', label: 'Charaka Samhita', variant: 'orange' },
            { id: 'Sushruta Samhita', label: 'Sushruta Samhita', variant: 'cyan' },
            { id: 'Ashtanga Hridaya', label: 'Ashtanga Hridaya', variant: 'violet' }
          ].map((t) => (
            <CyberToggle
              key={t.id}
              active={treatise === t.id}
              onClick={() => {
                setTreatise(t.id);
                api.searchRag(query || 'Jwara', t.id || null, 6).then(setResults).catch(console.error);
              }}
              variant={t.variant}
              size="sm"
            >
              {t.label}
            </CyberToggle>
          ))}
        </div>
      </form>

      {/* Results Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-violet-300 font-semibold">Searching canonical shlokas...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center bg-[#20194f] rounded-2xl border border-violet-400/30 text-violet-300 text-xs shadow-xl">
          No matching classical verses found. Try keywords like "Jwara", "Agni", "Amavata", or "Vatavyadhi".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((c, i) => (
            <ShlokaCard key={i} citation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
