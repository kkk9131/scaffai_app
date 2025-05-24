import React, { createContext, useContext, useState, ReactNode } from 'react';

// Theme colors
const darkTheme = {
  primary: '#6E56CF',
  primaryDark: '#4E3A9C',
  secondary: '#272B36',
  accent: '#FF4D8D',
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  background: '#121212',
  cardBackground: '#1E1E1E',
  overlayBackground: 'rgba(0, 0, 0, 0.7)',
  inputBackground: '#2C2C2C',
  border: '#333333',
  error: '#FF4D4F',
  success: '#52C41A',
  warning: '#FAAD14',
};

const lightTheme = {
  primary: '#5E46BF',
  primaryDark: '#4E3A9C',
  secondary: '#F0F0F0',
  accent: '#E6367E',
  text: '#000000',
  secondaryText: '#666666',
  background: '#FFFFFF',
  cardBackground: '#F5F5F5',
  overlayBackground: 'rgba(255, 255, 255, 0.7)',
  inputBackground: '#EFEFEF',
  border: '#E0E0E0',
  error: '#FF4D4F',
  success: '#52C41A',
  warning: '#FAAD14',
};

interface ThemeContextType {
  colors: typeof darkTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const colors = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}