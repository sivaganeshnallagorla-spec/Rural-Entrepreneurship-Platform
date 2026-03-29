import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Avatar
} from '@mui/material';
import { 
  Flight, 
  Assignment, 
  AccountBalanceWallet, 
  Star 
} from '@mui/icons-material';
import { useDrone } from '../../contexts/DroneContext';
import { useAuth } from '../../contexts/AuthContext';

const DroneOverview = () => {
  const { bookings } = useDrone();
  const { user } = useAuth();
  const operatorId = user?.id || 'op1';
  const operatorBookings = bookings.filter((b) => b.operatorId === operatorId);
  const pending = operatorBookings.filter(b => b.status === 'pending').length;
  const completed = operatorBookings.filter(b => b.status === 'completed').length;
  const earnings = operatorBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const stats = [
    { label: 'Active Tasks', value: pending, icon: <Assignment />, color: '#2196f3' },
    { label: 'Total Flights', value: completed, icon: <Flight />, color: '#4caf50' },
    { label: 'Total Earnings', value: `INR ${earnings}`, icon: <AccountBalanceWallet />, color: '#e91e63' },
    { label: 'Avg Rating', value: '4.8', icon: <Star />, color: '#ff9800' }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Operator Overview 🚁
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: stat.color, mx: 'auto', mb: 1, boxShadow: 2 }}>
                {stat.icon}
              </Avatar>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {operatorBookings.length === 0 ? (
              <Typography color="text.secondary">No recent bookings found.</Typography>
            ) : (
              operatorBookings.map((booking) => (
                <Card key={booking.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2">{booking.farmerName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.service} • {booking.acres} Acres
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          bgcolor: 'action.hover', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontWeight: 'bold',
                          color: booking.status === 'pending' ? 'warning.main' : 'success.main'
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" gutterBottom>Next Flight Status</Typography>
            <Typography variant="body2">
              Ready for dispatch. Battery levels optimal. Weather monitoring active. ⚡
            </Typography>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Flight sx={{ fontSize: 60, opacity: 0.8 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DroneOverview;
