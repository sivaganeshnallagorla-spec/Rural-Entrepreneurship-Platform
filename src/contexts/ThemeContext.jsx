import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2e7d32' : '#66bb6a', // Green
          },
          secondary: {
            main: mode === 'light' ? '#ff6f00' : '#ffa726', // Amber
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: 'Roboto, Inter, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {typeof children === 'function' ? children(theme) : children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => React.useContext(ThemeModeContext);
