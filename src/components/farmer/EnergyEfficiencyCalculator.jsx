import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Divider
} from '@mui/material';
import { Bolt, Calculate } from '@mui/icons-material';

const EnergyEfficiencyCalculator = () => {
  const [batchSize, setBatchSize] = useState('');
  const [energyRate, setEnergyRate] = useState('');
  const [energyConsumption, setEnergyConsumption] = useState('');
  const [cost, setCost] = useState(null);

  const calculateCost = () => {
    const totalCost = Number(batchSize) * Number(energyConsumption) * Number(energyRate);
    setCost(totalCost);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Bolt color="warning" /> Energy Efficiency Calculator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Estimate the energy costs of your processing machinery per production batch.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Batch Size (units)"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Energy Consumption per Unit (kWh)"
                  type="number"
                  value={energyConsumption}
                  onChange={(e) => setEnergyConsumption(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kWh</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Energy Rate (₹/kWh)"
                  type="number"
                  value={energyRate}
                  onChange={(e) => setEnergyRate(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={calculateCost}
                  startIcon={<Calculate />}
                >
                  Calculate Cost
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {cost !== null ? (
            <Card sx={{ bgcolor: 'rgba(255, 152, 0, 0.05)', border: '1px solid rgba(255, 152, 0, 0.2)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Estimated Energy Cost
                </Typography>
                <Typography variant="h3" color="warning.main" fontWeight="800">
                  ₹{cost.toLocaleString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Based on {batchSize} units at ₹{energyRate}/kWh
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f5f5f5', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Enter values to see estimated energy costs
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnergyEfficiencyCalculator;