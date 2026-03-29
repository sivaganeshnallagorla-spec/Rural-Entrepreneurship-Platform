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
import { WishlistProvider } from './contexts/WishlistContext'
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext'
import { ComparisonProvider } from './contexts/ComparisonContext'
import { KnowledgeProvider } from './contexts/KnowledgeContext'
import { DroneProvider } from './contexts/DroneContext'
import { PricingProvider } from './contexts/PricingContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AdminDashboard from './pages/AdminDashboard'
import FarmerDashboard from './pages/FarmerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import DroneOperatorDashboard from './pages/DroneOperatorDashboard'
import ProductOriginPage from './pages/ProductOriginPage'
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
                    <KnowledgeProvider>
                      <ToastProvider>
                        <WishlistProvider>
                          <RecentlyViewedProvider>
                            <ComparisonProvider>
                              <DroneProvider>
                                <PricingProvider>
                                  <Routes>
                                    <Route path="/" element={<Landing />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<SignUp />} />
                                    <Route path="/product-origin/:id" element={<ProductOriginPage />} />
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
                                    <Route
                                      path="/drone-operator/*"
                                      element={
                                        <ProtectedRoute role="drone_operator">
                                          <DroneOperatorDashboard />
                                        </ProtectedRoute>
                                      }
                                    />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                  </Routes>
                                </PricingProvider>
                              </DroneProvider>
                            </ComparisonProvider>
                          </RecentlyViewedProvider>
                        </WishlistProvider>
                      </ToastProvider>
                    </KnowledgeProvider>
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

