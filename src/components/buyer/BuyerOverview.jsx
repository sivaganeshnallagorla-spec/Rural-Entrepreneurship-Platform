import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material'
import {
  ShoppingBag,
  Inventory,
  Favorite,
  Explore
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'
import RecentlyViewed from './RecentlyViewed'
import StatCard from '../shared/StatCard'

const BuyerOverview = () => {
  const { user } = useAuth()
  const { getOrdersByBuyer } = useOrders()
  const { products } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    const orders = getOrdersByBuyer(user?.id)
    const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length

    setStats({
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders
    })
  }, [user, getOrdersByBuyer, products])

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: 'primary.main' }}>
          {t('welcome')}, {user?.name}! 🛒
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
          Discover unique rural excellence and support our farming communities.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Available Products"
            value={stats.totalProducts}
            icon={<Inventory />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('orders')}
            value={stats.totalOrders}
            icon={<ShoppingBag />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Orders"
            value={stats.pendingOrders}
            icon={<Favorite />}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper className="glass" sx={{ p: 4, mt: 2, border: '1px solid var(--glass-border)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  Ready to explore?
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Discover curated artisan collections and premium farm-fresh processed goods.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Explore />}
                onClick={() => navigate('/buyer/browse')}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                Start Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <RecentlyViewed />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BuyerOverview

