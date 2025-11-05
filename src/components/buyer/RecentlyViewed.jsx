import React from 'react'
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
  Paper
} from '@mui/material'
import {
  Visibility,
  ShoppingCart
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext'

const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed()
  const navigate = useNavigate()

  const handleViewProduct = (productId) => {
    navigate(`/buyer/product/${productId}`)
  }

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Recently Viewed Products
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Products you've recently browsed
      </Typography>

      <Grid container spacing={2}>
        {recentlyViewed.slice(0, 4).map((product) => {
          if (!product || !product.id) return null
          return (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="150"
                  image={product.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name || 'Product')}`}
                  alt={product.name || 'Product'}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleViewProduct(product.id)}
                />
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom noWrap>
                    {product.name || 'Unknown Product'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.farmerName || 'Unknown Farmer'}
                  </Typography>
                  <Chip
                    label={`₹${product.price || 0}/${product.unit || 'unit'}`}
                    color="primary"
                    size="small"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewProduct(product.id)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default RecentlyViewed

