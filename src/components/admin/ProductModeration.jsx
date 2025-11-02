import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Search,
  CheckCircle,
  Cancel,
  Edit
} from '@mui/icons-material'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'

const ProductModeration = () => {
  const { products, updateProduct, deleteProduct } = useProducts()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = (id) => {
    updateProduct(id, { approved: true })
  }

  const handleReject = (id) => {
    deleteProduct(id)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Product Moderation
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Review and approve product listings
      </Typography>

      <TextField
        fullWidth
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  By: {product.farmerName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {product.category}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={product.certification || 'Standard'}
                    color={product.certification === 'organic' ? 'success' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`₹${product.price}/${product.unit}`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleApprove(product.id)}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleReject(product.id)}
                >
                  Reject
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductModeration

