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
  IconButton,
  Rating
} from '@mui/material'
import {
  ShoppingCart,
  ArrowBack,
  Favorite,
  CompareArrows,
  Message
} from '@mui/icons-material'
import { QRCodeCanvas } from 'qrcode.react'
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
import { useReviews } from '../../contexts/ReviewContext'
import { generateOriginUrl } from '../../utils/qrGenerator'

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
  const { getAverageRating, getReviewsByProduct } = useReviews()
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
      const estimatedWeight = quantity * (product.unit === 'kg' ? 1 : 0.5)
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

  const handleMessageFarmer = () => {
    navigate(`/buyer/messages?farmerId=${product.farmerId}&farmerName=${encodeURIComponent(product.farmerName)}`)
  }

  const maxQuantity = Math.min(product.stock, 100)
  const avgRating = getAverageRating(product.id)
  const reviews = getReviewsByProduct(product.id)
  const recentReviews = reviews.slice(-3).reverse()

  const [activeTab, setActiveTab] = useState('details')

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

            {/* Average rating */}
            {avgRating > 0 && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={avgRating} precision={0.5} readOnly size="small" />
                <Typography variant="caption" color="textSecondary">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </Typography>
              </Box>
            )}

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

            {/* QR Code — origin verification */}
            <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'inline-block', textAlign: 'center' }}>
              <Typography variant="caption" display="block" gutterBottom>
                {t('scan_qr') || 'Scan to verify origin'}
              </Typography>
              <QRCodeCanvas value={generateOriginUrl(product.id)} size={120} />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Product ID: {product.id}
              </Typography>
            </Box>

            {/* Message Farmer button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Message />}
                onClick={handleMessageFarmer}
                fullWidth
              >
                Message Farmer / Request Bulk Order
              </Button>
            </Box>

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

      {/* Reviews Section */}
      {recentReviews.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Customer Reviews
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Rating value={avgRating} precision={0.5} readOnly />
            <Typography variant="body2" color="textSecondary">
              {avgRating} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {recentReviews.map((review) => (
            <Box key={review.id} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" fontWeight="bold">{review.buyerName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {review.comment && (
                <Typography variant="body2" color="textSecondary">
                  {review.comment}
                </Typography>
              )}
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Paper>
      )}

      {/* Product Journey Tab */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Product Journey
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Rating value={avgRating} precision={0.5} readOnly />
          <Typography variant="body2" color="textSecondary">
            {avgRating} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {product.journey && (
          <Box>
            <h4>Product Journey</h4>
            <p>Farm Origin: {product.journey.origin}</p>
            <p>Processing Method: {product.journey.processing}</p>
            <p>Quality Grade: {product.journey.quality}</p>
            <p>Packaging Type: {product.journey.packaging}</p>
            <p>Certifications: {product.journey.certifications.join(', ')}</p>
            <p>Estimated Dispatch: {product.journey.dispatch}</p>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ProductDetails
