import React from 'react';

/**
 * CyberToggle: Futuristic parallelogram toggle with top-left & bottom-right accent wings
 * Recreates the exact design reference from media_1794381831226_70811103.png:
 * - Slanted parallelogram main body
 * - Dynamic top-left & bottom-right accent wings
 * - Subtle internal top-right & bottom-left accent stripes
 * - High-contrast active state (#f1f5f9 fill with #0f172a text & saturated wings)
 */
export default function CyberToggle({
  active = false,
  onClick,
  variant = 'mint', // 'mint', 'cyan', 'orange', 'red', 'violet'
  size = 'md',      // 'sm', 'md', 'lg'
  icon: Icon,
  children,
  badge,
  className = '',
  disabled = false,
  title,
  ariaLabel,
  type = 'button',
  ...props
}) {
  const sizeClass = {
    sm: 'cyber-toggle-sm',
    md: '',
    lg: 'cyber-toggle-lg'
  }[size] || '';

  const variantClass = {
    red: 'cyber-toggle-red',
    cyan: 'cyber-toggle-cyan',
    blue: 'cyber-toggle-cyan',
    orange: 'cyber-toggle-orange',
    mint: 'cyber-toggle-mint',
    violet: 'cyber-toggle-violet'
  }[variant] || 'cyber-toggle-mint';

  return (
    <button
      type={type}
      role="radio"
      aria-checked={active}
      data-active={active}
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={`cyber-toggle ${active ? 'active' : ''} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {/* Top-Left Accent Wing */}
      <span className="cyber-toggle-wing-tl" aria-hidden="true" />

      {/* Bottom-Right Accent Wing */}
      <span className="cyber-toggle-wing-br" aria-hidden="true" />

      {/* Main Parallelogram Body */}
      <span className="cyber-toggle-body">
        {/* Top-Right Internal Accent Stripe */}
        <span className="cyber-toggle-line-tr" aria-hidden="true" />

        {/* Bottom-Left Internal Accent Stripe */}
        <span className="cyber-toggle-line-bl" aria-hidden="true" />

        {/* Label & Content */}
        <span className="cyber-toggle-content">
          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
          <span>{children}</span>
          {badge !== undefined && badge !== null && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                active
                  ? 'bg-slate-900/15 text-slate-900'
                  : 'bg-violet-950/60 text-violet-300'
              }`}
            >
              {badge}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

