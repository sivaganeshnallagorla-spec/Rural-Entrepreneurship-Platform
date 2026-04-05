import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'

import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Notifications from '@mui/icons-material/Notifications'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ExitToApp from '@mui/icons-material/ExitToApp'
import Translate from '@mui/icons-material/Translate'
import DarkMode from '@mui/icons-material/DarkMode'
import LightMode from '@mui/icons-material/LightMode'
import Favorite from '@mui/icons-material/Favorite'
import CompareArrows from '@mui/icons-material/CompareArrows'
import Message from '@mui/icons-material/Message'
import { useThemeMode } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useComparison } from '../contexts/ComparisonContext'
import { useMessaging } from '../contexts/MessagingContext'

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
  const { getUnreadCount: getMsgUnread } = useMessaging()
  const msgUnreadCount = user ? getMsgUnread(user.id) : 0

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
    ta: 'தமிழ்',
    kn: 'ಕನ್ನಡ',
    mr: 'मराठी'
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: 'none',
        color: 'text.primary',
        top: 0,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            onClick={() => navigate('/')}
          >
            <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.2))' }}>🌾</span>
            RuralPlatform
          </Typography>

          <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate(`/${rolePathSegment}`)}
              sx={{ opacity: location.pathname === `/${rolePathSegment}` ? 1 : 0.7 }}
            >
              {t('dashboard')}
            </Button>
            {user?.role === 'farmer' && (
              <>
                <Button color="inherit" onClick={() => navigate('/farmer/products')} sx={{ opacity: 0.7 }}>
                  {t('products')}
                </Button>
                <Button color="inherit" onClick={() => navigate('/farmer/services')} sx={{ opacity: 0.7 }}>
                  Services
                </Button>
                <Button color="inherit" onClick={() => navigate('/farmer/orders')} sx={{ opacity: 0.7 }}>
                  {t('orders')}
                </Button>
                <Button color="inherit" onClick={() => navigate('/farmer/skill')} sx={{ opacity: 0.7 }}>
                  Skill Center
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/farmer/equipment-marketplace')} 
                  sx={{ 
                    opacity: location.pathname === '/farmer/equipment-marketplace' ? 1 : 0.7,
                    fontWeight: location.pathname === '/farmer/equipment-marketplace' ? 700 : 400
                  }}
                >
                  Buy Equipment
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/farmer/tools')} 
                  sx={{ 
                    opacity: location.pathname === '/farmer/tools' ? 1 : 0.7,
                    fontWeight: location.pathname === '/farmer/tools' ? 700 : 400
                  }}
                >
                  Business Tools
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/farmer/mandi-prices')} 
                  sx={{ 
                    opacity: location.pathname === '/farmer/mandi-prices' ? 1 : 0.7,
                    fontWeight: location.pathname === '/farmer/mandi-prices' ? 700 : 400
                  }}
                >
                  Mandi Prices
                </Button>
              </>
            )}
            {user?.role === 'buyer' && (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/buyer/browse')}
                  sx={{ 
                    fontWeight: 600,
                    opacity: location.pathname === '/buyer/browse' ? 1 : 0.7,
                    color: location.pathname === '/buyer/browse' ? 'primary.main' : 'inherit'
                  }}
                >
                  {t('marketplace')}
                </Button>
                <Button color="inherit" onClick={() => navigate('/buyer/orders')} sx={{ opacity: 0.7 }}>
                  {t('orders')}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          {user?.role === 'buyer' && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
              <IconButton color="inherit" onClick={() => navigate('/buyer/wishlist')} size="small">
                <Badge badgeContent={wishlist.length} color="error">
                  <Favorite fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate('/buyer/compare')} size="small">
                <Badge badgeContent={comparisonItems.length} color="primary">
                  <CompareArrows fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton color="primary" onClick={onCartClick} size="small" sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.2)' } }}>
                <Badge badgeContent={0} color="error">
                  <ShoppingCart fontSize="small" />
                </Badge>
              </IconButton>
            </Box>
          )}

          <FormControl size="small" sx={{ minWidth: 100, display: { xs: 'none', sm: 'flex' } }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ 
                borderRadius: 2,
                bgcolor: 'rgba(46, 125, 50, 0.05)',
                '& .MuiSelect-select': { py: 0.8, display: 'flex', alignItems: 'center', gap: 1 }
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Translate fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight="600">
                    {languageLabels[selected]}
                  </Typography>
                </Box>
              )}
            >
              {availableLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {languageLabels[lang]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

          {(user?.role === 'farmer' || user?.role === 'buyer') && (
            <IconButton
              color="inherit"
              onClick={() => navigate(`/${rolePathSegment}/messages`)}
              size="small"
            >
              <Badge badgeContent={msgUnreadCount} color="error">
                <Message fontSize="small" />
              </Badge>
            </IconButton>
          )}

          <IconButton
            color="inherit"
            onClick={() => navigate(`/${rolePathSegment}/notifications`)}
            size="small"
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications fontSize="small" />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={handleMenu} 
            sx={{ 
              p: 0.5, 
              border: '2px solid', 
              borderColor: 'primary.light',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <AccountCircle color="primary" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 200,
                borderRadius: 3,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--glass-border)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="700">{user?.name}</Typography>
              <Typography variant="caption" color="textSecondary">{getRoleLabel()}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={toggleMode} sx={{ py: 1.5 }}>
              {mode === 'dark' ? <LightMode sx={{ mr: 1.5, fontSize: 20 }} /> : <DarkMode sx={{ mr: 1.5, fontSize: 20 }} />}
              <Typography variant="body2">{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</Typography>
            </MenuItem>
            <MenuItem onClick={() => { navigate(`/${rolePathSegment}/profile`); handleClose(); }} sx={{ py: 1.5 }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2">Profile Settings</Typography>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/help-center'); handleClose(); }} sx={{ py: 1.5 }}>
              <Notifications sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2">Help Center</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ExitToApp sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" fontWeight="600">{t('logout')}</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
