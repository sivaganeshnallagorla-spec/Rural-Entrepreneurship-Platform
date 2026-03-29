import React from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Chip,
  Box
} from '@mui/material';
import { useDrone } from '../../contexts/DroneContext';
import { useAuth } from '../../contexts/AuthContext';
import { Check, Close, Schedule } from '@mui/icons-material';

const BookingManagement = () => {
  const { bookings, updateBookingStatus } = useDrone();
  const { user } = useAuth();
  const operatorId = user?.id || 'op1';
  const operatorBookings = bookings.filter((b) => b.operatorId === operatorId);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Booking Requests 📅
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage incoming service requests from farmers.
      </Typography>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Farmer Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acres</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operatorBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No requests found yet.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              operatorBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.farmerName}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.acres}</TableCell>
                  <TableCell>{booking.scheduledDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status.toUpperCase()} 
                      size="small" 
                      color={
                        booking.status === 'pending' ? 'warning' :
                        booking.status === 'accepted' ? 'primary' :
                        booking.status === 'completed' ? 'success' : 'default'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          startIcon={<Check />}
                          onClick={() => updateBookingStatus(booking.id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error"
                          startIcon={<Close />}
                          onClick={() => updateBookingStatus(booking.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    {booking.status === 'accepted' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<Schedule />}
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {booking.status === 'completed' && (
                      <Typography variant="caption" color="text.secondary">Order Finished</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingManagement;
