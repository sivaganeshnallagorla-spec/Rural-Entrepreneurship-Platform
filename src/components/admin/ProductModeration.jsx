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
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material'
import {
  Search,
  CheckCircle,
  Cancel,
  Edit,
  Verified,
  Warning,
  Category,
  Agriculture,
  LocationOn
} from '@mui/icons-material'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'

const ProductModeration = () => {
  const { products, updateProduct, deleteProduct } = useProducts()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  // Filter products by search and moderation status (simulate status)
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.farmerName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // For demo, we'll treat products with 'organic' certification as 'Approved' and others as 'Pending' 
    // in real app we'd have a 'status' field
    const isApproved = p.certification === 'organic' || p.price > 100 
    if (activeTab === 0) return matchesSearch && !isApproved
    return matchesSearch && isApproved
  })

  const handleApprove = (id) => {
    updateProduct(id, { approved: true, certification: 'organic' }) // Set organic as "Approve" indicator for demo
  }

  const handleReject = (id) => {
    deleteProduct(id)
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
          Product Moderation
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Review and verify agricultural listings before they go live on the marketplace.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': { fontWeight: 700, px: 4 }
            }}
          >
            <Tab label={`Pending (${products.filter(p => p.certification !== 'organic' && p.price <= 100).length})`} />
            <Tab label="Approved" />
          </Tabs>
          
          <TextField
            size="small"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2, bgcolor: 'white' }
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} lg={4} key={product.id}>
            <Card 
              className="glass" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid var(--glass-border)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 'var(--shadow-lg)' }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={product.image || `https://source.unsplash.com/400x300/?agriculture,${product.category}`}
                  alt={product.name}
                  sx={{ filter: activeTab === 0 ? 'grayscale(0.3)' : 'none' }}
                />
                <Chip 
                  label={product.category?.toUpperCase()} 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(4px)',
                    fontWeight: 800,
                    fontSize: '0.65rem'
                  }} 
                />
                {activeTab === 0 && (
                  <Chip 
                    icon={<Warning sx={{ fontSize: '0.9rem !important' }} />}
                    label="NEEDS REVIEW" 
                    color="warning"
                    size="small" 
                    sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 800 }} 
                  />
                )}
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="900">
                    ₹{product.price}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light', fontSize: '0.8rem' }}>
                    {product.farmerName?.[0] || 'F'}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block">Farmer / Producer</Typography>
                    <Typography variant="body2" fontWeight="700">{product.farmerName}</Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2, opacity: 0.6 }} />
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <Agriculture sx={{ fontSize: '1rem' }} />
                      <Typography variant="caption">Yield: {product.quantity} {product.unit}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <LocationOn sx={{ fontSize: '1rem' }} />
                      <Typography variant="caption">{product.location || 'Pune District'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              
              <CardActions sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.01)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                {activeTab === 0 ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApprove(product.id)}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      Verify & List
                    </Button>
                    <Tooltip title="Reject listing">
                      <IconButton color="error" onClick={() => handleReject(product.id)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Manage Listing
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 10, textAlign: 'center', border: '1px dashed #ccc', borderRadius: 4 }}>
              <Typography color="textSecondary">No listings found for this category or search.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default ProductModeration
