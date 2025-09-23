import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Verificar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setDarkMode(shouldUseDark);
    updateTheme(shouldUseDark);
  }, []);

  const updateTheme = (isDark: boolean) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-all duration-300 
        ${darkMode 
          ? 'bg-dark-700 hover:bg-dark-600 text-neon-blue-400 hover:shadow-glow-blue' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600'
        }
      `}
      aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <div className="relative">
        {darkMode ? (
          <Sun className="h-5 w-5 animate-glow" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;