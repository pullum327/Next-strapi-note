'use client';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle(){
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button onClick={toggle}
      className="btn border-[var(--border)] bg-[var(--card)] text-[var(--text)]">
      <span className="h-4 w-4 inline-block">
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" strokeWidth="2"/><path d="M12 2v2m0 16v2M22 12h-2M4 12H2m15.07 6.07-1.41-1.41M8.34 8.34 6.93 6.93m10.14 0-1.41 1.41M8.34 15.66l-1.41 1.41" strokeWidth="2" strokeLinecap="round"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
      <span className="hidden sm:inline">{dark?'Light':'Dark'}</span>
    </button>
  );
}
