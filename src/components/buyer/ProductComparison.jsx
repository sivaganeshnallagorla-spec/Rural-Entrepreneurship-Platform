import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Card,
  CardMedia,
  Grid
} from '@mui/material'
import {
  Delete,
  CompareArrows
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useComparison } from '../../contexts/ComparisonContext'
import { useToast } from '../../contexts/ToastContext'

const ProductComparison = () => {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison()
  const { showToast } = useToast()
  const navigate = useNavigate()

  if (comparisonItems.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CompareArrows sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No products selected for comparison
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Select products from the browse page to compare them side by side.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/buyer/browse')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Paper>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          <CompareArrows sx={{ mr: 1, verticalAlign: 'middle' }} />
          Product Comparison
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            clearComparison()
            showToast('Comparison cleared', 'info')
          }}
        >
          Clear All
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        removeFromComparison(product.id)
                        showToast('Removed from comparison', 'info')
                      }}
                      sx={{ float: 'right' }}
                    >
                      <Delete />
                    </IconButton>
                    <CardMedia
                      component="img"
                      height="100"
                      image={product.image || `https://via.placeholder.com/200x150?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      sx={{ objectFit: 'cover', mb: 1 }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><strong>Price</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Typography variant="h6" color="primary">
                    ₹{product.price}/{product.unit}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Farmer</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  {product.farmerName}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Location</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  {product.location}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Category</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Chip label={product.category} size="small" />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Certification</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  {product.certification ? (
                    <Chip label={product.certification} color="success" size="small" />
                  ) : (
                    <Typography variant="body2" color="textSecondary">None</Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Stock Available</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Chip
                    label={`${product.stock} ${product.unit}`}
                    color={product.stock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Description</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Typography variant="body2">
                    {product.description.substring(0, 100)}...
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell><strong>Actions</strong></TableCell>
              {comparisonItems.map((product) => (
                <TableCell key={product.id} align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/buyer/product/${product.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProductComparison

