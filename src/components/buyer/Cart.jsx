import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  Delete,
  Add,
  Remove,
  Receipt
} from '@mui/icons-material';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const Cart = ({ open, onClose }) => {
  const { cart, removeFromCart, addToCart, clearCart, createOrder } = useOrders();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleUpdateQuantity = (item, delta) => {
    if (item.quantity + delta > 0) {
      addToCart(item, delta);
    }
  };

  const handleCheckout = () => {
    try {
      const orderData = {
        buyerId: user.id || 'buyer1',
        buyerName: user.name || 'Anonymous Buyer',
        items: cart,
        total,
        status: 'pending'
      };
      createOrder(orderData);
      showSuccess('Order placed successfully!');
      onClose();
    } catch (err) {
      showError('Failed to place order.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCart />
            <Typography variant="h6">Your Shopping Cart</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {cart.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
            <Button onClick={onClose} sx={{ mt: 2 }}>Start Shopping</Button>
          </Box>
        ) : (
          <List disablePadding>
            {cart.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={item.image} sx={{ width: 60, height: 60, mr: 2 }}>
                      {item.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`INR ${item.price} / ${item.unit || 'unit'}`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item, -1)}>
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item, 1)}>
                      <Add fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => removeFromCart(item.id)} sx={{ ml: 1 }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      {cart.length > 0 && (
        <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total Amount</Typography>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
              INR {total}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            startIcon={<Receipt />}
            onClick={handleCheckout}
          >
            Checkout & Place Order
          </Button>
        </Box>
      )}
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={clearCart} color="inherit" disabled={cart.length === 0}>Clear Cart</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Cart;
