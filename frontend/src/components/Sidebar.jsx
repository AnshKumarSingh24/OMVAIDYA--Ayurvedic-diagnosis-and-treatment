import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  Activity,
  Pill,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Share2,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const sections = [
    {
      heading: 'Active Case',
      items: [
        { to: '/overview', icon: LayoutDashboard, label: 'Clinical Overview' },
        { to: '/case', icon: Sparkles, label: 'Case Workspace' },
        { to: '/pathology', icon: Activity, label: 'Diagnostic Pathology' },
        { to: '/intake', icon: ClipboardList, label: 'Intake & Pariksha' }
      ]
    },
    {
      heading: 'Classical Sources & Audit',
      items: [
        { to: '/rag', icon: BookOpen, label: 'Brihat Trayi RAG' },
        { to: '/graph', icon: Share2, label: 'Knowledge Graph' },
        { to: '/tracker', icon: TrendingUp, label: 'Recovery Tracker' },
        { to: '/profile', icon: UserCheck, label: 'Practitioner Profile' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0a0724]/75 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[var(--gb-surface)] border-r border-[var(--gb-border)]
        transform transition-transform duration-200 ease-in-out pt-16
        md:static md:z-auto md:translate-x-0 md:pt-0 md:h-[calc(100vh-5rem)] md:sticky md:top-20 md:shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="space-y-4">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--gb-dim)]">
                  {sec.heading}
                </div>
                {sec.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150
                      ${isActive
                        ? 'bg-[var(--gb-mint)] text-white dark:text-[#0b1a2b] shadow-md shadow-emerald-500/20 scale-[1.01] font-extrabold'
                        : 'text-[var(--gb-muted)] hover:bg-[var(--gb-surface-raised)] hover:text-[var(--gb-white)]'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          {/* Footer info box */}
          <div className="p-3.5 bg-[var(--gb-surface-raised)] rounded-2xl border border-[var(--gb-border)] text-xs shadow-sm">
            <div className="font-extrabold text-[var(--gb-white)] flex items-center justify-between">
              <span>IIT Bombay Techfest</span>
              <span className="w-2 h-2 rounded-full bg-[var(--gb-mint)] animate-pulse" />
            </div>
            <p className="text-[11px] text-[var(--gb-dim)] mt-1">
              AyushTech Innovate 2026–27
            </p>
            <div className="mt-2 text-[10px] text-[var(--gb-mint)] font-bold flex items-center gap-1">
              <span>Ministry of Ayush &bull; AIIA Grounded</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
