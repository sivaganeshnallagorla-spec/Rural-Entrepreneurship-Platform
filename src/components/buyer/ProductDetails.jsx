import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton
} from '@mui/material'
import {
  ShoppingCart,
  ArrowBack,
  Favorite,
  CompareArrows
} from '@mui/icons-material'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { calculateShipping, getShippingMethods } from '../../utils/shippingCalculator'
import PaymentMethods from '../PaymentMethods'
import { useToast } from '../../contexts/ToastContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext'
import { useComparison } from '../../contexts/ComparisonContext'

const ProductDetails = () => {
  const { id } = useParams()
  const { getProductById } = useProducts()
  const { createOrder } = useOrders()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const { addToComparison, isInComparison, removeFromComparison, canAddMore } = useComparison()
  const product = getProductById(id)
  
  const [quantity, setQuantity] = useState(1)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingDetails, setShippingDetails] = useState(null)

  if (!product) {
    return (
      <Box>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate('/buyer/browse')}>Back to Browse</Button>
      </Box>
    )
  }

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  // Calculate shipping when quantity or shipping method changes
  useEffect(() => {
    if (product && user) {
      const estimatedWeight = quantity * (product.unit === 'kg' ? 1 : 0.5) // Estimate weight
      const shipping = calculateShipping(
        product.location,
        user.location || user.address?.city || 'New Delhi',
        estimatedWeight,
        shippingMethod
      )
      setShippingCost(shipping.cost)
      setShippingDetails(shipping)
    }
  }, [quantity, shippingMethod, product, user])

  const handleAddToCart = () => {
    if (!paymentMethod) { showToast('Please select a payment method', 'warning'); return }

    if (!user.address || !user.address.street) { showToast('Please update your profile address', 'warning'); return }

    const subtotal = product.price * quantity
    const total = subtotal + shippingCost

    // Create order
    const order = createOrder({
      buyerId: user.id,
      buyerName: user.name,
      buyerAddress: user.address,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      items: [{
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        unit: product.unit
      }],
      shipping: {
        method: shippingMethod,
        cost: shippingCost,
        estimatedDays: shippingDetails?.estimatedDays || 7
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed'
      },
      subtotal,
      total,
      status: 'pending'
    })

    addNotification({
      userId: user.id,
      type: 'order',
      title: 'Order Placed',
      message: `Your order for ${product.name} has been placed successfully. Total: ₹${total}`
    })

    addNotification({
      userId: product.farmerId,
      type: 'order',
      title: 'New Order',
      message: `You have received a new order for ${product.name} from ${user.name}.`
    })

    showToast('Order placed successfully!', 'success')
    navigate('/buyer/orders')
  }

  const maxQuantity = Math.min(product.stock, 100)

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/buyer/browse')}
        sx={{ mb: 2 }}
      >
        Back to Browse
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.image || `https://via.placeholder.com/600x500?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price}/{product.unit}
            </Typography>

            <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
              />
              {product.certification && (
                <Chip
                  label={product.certification}
                  color="success"
                  variant="outlined"
                />
              )}
              <IconButton
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
                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Favorite />
              </IconButton>
              <IconButton
                color={isInComparison(product.id) ? 'primary' : 'default'}
                onClick={() => {
                  if (isInComparison(product.id)) {
                    removeFromComparison(product.id)
                    showToast('Removed from comparison', 'info')
                  } else if (canAddMore) {
                    addToComparison(product)
                    showToast('Added to comparison', 'success')
                  } else {
                    showToast('Maximum 3 products can be compared', 'warning')
                  }
                }}
                title={isInComparison(product.id) ? 'Remove from comparison' : 'Add to comparison'}
              >
                <CompareArrows />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {product.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Farmer Information
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Farmer:</strong> {product.farmerName}<br />
              <strong>Location:</strong> {product.location}<br />
              <strong>Stock Available:</strong> {product.stock} {product.unit}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quantity
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1
                  setQuantity(Math.max(1, Math.min(val, maxQuantity)))
                }}
                inputProps={{ min: 1, max: maxQuantity }}
                sx={{ width: 150 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Maximum: {maxQuantity} {product.unit}
              </Typography>
            </Box>

            {/* Shipping Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Options
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Shipping Method</InputLabel>
                <Select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  label="Shipping Method"
                >
                  {getShippingMethods().map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.icon} {method.name} - {method.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {shippingDetails && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Shipping Cost:</strong> ₹{shippingCost}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Estimated Delivery: {shippingDetails.estimatedDays} business days
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Payment Methods */}
            <Box sx={{ mb: 3 }}>
              <PaymentMethods
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />
            </Box>

            {/* Order Summary */}
            <Paper sx={{ p: 2, bgcolor: '#f9f9f9', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Subtotal ({quantity} {product.unit})</Typography>
                <Typography variant="body2">₹{(product.price * quantity).toLocaleString()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">₹{shippingCost.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ₹{((product.price * quantity) + shippingCost).toLocaleString()}
                </Typography>
              </Box>
            </Paper>

            {!user.address || !user.address.street ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please update your address in your profile to place an order.
              </Alert>
            ) : (
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !paymentMethod}
                >
                  Place Order - ₹{((product.price * quantity) + shippingCost).toLocaleString()}
                </Button>
              </Box>
            )}

            {product.stock === 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                This product is currently out of stock.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductDetails

