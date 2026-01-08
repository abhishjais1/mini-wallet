import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Create context
export const ThemeContext = createContext(null);

/**
 * ThemeProvider component - manages dark/light theme
 * Note: Neo-Fi is dark-only, but this allows for future expansion
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    // Default to dark for Neo-Fi aesthetic
    return true;
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

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
