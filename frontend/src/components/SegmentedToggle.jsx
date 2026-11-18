import React from 'react';
import CyberToggle from './CyberToggle';

/**
 * SegmentedToggle: Cyber-winged multi-option segment toggle
 * Uses the exact parallelogram + dual accent wings design from reference
 */
export default function SegmentedToggle({
  options = [],        // array of { value, label, icon: Icon, badge, variant }
  value,
  onChange,
  size = 'md',         // 'sm', 'md', 'lg'
  variant = 'mint',    // default accent color: 'mint', 'cyan', 'orange', 'red', 'violet'
  className = ''
}) {
  return (
    <div
      role="group"
      className={`inline-flex items-center flex-wrap gap-1 p-1 bg-[var(--gb-surface)]/80 border border-[var(--gb-border)]/60 rounded-2xl shadow-inner backdrop-blur-md ${className}`}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.value === value;
        // If option doesn't specify a variant, use prop variant or rotate through palette
        const itemVariant = opt.variant || variant;

        return (
          <CyberToggle
            key={opt.value}
            active={isSelected}
            onClick={() => onChange(opt.value)}
            size={size}
            variant={itemVariant}
            icon={opt.icon}
            badge={opt.badge}
            title={opt.title || opt.label}
          >
            {opt.label}
          </CyberToggle>
        );
      })}
    </div>
  );
}
