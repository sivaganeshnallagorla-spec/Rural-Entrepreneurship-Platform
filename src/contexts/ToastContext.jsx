import React, { createContext, useCallback, useContext, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [severity, setSeverity] = useState('info')

	const showToast = useCallback((msg, sev = 'info') => {
		setMessage(msg)
		setSeverity(sev)
		setOpen(true)
	}, [])

	const handleClose = (_, reason) => {
		if (reason === 'clickaway') return
		setOpen(false)
	}

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
				<Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	)
}

export const useToast = () => {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within ToastProvider')
	return ctx
}
