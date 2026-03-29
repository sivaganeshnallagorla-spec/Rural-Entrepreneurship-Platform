import React, { useState } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  Delete,
  Add,
  Remove,
  Receipt,
  ArrowBack,
  LocalShipping
} from '@mui/icons-material';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import PaymentMethods from '../PaymentMethods';
import { getShippingMethods } from '../../utils/shippingCalculator';

const Cart = ({ open, onClose }) => {
  const { cart, removeFromCart, addToCart, clearCart, createOrder } = useOrders();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const shippingMethods = getShippingMethods();
  const shippingCostMap = { standard: 80, express: 150, economy: 40 };
  const shippingCost = shippingCostMap[selectedShipping] || 80;
  const shippingMethodObj = shippingMethods.find(m => m.id === selectedShipping) || shippingMethods[0];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  const handleUpdateQuantity = (item, delta) => {
    if (item.quantity + delta > 0) {
      addToCart(item, delta);
    }
  };

  const handleCheckout = () => {
    try {
      // Group cart items by farmerId and create one order per farmer
      const farmerGroups = {};
      cart.forEach(item => {
        const fid = item.farmerId || 'unknown';
        if (!farmerGroups[fid]) farmerGroups[fid] = [];
        farmerGroups[fid].push(item);
      });

      Object.entries(farmerGroups).forEach(([farmerId, items]) => {
        const groupSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        createOrder({
          buyerId: user.id,
          buyerName: user.name,
          farmerId,
          items,
          total: groupSubtotal + shippingCost,
          shippingMethod: selectedShipping,
          paymentMethod: selectedPayment,
          status: 'pending'
        });
      });

      showSuccess('Order placed successfully!');
      clearCart();
      setStep('cart');
      onClose();
    } catch (err) {
      showError('Failed to place order.');
    }
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            {step === 'checkout' && (
              <IconButton size="small" sx={{ color: 'white' }} onClick={() => setStep('cart')}>
                <ArrowBack />
              </IconButton>
            )}
            <ShoppingCart />
            <Typography variant="h6">
              {step === 'cart' ? 'Your Shopping Cart' : 'Checkout'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {step === 'cart' ? (
          cart.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
              <Button onClick={handleClose} sx={{ mt: 2 }}>Start Shopping</Button>
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
                      secondary={`₹${item.price} / ${item.unit || 'unit'}`}
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
          )
        ) : (
          // Checkout step
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Shipping method */}
            <FormControl>
              <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>
                <LocalShipping sx={{ mr: 0.5, fontSize: 'inherit', verticalAlign: 'middle' }} />
                Shipping Method
              </FormLabel>
              <RadioGroup
                value={selectedShipping}
                onChange={(e) => setSelectedShipping(e.target.value)}
              >
                {shippingMethods.map((method) => (
                  <FormControlLabel
                    key={method.id}
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {method.icon} {method.name} — ₹{shippingCostMap[method.id] || 80}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {method.description} ({shippingCostMap[method.id] === 150 ? '1–2' : shippingCostMap[method.id] === 40 ? '7–10' : '3–5'} days)
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Divider />

            {/* Payment methods */}
            <PaymentMethods
              selectedMethod={selectedPayment}
              onSelectMethod={setSelectedPayment}
            />

            <Divider />

            {/* Order summary */}
            <Box>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">₹{subtotal.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">Shipping ({shippingMethodObj?.name})</Typography>
                <Typography variant="body2">₹{shippingCost}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">₹{total.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {cart.length > 0 && (
        <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
          {step === 'cart' ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Subtotal</Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  ₹{subtotal.toLocaleString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Receipt />}
                onClick={() => setStep('checkout')}
              >
                Proceed to Checkout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Receipt />}
              onClick={handleCheckout}
              color="success"
            >
              Place Order — ₹{total.toLocaleString()}
            </Button>
          )}
        </Box>
      )}

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={clearCart} color="inherit" disabled={cart.length === 0}>Clear Cart</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Cart;
