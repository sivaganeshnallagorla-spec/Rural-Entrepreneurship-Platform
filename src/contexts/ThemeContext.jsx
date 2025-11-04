import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createTheme } from '@mui/material/styles'

const ThemeModeContext = createContext()

const getInitialMode = () => {
	try {
		const stored = localStorage.getItem('themeMode')
		if (stored === 'light' || stored === 'dark') return stored
	} catch {}
	// prefer system
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	return prefersDark ? 'dark' : 'light'
}

export const ThemeModeProvider = ({ children }) => {
	const [mode, setMode] = useState(getInitialMode)

	useEffect(() => {
		try { localStorage.setItem('themeMode', mode) } catch {}
	}, [mode])

	const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'))

	const theme = useMemo(() => createTheme({
		palette: {
			mode,
			primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
			secondary: { main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
			background: mode === 'dark' ? { default: '#121212', paper: '#1e1e1e' } : { default: '#f5f5f5', paper: '#ffffff' },
		},
		typography: {
			fontFamily: 'Roboto, Arial, sans-serif',
			h4: { fontWeight: 600 },
			h5: { fontWeight: 600 },
		},
	}), [mode])

	const value = { mode, toggleMode }

	return (
		<ThemeModeContext.Provider value={value}>
			{children(theme)}
		</ThemeModeContext.Provider>
	)
}

export const useThemeMode = () => {
	const ctx = useContext(ThemeModeContext)
	if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
	return ctx
}
