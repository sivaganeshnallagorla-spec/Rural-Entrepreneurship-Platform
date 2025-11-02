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
  Button,
  IconButton
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Visibility
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'

const FarmerOrders = () => {
  const { user } = useAuth()
  const { getOrdersByFarmer, updateOrder } = useOrders()
  const { t } = useLanguage()
  const orders = getOrdersByFarmer(user?.id)

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

  const handleConfirm = (id) => {
    updateOrder(id, { status: 'confirmed' })
  }

  const handleReject = (id) => {
    updateOrder(id, { status: 'cancelled' })
  }

  const handleShip = (id) => {
    updateOrder(id, { status: 'shipped' })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('orders')}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Manage incoming orders from buyers
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.buyerName || 'Buyer'}</TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell>₹{order.total?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {order.status === 'pending' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleConfirm(order.id)}
                          title="Confirm"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleReject(order.id)}
                          title="Reject"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleShip(order.id)}
                      >
                        Mark as Shipped
                      </Button>
                    )}
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

export default FarmerOrders

