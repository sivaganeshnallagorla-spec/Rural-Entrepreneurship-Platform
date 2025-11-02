import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'

const EditProduct = () => {
  const { id } = useParams()
  const { getProductById, updateProduct } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const product = getProductById(id)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    certification: '',
    location: '',
    image: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || 'kg',
        stock: product.stock || '',
        certification: product.certification || '',
        location: product.location || '',
        image: product.image || ''
      })
    }
  }, [product])

  if (!product) {
    return (
      <Box>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate('/farmer/products')}>Back to Products</Button>
      </Box>
    )
  }

  const categories = [
    'Processed Foods',
    'Spices',
    'Eco-friendly Crafts',
    'Organic Produce',
    'Value-added Products'
  ]

  const certifications = ['', 'organic', 'eco-friendly', 'fair trade']

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProduct(id, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      available: formData.stock > 0
    })
    navigate('/farmer/products')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('editProduct')}
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  label="Unit"
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="piece">piece</MenuItem>
                  <MenuItem value="liter">liter</MenuItem>
                  <MenuItem value="pack">pack</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Certification</InputLabel>
                <Select
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  label="Certification"
                >
                  {certifications.map((cert) => (
                    <MenuItem key={cert} value={cert}>
                      {cert || 'None'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                helperText="Enter a URL to an image of your product"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/farmer/products')}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="contained">
                  {t('save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default EditProduct

