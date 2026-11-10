import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  Pill,
  BookOpen,
  ShieldAlert,
  TrendingUp,
  Share2,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Clinical Dashboard' },
    { to: '/intake', icon: ClipboardList, label: 'Case Intake & Pariksha' },
    { to: '/samprapti', icon: Activity, label: 'Samprapti Modeler' },
    { to: '/chikitsa', icon: Pill, label: 'Chikitsa & Rx Planner' },
    { to: '/rag', icon: BookOpen, label: 'Brihat Trayi RAG' },
    { to: '/safety', icon: ShieldAlert, label: 'AyurGuard Safety' },
    { to: '/tracker', icon: TrendingUp, label: 'Recovery Tracker' },
    { to: '/graph', icon: Share2, label: 'Knowledge Graph' },
    { to: '/profile', icon: UserCheck, label: 'Practitioner Profile' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800
      transform transition-transform duration-200 ease-in-out md:translate-x-0 pt-16
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
        <nav className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Clinical Workflow
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition
                ${isActive
                  ? 'bg-emerald-800 text-amber-200 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                }
              `}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info box */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs">
          <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
            <span>IIT Bombay Techfest</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            AyushTech Innovate 2026–27
          </p>
          <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            Ministry of Ayush &bull; AIIA Grounded
          </div>
        </div>
      </div>
    </aside>
  );
}

