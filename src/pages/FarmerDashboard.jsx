import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FarmerOverview from '../components/farmer/FarmerOverview'
import ProductList from '../components/farmer/ProductList'
import AddProduct from '../components/farmer/AddProduct'
import EditProduct from '../components/farmer/EditProduct'
import FarmerOrders from '../components/farmer/FarmerOrders'
import NotificationsComponent from '../components/Notifications'
import Profile from '../components/farmer/Profile'
import { Container, Box } from '@mui/material'

const FarmerDashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route index element={<FarmerOverview />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationsComponent />} />
          <Route path="*" element={<Navigate to="/farmer" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default FarmerDashboard

