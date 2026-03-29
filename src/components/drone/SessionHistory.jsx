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
  Box,
  Chip
} from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import { useDrone } from '../../contexts/DroneContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const SessionHistory = () => {
  const { getFlightLogsForOperator } = useDrone();
  const { user } = useAuth();
  const operatorId = user?.id || 'op1';
  const logs = getFlightLogsForOperator(operatorId);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoff color="primary" /> Flight session history
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Completed flights logged from finished bookings. Duration is estimated from acreage.
      </Typography>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Completed</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Farmer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acres</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration (min)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Booking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No completed flights yet. Mark a booking as completed to log a session.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    {format(new Date(log.completedAt), 'PPp')}
                  </TableCell>
                  <TableCell>{log.farmerName}</TableCell>
                  <TableCell>{log.service}</TableCell>
                  <TableCell>{log.acres}</TableCell>
                  <TableCell>
                    <Chip label={log.durationMin} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {log.bookingId}
                    </Typography>
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

export default SessionHistory;
