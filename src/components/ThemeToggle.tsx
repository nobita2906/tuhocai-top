'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('tuhocai_theme_v2');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('tuhocai_theme_v2', 'dark');
        localStorage.removeItem('theme');
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('tuhocai_theme_v2', 'light');
        localStorage.removeItem('theme');
      } catch (_) {}
    }

    window.dispatchEvent(new Event('theme-change'));
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.05] p-2" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      title={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
      aria-label="Đổi giao diện Sáng / Tối"
    >
      {theme === 'light' ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-300 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
