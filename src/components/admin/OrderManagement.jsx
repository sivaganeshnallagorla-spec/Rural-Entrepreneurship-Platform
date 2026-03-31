import React from 'react'
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Button,
  Avatar
} from '@mui/material'
import { MoreVert, Visibility, LocalShipping, GetApp, Person, ShoppingBag } from '@mui/icons-material'
import { useOrders } from '../../contexts/OrderContext'

const OrderManagement = () => {
  const { orders } = useOrders()

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>Order Management</Typography>
          <Typography variant="body2" color="textSecondary">Monitor and fulfill marketplace transactions across the platform.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<GetApp />} sx={{ borderRadius: 2 }}>Export CSV</Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Buyer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Value</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? orders.map((order) => (
              <TableRow key={order.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  #{order.id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.light' }}><Person fontSize="small" /></Avatar>
                    <Typography variant="body2" fontWeight="600">{order.buyerName || 'Unregistered'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="800">₹{order.total?.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status?.toUpperCase() || 'PENDING'} 
                    size="small" 
                    color={getStatusColor(order.status)} 
                    sx={{ fontWeight: 900, fontSize: '0.65rem', height: 24 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentMethod?.toUpperCase() || 'UPI'} 
                    variant="outlined"
                    size="small" 
                    sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" sx={{ mr: 1 }}><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="primary"><LocalShipping fontSize="small" /></IconButton>
                  <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Box sx={{ opacity: 0.5 }}>
                    <ShoppingBag sx={{ fontSize: '3rem', mb: 1 }} />
                    <Typography variant="h6">No Orders Recorded</Typography>
                    <Typography variant="body2">Try loading demo data from the Overview dashboard.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default OrderManagement
