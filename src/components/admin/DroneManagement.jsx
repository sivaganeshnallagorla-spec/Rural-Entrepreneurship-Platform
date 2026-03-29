import React, { useMemo } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Flight, AssignmentTurnedIn, PeopleAlt } from '@mui/icons-material';
import { useDrone } from '../../contexts/DroneContext';

const DroneManagement = () => {
  const { operators, bookings, flightLogs, updateOperator } = useDrone();

  const statsByOp = useMemo(() => {
    return operators.map((op) => {
      const opBookings = bookings.filter((b) => b.operatorId === op.id);
      const completed = opBookings.filter((b) => b.status === 'completed').length;
      const revenue = opBookings
        .filter((b) => b.status === 'completed')
        .reduce((s, b) => s + (b.totalPrice || 0), 0);
      const flights = flightLogs.filter((f) => f.operatorId === op.id).length;
      return { op, pending: opBookings.filter((b) => b.status === 'pending').length, completed, revenue, flights };
    });
  }, [operators, bookings, flightLogs]);

  const handlePriceChange = (operatorId, value) => {
    const n = parseFloat(value);
    if (Number.isNaN(n) || n < 0) return;
    updateOperator(operatorId, { pricePerAcre: n });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Drone operators & DaaS
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Platform-wide view of registered operators, booking volume, and flight logs (local demo data).
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="textSecondary" variant="body2">Active operators</Typography>
                <PeopleAlt color="primary" />
              </Box>
              <Typography variant="h4">{operators.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="textSecondary" variant="body2">Total bookings</Typography>
                <AssignmentTurnedIn color="secondary" />
              </Box>
              <Typography variant="h4">{bookings.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="textSecondary" variant="body2">Flight logs</Typography>
                <Flight color="success" />
              </Box>
              <Typography variant="h4">{flightLogs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Operator</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Flights logged</TableCell>
              <TableCell>Revenue (INR)</TableCell>
              <TableCell>Price / acre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statsByOp.map(({ op, pending, completed, revenue, flights }) => (
              <TableRow key={op.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{op.name}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {op.services.join(', ')}
                  </Typography>
                </TableCell>
                <TableCell>{op.location}</TableCell>
                <TableCell>
                  <Chip size="small" label={op.rating} />
                </TableCell>
                <TableCell>{pending}</TableCell>
                <TableCell>{completed}</TableCell>
                <TableCell>{flights}</TableCell>
                <TableCell>₹{revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    defaultValue={op.pricePerAcre}
                    key={op.pricePerAcre}
                    onBlur={(e) => handlePriceChange(op.id, e.target.value)}
                    sx={{ width: 110 }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DroneManagement;
