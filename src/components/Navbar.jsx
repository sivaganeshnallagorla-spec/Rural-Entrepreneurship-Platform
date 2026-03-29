import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import {
  ShoppingCart,
  Notifications,
  AccountCircle,
  ExitToApp,
  Translate,
  DarkMode,
  LightMode,
  Favorite,
  CompareArrows
} from '@mui/icons-material'
import { useThemeMode } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useComparison } from '../contexts/ComparisonContext'

const Navbar = ({ onCartClick }) => {
  const { user, logout } = useAuth()
  const { getUnreadCount } = useNotifications()
  const { language, setLanguage, t, availableLanguages } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)
  const unreadCount = getUnreadCount(user?.id) || 0
  const { mode, toggleMode } = useThemeMode()
  const { wishlist } = useWishlist()
  const { comparisonItems } = useComparison()

  /** Route paths use hyphens (e.g. drone-operator), roles use snake_case in data. */
  const rolePathSegment = user?.role ? user.role.replace(/_/g, '-') : ''

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleClose()
  }

  const getRoleLabel = () => {
    if (!user?.role) return 'User'
    if (user.role === 'drone_operator') return t('drone_operator')
    if (user.role === 'admin') return t('admin')
    if (user.role === 'farmer') return t('farmer')
    if (user.role === 'buyer') return t('buyer')
    return 'User'
  }

  const languageLabels = {
    en: 'English',
    hi: 'हिंदी',
    te: 'తెలుగు',
    ta: 'தமிழ்'
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          🌾 Rural Platform
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate(`/${rolePathSegment}`)}
          >
            {t('dashboard')}
          </Button>
          {user?.role === 'farmer' && (
            <>
              <Button color="inherit" onClick={() => navigate('/farmer/products')}>
                {t('products')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/farmer/drone-booking')}>
                {t('book_drone')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/farmer/orders')}>
                {t('orders')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/farmer/knowledge')}>
                {t('knowledge_center')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/farmer/tools')}>
                {t('nav_tools')}
              </Button>
            </>
          )}
          {user?.role === 'buyer' && (
            <>
              <Button color="inherit" onClick={() => navigate('/buyer/browse')}>
                {t('marketplace')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/buyer/orders')}>
                {t('orders')}
              </Button>
            </>
          )}
          {user?.role === 'drone_operator' && (
            <>
              <Button color="inherit" onClick={() => navigate('/drone-operator/bookings')}>
                {t('manage_bookings')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/drone-operator/sessions')}>
                {t('flight_logs')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/drone-operator/availability')}>
                {t('availability')}
              </Button>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/users')}>
                {t('users')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/products')}>
                {t('moderation')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/analytics')}>
                {t('analytics')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/drones')}>
                {t('drone_admin')}
              </Button>
            </>
          )}
          {user && (
            <Button color="inherit" onClick={() => navigate(`/${rolePathSegment}/profile`)}>
              {t('profile')}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleMode} title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel>{t('language') || 'Language'}</InputLabel>
            <Select
              value={language}
              label={t('language') || 'Language'}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' } }}
            >
              {availableLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {languageLabels[lang]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {user?.role === 'buyer' && (
            <>
              <IconButton color="inherit" onClick={() => navigate('/buyer/wishlist')}>
                <Badge badgeContent={wishlist.length} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate('/buyer/compare')}>
                <Badge badgeContent={comparisonItems.length} color="primary">
                  <CompareArrows />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={onCartClick}>
                <Badge badgeContent={0} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </>
          )}

          <IconButton
            color="inherit"
            onClick={() => navigate(`/${rolePathSegment}/notifications`)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption">{getRoleLabel()}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> {t('logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

