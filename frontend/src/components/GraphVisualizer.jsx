import React, { useState, useEffect } from 'react';
import { Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import CyberToggle from './CyberToggle';

export default function GraphVisualizer({ graphData, onSelectNode }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center bg-[var(--gb-surface)] rounded-2xl border border-[var(--gb-border)] text-[var(--gb-dim)] text-xs">
        No graph network data loaded.
      </div>
    );
  }

  const nodes = filterType === 'ALL'
    ? graphData.nodes
    : graphData.nodes.filter(n => n.type === filterType);

  const nodeTypes = ['ALL', ...new Set(graphData.nodes.map(n => n.type))];

  return (
    <div className="bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl p-5 shadow-[var(--gb-shadow)] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gb-border)]/60 pb-3">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-[var(--gb-mint)]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--gb-white)]">
            Ayurvedic Knowledge Graph Explorer ({graphData.total_nodes || nodes.length} Nodes &bull; {graphData.total_edges || graphData.links?.length} Edges)
          </h3>
        </div>

        {/* Filter Pills with CyberToggle Architecture */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] rounded-2xl">
          {nodeTypes.map((t, idx) => {
            const variantMap = {
              ALL: 'mint',
              disease: 'red',
              dosha: 'orange',
              dhatu: 'cyan',
              srotas: 'violet',
              herb: 'mint'
            };
            const variant = variantMap[t.toLowerCase()] || variantMap[t] || ['mint', 'cyan', 'orange', 'red', 'violet'][idx % 5];
            return (
              <CyberToggle
                key={t}
                active={filterType === t}
                onClick={() => setFilterType(t)}
                variant={variant}
                size="sm"
              >
                {t}
              </CyberToggle>
            );
          })}
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
                ? 'ring-2 ring-[var(--gb-mint)] bg-[var(--gb-purple-dark)] border-[var(--gb-mint)]'
                : 'bg-[var(--gb-surface-raised)]/70 hover:bg-[var(--gb-surface-raised)] border-[var(--gb-border)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: node.color || '#4ade80' }}
              ></span>
              <span className="text-[9px] uppercase font-bold text-[var(--gb-dim)]">
                {node.type}
              </span>
            </div>
            <div className="font-semibold text-[var(--gb-white)] truncate mt-1.5 text-[11px]" title={node.label}>
              {node.label}
            </div>
          </div>
        ))}
      </div>

      {/* Node Inspection Detail Bar */}
      {selectedNode && (
        <div className="p-3 bg-[var(--gb-purple-dark)]/80 rounded-xl border border-[var(--gb-border-strong)] text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-[var(--gb-white)]">{selectedNode.label}</span>
            <span className="text-[var(--gb-dim)] ml-2">Type: <span className="text-[var(--gb-mint)] font-mono">{selectedNode.type}</span></span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[var(--gb-dim)] hover:text-[var(--gb-white)] text-xs font-semibold"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
