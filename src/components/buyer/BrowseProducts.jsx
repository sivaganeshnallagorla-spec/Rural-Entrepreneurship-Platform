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
  IconButton
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

const BrowseProducts = () => {
  const { products, searchProducts, filterProducts } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToComparison, isInComparison, removeFromComparison, canAddMore } = useComparison()
  const { showToast } = useToast()
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Browse Products
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Discover value-added products from rural farmers
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.filter(Boolean).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Certification</InputLabel>
              <Select
                value={filters.certification}
                onChange={(e) => handleFilterChange('certification', e.target.value)}
                label="Certification"
              >
                <MenuItem value="">All</MenuItem>
                {certifications.filter(Boolean).map((cert) => (
                  <MenuItem key={cert} value={cert}>
                    {cert}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No products found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    By: {product.farmerName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, minHeight: 60 }}>
                    {product.description ? (product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description) : 'No description available'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={`₹${product.price}/${product.unit}`}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {product.certification && (
                      <Chip
                        label={product.certification}
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/buyer/product/${product.id}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate(`/buyer/product/${product.id}`)}
                  >
                    {t('addToCart')}
                  </Button>
                  <IconButton
                    size="small"
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
                    title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Favorite />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={isInComparison(product.id) ? 'primary' : 'default'}
                    onClick={() => {
                      if (isInComparison(product.id)) {
                        removeFromComparison(product.id)
                        showToast('Removed from comparison', 'info')
                      } else if (canAddMore) {
                        addToComparison(product)
                        showToast('Added to comparison', 'success')
                      } else {
                        showToast('Maximum 3 products can be compared', 'warning')
                      }
                    }}
                    title={isInComparison(product.id) ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    <CompareArrows />
                  </IconButton>
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

