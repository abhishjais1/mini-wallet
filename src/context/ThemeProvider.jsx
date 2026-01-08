import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.jsx';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
