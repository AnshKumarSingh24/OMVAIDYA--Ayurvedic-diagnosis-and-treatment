import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Sparkles, 
  X, 
  Loader2, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import ChamferButton from './ChamferButton';

/**
 * ClinicalCard / GlassPanel: Deep indigo/purple card container with subtle violet border
 */
export function ClinicalCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = 'p-5',
  accentColor = null // 'mint', 'orange', 'violet', 'cyan', 'rose'
}) {
  const accentBorder = {
    mint: 'border-l-4 border-l-emerald-400',
    orange: 'border-l-4 border-l-orange-500',
    violet: 'border-l-4 border-l-violet-400',
    cyan: 'border-l-4 border-l-sky-400',
    rose: 'border-l-4 border-l-rose-500'
  }[accentColor] || '';

  return (
    <div className={`bg-[#20194f]/90 dark:bg-[#20194f]/90 border border-violet-400/30 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-200 ${accentBorder} ${className}`}>
      {(title || Icon || badge || action) && (
        <div className={`px-5 py-4 border-b border-violet-400/20 flex items-center justify-between gap-3 ${headerClassName}`}>
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-violet-950/70 border border-violet-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">{title}</h3>
              {subtitle && <p className="text-[11px] text-violet-200/70 truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}

/**
 * ClinicalButton: Reusable chamfered button mapping directly to ChamferButton
 */
export function ClinicalButton({
  children,
  variant = 'primary', // primary, secondary/orange, ghost/outline, danger
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const mappedVariant = {
    primary: 'primary',
    secondary: 'orange',
    outline: 'ghost',
    ghost: 'ghost',
    danger: 'danger'
  }[variant] || 'primary';

  return (
    <ChamferButton
      variant={mappedVariant}
      size={size}
      loading={loading}
      disabled={disabled}
      icon={icon}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {children}
    </ChamferButton>
  );
}

/**
 * StatusBadge: Lightweight pills with GutBalance color language
 */
export function StatusBadge({ status = 'ready', label, className = '' }) {
  const configs = {
    ready: {
      bg: 'bg-violet-950/60 text-violet-200 border-violet-400/40',
      icon: Info,
      defaultLabel: 'Ready'
    },
    in_clarification: {
      bg: 'bg-orange-950/70 text-orange-300 border-orange-400/40',
      icon: Loader2,
      defaultLabel: 'Clarifying Intake'
    },
    analyzing: {
      bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-400/40 animate-pulse',
      icon: Sparkles,
      defaultLabel: 'Reasoning...'
    },
    analyzed: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
      icon: CheckCircle,
      defaultLabel: 'Analyzed'
    },
    clinician_review: {
      bg: 'bg-sky-950/70 text-sky-300 border-sky-400/40',
      icon: Info,
      defaultLabel: 'Clinician Review Required'
    },
    verified: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
      icon: ShieldCheck,
      defaultLabel: 'Vaidya Verified'
    },
    warning: {
      bg: 'bg-amber-950/70 text-amber-300 border-amber-400/40',
      icon: AlertTriangle,
      defaultLabel: 'Warning'
    },
    safety_hold: {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-400/50',
      icon: AlertTriangle,
      defaultLabel: 'AyurGuard Safety Hold'
    }
  };

  const config = configs[status] || configs.ready;
  const TagIcon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${config.bg} ${className}`}>
      <TagIcon className="w-3.5 h-3.5" />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
}

/**
 * EvidenceBadge: Sanskrit epistemological criteria (Pramana)
 */
export function EvidenceBadge({ level = 'aptopadesha', label }) {
  const configs = {
    aptopadesha: {
      text: 'Aptopadesha (Canonical Authority)',
      color: 'bg-amber-950/60 text-amber-300 border-amber-400/40'
    },
    pratyaksha: {
      text: 'Pratyaksha (Direct Clinical Observation)',
      color: 'bg-emerald-950/60 text-emerald-300 border-emerald-400/40'
    },
    anumana: {
      text: 'Anumana (Logical Diagnostic Inference)',
      color: 'bg-violet-950/60 text-violet-300 border-violet-400/40'
    }
  };

  const conf = configs[level] || configs.aptopadesha;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${conf.color}`}>
      <BookOpen className="w-3.5 h-3.5" />
      <span>{label || conf.text}</span>
    </span>
  );
}

/**
 * ClinicalModal: Accessible dialog with Escape key and backdrop dismissal
 */
export function ClinicalModal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0724]/80 backdrop-blur-md animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className={`relative bg-[#20194f] border border-violet-400/40 rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden z-10 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-violet-400/20 flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-violet-300 hover:text-white hover:bg-violet-900/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200 text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#171342]/80 border-t border-violet-400/20 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * EmptyState: Actionable placeholder with deep purple translucent style
 */
export function EmptyState({
  title = 'No case data available',
  description = 'Start by completing patient intake or clarifying observations.',
  icon: Icon = Info,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`bg-[#20194f]/60 border border-dashed border-violet-400/30 rounded-2xl p-8 text-center space-y-3.5 backdrop-blur-sm ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-violet-950/70 border border-violet-400/40 text-emerald-400 mx-auto flex items-center justify-center shadow-md">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-violet-200/70 max-w-sm mx-auto mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && (
        <div className="pt-2">
          <ChamferButton variant="primary" size="sm" onClick={onAction}>
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </ChamferButton>
        </div>
      )}
    </div>
  );
}
