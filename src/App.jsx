import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import { OrderProvider } from './contexts/OrderContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeModeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AdminDashboard from './pages/AdminDashboard'
import FarmerDashboard from './pages/FarmerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeModeProvider>
      {(theme) => (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LanguageProvider>
            <AuthProvider>
              <ProductProvider>
                <OrderProvider>
                  <NotificationProvider>
                    <ToastProvider>
                      <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute role="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farmer/*"
                    element={
                      <ProtectedRoute role="farmer">
                        <FarmerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/*"
                    element={
                      <ProtectedRoute role="buyer">
                        <BuyerDashboard />
                      </ProtectedRoute>
                    }
                  />
                      </Routes>
                    </ToastProvider>
                  </NotificationProvider>
                </OrderProvider>
              </ProductProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      )}
    </ThemeModeProvider>
  )
}

export default App

