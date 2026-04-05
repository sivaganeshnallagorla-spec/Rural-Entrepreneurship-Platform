import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminOverview from '../components/admin/AdminOverview'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'

import Security from '@mui/icons-material/Security'
import Search from '@mui/icons-material/Search'
import Settings from '@mui/icons-material/Settings'
import Help from '@mui/icons-material/Help'
import { useAuth } from '../contexts/AuthContext'

// Lazy loaded components for code splitting (Optimized for 2G)
const UserManagement = lazy(() => import('../components/admin/UserManagement'))
const Analytics = lazy(() => import('../components/admin/Analytics'))
const ProductModeration = lazy(() => import('../components/admin/ProductModeration'))
const EquipmentManagement = lazy(() => import('../components/admin/EquipmentManagement'))
const OrderManagement = lazy(() => import('../components/admin/OrderManagement'))
const ServicesHubManagement = lazy(() => import('../components/admin/ServicesHubManagement'))
const KnowledgeManagement = lazy(() => import('../components/admin/KnowledgeManagement'))
const DroneManagement = lazy(() => import('../components/admin/DroneManagement'))
const NotificationsComponent = lazy(() => import('../components/Notifications'))

const drawerWidth = 280

const LoadingState = () => (
  <Stack 
    alignItems="center" 
    justifyContent="center" 
    sx={{ height: '300px', width: '100%' }}
  >
    <CircularProgress size={32} thickness={5} sx={{ color: '#2e7d32' }} />
    <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary', fontWeight: 600 }}>
      Optimizing for your connection...
    </Typography>
  </Stack>
)

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenu = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8faf9' }}>
      <AdminSidebar />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Admin Header */}
        <Paper square elevation={0} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 4, py: 2, 
          bgcolor: 'background.paper',
          borderBottom: '1px solid var(--glass-border)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Typography variant="h6" fontWeight="700">Platform Control Center</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Search"><IconButton size="small"><Search /></IconButton></Tooltip>
            <Tooltip title="Help Center"><IconButton size="small"><Help /></IconButton></Tooltip>
            <Tooltip title="Settings"><IconButton size="small"><Settings /></IconButton></Tooltip>
            <Box 
              onClick={handleMenu} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                ml: 2, 
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
              }}
            >
              <Avatar 
                src={user?.avatar} 
                sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 800 }}
              >
                {user?.name?.[0] || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" fontWeight="700" lineHeight="1">{user?.name}</Typography>
                <Typography variant="caption" color="textSecondary">Administrator</Typography>
              </Box>
            </Box>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>My Profile</MenuItem>
              <MenuItem onClick={handleClose}>Security Settings</MenuItem>
              <MenuItem onClick={() => { handleClose(); logout(); }}>Logout System</MenuItem>
            </Menu>
          </Box>
        </Paper>

        <Box component="main" sx={{ p: 4, flexGrow: 1 }}>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="products" element={<ProductModeration />} />
              <Route path="equipment" element={<EquipmentManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="services" element={<ServicesHubManagement />} />
              <Route path="skill" element={<KnowledgeManagement />} />
              <Route path="drones" element={<DroneManagement />} />
              <Route path="notifications" element={<NotificationsComponent />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminDashboard

