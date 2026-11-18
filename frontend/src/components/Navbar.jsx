import React from 'react';
import TopNavigation from './TopNavigation';

export default function Navbar({
  patients = [],
  activePatientId,
  onSelectPatient,
  onNewPatient,
  isDark,
  onToggleTheme,
  onToggleSidebar
}) {
  return (
    <TopNavigation
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      activePatientId={activePatientId}
      patients={patients}
      onSelectPatient={onSelectPatient}
      onNewPatient={onNewPatient}
      isDashboard={true}
      onToggleSidebar={onToggleSidebar}
    />
  );
}
