import React, { useState } from 'react'
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
  Chip,
  Button
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useReviews } from '../../contexts/ReviewContext'
import { generateInvoice } from '../../utils/invoice'
import ProductReview from './ProductReview'

const BuyerOrders = () => {
  const { user } = useAuth()
  const { getOrdersByBuyer } = useOrders()
  const { t } = useLanguage()
  const { hasReviewed } = useReviews()
  const orders = getOrdersByBuyer(user?.id)

  const [reviewTarget, setReviewTarget] = useState(null) // { productId, farmerId }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'confirmed': return 'info'
      case 'shipped': return 'primary'
      case 'delivered': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My {t('orders')}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Track your orders and deliveries
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Farmer</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>Date / Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.farmerName || 'Farmer'}</TableCell>
                  <TableCell>
                    {order.items?.map((item, idx) => (
                      <div key={idx}>
                        {item.productName} - {item.quantity} {item.unit}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>₹{order.total?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="caption">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => {
                        const farmer = {
                          name: order.farmerName,
                          location: 'Rural India',
                          email: 'farmer@example.com',
                          phone: 'N/A'
                        }
                        generateInvoice(order, user, farmer)
                      }}>
                        Download Invoice
                      </Button>
                      {/* Write Review for delivered orders */}
                      {order.status === 'delivered' && order.items?.map((item, idx) => {
                        const alreadyReviewed = hasReviewed(item.productId, user.id)
                        return alreadyReviewed ? (
                          <Chip
                            key={idx}
                            label="Reviewed ✓"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Button
                            key={idx}
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => setReviewTarget({ productId: item.productId, farmerId: order.farmerId })}
                          >
                            {t('write_review') || 'Write Review'}
                          </Button>
                        )
                      })}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Dialog */}
      {reviewTarget && (
        <ProductReview
          productId={reviewTarget.productId}
          farmerId={reviewTarget.farmerId}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </Box>
  )
}

export default BuyerOrders
