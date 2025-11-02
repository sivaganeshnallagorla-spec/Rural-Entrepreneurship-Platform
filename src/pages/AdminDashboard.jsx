import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AdminOverview from '../components/admin/AdminOverview'
import UserManagement from '../components/admin/UserManagement'
import Analytics from '../components/admin/Analytics'
import ProductModeration from '../components/admin/ProductModeration'
import OrderManagement from '../components/admin/OrderManagement'
import NotificationsComponent from '../components/Notifications'
import { Container, Box } from '@mui/material'

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="products" element={<ProductModeration />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="notifications" element={<NotificationsComponent />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default AdminDashboard

