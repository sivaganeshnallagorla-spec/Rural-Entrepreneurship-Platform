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
      <Typography variant="h4" gutterBottom>
        {t('welcome')}, {user?.name}!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Discover unique rural products and support local farmers
      </Typography>

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
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Start Shopping</Typography>
              <Button
                variant="contained"
                startIcon={<Explore />}
                onClick={() => navigate('/buyer/browse')}
              >
                Browse Products
              </Button>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Explore a wide range of value-added products from rural farmers across India.
            </Typography>
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

