import React, { useState, useEffect } from 'react';
import { Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export default function GraphVisualizer({ graphData, onSelectNode }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-500">
        No graph network data loaded.
      </div>
    );
  }

  const nodes = filterType === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.type === filterType);

  const nodeTypes = ['ALL', ...new Set(graphData.nodes.map(n => n.type))];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 dark:text-stone-200">
            Ayurvedic Knowledge Graph Explorer ({graphData.total_nodes || nodes.length} Nodes &bull; {graphData.total_edges || graphData.links?.length} Edges)
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {nodeTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filterType === t
                  ? 'bg-emerald-800 text-amber-200 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Network Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-80 overflow-y-auto p-2">
        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => {
              setSelectedNode(node);
              if (onSelectNode) onSelectNode(node.id);
            }}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
              selectedNode?.id === node.id
                ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: node.color || '#10b981' }}
              ></span>
              <span className="text-[10px] uppercase font-bold text-stone-400">
                {node.type}
              </span>
            </div>
            <div className="font-semibold text-stone-900 dark:text-stone-100 truncate mt-1.5" title={node.label}>
              {node.label}
            </div>
          </div>
        ))}
      </div>

      {/* Node Inspection Detail Bar */}
      {selectedNode && (
        <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100">{selectedNode.label}</span>
            <span className="text-stone-500 dark:text-stone-400 ml-2">Type: {selectedNode.type}</span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-stone-400 hover:text-stone-600 text-xs font-semibold"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

