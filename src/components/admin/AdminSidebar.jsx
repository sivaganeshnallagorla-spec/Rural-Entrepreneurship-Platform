import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Chip,
  Paper
} from '@mui/material'
import {
  Dashboard,
  People,
  Inventory,
  ShoppingBag,
  School,
  AirplanemodeActive,
  BarChart,
  Notifications,
  Settings,
  AdminPanelSettings,
  SettingsSuggest,
  Work
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 280

const AdminSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/admin' },
    { text: 'Analytics', icon: <BarChart />, path: '/admin/analytics' },
    { text: 'divider' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Products', icon: <Inventory />, path: '/admin/products' },
    { text: 'Equipment Store', icon: <SettingsSuggest />, path: '/admin/equipment' },
    { text: 'Orders', icon: <ShoppingBag />, path: '/admin/orders' },
    { text: 'divider' },
    { text: 'Service Hub', icon: <Work />, path: '/admin/services' },
    { text: 'Drone Operations', icon: <AirplanemodeActive />, path: '/admin/drones' },
    { text: 'Skill Center', icon: <School />, path: '/admin/skill' },
    { text: 'divider' },
    { text: 'Notifications', icon: <Notifications />, path: '/admin/notifications' }
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid var(--glass-border)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Toolbar sx={{ px: 3, py: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <AdminPanelSettings sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
            Rural<span style={{ color: 'var(--primary-color)' }}>Admin</span>
          </Typography>
        </Box>
        <Chip 
          label="Super Admin" 
          size="small" 
          color="primary" 
          sx={{ fontWeight: 800, fontSize: '0.7rem', height: 20 }} 
        />
      </Toolbar>

      <Box sx={{ overflow: 'auto', px: 2 }}>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            item.text === 'divider' ? (
              <Divider key={`divider-${index}`} sx={{ my: 2, opacity: 0.6 }} />
            ) : (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                    color: isActive(item.path) ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive(item.path) ? 'primary.dark' : 'rgba(46, 125, 50, 0.08)',
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive(item.path) ? 'white' : 'inherit',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '0.95rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            )
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', p: 3 }}>
        <Paper className="glass" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(46, 125, 50, 0.05)', border: '1px solid rgba(46, 125, 50, 0.1)' }}>
          <Typography variant="caption" fontWeight="800" color="primary.main" display="block" gutterBottom>
            SYSTEM STATUS
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', animation: 'pulse 2s infinite' }} />
            <Typography variant="body2" fontWeight="600">All Systems Go</Typography>
          </Box>
        </Paper>
      </Box>
    </Drawer>
  )
}

export default AdminSidebar
