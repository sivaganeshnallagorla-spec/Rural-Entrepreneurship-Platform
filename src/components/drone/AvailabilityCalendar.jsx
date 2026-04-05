import React, { useState } from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import EventAvailable from '@mui/icons-material/EventAvailable'
import { useDrone } from '../../contexts/DroneContext';
import { useAuth } from '../../contexts/AuthContext';

const AvailabilityCalendar = () => {
  const { getAvailabilityForOperator, addAvailabilitySlot, removeAvailabilitySlot } = useDrone();
  const { user } = useAuth();
  const operatorId = user?.id || 'op1';
  const slots = getAvailabilityForOperator(operatorId);
  const [date, setDate] = useState('');

  const handleAdd = () => {
    if (!date) return;
    addAvailabilitySlot(operatorId, date);
    setDate('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <EventAvailable color="primary" /> Service availability
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Mark dates when you can accept drone jobs. Farmers see operator listings in the marketplace; this list helps you plan capacity (demo persistence via local storage).
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Add ISO dates you are open for bookings. Remove slots when you are fully booked or offline.
      </Alert>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label="Available date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button variant="contained" onClick={handleAdd} disabled={!date}>
            Add date
          </Button>
        </Stack>
      </Paper>

      <Typography variant="subtitle2" gutterBottom>
        Upcoming open dates
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {slots.length === 0 ? (
          <Typography color="text.secondary">No availability added yet.</Typography>
        ) : (
          slots.map((s) => (
            <Chip
              key={s.id}
              label={s.date}
              onDelete={() => removeAvailabilitySlot(s.id)}
              color="primary"
              variant="outlined"
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default AvailabilityCalendar;
