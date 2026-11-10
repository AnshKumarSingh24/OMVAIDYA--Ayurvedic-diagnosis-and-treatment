import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import ShlokaCard from '../components/ShlokaCard';
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
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Source Grounding Engine
        </span>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Canonical Brihat Trayi Retrieval Engine (Charaka &bull; Sushruta &bull; Vagbhata)
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Hybrid dense-sparse (BM25 + semantic) retrieval over verified Sanskrit treatises with shloka-level citation traceability.
        </p>

        {stats && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-stone-600 dark:text-stone-400">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">Indexed Verses: {stats.total_verses}</span>
            <span>&bull;</span>
            <span>Supported: Devanagari, IAST Sanskrit, English, Hindi</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classical concepts: 'Amavata', 'Langhana', 'Agni', 'Chitrakadi', 'Brahma Muhurta'..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={treatise}
          onChange={(e) => setTreatise(e.target.value)}
          className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">All Treatises (Brihat Trayi)</option>
          <option value="Charaka Samhita">Charaka Samhita</option>
          <option value="Sushruta Samhita">Sushruta Samhita</option>
          <option value="Ashtanga Hridaya">Ashtanga Hridaya</option>
        </select>

        <button
          type="submit"
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow transition flex items-center justify-center space-x-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Search Verses</span>
        </button>
      </form>

      {/* Results Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-stone-500">Searching canonical shlokas...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
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

