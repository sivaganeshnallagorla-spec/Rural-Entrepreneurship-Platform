import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material'
import {
  People,
  ShoppingBag,
  Inventory,
  TrendingUp
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../contexts/ToastContext'
import StatCard from '../shared/StatCard'
import { demoProducts, demoOrders } from '../../api/demoData'

const AdminOverview = () => {
  const { user } = useAuth()
  const { products, addProduct } = useProducts()
  const { orders, createOrder } = useOrders()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [demoLoaded, setDemoLoaded] = useState(false)

  useEffect(() => {
    // Count registered users dynamically
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    // 6 = admin + farmer + farmer2 + buyer + buyer2 + drone operator
    const totalUsers = 6 + registeredUsers.length
    const totalProducts = products.length
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    setStats({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    })
  }, [products, orders])

  const seedDemoData = () => {
    const currentProductNames = products.map(p => p.name.toLowerCase())

    // Add demo products (skip duplicates by name)
    demoProducts.forEach(dp => {
      if (!currentProductNames.includes(dp.name.toLowerCase())) {
        addProduct({
          ...dp,
          image: (dp.images && dp.images[0]) || '',
          available: true,
          certification: (dp.certifications && dp.certifications[0]) || ''
        })
      }
    })

    // Create demo orders
    demoOrders.forEach(order => {
      createOrder({
        buyerId: order.buyerId,
        buyerName: 'Demo Buyer',
        farmerId: order.farmerId,
        items: order.products?.map(p => ({
          productId: p.id,
          productName: p.name,
          quantity: p.qty,
          price: p.price,
          unit: 'kg'
        })) || [],
        total: order.total,
        status: 'confirmed',
        paymentMethod: 'upi',
        shippingMethod: 'standard'
      })
    })

    setDemoLoaded(true)
    showToast('Demo data loaded successfully!', 'success')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}, {user?.name}!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Platform Overview & Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('users')}
            value={stats.totalUsers}
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('products')}
            value={stats.totalProducts}
            icon={<Inventory />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('orders')}
            value={stats.totalOrders}
            icon={<ShoppingBag />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp />}
            color="#9c27b0"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Quick Actions
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={seedDemoData}
                disabled={demoLoaded}
              >
                {demoLoaded ? 'Demo Data Loaded ✓' : t('load_demo_data') || 'Load demo data'}
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Monitor platform activity, manage users, moderate products, and track orders from this dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminOverview
