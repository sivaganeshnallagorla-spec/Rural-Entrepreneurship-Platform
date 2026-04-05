import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Inventory from '@mui/icons-material/Inventory'
import ShoppingBag from '@mui/icons-material/ShoppingBag'
import TrendingUp from '@mui/icons-material/TrendingUp'
import Add from '@mui/icons-material/Add'
import School from '@mui/icons-material/School'
import Calculate from '@mui/icons-material/Calculate'
import Star from '@mui/icons-material/Star'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReviews } from '../../contexts/ReviewContext'
import StatCard from '../shared/StatCard'

const FarmerOverview = () => {
  const { user } = useAuth()
  const { getProductsByFarmer } = useProducts()
  const { getOrdersByFarmer } = useOrders()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { getAverageFarmerRating } = useReviews()
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

  const avgRating = getAverageFarmerRating(user?.id)

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: 'primary.main' }}>
          {t('welcome')}, {user?.name}! 👋
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
          Manage your rural business journey with our modern digital tools.
        </Typography>
      </Box>

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
            title={t('avg_rating') || 'Avg Rating'}
            value={avgRating > 0 ? `${avgRating} ★` : 'No ratings'}
            icon={<Star />}
            color="#fbc02d"
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

        <Grid item xs={12} md={6}>
          <Paper className="glass" sx={{ p: 4, bgcolor: 'rgba(227, 242, 253, 0.4)', border: '1px solid rgba(227, 242, 253, 0.6)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box sx={{ maxWidth: 350 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <School color="primary" fontSize="large" />
                  Skill Center
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Master value-addition, branding, and processing to multiply your income.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<School />}
                onClick={() => navigate('/farmer/skill')}
                sx={{ px: 4, py: 1.5 }}
              >
                Learn Now
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="glass" sx={{ p: 4, bgcolor: 'rgba(232, 245, 233, 0.4)', border: '1px solid rgba(232, 245, 233, 0.6)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box sx={{ maxWidth: 350 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Calculate color="success" fontSize="large" />
                  Smart Tools
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Use our AI-powered calculators to estimate margins and pricing.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<Calculate />}
                onClick={() => navigate('/farmer/tools')}
                sx={{ px: 4, py: 1.5 }}
              >
                Explore Tools
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FarmerOverview
