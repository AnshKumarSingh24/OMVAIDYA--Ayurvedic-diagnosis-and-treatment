import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import ChamferButton from './ChamferButton';
import ThemeToggle from './ThemeToggle';
import OmVaidyaLogo from './OmVaidyaLogo';

/**
 * TopNavigation: Recreates the exact GutBalance floating dark navigation header
 */
export default function TopNavigation({
  isDark = true,
  onToggleTheme,
  activePatientId,
  patients = [],
  onSelectPatient,
  onNewPatient,
  isDashboard = false,
  onToggleSidebar
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Classical Science', href: '/#how-it-works' },
    { label: 'Brihat Trayi Corpus', href: '/#brihat-trayi' },
    { label: 'AyurGuard Safety', href: '/#safety-engine' },
    { label: 'Live Sandbox', href: '/#demo-sandbox' },
    { label: 'FAQ', href: '/#faq' }
  ];

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6">
      <div className="max-w-[1280px] mx-auto bg-[var(--gb-surface)] border border-[var(--gb-border)] rounded-2xl px-4 sm:px-6 py-2.5 shadow-xl backdrop-blur-xl flex items-center justify-between gap-3 transition-colors duration-200">
        
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          {isDashboard && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded-xl text-[var(--gb-dim)] hover:text-[var(--gb-white)] hover:bg-[var(--gb-surface-raised)] md:hidden transition"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <a href="/" className="flex items-center gap-2.5 group">
            {/* Official ॐ Vaidya Lotus Sacred Logo */}
            <OmVaidyaLogo size={38} animate={true} className="group-hover:scale-105 transition-transform duration-300" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-[var(--gb-white)] tracking-wider">
                  <span className="text-amber-400 font-bold mr-1">ॐ</span>VAIDYA
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-[var(--gb-mint)] font-mono font-bold border border-emerald-400/30 hidden sm:inline-block">
                  CDSS
                </span>
              </div>
              <p className="text-[10px] text-[var(--gb-dim)] tracking-tight font-medium hidden sm:block">
                Clinical &amp; Practitioner Intelligence
              </p>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        {!isDashboard && (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[var(--gb-muted)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 hover:text-[var(--gb-mint)] transition-colors duration-150 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--gb-mint)] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Dashboard Center Indicator */}
        {isDashboard && (
          <div className="hidden xl:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] text-[var(--gb-mint)]">
              <Cpu className="w-3.5 h-3.5 text-[var(--gb-mint)]" />
              <span className="font-semibold">AyurParam 2.9B</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gb-mint)] animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] text-[var(--gb-orange)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gb-orange)]" />
              <span className="font-semibold">AyurGuard Active</span>
            </div>
          </div>
        )}

        {/* Right: Controls & Primary Chamfer Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Case Workspace Indicator */}
          {isDashboard && (
            <div className="flex items-center gap-1.5">
              {activePatient && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--gb-surface-raised)] border border-[var(--gb-border)] text-xs font-semibold text-[var(--gb-white)] max-w-[200px] sm:max-w-[260px] shadow-sm"
                  title={`Active Patient: ${activePatient.full_name}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--gb-mint)] animate-pulse shrink-0" />
                  <span className="truncate">{activePatient.full_name} ({activePatient.age}y &bull; {activePatient.prakriti})</span>
                </div>
              )}

              <ChamferButton
                variant="orange"
                size="sm"
                onClick={onNewPatient}
                title="Start New Patient Case Intake"
                className="!py-1.5 !px-3 shrink-0"
              >
                + Intake
              </ChamferButton>
            </div>
          )}

          {/* Quick link to Case Workspace if on Landing */}
          {!isDashboard && (
            <ChamferButton
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex !py-1.5 !px-3"
              onClick={() => {
                localStorage.setItem('ayuvaidya_onboarded', 'true');
                navigate('/case');
              }}
            >
              Case Workspace
            </ChamferButton>
          )}

          {/* Reusable Theme Toggle - Only provided after entering website */}
          {isDashboard && (
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          )}

          {/* Primary Chamfered Action Button */}
          {!isDashboard ? (
            <ChamferButton
              variant="primary"
              size="sm"
              withArrow
              onClick={() => navigate('/onboarding')}
              className="text-xs !py-2 !px-4"
            >
              Personalised Intake
            </ChamferButton>
          ) : (
            <ChamferButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/case')}
              className="text-xs !py-1.5 !px-3.5 hidden sm:inline-flex"
            >
              Active Case
            </ChamferButton>
          )}

          {/* Mobile hamburger menu for landing */}
          {!isDashboard && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-violet-300 hover:text-white hover:bg-violet-900/50 lg:hidden transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation for Landing */}
      {!isDashboard && mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-[1280px] mx-auto bg-[#171342]/98 border border-violet-400/40 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-200 hover:text-emerald-300 hover:bg-violet-950/40 rounded-lg transition"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-violet-400/20 flex flex-col gap-2">
            <ChamferButton
              variant="primary"
              size="md"
              withArrow
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/onboarding');
              }}
              className="w-full justify-center"
            >
              Personalised Intake
            </ChamferButton>
          </div>
        </div>
      )}
    </header>
  );
}

