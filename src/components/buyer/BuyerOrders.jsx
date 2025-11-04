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
  Chip,
  Button
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { generateInvoicePdf } from '../../utils/invoice'

const BuyerOrders = () => {
  const { user } = useAuth()
  const { getOrdersByBuyer } = useOrders()
  const { t } = useLanguage()
  const orders = getOrdersByBuyer(user?.id)

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
              <TableCell>Date</TableCell>
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
                    <Box display="flex" alignItems="center" gap={1}>
                      {new Date(order.createdAt).toLocaleDateString()}
                      <Button size="small" variant="outlined" onClick={() => generateInvoicePdf(order)}>
                        Download Invoice
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default BuyerOrders

