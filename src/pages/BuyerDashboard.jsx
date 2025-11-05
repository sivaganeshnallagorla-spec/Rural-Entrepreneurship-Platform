import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BuyerOverview from '../components/buyer/BuyerOverview'
import BrowseProducts from '../components/buyer/BrowseProducts'
import ProductDetails from '../components/buyer/ProductDetails'
import BuyerOrders from '../components/buyer/BuyerOrders'
import Cart from '../components/buyer/Cart'
import NotificationsComponent from '../components/Notifications'
import Profile from '../components/buyer/Profile'
import Wishlist from '../components/buyer/Wishlist'
import RecentlyViewed from '../components/buyer/RecentlyViewed'
import ProductComparison from '../components/buyer/ProductComparison'
import { Container, Box } from '@mui/material'

const BuyerDashboard = () => {
  const [cartOpen, setCartOpen] = useState(false)

  const handleCartClick = () => {
    setCartOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onCartClick={handleCartClick} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route index element={<BuyerOverview />} />
          <Route path="browse" element={<BrowseProducts />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="compare" element={<ProductComparison />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationsComponent />} />
          <Route path="*" element={<Navigate to="/buyer" replace />} />
        </Routes>
      </Container>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  )
}

export default BuyerDashboard

