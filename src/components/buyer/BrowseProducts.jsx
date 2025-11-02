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
  InputLabel
} from '@mui/material'
import {
  Search,
  ShoppingCart,
  Visibility
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'

const BrowseProducts = () => {
  const { products, searchProducts, filterProducts } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    certification: '',
    location: ''
  })

  let filtered = searchQuery ? searchProducts(searchQuery) : products
  
  if (filters.category || filters.certification || filters.location) {
    filtered = filterProducts({
      ...filters,
      available: true
    })
  }

  const categories = ['', ...new Set(products.map(p => p.category))]
  const certifications = ['', ...new Set(products.map(p => p.certification).filter(Boolean))]
  const locations = ['', ...new Set(products.map(p => p.location))]

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
                    {product.description.substring(0, 100)}...
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
                <CardActions>
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

