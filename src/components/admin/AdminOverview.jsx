import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Chip
} from '@mui/material'
import {
  People,
  ShoppingBag,
  Inventory,
  TrendingUp,
  NotificationsActive,
  Assessment,
  Gavel,
  History
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../contexts/ToastContext'
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
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
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

  const QuickStat = ({ title, value, icon, color, trend }) => (
    <Paper 
      className="glass" 
      sx={{ 
        p: 3, 
        height: '100%', 
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle2" color="textSecondary" fontWeight="700" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="900" sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'} fontWeight="700">
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
            <Typography variant="caption" color="textSecondary">since last month</Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
      <Box sx={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.05 }}>
        {React.cloneElement(icon, { sx: { fontSize: '5rem' } })}
      </Box>
    </Paper>
  )

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" fontWeight="900" sx={{ mb: 1, letterSpacing: '-1px' }}>
            System Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Active session: <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{user?.name}</span> • Super Admin Access
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<History />}>View Logs</Button>
          <Button variant="contained" startIcon={<NotificationsActive />}>System Alert</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStat title="Total Farmers" value={stats.totalUsers} icon={<People />} color="#1976d2" trend={12} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStat title="Total Products" value={stats.totalProducts} icon={<Inventory />} color="#2e7d32" trend={8} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStat title="Monthly Orders" value={stats.totalOrders} icon={<ShoppingBag />} color="#ff9800" trend={24} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStat title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp />} color="#9c27b0" trend={18} />
        </Grid>

        {/* System Health & Activity */}
        <Grid item xs={12} md={8}>
          <Paper className="glass" sx={{ p: 3, border: '1px solid var(--glass-border)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment color="primary" /> Platform Growth Analysis
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="7 Days" size="small" component="button" clickable color="primary" />
                <Chip label="30 Days" size="small" component="button" clickable variant="outlined" />
              </Box>
            </Box>
            
            {/* Simulated Chart Area */}
            <Box sx={{ height: 300, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: 2, p: 3 }}>
              {[40, 65, 45, 90, 75, 55, 80, 60, 95, 70, 85, 100].map((height, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    flex: 1, 
                    height: `${height}%`, 
                    bgcolor: 'primary.main', 
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.6 + (i * 0.03),
                    transition: 'all 0.3s',
                    '&:hover': { opacity: 1, transform: 'scaleX(1.1)' }
                  }} 
                />
              ))}
            </Box>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary" display="block">Active Drones</Typography>
                <Typography variant="h5" fontWeight="700">14 UAVs</Typography>
                <LinearProgress variant="determinate" value={85} sx={{ height: 4, borderRadius: 2, mt: 1 }} />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary" display="block">Logistics Load</Typography>
                <Typography variant="h5" fontWeight="700">62% Cap.</Typography>
                <LinearProgress variant="determinate" value={62} sx={{ height: 4, borderRadius: 2, mt: 1, color: 'warning.main' }} />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary" display="block">Server Latency</Typography>
                <Typography variant="h5" fontWeight="700">24ms</Typography>
                <LinearProgress variant="determinate" value={15} sx={{ height: 4, borderRadius: 2, mt: 1, color: 'success.main' }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Live Moderation Queue */}
        <Grid item xs={12} md={4}>
          <Paper className="glass" sx={{ p: 3, border: '1px solid var(--glass-border)', height: '100%' }}>
            <Typography variant="h6" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel color="primary" /> Moderation Queue
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Immediate attention required for platform safety.
            </Typography>
            
            <List>
              <ListItem 
                secondaryAction={
                   <Button size="small" variant="outlined" color="primary">Review</Button>
                }
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.light', fontSize: '0.8rem' }}>IMG</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Flagged Product: Pesticide-X" 
                  secondary="Reported: Prohibited Item"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ opacity: 0.5 }} />
              <ListItem 
                secondaryAction={
                   <Button size="small" variant="outlined" color="primary">Review</Button>
                }
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.light', fontSize: '0.8rem' }}>KYC</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="New Service Provider" 
                  secondary="Verification Pending"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ opacity: 0.5 }} />
              <ListItem 
                secondaryAction={
                   <Button size="small" variant="outlined" color="primary">Review</Button>
                }
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'error.light', fontSize: '0.8rem' }}>TX</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Failed Payout" 
                  secondary="Bank rejection: ID-992"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                />
              </ListItem>
            </List>
            
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 700 }}
              onClick={seedDemoData}
              disabled={demoLoaded}
            >
              {demoLoaded ? 'Demo Data Sync Active ✓' : 'Sync Demo Hub Data'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminOverview
