import React from 'react';
import { Loader2, ArrowRight, ChevronRight } from 'lucide-react';

/**
 * ChamferButton — 3D Offset-Block style button.
 * Same website colors (mint / orange / ghost / danger).
 * The chunky dark offset shadow gives a pressed-block 3D depth
 * matching the reference design.  Hover lifts; active presses down.
 *
 * The wrapper <span> adds bottom-right padding so parent containers
 * never clip the offset shadow.
 */
export default function ChamferButton({
  children,
  variant = 'primary', // 'primary' | 'mint' | 'orange' | 'ghost' | 'purple' | 'danger' | 'icon'
  size = 'md',         // 'sm' | 'md' | 'lg'
  icon: Icon,
  withArrow = false,
  withChevron = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  title,
  ariaLabel,
  ...props
}) {
  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5 tracking-wide'
  }[size] || 'text-sm px-6 py-3 gap-2';

  const variantClass = {
    primary: 'gb-chamfer-btn-primary',
    mint:    'gb-chamfer-btn-primary',
    orange:  'gb-chamfer-btn-orange',
    ghost:   'gb-chamfer-btn-ghost',
    purple:  'gb-chamfer-btn-ghost',
    danger:  'gb-chamfer-btn-danger',
    icon:    'gb-chamfer-btn-ghost !p-2',
  }[variant] || 'gb-chamfer-btn-primary';

  return (
    /*
     * Wrapper gives 6px breathing room bottom-right so the
     * offset box-shadow is never clipped by overflow:hidden parents.
     */
    <span className="inline-block pb-[6px] pr-[6px] leading-none">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        title={title}
        aria-label={ariaLabel || title}
        className={`gb-chamfer-btn ${variantClass} ${sizeClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="truncate">{children || 'Loading…'}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 pointer-events-none">
            {Icon && (
              React.isValidElement(Icon)
                ? Icon
                : <Icon className="w-4 h-4 shrink-0 text-current" />
            )}
            {children && <span>{children}</span>}
            {withArrow   && <ArrowRight   className="w-4 h-4 shrink-0" />}
            {withChevron && <ChevronRight className="w-4 h-4 shrink-0" />}
          </span>
        )}
      </button>
    </span>
  );
}

