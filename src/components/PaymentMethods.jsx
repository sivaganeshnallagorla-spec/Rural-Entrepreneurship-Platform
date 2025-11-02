import React from 'react'
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Grid
} from '@mui/material'
import {
  AccountBalance,
  CreditCard,
  PhoneAndroid,
  LocalAtm
} from '@mui/icons-material'

const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay using UPI (PhonePe, Google Pay, Paytm)',
    icon: <PhoneAndroid />,
    color: '#4CAF50'
  },
  {
    id: 'card',
    name: 'Debit/Credit Card',
    description: 'Pay using Visa, MasterCard, or RuPay',
    icon: <CreditCard />,
    color: '#2196F3'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'Pay directly from your bank account',
    icon: <AccountBalance />,
    color: '#FF9800'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive the order',
    icon: <LocalAtm />,
    color: '#9C27B0'
  }
]

const PaymentMethods = ({ selectedMethod, onSelectMethod }) => {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        <Typography variant="h6">Select Payment Method</Typography>
      </FormLabel>
      <RadioGroup
        value={selectedMethod || ''}
        onChange={(e) => onSelectMethod(e.target.value)}
      >
        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} key={method.id}>
              <Paper
                sx={{
                  p: 2,
                  border: selectedMethod === method.id ? `2px solid ${method.color}` : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
                onClick={() => onSelectMethod(method.id)}
              >
                <FormControlLabel
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Box sx={{ color: method.color }}>{method.icon}</Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {method.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {method.description}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </FormControl>
  )
}

export default PaymentMethods

