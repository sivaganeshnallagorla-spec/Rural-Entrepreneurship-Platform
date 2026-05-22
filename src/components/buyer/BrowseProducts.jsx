import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Search from '@mui/icons-material/Search'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Visibility from '@mui/icons-material/Visibility'
import Favorite from '@mui/icons-material/Favorite'
import CompareArrows from '@mui/icons-material/CompareArrows'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useComparison } from '../../contexts/ComparisonContext'
import { useToast } from '../../contexts/ToastContext'
import { useReviews } from '../../contexts/ReviewContext'

const BrowseProducts = () => {
  const { products, searchProducts, filterProducts } = useProducts()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToComparison, isInComparison, removeFromComparison, canAddMore } = useComparison()
  const { showToast } = useToast()
  const { getAverageRating } = useReviews()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    certification: '',
    location: '',
    special: ''
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
  
  if (filters.category || filters.certification || filters.location || filters.special) {
    const filterParams = { ...filters, available: true }
    
    if (filters.special === 'organic') filterParams.certification = 'organic'
    if (filters.special === 'under500') filterParams.maxPrice = 500
    
    filtered = filterProducts(filterParams)

    if (filters.special === 'bestseller') {
      // Simulate bestsellers by filtering products with higher price (mock logic)
      filtered = filtered.filter(p => p.price > 100)
    }
  }

  const categories = ['', ...new Set(products.map(p => p?.category).filter(Boolean))]
  const certifications = ['', ...new Set(products.map(p => p?.certification).filter(Boolean))]
  const locations = ['', ...new Set(products.map(p => p?.location).filter(Boolean))]

  const handleFilterChange = (field, value) => {
    setFilters({
                      variant="outlined"
                      sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                    />
                    {getAverageRating(product.id) > 0 && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={getAverageRating(product.id)} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" fontWeight="bold">
                          {getAverageRating(product.id)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate(`/buyer/product/${product.id}`)}
                    sx={{ py: 1 }}
                  >
                    {t('viewDetails')}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      className="glass"
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
                    >
                      <Favorite />
                    </IconButton>
                    <IconButton
                      size="small"
                      className="glass"
                      color={isInComparison(product.id) ? 'primary' : 'default'}
                      onClick={() => {
                        if (isInComparison(product.id)) {
                          removeFromComparison(product.id)
                          showToast('Removed from comparison', 'info')
                        } else if (canAddMore) {
                          addToComparison(product)
                          showToast('Added to comparison', 'success')
                        } else {
                          showToast('Max 3 products', 'warning')
                        }
                      }}
                    >
                      <CompareArrows />
                    </IconButton>
                  </Box>
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

