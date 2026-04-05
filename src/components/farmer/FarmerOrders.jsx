import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
import Visibility from '@mui/icons-material/Visibility'
import Download from '@mui/icons-material/Download'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { useLanguage } from '../../contexts/LanguageContext'

const FarmerOrders = () => {
  const { user } = useAuth()
  const { getOrdersByFarmer, updateOrder } = useOrders()
  const { t } = useLanguage()
  const orders = getOrdersByFarmer(user?.id)

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Buyer Name', 'Items Count', 'Total Amount', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id,
      `"${o.buyerName || 'Buyer'}"`,
      o.items?.length || 0,
      o.total || 0,
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${user?.username || 'farmer'}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('orders')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage incoming orders from buyers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={exportToCSV}
          disabled={orders.length === 0}
          color="secondary"
        >
          Export CSV
        </Button>
      </Box>

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

