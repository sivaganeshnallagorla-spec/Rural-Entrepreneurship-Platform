import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import {
  Close,
  ShoppingCart
} from '@mui/icons-material'
import { useLanguage } from '../../contexts/LanguageContext'

const Cart = ({ open, onClose }) => {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCart />
            <Typography variant="h6">Shopping Cart</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
          Cart is empty. Add products to your cart to see them here.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Cart

