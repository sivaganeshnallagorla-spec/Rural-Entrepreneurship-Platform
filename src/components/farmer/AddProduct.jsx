import React, { useState } from 'react'
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
import { Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AddProduct = () => {
  const { user } = useAuth()
  const { addProduct } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    certification: '',
    location: user?.location || '',
    image: ''
  })

  const getSuggestedPriceRange = () => {
    const base = {
      'Processed Foods': 180,
      'Spices': 220,
      'Eco-friendly Crafts': 120,
      'Organic Produce': 150,
      'Value-added Products': 200,
    }[formData.category] || 150
    // adjust by unit
    const unitFactor = formData.unit === 'kg' ? 1 : formData.unit === 'liter' ? 0.9 : formData.unit === 'piece' ? 0.6 : 0.8
    const center = base * unitFactor
    return { min: Math.round(center * 0.9), max: Math.round(center * 1.1) }
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
    const product = {
      ...formData,
      farmerId: user.id,
      farmerName: user.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      available: formData.stock > 0
    }
    addProduct(product)
    navigate('/farmer/products')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('addProduct')}
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
              {formData.category && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Suggested: ₹{getSuggestedPriceRange().min}–₹{getSuggestedPriceRange().max}/{formData.unit} (Market trend)
                </Alert>
              )}
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

export default AddProduct

