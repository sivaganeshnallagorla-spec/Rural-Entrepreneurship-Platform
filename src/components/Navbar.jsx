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
    if (user?.role === 'admin') return 'Admin'
    if (user?.role === 'farmer') return 'Farmer'
    if (user?.role === 'buyer') return 'Buyer'
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
            onClick={() => navigate(`/${user?.role}`)}
          >
            {t('dashboard')}
          </Button>
          {user?.role === 'farmer' && (
            <Button color="inherit" onClick={() => navigate(`/${user?.role}/products`)}>
              {t('products')}
            </Button>
          )}
          {user?.role === 'buyer' && (
            <Button color="inherit" onClick={() => navigate(`/${user?.role}/browse`)}>
              {t('products')}
            </Button>
          )}
          {user?.role === 'buyer' && (
            <Button color="inherit" onClick={() => navigate(`/${user?.role}/orders`)}>
              {t('orders')}
            </Button>
          )}
          {user?.role === 'farmer' && (
            <>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/orders`)}>
                {t('orders')}
              </Button>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/knowledge`)}>
                Knowledge Center
              </Button>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/tools`)}>
                Tools
              </Button>
            </>
          )}
          {user?.role !== 'admin' && (
            <Button color="inherit" onClick={() => navigate(`/${user?.role}/profile`)}>
              Profile
            </Button>
          )}
          {user?.role === 'admin' && (
            <>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/users`)}>
                {t('users')}
              </Button>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/analytics`)}>
                {t('analytics')}
              </Button>
              <Button color="inherit" onClick={() => navigate(`/${user?.role}/knowledge`)}>
                Knowledge Center
              </Button>
            </>
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
            onClick={() => navigate(`/${user?.role}/notifications`)}
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

