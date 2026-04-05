import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

import ShoppingBag from '@mui/icons-material/ShoppingBag'
import Inventory from '@mui/icons-material/Inventory'
import Favorite from '@mui/icons-material/Favorite'
import Explore from '@mui/icons-material/Explore'
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

  const [spendData, setSpendData] = useState([])

  useEffect(() => {
    const orders = getOrdersByBuyer(user?.id)
    const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length

    setStats({
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders
    })

    // Process spend data for chart
    const monthlySpend = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt)
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const key = `${month} ${year}`
      
      const existing = acc.find(d => d.name === key)
      if (existing) {
        existing.spend += order.total || 0
      } else {
        acc.push({ name: key, spend: order.total || 0, sortKey: date.getTime() })
      }
      return acc
    }, [])

    // Sort by date
    monthlySpend.sort((a, b) => a.sortKey - b.sortKey)
    setSpendData(monthlySpend)
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

        <Grid item xs={12} md={8}>
          <Paper className="glass" sx={{ p: 3, border: '1px solid var(--glass-border)', height: '400px' }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Track My Spend
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Monthly overview of your purchases
            </Typography>
            {spendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={spendData}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-main)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary-main)" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="spend" radius={[6, 6, 0, 0]} fill="url(#spendGradient)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="70%">
                <Typography color="textSecondary">No spending data available yet</Typography>
              </Box>
            )}
          </Paper>
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

