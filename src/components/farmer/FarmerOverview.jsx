import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button
} from '@mui/material'
import {
  Inventory,
  ShoppingBag,
  TrendingUp,
  Add,
  School
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
)

const FarmerOverview = () => {
  const { user } = useAuth()
  const { getProductsByFarmer } = useProducts()
  const { getOrdersByFarmer } = useOrders()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    const products = getProductsByFarmer(user?.id)
    const orders = getOrdersByFarmer(user?.id)
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders
    })
  }, [user, getProductsByFarmer, getOrdersByFarmer])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}, {user?.name}!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Manage your products, inventory, and orders
      </Typography>

      <Grid container spacing={3}>
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<ShoppingBag />}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Quick Actions</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/farmer/products/add')}
              >
                {t('addProduct')}
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Add new products, manage inventory, track orders, and connect with buyers.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Knowledge Center
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Learn farming techniques, value-addition processing, branding, digital skills, and more.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<School />}
                onClick={() => navigate('/farmer/knowledge')}
              >
                Explore Resources
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FarmerOverview

