import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundFx } from '../services/soundFx';

export type AppTheme = 'neon_cyber';

interface ThemeContextType {
  theme: AppTheme;
  setThemeMode: (newTheme: AppTheme) => void;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('quizwiz_sound');
    return saved !== 'disabled';
  });

  // Always enforce single dark cosmic theme on HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'theme-artistic', 'theme-playful', 'theme-minimal');
    root.classList.add('dark', 'theme-cyber');
  }, []);

  const setThemeMode = () => {};
  const toggleTheme = () => {};

  const toggleSound = () => {
    const isMutedNow = soundFx.toggleMute();
    setSoundEnabled(!isMutedNow);
    localStorage.setItem('quizwiz_sound', isMutedNow ? 'disabled' : 'enabled');
    if (!isMutedNow) soundFx.playPop();
  };

  return (
    <ThemeContext.Provider value={{ theme: 'neon_cyber', setThemeMode, toggleTheme, soundEnabled, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


