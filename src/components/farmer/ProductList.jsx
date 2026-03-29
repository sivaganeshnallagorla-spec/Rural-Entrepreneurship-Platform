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
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  QrCode
} from '@mui/icons-material'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { generateOriginUrl } from '../../utils/qrGenerator'

const ProductList = () => {
  const { user } = useAuth()
  const { getProductsByFarmer, deleteProduct } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const products = getProductsByFarmer(user?.id)

  const [qrProduct, setQrProduct] = useState(null)

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">{t('products')}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/farmer/products/add')}
        >
          {t('addProduct')}
        </Button>
      </Box>

      {products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/farmer/products/add')}
            sx={{ mt: 2 }}
          >
            {t('addProduct')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
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
                    {product.category}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {product.description.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={`₹${product.price}/${product.unit}`}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Stock: ${product.stock}`}
                      color={product.stock > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  {product.certification && (
                    <Chip
                      label={product.certification}
                      color="success"
                      size="small"
                    />
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/farmer/products/edit/${product.id}`)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(product.id)}
                  >
                    {t('delete')}
                  </Button>
                  <IconButton
                    size="small"
                    color="secondary"
                    title="View QR Code"
                    onClick={() => setQrProduct(product)}
                  >
                    <QrCode />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* QR Code Dialog */}
      <Dialog open={Boolean(qrProduct)} onClose={() => setQrProduct(null)} maxWidth="xs">
        <DialogTitle>Product QR Code</DialogTitle>
        <DialogContent>
          {qrProduct && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
              <Typography variant="body2" color="textSecondary">
                {qrProduct.name}
              </Typography>
              <QRCode value={generateOriginUrl(qrProduct.id)} size={180} />
              <Typography variant="caption" color="textSecondary">
                Origin URL: {generateOriginUrl(qrProduct.id)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrProduct(null)}>Close</Button>
          {qrProduct && (
            <Button
              variant="outlined"
              onClick={() => window.open(generateOriginUrl(qrProduct.id), '_blank')}
            >
              Open Origin Page
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductList
