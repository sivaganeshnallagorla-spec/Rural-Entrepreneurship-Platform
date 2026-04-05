import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useDrone } from '../../contexts/DroneContext';
import { useAuth } from '../../contexts/AuthContext';
import Agriculture from '@mui/icons-material/Agriculture'
import LocationOn from '@mui/icons-material/LocationOn'
import Star from '@mui/icons-material/Star'

const DaaSMarketplace = () => {
  const { operators, bookDrone } = useDrone();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    acres: 1,
    service: '',
    scheduledDate: ''
  });

  const handleBookOpen = (op) => {
    setSelectedOp(op);
    setBookingForm({ ...bookingForm, service: op.services[0] });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOp(null);
  };

  const handleSubmit = () => {
    bookDrone({
      operatorId: selectedOp.id,
      operatorName: selectedOp.name,
      farmerId: user.id || 'farmer1',
      farmerName: user.name || 'Farmer Client',
      ...bookingForm,
      totalPrice: selectedOp.pricePerAcre * bookingForm.acres
    });
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        DaaS Marketplace (Drone as a Service) 🚁
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Access cutting-edge agricultural technology for your fields.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {operators.map((op) => (
          <Grid item xs={12} md={6} key={op.id}>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', sm: 200 } }}
                image={op.image}
                alt={op.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div">{op.name}</Typography>
                    <Chip size="small" icon={<Star sx={{ fontSize: '1rem !important' }} />} label={op.rating} color="warning" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: '1rem', mr: 0.5 }} /> {op.location}
                  </Typography>
                  <Box sx={{ mt: 1.5, mb: 1 }}>
                    {op.services.map((s, idx) => (
                      <Chip key={idx} label={s} size="small" sx={{ mr: 0.5, mb: 0.5 }} variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    INR {op.pricePerAcre} <Typography component="span" variant="caption">/ acre</Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button variant="contained" fullWidth startIcon={<Agriculture />} onClick={() => handleBookOpen(op)}>
                    Book Now
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Book {selectedOp?.name}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              select
              label="Service Required"
              value={bookingForm.service}
              fullWidth
              onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
            >
              {selectedOp?.services.map((s, i) => (
                <MenuItem key={i} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Area (in Acres)"
              fullWidth
              value={bookingForm.acres}
              onChange={(e) => setBookingForm({ ...bookingForm, acres: e.target.value })}
              inputProps={{ min: 1 }}
            />
            <TextField
              type="date"
              label="Scheduled Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingForm.scheduledDate}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduledDate: e.target.value })}
            />
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2">Estimated Total</Typography>
              <Typography variant="h5" color="primary.main">
                INR {selectedOp?.pricePerAcre * bookingForm.acres}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!bookingForm.scheduledDate}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DaaSMarketplace;
