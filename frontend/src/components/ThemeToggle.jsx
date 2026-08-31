import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-yellow-500 dark:text-sky-300 hover:scale-110 active:scale-95 transition-all shadow-md focus:outline-none border border-slate-100 dark:border-slate-700"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {darkMode ? <Sun className="w-5 h-5 animate-pulse" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
