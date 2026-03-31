import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Rating
} from '@mui/material'
import {
  Search,
  ShoppingCart,
  Visibility,
  Favorite,
  CompareArrows
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useComparison } from '../../contexts/ComparisonContext'
import { useToast } from '../../contexts/ToastContext'
import { useReviews } from '../../contexts/ReviewContext'

const BrowseProducts = () => {
  const { products, searchProducts, filterProducts } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToComparison, isInComparison, removeFromComparison, canAddMore } = useComparison()
  const { showToast } = useToast()
  const { getAverageRating } = useReviews()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    certification: '',
    location: ''
  })

  // Safety checks
  if (!products || !Array.isArray(products)) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Browse Products
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Loading products...
        </Typography>
      </Box>
    )
  }

  let filtered = searchQuery ? searchProducts(searchQuery) : products
  
  if (filters.category || filters.certification || filters.location) {
    filtered = filterProducts({
      ...filters,
      available: true
    })
  }

  const categories = ['', ...new Set(products.map(p => p?.category).filter(Boolean))]
  const certifications = ['', ...new Set(products.map(p => p?.certification).filter(Boolean))]
  const locations = ['', ...new Set(products.map(p => p?.location).filter(Boolean))]

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    })
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 2, background: 'linear-gradient(45deg, #2e7d32 30%, #ff6f00 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Rural Excellence
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
          High-quality, artisan-made products directly from rural entrepreneurs across India.
        </Typography>
      </Box>

      <Paper className="glass" sx={{ p: 4, mb: 6, boxShadow: 'var(--shadow)', border: '1px solid var(--glass-border)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by product name, category, or origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: 'background.paper' }
              }}
            />
          </Grid>
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
                sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.filter(Boolean).map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth>
              <InputLabel>Certification</InputLabel>
              <Select
                value={filters.certification}
                onChange={(e) => handleFilterChange('certification', e.target.value)}
                label="Certification"
                sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
              >
                <MenuItem value="">Any Certification</MenuItem>
                {certifications.filter(Boolean).map((cert) => (
                  <MenuItem key={cert} value={cert}>{cert}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filtered.length === 0 ? (
        <Paper className="glass" sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Box sx={{ fontSize: 64, mb: 2 }}>🔍</Box>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No products found matching your criteria.
          </Typography>
          <Button variant="text" onClick={() => { setSearchQuery(''); setFilters({ category: '', certification: '', location: '' }) }}>
            Clear all filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {filtered.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1, display: 'flex', gap: 1 }}>
                  {product.certification && (
                    <Chip
                      label={product.certification.toUpperCase()}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 'bold', backdropFilter: 'blur(4px)', bgcolor: 'rgba(46, 125, 50, 0.8)' }}
                    />
                  )}
                </Box>
                <CardMedia
                  component="img"
                  height="260"
                  image={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  sx={{ 
                    transition: 'transform 0.5s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" fontWeight="700" noWrap sx={{ flex: 1 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="700">
                      ₹{product.price}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    📍 {product.location} • By {product.farmerName}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description || 'Premium artisan-crafted product from our rural entrepreneurs.'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={`${product.unit}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                    />
                    {getAverageRating(product.id) > 0 && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={getAverageRating(product.id)} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" fontWeight="bold">
                          {getAverageRating(product.id)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate(`/buyer/product/${product.id}`)}
                    sx={{ py: 1 }}
                  >
                    {t('viewDetails')}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      className="glass"
                      color={isInWishlist(product.id) ? 'error' : 'default'}
                      onClick={() => {
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id)
                          showToast('Removed from wishlist', 'info')
                        } else {
                          addToWishlist(product)
                          showToast('Added to wishlist', 'success')
                        }
                      }}
                    >
                      <Favorite />
                    </IconButton>
                    <IconButton
                      size="small"
                      className="glass"
                      color={isInComparison(product.id) ? 'primary' : 'default'}
                      onClick={() => {
                        if (isInComparison(product.id)) {
                          removeFromComparison(product.id)
                          showToast('Removed from comparison', 'info')
                        } else if (canAddMore) {
                          addToComparison(product)
                          showToast('Added to comparison', 'success')
                        } else {
                          showToast('Max 3 products', 'warning')
                        }
                      }}
                    >
                      <CompareArrows />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default BrowseProducts

