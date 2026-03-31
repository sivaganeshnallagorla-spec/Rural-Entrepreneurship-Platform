import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminOverview from '../components/admin/AdminOverview'
import UserManagement from '../components/admin/UserManagement'
import Analytics from '../components/admin/Analytics'
import ProductModeration from '../components/admin/ProductModeration'
import EquipmentManagement from '../components/admin/EquipmentManagement'
import OrderManagement from '../components/admin/OrderManagement'
import ServicesHubManagement from '../components/admin/ServicesHubManagement'
import KnowledgeManagement from '../components/admin/KnowledgeManagement'
import DroneManagement from '../components/admin/DroneManagement'
import NotificationsComponent from '../components/Notifications'
import { Box, Paper, Typography, Tooltip, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Security, Search, Settings, Help } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 280

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
        </Box>
      </Box>
    </Box>
  )
}

export default AdminDashboard

