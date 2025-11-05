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
  Paper,
  IconButton
} from '@mui/material'
import {
  Favorite,
  Delete,
  ShoppingCart,
  Visibility
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../../contexts/WishlistContext'
import { useToast } from '../../contexts/ToastContext'

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleRemove = (productId) => {
    removeFromWishlist(productId)
    showToast('Removed from wishlist', 'info')
  }

  const handleViewProduct = (productId) => {
    navigate(`/buyer/product/${productId}`)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          <Favorite sx={{ mr: 1, verticalAlign: 'middle', color: 'error' }} />
          My Wishlist
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </Typography>
      </Box>

      {wishlist.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Start adding products you love to your wishlist!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/buyer/browse')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    By: {product.farmerName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.location}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
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
                    onClick={() => handleViewProduct(product.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => {
                      handleViewProduct(product.id)
                    }}
                  >
                    Buy Now
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(product.id)}
                    sx={{ ml: 'auto' }}
                  >
                    <Delete />
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

export default Wishlist

